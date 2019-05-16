const rooms = require('../utils/rooms')

module.exports = [
  {
    method: 'GET',
    path: '/broadcast',
    config: {
      handler: (r, h) => {
        r.server.broadcast('welcome!')
        return { result: 'SENT' }
      },
    },
  },
  {
    method: 'GET',
    path: '/rooms',
    config: {
      id: 'hello',
      handler: (request, h) => {
        return { rooms }
      },
    },
  },
  {
    method: 'GET',
    path: '/rooms/{id}',
    config: {
      id: 'hello',
      handler: (request, h) => {
        return 'world!'
      },
    },
  },
  {
    method: 'POST',
    path: '/rooms/{id}/message',
    config: {
      id: 'hello',
      handler: (r, h) => {
        r.server.publish(`/rooms$/{r.params.id}/`, r.payload)
        return 'world!'
      },
    },
  },
]
