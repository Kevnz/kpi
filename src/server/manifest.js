module.exports = [
  {
    plugin: require('blipp'),
  },
  {
    plugin: require('vision'),
  },
  {
    plugin: require('inert'),
  },
  {
    plugin: require('good'),
    options: {
      ops: {
        interval: 30 * 200,
      },
      reporters: {
        console: [
          {
            module: 'good-console',
            args: [{ log: '*', response: '*' }],
          },
          'stdout',
        ],
      },
    },
  },
  {
    plugin: require('hapi-swagger'),
    options: {
      info: {
        title: 'Kev-API Documentation',
        version: '1.0.0',
      },
    },
  },
  {
    plugin: require('hapi-router'),
    options: {
      routes: ['src/server/routes/**/*.js'],
    },
  },
  {
    plugin: require('./plugins/ga'),
  },
]
