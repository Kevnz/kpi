const Cache = require('node-cache')
const { User, Post, Product } = require('../models')
const { getToken } = require('../utils/auth')

const cache = new Cache({})

const POSTS_KEY = 'all-blog-posts'

const PRODUCTS_KEY = 'all-products'

const resolvers = {
  Query: {
    kevin: async (root, args, context, info) => {
      return {
        name: 'Kevin Isom',
      }
    },
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
      const products = cache.get(PRODUCTS_KEY)
      if (products) {
        return products
      }
      const genProds = Product.getAll()
      cache.set(PRODUCTS_KEY, genProds)
      return genProds
    },
    posts: async (root, args, context, info) => {
      const posts = cache.get(POSTS_KEY)
      if (posts) {
        return posts
      }
      const genPosts = Post.getAll()
      cache.set(POSTS_KEY, genPosts)
      return genPosts
    },
    post: async (root, args, context, info) => {
      const posts = cache.get(POSTS_KEY)
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
