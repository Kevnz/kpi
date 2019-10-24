const Cache = require('@brightleaf/cache')
const { delay } = require('@kev_nz/async-tools')
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
    path: '/api/package/{pkg}',
    config: {
      description: 'Get info on package',
      notes: 'Returns downloads',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'Package stats')
        const today = new Date()
        const yesterday = dateMath.subtract(today, 1, 'day')
        const start = ymd(yesterday)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        console.log('date-range', dateRange)
        const result = await pkgDownloads(r.params.pkg, dateRange)
        console.info('result', result)
        return result
      },
    },
  },
  {
    method: 'GET',
    path: '/api/packages/{pkg}/week',
    config: {
      description: 'Get info on me',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, 'Get My Info Call')
        const today = new Date()
        const lastWeek = dateMath.subtract(today, 1, 'week')
        const start = ymd(lastWeek)
        const end = ymd(today)
        const dateRange = `${start.year}-${start.month}-${start.day}:${end.year}-${end.month}-${end.day}`
        const result = await pkgDownloads(r.params.pkg, dateRange)
        console.info('result', result)
        return result
      },
    },
  },
]
