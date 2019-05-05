const Cache = require('@brightleaf/cache')
const { Post, User, Product } = require('../models')

const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD
}

const cache = new Cache({ prepend: 'kpi', redis: redisConfig })

module.exports = [
  {
    method: 'GET',
    path: '/api/blog/posts',
    config: {
      handler: async (request, h) => {
        const posts = await cache.get('all-blog-posts')
        if (posts) {
          return posts
        }
        const genPosts = Post.getAll()
        cache.set('all-blog-posts', genPosts)
        return genPosts
      },
    },
  },
  {
    method: 'GET',
    path: '/api/blog/posts/{slug}',
    config: {
      handler: async (request, h) => {
        const posts = await cache.get('all-blog-posts')
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
        const users = await cache.get('all-users')
        if (users) {
          return users
        }
        const genUsers = User.getUsers()
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
        const products = await cache.get('all-products')
        if (products) {
          return products
        }
        const genProds = Product.getProducts()
        cache.set('all-products', genProds)
        return genProds
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    config: {
      handler: async (request, h) => {
        const products = await cache.get('all-products')
        if (products) {
          const one = products.find(p => p.id === request.params.id)
          if (one && one.length > 0) return one[0]
          return products[0]
        }
        return Product.getProduct()
      },
    },
  },
]
