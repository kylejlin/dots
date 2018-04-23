import React from 'react'
import './ObjectInfo.css'
import extractPairs from './misc/extractPairs'

export default ({ object }) => {
  const [fill, stroke, ...rest] = object.data
  const pairs = extractPairs(rest)

  return (
    <div className="ObjectInfo">
      <div className="ObjectInfo-header">{object.type}</div>
      <div className="ObjectInfo-property">Fill: {fill}</div>
      <div className="ObjectInfo-property">Stroke: {stroke || 'none'}</div>
      {pairs.map(pair => (
        <div className="ObjectInfo-property">
          <input value={pairs[0]} />
          <input value={pairs[1]} />
        </div>
      ))}
    </div>
  )
}
