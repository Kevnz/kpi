module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: (request, h) => {
        return 'Rest and GraphQL API for development'
      },
    },
  },
]
