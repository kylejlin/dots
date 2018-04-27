import React from 'react'

import calculateCurvedPath from './calculateCurvedPath'
import calculateStraightPath from './calculateStraightPath'

const DotsObject = ({ object, selectObject }) => {
  const {
    id: objectId,
    type,
    data
  } = object

  switch (type) {
    case 'circle': {
      const fill = data.fillColor
      const stroke = data.strokeColor
      const [cx, cy, ex, ey] = data.points

      const radius = Math.hypot(cx - ex, cy - ey)

      return (
        <circle
          fill={fill}
          stroke={stroke}
          r={radius}
          cx={cx}
          cy={cy}
          onClick={() => selectObject(objectId)}
        />
      )
    }
    case 'straightPath': {
      const fill = data.fillColor
      const stroke = data.strokeColor
      const pathData = data.points

      return (
        <path
          fill={fill}
          stroke={stroke}
          d={calculateStraightPath(pathData)}
          onClick={() => selectObject(objectId)}
        />
      )
    }
    case 'curvedPath': {
      const fill = data.fillColor
      const stroke = data.strokeColor
      const pathData = data.points

      return (
        <path
          fill={fill}
          stroke={stroke}
          d={calculateCurvedPath(pathData)}
          onClick={() => selectObject(objectId)}
        />
      )
    }
    default:
      throw new TypeError('Illegal component: ' + type)
  }
}

export default DotsObject
