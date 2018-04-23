import React from 'react'
import './DotsEditor.css'
import defaultObjects from './defaultObjects'
import defaultConfig from './defaultConfig'
import calculateCurvedPath from './calculateCurvedPath'
import calculateStraightPath from './calculateStraightPath'
import DotFactory from './DotFactory'
import convertClientToLocal from './convertClientToLocal'
import ObjectInfo from './ObjectInfo'

class DotsEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      viewBox: [0, 0, 100, 100],
      objects: defaultObjects,
      selectedDot: null,
      selectedObjectId: null,
      config: defaultConfig
    }

    this.state.Dot = DotFactory(
      () => this.state,
      (...args) => this.setState(...args)
    )

    this.svgRef = React.createRef()
  }

  render() {
    return (
      <div className="DotsEditor">
        <div className="DotsEditor-header">
          DotsEditor - An SVG Editor
        </div>

        <div className="DotsEditor-editor">
          {this.state.objects.map((object) => (
            <ObjectInfo
              object={object}
              key={object.id}
              isSelected={object.id === this.state.selectedObjectId}
              onClick={object.id !== this.state.selectedObjectId
                ? () => this.selectObject(object.id)
                : () => this.selectObject(null)
              }
            />
          ))}
        </div>

        <div className="DotsEditor-result">
          <svg
            viewBox={this.state.viewBox.join(' ')}
            onMouseMove={this.updateDots}
            onMouseUp={this.clearDotSelection}
            ref={this.svgRef}
          >
            {this.state.objects.map(this.renderObjects)}
          </svg>
        </div>
      </div>
    )
  }

  clearDotSelection = () => {
    this.setState({
      selectedDot: null
    })
  }

  renderObjects = (object) => {
    const {
      id: objectId,
      type,
      data
    } = object

    const { Dot } = this.state

    switch (type) {
      case 'circle': {
        const [fill, stroke, cx, cy, ex, ey] = data

        const radius = Math.hypot(cx - ex, cy - ey)

        return this.state.selectedObjectId !== objectId
          ? (
            <circle
              fill={fill}
              stroke={stroke}
              r={radius}
              cx={cx}
              cy={cy}
              onClick={() => this.selectObject(objectId)}
            />
          )
          : [
            <circle
              fill={fill}
              stroke={stroke}
              r={radius}
              cx={cx}
              cy={cy}
              onClick={() => this.selectObject(null)}
            />,
            <Dot
              x={cx}
              y={cy}
              id={objectId}
              dataIndex={2}
            />,
            <Dot
              x={ex}
              y={ey}
              id={objectId}
              dataIndex={4}
            />
          ]
      }
      case 'straightPath': {
        const [fill, stroke, ...pathData] = data
        const offset = 2

        return this.state.selectedObjectId !== objectId
          ? (
            <path
              fill={fill}
              stroke={stroke}
              d={calculateStraightPath(pathData)}
              onClick={() => this.selectObject(objectId)}
            />
          )
          : [
            <path
              fill={fill}
              stroke={stroke}
              d={calculateStraightPath(pathData)}
              onClick={() => this.selectObject(null)}
            />
          ].concat(
            pathData.map(({}, i, pathData) => {
              if (i % 2 === 1) {
                return null
              }

              const x = pathData[i]
              const y = pathData[i + 1]
              return (
                <Dot
                  x={x}
                  y={y}
                  id={objectId}
                  dataIndex={offset + i}
                />
              )
            })
            .filter(thing => thing !== null)
          )
      }
      case 'curvedPath': {
        const [fill, stroke, ...pathData] = data
        const offset = 2

        return this.state.selectedObjectId !== objectId
          ? (
            <path
              fill={fill}
              stroke={stroke}
              d={calculateCurvedPath(pathData)}
              onClick={() => this.selectObject(objectId)}
            />
          )
          : [
            <path
              fill={fill}
              stroke={stroke}
              d={calculateCurvedPath(pathData)}
              onClick={() => this.selectObject(null)}
            />
          ].concat(
            pathData.map(({}, i, pathData) => {
              if (i % 2 === 1) {
                return null
              }

              const x = pathData[i]
              const y = pathData[i + 1]
              return (
                <Dot
                  x={x}
                  y={y}
                  id={objectId}
                  dataIndex={offset + i}
                />
              )
            })
            .filter(thing => thing !== null)
          )
      }
      default:
        throw new TypeError('Illegal component: ' + type)
    }
  }

  selectObject = (objectId) => {
    this.setState({
      selectedObjectId: objectId
    })
  }

  updateDots = (e) => {
    const { clientX, clientY } = e

    const { selectedDot } = this.state
    if (selectedDot === null) {
      return
    }

    this.setState((prevState) => ({
      objects: prevState.objects.map((object) => {
        if (selectedDot.id === object.id) {
          const newCoords = convertClientToLocal(
            [clientX, clientY],
            this.svgRef.current
          )

          return {
            ...object,
            data: object.data
              .slice(0, selectedDot.dataIndex)
              .concat(newCoords)
              .concat(object.data.slice(selectedDot.dataIndex + 2))
          }
        }
        return object
      })
    }))
  }
}

export default DotsEditor
