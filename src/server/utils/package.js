// const npmstat = require('npmstat')
const { mapper, delay } = require('@kev_nz/async-tools')
const fetch = require('node-fetch')
/* const days = require('days-in-a-row');
const allTheDays = days(new Date('10/16/2019'), 2);

const mappedRanges = allTheDays.map((d, i) => {
  if (i === allTheDays.length) return ''
  return `${d}:${allTheDays[i+1]}`
})
mappedRanges.pop()

(name, { range = 'last-month', type } = {}) => {
  const api = 'https://api.npmjs.org/downloads'

  if (type === 'range') {
    return axios(`${api}/range/${range}/${name}`)
      .then(({ data }) => data)
      .catch(({ response: { data: { error } } }) => error)
  }

  return axios(`${api}/point/${range}/${name}`)
    .then(({ data }) => data)
    .catch(({ response: { data: { error } } }) => error)
}


*/

module.exports = async (pkgName, range) => {
  const api = 'https://api.npmjs.org/downloads'
  const down = await fetch(`${api}/range/${range}/${pkgName}`)
  const data = await down.json()
  console.log('the download', data)
  return data
}
