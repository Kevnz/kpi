const Cache = require('@brightleaf/cache')
const { User, Post, Product } = require('../models')
const { getToken } = require('../utils/auth')

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

const resolvers = {
  Query: {
    user: async (root, args, context, info) => {
      return User.get()
    },
    users: async (root, args, context, info) => {
      const users = await cache.get('all-users')
      if (users) {
        return users
      }
      const genUsers = User.getAll()
      cache.set('all-users', genUsers)
      return genUsers
    },
    product: async (root, args, context, info) => {
      const products = await cache.get(PRODUCTS_KEY)
      if (products) {
        const one = products.find(p => p.id === args.id)
        if (one && one.length > 0) return one[0]
        return products[0]
      }
      return Product.get()
    },
    products: async (root, args, context, info) => {
      const products = await cache.get(PRODUCTS_KEY)
      if (products) {
        return products
      }
      const genProds = Product.getAll()
      cache.set(PRODUCTS_KEY, genProds)
      return genProds
    },
    posts: async (root, args, context, info) => {
      const posts = await cache.get(POSTS_KEY)
      if (posts) {
        return posts
      }
      const genPosts = Post.getAll()
      cache.set(POSTS_KEY, genPosts)
      return genPosts
    },
    post: async (root, args, context, info) => {
      const posts = await cache.get(POSTS_KEY)
      if (posts) {
        const one = posts.find(p => p.slug === args.slug)
        if (one && one.length > 0) return one[0]
        return posts[0]
      }
      return Post.get()
    },
  },
  Mutation: {
    login: async (root, args, context, info) => {
      const user = await User.get()
      return {
        token: getToken(user.id),
        user: user,
      }
    },
    signup: async (root, args, context, info) => {
      const user = User.get(args.newUserInput)
      return {
        token: getToken(user.id),
        user: user,
      }
    },
  },
}

module.exports = resolvers
