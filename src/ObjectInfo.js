import React from 'react'
import './ObjectInfo.css'
import extractPairs from './misc/extractPairs'

const ObjectInfo = ({ object, isSelected: isObjectSelected, selectedDot, selectDot, onClick }) => {
  const [fill, stroke, ...rest] = object.data
  const pairs = extractPairs(rest)
  
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
      <div className="ObjectInfo-property">Fill: {fill}</div>
      <div className="ObjectInfo-property">Stroke: {stroke || 'none'}</div>
      {pairs.map((pair, pairIndex) => (
        <div
          className={'ObjectInfo-property' + (isDotSelected((pairIndex + 1) * 2) ? ' ObjectInfo-selected-property' : '')}
        >
          <input className="ObjectInfo-input" value={pair[0]} onFocus={createDotSelector((pairIndex + 1) * 2)} />
          <input className="ObjectInfo-input" value={pair[1]} onFocus={createDotSelector((pairIndex + 1) * 2)} />
        </div>
      ))}
    </div>
  )
}

export default ObjectInfo
