const { User } = require('../models')
const { getToken } = require('../utils/auth')
const resolvers = {
  Query: {
    user: async (root, args, context, info) => {
      return User.getUser
    },
  },
  Mutation: {
    login: async (root, args, context, info) => {
      const user = await User.getUser()
      return {
        token: getToken(user.id),
        user: user,
      }
    },
    signup: async (root, args, context, info) => {
      const user = User.getUser(args.newUserInput)
      return {
        token: getToken(user.id),
        user: user,
      }
    },
  },
}

module.exports = resolvers
