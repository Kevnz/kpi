const ua = require('universal-analytics')
const CODE = process.env.GOOGLE_ANALYTICS
const visitor = ua(CODE)
module.exports = (cat, action) => {
  visitor.event(cat, action).send()
}
