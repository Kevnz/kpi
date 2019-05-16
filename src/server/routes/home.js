module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: (request, h) => {
        return 'A Rest, GraphQL, and NES API for development - See <a href="https://github.com/kevnz/kpi">https://github.com/kevnz/kpi</a>'
      },
    },
  },
  {
    method: 'GET',
    path: '/routes.table',
    config: {
      auth: false,
      description: 'List routes table',
      handler: (request, h) => {
        return request.server.plugins.blipp.info()
      },
    },
  },
]
