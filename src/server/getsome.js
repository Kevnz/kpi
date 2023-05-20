const get = require('./utils/package')

get('back-off', '2019-12-01:2019-12-10').then(data => {
  console.log('data', data)
})
