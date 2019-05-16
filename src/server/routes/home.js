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
]
