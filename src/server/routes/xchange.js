const Cache = require('@brightleaf/cache')
const r2 = require('r2')

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
]
