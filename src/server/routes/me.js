const Cache = require('@brightleaf/cache')
const { delay } = require('@kev_nz/async-tools')
const { Post, User, Product } = require('../models')

const ga = require('../utils/ga')
const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD
}

const cache = new Cache({ prepend: 'kpi', redis: redisConfig })

const GA_CATEGORY = 'API ME Call'
module.exports = [
  {
    method: 'GET',
    path: '/api/me',
    config: {
      description: 'Get info on me',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Get My Info Call')

        return {
          name: 'Kevin Isom',
          website: 'https://kevinisom.info',
          twitter: { url: 'https://twitter.com/kev_nz', user: 'kev_nz' },
          linkedin: {
            url: 'https://www.linkedin.com/in/kevinisom/',
            user: 'kevinisom',
          },
          github: { url: 'https://github.com/kevnz', user: 'kevnz' },
          dev: { url: 'https://dev.to/kevnz/', user: 'kevnz' },
          links: [
            {
              name: 'Brightleaf JS',
              url: 'https://brightleaf.dev',
              details: 'Brightleaf JS Projects',
            },
            {
              name: 'JavaScript Rodeo',
              url: 'https://javascript.rodeo',
              details: 'Pretty pictures of code',
            },
            {
              name: 'AkJS Meetup',
              url: 'https://akjs.nz',
              details: 'The Auckland JavaScript meetup',
            },
            {
              name: 'Kevin Isom',
              url: 'https://kevinisom.info',
              details: 'Details on me',
            },
            {
              name: 'My Home Page',
              url: 'https://kevnz.xyz',
              details: 'A collection of day to day links',
            },
            {
              name: 'The Forge',
              url: 'https://forge.kevnz.xyz',
              details: 'Try to make things',
            },
          ],
          tagline:
            'Developer, Mentor, Organizer. Runs @akjs_meetup and helps with @akl_node and @javascript_nz, so yes, I like JavaScript',
        }
      },
    },
  },
]
