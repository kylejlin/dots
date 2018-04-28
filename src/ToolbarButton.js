import React from 'react'
import './ToolbarButton.css'

const NOOP = () => undefined

const ToolbarButton = ({ src, alt = '', isEnabled, onClick }) => (
  <img
    src={src}
    alt={alt}
    className={isEnabled ? '' : 'ToolbarButton-disabled'}
    onClick={isEnabled ? onClick : NOOP}
  />
)

export default ToolbarButton
