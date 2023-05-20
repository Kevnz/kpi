const Hapi = require('@hapi/hapi')
const Nes = require('@hapi/nes')
const init = async () => {
  const server = Hapi.server({
    port: 8080,
  })
  await server.register(Nes)
  server.subscription('/slides/{id}')

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!!!'
    },
  })
  server.route({
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
  })
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
