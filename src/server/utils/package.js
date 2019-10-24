const npmstat = require('npmstat')
const { mapper, delay } = require('@kev_nz/async-tools')

/* const days = require('days-in-a-row');
const allTheDays = days(new Date('10/16/2019'), 2);

const mappedRanges = allTheDays.map((d, i) => {
  if (i === allTheDays.length) return ''
  return `${d}:${allTheDays[i+1]}`
})
mappedRanges.pop()
*/

module.exports = async (pkgName, range) => {
  const down = await npmstat.getDownloads(pkgName, { range })
  console.log('the download', down)
  return down
}