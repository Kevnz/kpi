const Cache = require('node-cache')
const r2 = require('r2')
const { mapper } = require('@kev_nz/async-tools')
const daysInARow = require('days-in-a-row')
const ga = require('../utils/ga')
const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD
}

const cache = new Cache({ prepend: 'kpi', redis: redisConfig })

const XCHANGE_RATES_KEY = 'current-rates'
const XCHANGE_RATES_SERIES_KEY = 'time-series-rates'
const XCHANGE_RATES_DAY_KEY = 'exchange-rate-for'
const getDate = utcSeconds => {
  const d = new Date(0)
  d.setUTCSeconds(utcSeconds)
  return d
}
const datediff = (first, second) => {
  return Math.round((second - first) / (1000 * 60 * 60))
}

const timeDiff = utcSeconds => {
  const d = new Date(0)
  d.setUTCSeconds(utcSeconds)
  return datediff(getDate(utcSeconds), new Date())
}

const getCurrent = async () => {
  return r2.get(
    `https://openexchangerates.org/api/latest.json?app_id=${process.env.OXR}`
  ).json
}
const getRatesFor = async date => {
  const rates = await cache.get(`${XCHANGE_RATES_DAY_KEY}-${date}`)
  if (rates) {
    ga.event(GA_CATEGORY, 'Historic rates from cache')
    return { [date]: rates }
  }
  console.log(
    `https://openexchangerates.org/api/historical/${date}.json?app_id=${process.env.OXR}`
  )
  const results = await r2.get(
    `https://openexchangerates.org/api/historical/${date}.json?app_id=${process.env.OXR}`
  ).json
  ga.event(GA_CATEGORY, 'Historic rates from OXR')
  cache.set(XCHANGE_RATES_KEY, results)
  return { [date]: results }
}
/*
https://openexchangerates.org/api/time-series.json
    ?app_id=YOUR_APP_ID
    &start=2012-01-01
    &end=2012-01-31
    &base=AUD
    &symbols=BTC,EUR,HKD
    &prettyprint=1
    */
const getSeries = async (
  start,
  end,
  base = 'USD',
  symbols = 'EUR,AUD,NZD,GBP,BTC'
) => {
  const url = 'https://openexchangerates.org/api/time-series.json'
  return r2.get(
    `${url}?app_id=${process.env.OXR}&start=${start}&end=${end}&base=${base}&symbols=${symbols}`
  ).json
}

const GA_CATEGORY = 'API Exchange Rates'
module.exports = [
  {
    method: 'GET',
    path: '/api/rates/latest',
    config: {
      description: 'Get rates posts',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Rates Call')
        const rates = await cache.get(XCHANGE_RATES_KEY)
        if (rates && timeDiff(rates.timestamp) < 2) {
          ga.event(GA_CATEGORY, 'Rates from cache')
          return rates
        }

        const currentRates = await getCurrent()
        ga.event(GA_CATEGORY, 'Rates from OXR')
        cache.set(XCHANGE_RATES_KEY, currentRates)

        return currentRates
      },
    },
  },
  {
    method: 'GET',
    path: '/api/rates/series',
    config: {
      description: 'Get rates posts',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Rates Call')
        const { start, days } = request.query
        const points = daysInARow(new Date(start), parseInt(days, 10))
        const rates = await mapper(points, getRatesFor)
        const shaped = rates.reduce((collection, current) => {
          const key = Object.keys(current)[0]
          collection[key] = current[key]
          return collection
        }, {})
        ga.event(GA_CATEGORY, 'Historic Rates from OXR')

        return shaped
      },
    },
  },
]
