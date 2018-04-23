import React from 'react'
import './Dots.css'
import defaultObjects from './defaultObjects'
import defaultConfig from './defaultConfig'
import calculateCurvedPath from './calculateCurvedPath'

class Dots extends React.Component {
  state = {
    viewBox: [0, 0, 100, 100],
    objects: defaultObjects,
    config: defaultConfig
  }

  render() {
    return (
      <div className="Dots">
        <div className="Dots-header">
          Dots - An SVG Editor
        </div>

        <div className="Dots-editor">

        </div>

        <div className="Dots-result">
          <svg viewBox={this.state.viewBox.join(' ')}>
            {this.state.objects.map(this.renderObjects)}
          </svg>
        </div>
      </div>
    )
  }

  renderObjects = (object) => {
    const {
      id,
      type,
      data
    } = object

    const { config } = this.state

    switch (type) {
      case 'circle': {
        const [fill, stroke, cr, cx, cy] = data
        return ([
          <circle
            fill={fill}
            stroke={stroke}
            r={cr}
            cx={cx}
            cy={cy}
          />
        ])
      }
      case 'curvedPath': {
        const [fill, stroke, ...pathData] = data
        return ([
          <path
            fill={fill}
            stroke={stroke}
            d={calculateCurvedPath(pathData)}
          />
        ])
      }
      default:
        throw new TypeError('Illegal component: ' + type)
    }
  }
}

export default Dots
