const { User, Post, Product } = require('../models')
const { getToken } = require('../utils/auth')
const resolvers = {
  Query: {
    user: async (root, args, context, info) => {
      return User.getAll()
    },
    products: async (root, args, context, info) => {
      return Product.getAll()
    },
    posts: async (root, args, context, info) => {
      return Post.getAll()
    },
    post: async (root, args, context, info) => {
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
