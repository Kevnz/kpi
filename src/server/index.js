require('xtconf')()
const Path = require('path')
const { ApolloServer } = require('apollo-server-hapi')
const Hapi = require('@hapi/hapi')
const Manifest = require('./manifest')
const Types = require('./graphql/types')
const Resolvers = require('./graphql/resolvers')
const ga = require('./utils/ga')
let app

const start = async () => {
  try {
    const server = new ApolloServer({
      typeDefs: Types,
      resolvers: Resolvers,
      introspection: true,
      playground: true,
    })
    app = Hapi.server({
      port: process.env.PORT,
      routes: {
        files: {
          relativeTo: Path.join(__dirname, 'public'),
        },
        cors: {
          origin: ['*'],
          additionalHeaders: [
            'x-kpi-server',
            'x-kevpi-server',
            'content-type',
            'schema',
            'page',
            'total',
          ],
        },
      },
    })
    await app.register({
      plugin: require('@hapi/nes'),
      options: {
        heartbeat: false,
        onDisconnection: () => {
          console.info('onDisconnection')
          ga.event('SocketOperation', 'SocketDisconnection')
        },
        onConnection: socket => {
          console.info('onConnection')
          ga.event('SocketOperation', 'SocketConnection')
        },
        onMessage: (socket, message) => {
          console.info('message', message)
          ga.event('SocketOperation', 'SocketMessage')
          app.broadcast(message)
        },
      },
    })
    await app.register(Manifest)
    await server.applyMiddleware({
      app,
    })
    app.subscription('/rooms/{id}')

    app.subscription('/slides/{deck}')
    await app.start()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
  console.info('🚀 Server running')
  ga.event('ServerOperation', 'Started')
}

process.on('SIGINT', async () => {
  console.warn('stopping server')
  try {
    await app.stop({ timeout: 10000 })
    ga.event('ServerOperation', 'Stopped')
    console.info('The server has stopped 🛑')
    process.exit(0)
  } catch (err) {
    ga.event('ServerOperation', 'ShutdownError')
    console.error('Shutdown Server Error 💀', err)
    process.exit(1)
  }
})

start()
