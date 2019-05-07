const Cache = require('@brightleaf/cache')
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
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'Products Call')
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
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, 'ECHO Post')
        return request.payload
      },
    },
  },
  {
    method: 'POST',
    path: '/api/echo/{entity}',
    config: {
      handler: async (request, h) => {
        ga.event(GA_CATEGORY, `ECHO Entity ${request.params.entity} Post`)
        return request.payload
      },
    },
  },
]
