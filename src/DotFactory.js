import React from 'react'

const DotFactory = (getState, setState) => {
  const { config } = getState()

  return ({ id, dataIndex, x, y }) => (
    <circle
      fill={config.dotFill}
      stroke={config.dotStroke}
      r={config.dotRadius}
      cx={x}
      cy={y}
      onMouseDown={() => {
        setState({
          selectedDot: {
            id,
            dataIndex
          }
        })
      }}
    />
  )
}

export default DotFactory
