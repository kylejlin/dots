import extractPairs from './misc/extractPairs'

export default (pathData) => {
  const pairs = extractPairs(pathData)

  const [start, ...rest] = pairs

  return 'M ' + start.join(' ') + ' L ' + rest.map(point => point.join(' ')).join(' ')
}
