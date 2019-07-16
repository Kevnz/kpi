const ga = require('../utils/ga')

exports.register = function(server, options) {
  server.events.on({ name: 'request', channels: 'error' }, function(
    request,
    event
  ) {
    const baseUrl =
      request.info.uri ||
      (request.info.host && `${server.info.protocol}://${request.info.host}`) ||
      /* istanbul ignore next */
      server.info.uri

    ga.exception(
      `${event.error.name || event.error.message || 'Error'} at ${baseUrl}`
    )
  })
}

exports.name = 'kpi-error-plugin'
