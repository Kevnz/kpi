const ua = require('universal-analytics')
const CODE = process.env.GOOGLE_ANALYTICS
const visitor = ua(CODE)
module.exports = {
  page: (route, title) => {
    visitor.pageview(route, 'https://kev-pi.herokuapp.com/', title).send()
  },
  event: (cat, action) => {
    visitor.event(cat, action).send()
  },
}
