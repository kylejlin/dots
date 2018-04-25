import React from 'react'
import './ObjectInfo.css'
import extractPairs from './misc/extractPairs'

const ObjectInfo = ({ object, isSelected, onClick }) => {
  const [fill, stroke, ...rest] = object.data
  const pairs = extractPairs(rest)

  return (
    <div
      className={'ObjectInfo' + (isSelected ? ' ObjectInfo-selected' : '')}
      onClick={onClick}
    >
      <div className="ObjectInfo-header">{object.type}</div>
      <div className="ObjectInfo-property">Fill: {fill}</div>
      <div className="ObjectInfo-property">Stroke: {stroke || 'none'}</div>
      {pairs.map(pair => (
        <div className="ObjectInfo-property">
          <input className="ObjectInfo-input" value={pair[0]} />
          <input className="ObjectInfo-input" value={pair[1]} />
        </div>
      ))}
    </div>
  )
}

export default ObjectInfo
