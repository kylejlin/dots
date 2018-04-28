const TYPES_WITH_FIXED_LENGTH_POINT_LISTS = [
  'circle'
]

const isObjectTypePointListFixedLength = (objectType) => {
  return TYPES_WITH_FIXED_LENGTH_POINT_LISTS.includes(objectType)
}

export default isObjectTypePointListFixedLength
