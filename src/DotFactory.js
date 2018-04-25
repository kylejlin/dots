import React from 'react'

const DotFactory = (getState, setState) => {
  const { config } = getState()

  const Dot = ({ id, dataIndex, x, y, selectedDot }) => {
    const isThisDotSelected = (
      selectedDot
      && selectedDot.id === id
      && selectedDot.dataIndex === dataIndex
    )

    return (
      <circle
        fill={isThisDotSelected ? config.selectedDotFill : config.dotFill}
        stroke={isThisDotSelected ? config.selectedDotStroke : config.dotStroke}
        r={config.dotRadius}
        cx={x}
        cy={y}
        onMouseDown={() => {
          setState({
            draggedDot: {
              id,
              dataIndex
            },
            selectedDot: {
              id,
              dataIndex
            }
          })
        }}
      />
    )
  }

  return Dot
}

export default DotFactory
