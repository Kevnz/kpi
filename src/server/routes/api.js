const Cache = require('@brightleaf/cache')
const { delay, mapper } = require('@kev_nz/async-tools')
const faker = require('faker')
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

const POSTS_KEY = 'all-blog-posts'

const PRODUCTS_KEY = 'all-products'

const GA_CATEGORY = 'API REST Call'
module.exports = [
  {
    method: 'GET',
    path: '/api/blog/posts',
    config: {
      description: 'Get blog posts',
      notes: 'Returns list of blog posts',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Posts Call')
        const posts = await cache.get(POSTS_KEY)
        if (posts) {
          return posts
        }
        const genPosts = Post.getAll()
        cache.set(POSTS_KEY, genPosts)
        return genPosts
      },
    },
  },
  {
    method: 'GET',
    path: '/api/blog/posts/{slug}',
    config: {
      description: 'Get a blog post',
      notes: 'Returns blog post that matches slug',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Post Call')
        const posts = await cache.get(POSTS_KEY)
        if (posts) {
          const one = posts.find(p => p.slug === request.params.slug)
          if (one && one.length > 0) return one[0]
          return posts[0]
        }
        return Post.get()
      },
    },
  },
  {
    method: 'GET',
    path: '/api/users',
    config: {
      description: 'Get a list of users',
      notes: 'Returns a list of users',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Users Call')
        const users = await cache.get('all-users')
        if (users) {
          return users
        }
        const genUsers = User.getAll()
        cache.set('all-users', genUsers)
        return genUsers
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products',
    config: {
      description: 'Get a list of products',
      notes: 'Returns a list of products',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Products Call')
        if (request.query.page) {
          const page = parseInt(request.query.page, 10)
          const products = await cache.get(`${PRODUCTS_KEY}-PAGE-${page}`)
          if (products) {
            return products
          }
          const genProds = Product.getAll()
          cache.set(`${PRODUCTS_KEY}-PAGE-${page}`, genProds)
          return genProds
        }
        const products = await cache.get(PRODUCTS_KEY)
        if (products) {
          return products
        }
        const genProds = Product.getAll()
        cache.set(PRODUCTS_KEY, genProds)
        return genProds
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    config: {
      description: 'Get a product',
      notes: 'Returns a product',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Product Call')
        const products = await cache.get(PRODUCTS_KEY)
        if (products) {
          const one = products.find(p => p.id === request.params.id)
          if (one && one.length > 0) return one[0]
          return products[0]
        }
        return Product.get()
      },
    },
  },
  {
    method: 'POST',
    path: '/api/echo',
    config: {
      description: 'Return the entity posted',
      notes: 'Returns the entity that is posted',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'ECHO Post')
        await delay(800)
        return request.payload
      },
    },
  },
  {
    method: 'POST',
    path: '/api/long/wait',
    config: {
      description:
        'Provides an endpoint that simulates a longer running process',
      notes: 'Returns the entity that is posted after 2.4 seconds',
      tags: ['api'],
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'LONG WAIT Post')
        await delay(2400)
        return { ...request.payload, result: true }
      },
    },
  },
  {
    method: 'POST',
    path: '/api/echo/{entity}',
    config: {
      description: 'Return the entity posted',
      notes: 'Returns the entity that is posted',
      tags: ['api'],
      handler: async (request, h) => {
        await delay(1200)
        ga.event(GA_CATEGORY, `ECHO Entity ${request.params.entity} Post`)
        return request.payload
      },
    },
  },
  {
    method: 'POST',
    path: '/api/cache/clear',
    config: {
      handler: async (request, h) => {
        await cache.clear()
        ga.event(GA_CATEGORY, `Cache Clear Post`)
        return request.payload
      },
    },
  },
  {
    method: 'GET',
    path: '/api/mock/entities/entity',
    config: {
      handler: async (request, h) => {
        const test =
          '{ "firstName": "{{name.firstName}}", "lastName": "{{name.lastName}}","email": "{{internet.email}}"}'
        const mockSchema = JSON.parse(request.headers.schema) || test

        const s = faker.fake(`${mockSchema}`)
        ga.event(GA_CATEGORY, `API ENTITY`)
        return { entity: JSON.parse(s) }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/mock/entities',
    config: {
      handler: async (request, h) => {
        const test =
          '{ "firstName": "{{name.firstName}}", "lastName": "{{name.lastName}}","email": "{{internet.email}}"}'
        const mockSchema = request.headers.schema || test
        const page = request.headers.page || 0
        const total = request.headers.total || 200

        const data = Array(10)
          .fill(0)
          .map(e => faker.fake(mockSchema))
          .map(e => {
            return e.replace(/(\r\n|\n|\r)/gm, '')
          })
          .map(e => {
            console.log('e', e)
            return e
          })
          .map((e, index) => {
            try {
              return JSON.parse(JSON.stringify(e))
            } catch (err) {
              console.log('error', err)
              return {}
            }
          })
          .map(e => {
            return JSON.parse(e)
          })

        ga.event(GA_CATEGORY, `API ENTITIES`)
        return {
          data,
          pagination: {
            current: page,
            total: total,
          },
        }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/items',
    config: {
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, `API ALL ITEMS`)

        const itemKeys = await cache.redis.keys('*item*')
        const cleaned = itemKeys.map(k => k.replace('kpi-', ''))
        console.log('cleaned key', cleaned)
        if (cleaned) {
          const items = await mapper(cleaned, k => cache.get(k))
          console.log('items', items)
          const parsedItems = items.map(item => JSON.parse(item))
          console.log('parsed', parsedItems)
          return parsedItems
        }
        return []
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/items/{id}',
    config: {
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, `API PUT ITEM`)

        await cache.set(`item:${r.params.id}`, r.payload)
        const item = await cache.get(`item:${r.params.id}`)
        return {
          saved: true,
          item: item,
        }
      },
    },
  },
  {
    method: 'POST',
    path: '/api/items',
    config: {
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, `API POST ITEM`)
        await cache.set(`item:${r.payload.id}`, r.payload)
        const item = await cache.get(`item:${r.payload.id}`)
        return {
          saved: true,
          item: item,
        }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/items/{id}',
    config: {
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, `API GET ITEM`)
        const item = await cache.get(`item:${r.params.id}`)
        if (item) {
          return item
        }
        h.response('not found').code(404)
      },
    },
  },
  {
    method: 'GET',
    path: '/api/clear/items',
    config: {
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, `API ALL ITEMS CLEAR`)

        const itemKeys = await cache.redis.keys('*item*')
        const cleaned = itemKeys.map(k => k.replace('kpi-', ''))
        console.log('cleaned key', cleaned)
        if (cleaned) {
          await mapper(cleaned, k => cache.delete(k))

          return { cleared: true }
        }
        return { cleared: false }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/projects',
    config: {
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, `API ALL ITEMS`)

        const itemKeys = await cache.redis.keys('*project*')
        const cleaned = itemKeys.map(k => k.replace('kpi-', ''))
        console.log('cleaned key', cleaned)
        if (cleaned) {
          const items = await mapper(cleaned, k => cache.get(k))
          console.log('projects', items)
          const parsedItems = items.map(item => JSON.parse(item))
          console.log('parsed projects', parsedItems)
          return parsedItems
        }
        return []
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/projects/{id}',
    config: {
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, `API PUT PROJECT`)

        await cache.set(`project:${r.params.id}`, r.payload)
        const item = await cache.get(`project:${r.params.id}`)
        return {
          saved: true,
          item: item,
        }
      },
    },
  },
  {
    method: 'POST',
    path: '/api/projects',
    config: {
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, `API POST PROJECT`)
        await cache.set(`project:${r.payload.id}`, r.payload)
        const item = await cache.get(`project:${r.payload.id}`)
        return {
          saved: true,
          item: item,
        }
      },
    },
  },
  {
    method: 'GET',
    path: '/api/projects/{id}',
    config: {
      handler: async (r, h) => {
        ga.event(GA_CATEGORY, `API GET PROJECT`)
        const item = await cache.get(`project:${r.params.id}`)
        if (item) {
          return item
        }
        h.response('not found').code(404)
      },
    },
  },
  {
    method: 'GET',
    path: '/api/clear/projects',
    config: {
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, `API ALL PROJECTS CLEAR`)

        const itemKeys = await cache.redis.keys('*project*')
        const cleaned = itemKeys.map(k => k.replace('kpi-', ''))
        console.log('cleaned key', cleaned)
        if (cleaned) {
          await mapper(cleaned, k => cache.delete(k))

          return { cleared: true }
        }
        return { cleared: false }
      },
    },
  },
]
