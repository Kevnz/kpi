const Cache = require('@brightleaf/cache')
const { delay, mapper } = require('@kev_nz/async-tools')
const dateMath = require('date-arithmetic')
const ymd = require('year-month-day')
const pkgDownloads = require('../utils/package')

const ga = require('../utils/ga')
const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD
}

const cache = new Cache({ prepend: 'kpi', redis: redisConfig })

const GA_CATEGORY = 'API Package Call'
module.exports = [
  {
    method: 'GET',
    path: '/api/package/today',
    config: {
      description: 'Get info on package',
      notes: 'Returns downloads',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Package stats')
        const today = dateMath.subtract(new Date(), 1, 'day')
        const yesterday = dateMath.subtract(today, 1, 'day')
        const start = ymd(yesterday)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        console.info('date-range', dateRange)
        const result = await pkgDownloads(r.query.pkg, dateRange)
        console.info('result', result)
        return result
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/week',
    config: {
      description: 'Get downloads for the week',
      notes: 'Returns downloads',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Package Week')
        const today = dateMath.subtract(new Date(), 1, 'day')
        const lastWeek = dateMath.subtract(today, 1, 'week')
        const start = ymd(lastWeek)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.query.pkg, dateRange)
        console.info('result', result)
        return result
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/weekly1',
    config: {
      description: 'Get downloads for the week 1?',
      notes: 'Returns info on package for a week',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Weekly1')
        const today = dateMath.subtract(new Date(), 1, 'day')
        const holder = new Array(8).fill(0)
        const ranges = holder.map((v, index) => {
          const dt = ymd(dateMath.subtract(today, index, 'day'))

          return `${dt.year}-${dt.month}-${dt.day}`
        })

        const mappedRanges = ranges.map((d, i) => {
          if (i === ranges.length) return ''
          return `${ranges[i + 1]}:${d}`
        })
        mappedRanges.pop()

        const lastWeek = dateMath.subtract(today, 1, 'week')
        const start = ymd(lastWeek)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.query.pkg, dateRange)

        const weeklyResults = await mapper(
          mappedRanges.reverse(),
          async range => {
            const result = await pkgDownloads(r.query.pkg, range)
            await delay(100)
            return result
          }
        )

        return { breakdown: weeklyResults, totals: result }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/weekly',
    config: {
      description: 'Get downloads for the week',
      notes: 'Get downloads for the week',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Weekly')
        const back = parseInt(r.query.back || '1', 10)
        const today = dateMath.subtract(new Date(), back, 'day')
        const lastWeek = dateMath.add(
          dateMath.subtract(today, 1, 'week'),
          1,
          'day'
        )
        const diff = dateMath.diff(lastWeek, today, 'day', false)

        const holder = new Array(diff + 1).fill(0)
        const ranges = holder.map((v, index) => {
          const dt = ymd(dateMath.subtract(today, index, 'day'))

          return `${dt.year}-${dt.month}-${dt.day}`
        })

        const mappedRanges = ranges.map((d, i) => {
          if (i === ranges.length) return ''
          return `${d}:${d}`
        })
        // mappedRanges.pop()

        const start = ymd(lastWeek)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.query.pkg, dateRange)

        const weeklyResults = await mapper(
          mappedRanges.reverse(),
          async range => {
            const result = await pkgDownloads(r.query.pkg, range)
            await delay(100)
            return result
          }
        )
        const reduced = weeklyResults.reduce((accumulator, current) => {
          return accumulator + current.downloads
        }, 0)
        return { breakdown: weeklyResults, totals: result, addedUp: reduced }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/fortnightly',
    config: {
      description: 'Get downloads for the week',
      notes: 'Get downloads for the week',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Weekly')
        const back = parseInt(r.query.back || '1', 10)
        const today = dateMath.subtract(new Date(), back, 'day')
        const lastWeek = dateMath.add(
          dateMath.subtract(today, 2, 'week'),
          1,
          'day'
        )
        const diff = dateMath.diff(lastWeek, today, 'day', false)

        const holder = new Array(diff + 1).fill(0)
        const ranges = holder.map((v, index) => {
          const dt = ymd(dateMath.subtract(today, index, 'day'))

          return `${dt.year}-${dt.month}-${dt.day}`
        })

        const mappedRanges = ranges.map((d, i) => {
          if (i === ranges.length) return ''
          return `${d}:${d}`
        })
        // mappedRanges.pop()

        const start = ymd(lastWeek)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.query.pkg, dateRange)

        const weeklyResults = await mapper(
          mappedRanges.reverse(),
          async range => {
            const result = await pkgDownloads(r.query.pkg, range)
            await delay(100)
            return result
          }
        )
        const reduced = weeklyResults.reduce((accumulator, current) => {
          return accumulator + current.downloads
        }, 0)
        return { breakdown: weeklyResults, totals: result, addedUp: reduced }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/monthly',
    config: {
      description: 'Get downloads for the month',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Monthly')
        const back = parseInt(r.query.back || '1', 10)
        const today = dateMath.subtract(new Date(), back, 'day')
        const lastMonth = dateMath.subtract(today, 1, 'month')
        const diff = dateMath.diff(lastMonth, today, 'day', false)
        console.info('Monthly Diff', diff)
        const holder = new Array(diff + 1).fill(0)
        const ranges = holder.map((v, index) => {
          const dt = ymd(dateMath.subtract(today, index, 'day'))

          return `${dt.year}-${dt.month}-${dt.day}`
        })

        const mappedRanges = ranges.map((d, i) => {
          if (i === ranges.length) return ''
          return `${d}:${d}`
        })
        // mappedRanges.pop()

        const start = ymd(lastMonth)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.query.pkg, dateRange)

        const monthlyResults = await mapper(
          mappedRanges.reverse(),
          async range => {
            const result = await pkgDownloads(r.query.pkg, range)
            await delay(100)
            return result
          }
        )
        const reduced = monthlyResults.reduce((accumulator, current) => {
          return accumulator + current.downloads
        }, 0)
        return { breakdown: monthlyResults, totals: result, addedUp: reduced }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/yearly',
    config: {
      description: 'Get downloads for the year',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Yearly')
        const back = parseInt(r.query.back || '1', 10)
        const today = dateMath.subtract(new Date(), back, 'day')
        const lastYear = dateMath.subtract(today, 1, 'year')
        const diff = dateMath.diff(lastYear, today, 'day', false)
        console.info('Yearly Diff', diff)
        const holder = new Array(diff + 1).fill(0)
        const ranges = holder.map((v, index) => {
          const dt = ymd(dateMath.subtract(today, index, 'day'))

          return `${dt.year}-${dt.month}-${dt.day}`
        })

        const mappedRanges = ranges.map((d, i) => {
          if (i === ranges.length) return ''
          return `${d}:${d}`
        })
        // mappedRanges.pop()

        const start = ymd(lastYear)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.query.pkg, dateRange)

        const monthlyResults = await mapper(
          mappedRanges.reverse(),
          async range => {
            const result = await pkgDownloads(r.query.pkg, range)
            await delay(120)
            return result
          },
          10
        )
        const reduced = monthlyResults.reduce((accumulator, current) => {
          return accumulator + current.downloads
        }, 0)
        return { breakdown: monthlyResults, totals: result, addedUp: reduced }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/package/daily',
    config: {
      description: 'Get info on me',
      notes: 'Returns downloads for a day',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'NPM Daily')
        const back = parseInt(r.query.back || '1', 10)
        const today = dateMath.subtract(new Date(), back, 'day')

        const yesterday = dateMath.subtract(today, 1, 'day')
        const start = ymd(yesterday)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`

        const result = await pkgDownloads(r.query.pkg, dateRange)

        console.info('date-range', dateRange)

        console.info('result', result)
        return result
      },
    },
  },
]
