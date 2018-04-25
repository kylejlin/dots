import React from 'react'

const DotFactory = (getState, setState) => {
  const { config } = getState()

  const Dot = ({ id, dataIndex, x, y }) => (
    <circle
      fill={config.dotFill}
      stroke={config.dotStroke}
      r={config.dotRadius}
      cx={x}
      cy={y}
      onMouseDown={() => {
        setState({
          draggedDot: {
            id,
            dataIndex
          }
        })
      }}
    />
  )

  return Dot
}

export default DotFactory
