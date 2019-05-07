const ga = require('../utils/ga')
const pkg = require('../package.json')
const register = (server, options) => {
  server.decorate('request', 'ga.page', ga.page)
  server.decorate('request', 'ga.event', ga.event)

  server.ext('onRequest', (request, h) => {
    ga.page(request.path)
    return h.continue
  })
}
const { name, version } = pkg

module.exports = { register, name, version }
