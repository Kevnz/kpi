const ga = require('../utils/ga')

const register = (server, options) => {
  server.decorate('request', 'ga.page', ga.page)
  server.decorate('request', 'ga.event', ga.event)

  server.ext('onRequest', (request, h) => {
    ga.page(request.path)
    return h.continue
  })
}
const { name, version } = {
  name: 'GA-Plugin',
  version: '1.0.0',
}

module.exports = { register, name, version }
