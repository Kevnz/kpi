module.exports = [
  {
    method: 'GET',
    path: '/slide/{deck}/next',
    config: {
      handler: (r, h) => {
        r.server.publish(`/slides/${r.params.deck}`, {
          action: 'next',
        })
        return { result: 'SENT' }
      },
    },
  },
  {
    method: 'GET',
    path: '/slide/{deck}/previous',
    config: {
      handler: (r, h) => {
        r.server.publish(`/slides/${r.params.deck}`, {
          action: 'previous',
        })
        return { result: 'SENT' }
      },
    },
  },
  {
    method: 'GET',
    path: '/slide/{deck}/goto',
    config: {
      handler: (r, h) => {
        r.server.publish(`/slides/${r.params.deck}`, {
          action: 'goto',
          slide: r.query.slide,
        })
        return { result: 'SENT' }
      },
    },
  },
]
