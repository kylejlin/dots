import React from 'react'
import './ObjectInfo.css'
import extractPairs from './misc/extractPairs'

const ObjectInfo = ({ object, isSelected: isObjectSelected, selectedDot, selectDot, onClick }) => {
  const { fill, stroke, points } = object.data
  const pairs = extractPairs(points)

  const isDotSelected = (dataIndex) => {
    return (
      isObjectSelected

      && selectedDot
      && object.id === selectedDot.id
      && dataIndex === selectedDot.dataIndex
    )
  }
  const createDotSelector = (dataIndex) => () => {
    selectDot({
      id: object.id,
      dataIndex
    })
  }

  return (
    <div
      className={'ObjectInfo' + (isObjectSelected ? ' ObjectInfo-selected' : '')}
      onClick={onClick}
    >
      <div className="ObjectInfo-header">{object.type}</div>
      <div className="ObjectInfo-property">
        Fill:
        {' '}
        <input value={object.data.fillColor} />
      </div>
      <div className="ObjectInfo-property">
        Stroke:
        {' '}
        <input value={object.data.strokeColor} />
      </div>
      {pairs.map((pair, pairIndex) => (
        <div
          className={'ObjectInfo-property' + (isDotSelected(pairIndex * 2) ? ' ObjectInfo-selected-property' : '')}
        >
          <input className="ObjectInfo-input" value={pair[0]} onFocus={createDotSelector(pairIndex * 2)} />
          <input className="ObjectInfo-input" value={pair[1]} onFocus={createDotSelector(pairIndex * 2)} />
        </div>
      ))}
    </div>
  )
}

export default ObjectInfo
