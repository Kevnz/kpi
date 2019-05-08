module.exports = [
  {
    method: 'GET',
    path: '/send',
    config: {
      handler: (r, h) => {
        r.server.broadcast('welcome!')
        return { result: 'SENT' }
      },
    },
  },
  {
    method: 'GET',
    path: '/h',
    config: {
      id: 'hello',
      handler: (request, h) => {
        return 'world!'
      },
    },
  },
]
