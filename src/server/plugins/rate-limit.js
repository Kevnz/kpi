const register = (server, options) => {
  server.ext('onRequest', (request, h) => {
    return h.continue
  })
}
const { name, version } = {
  name: 'Rate-Limit-Plugin',
  version: '1.0.0',
}

module.exports = { register, name, version }
