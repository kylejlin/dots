import cardinalCurveGenerator from './curveUtils/cardinalCurveGenerator'
import extractPairs from './misc/extractPairs'

export default (pathData) => {
  const pairs = extractPairs(pathData)
  return cardinalCurveGenerator(pairs.concat([pairs[0]]))
}
