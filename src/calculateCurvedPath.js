import cardinalCurveGenerator from './curveUtils/cardinalCurveGenerator'

const extractPairs = (array) => {
  const pairs = []

  for (let i = 0; i < array.length; i += 2) {
    pairs.push([
      array[i],
      array[i + 1]
    ])
  }

  return pairs
}

export default (pathData) => {
  const pairs = extractPairs(pathData)
  return cardinalCurveGenerator(pairs)
}
