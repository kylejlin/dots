import React from 'react'
import './DotsEditor.css'

import { SketchPicker } from 'react-color'

import Toolbar from './Toolbar'
import DotFactory from './DotFactory'
import ObjectInfo from './ObjectInfo'
import DotsObject from './DotsObject'

import backIcon from './toolbarIcons/placeholder.svg'
import logo from './toolbarIcons/logo.svg'
import newDotIcon from './toolbarIcons/placeholder.svg'
import openAddObjectToolbarIcon from './toolbarIcons/placeholder.svg'
import selectCreateStraightPathIcon from './toolbarIcons/placeholder.svg'
import selectCreateCurvedPathIcon from './toolbarIcons/placeholder.svg'
import selectCreateCircleIcon from './toolbarIcons/placeholder.svg'

import defaultObjects from './defaultObjects'
import defaultConfig from './defaultConfig'

import pointListLengthRanges from './pointListLengthRanges'
import convertClientToLocal from './convertClientToLocal'
import getLowestPositiveUnusedInt from './getLowestPositiveUnusedInt'

class DotsEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      toolbarType: 'main',
      viewBox: [0, 0, 100, 100],
      objects: defaultObjects,
      draggedDot: null,
      selectedObjectId: null,
      selectedDot: null,
      config: defaultConfig,
      pendingCreation: {
        type: null,
        points: [],
        indexToAppendTo: -1
      },
      ongoingColorEdit: null
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
        <Toolbar
          editor={this}
          icons={{
            backIcon,

            logo,
            newDotIcon,
            openAddObjectToolbarIcon,

            selectCreateStraightPathIcon,
            selectCreateCurvedPathIcon,
            selectCreateCircleIcon
          }}
        />

        <div className="DotsEditor-editor">
          {(() => {
            const { ongoingColorEdit } = this.state

            if (ongoingColorEdit === null) {
              return null
            }

            const editedObject = this.state.objects.find(o => o.id === ongoingColorEdit.objectId)

            const { editedColor } = ongoingColorEdit

            const color = editedObject.data[editedColor]

            return [
              <div
                className="DotsEditor-color-picker-overlay"
                onClick={() => this.setState({ ongoingColorEdit: null })}
              />,

              <div className="DotsEditor-color-picker-container">
                <SketchPicker color={color} onChange={this.updateColor} />
              </div>
            ]
          })()}

          {this.state.objects.map((object) => (
            <ObjectInfo
              object={object}
              key={object.id}
              isSelected={object.id === this.state.selectedObjectId}
              selectedDot={this.state.selectedDot}
              selectDot={this.selectDot}
              onClick={object.id !== this.state.selectedObjectId
                ? () => {
                  this.selectObject(object.id)
                }
                : (e) => {
                  if (
                    !e.target.classList.contains('ObjectInfo-input')
                  ) {
                    this.selectObject(null)
                  }
                }
              }
              onEditColor={(fillOrStroke, objectId) => {
                this.setState({
                  selectedObjectId: objectId,
                  ongoingColorEdit: {
                    editedColor: fillOrStroke,
                    objectId
                  }
                })
              }}
            />
          ))}
        </div>

        <div className="DotsEditor-result">
          <svg
            viewBox={this.state.viewBox.join(' ')}
            onClick={this.addPointIfApplicable}
            onMouseMove={this.updateDots}
            onMouseUp={this.clearDraggedDotSelection}
            ref={this.svgRef}
          >
            {this.state.objects.map((object) => (
              <DotsObject object={object} selectObject={this.selectObject} />
            ))}

            {this.renderDots(this.state.objects.find(o => o.id === this.state.selectedObjectId) || null)}
          </svg>
        </div>
      </div>
    )
  }

  addDot = () => {
    this.setState((prevState) => {
      const { selectedObjectId, selectedDot } = prevState

      return {
        objects: prevState.objects.map((object) => {
          if (object.id !== selectedObjectId) {
            return object
          }

          return {
            ...object,
            data: {
              ...object.data,
              points: object.data.points.slice(0, selectedDot.dataIndex + 2)
                .concat([50, 50])
                .concat(object.data.points.slice(selectedDot.dataIndex + 2))
            }
          }
        })
      }
    })
  }

  addObject = (pendingCreation) => {
    const fillColor = this.state.config.newObjectFillColor
    const strokeColor = this.state.config.newObjectStrokeColor

    const takenIds = this.state.objects.map(o => o.id)
    const newId = getLowestPositiveUnusedInt(takenIds)

    const flattenedPoints = pendingCreation.points.reduce((arr, point) => {
      return arr.concat(point)
    }, [])

    const { indexToAppendTo } = pendingCreation

    switch (pendingCreation.type) {
      case 'circle':
      case 'curvedPath':
      case 'straightPath':
        const newObject = {
          type: pendingCreation.type,
          id: newId,
          data: {
            fillColor,
            strokeColor,
            points: flattenedPoints
          }
        }
        this.setState(prevState => ({
          objects: prevState.objects.slice(0, indexToAppendTo + 1)
            .concat([newObject])
            .concat(prevState.objects.slice(indexToAppendTo + 1))
        }))
        return newObject
      default:
        throw new TypeError('Illegal object type: ' + pendingCreation.type)
    }
  }

  addPointIfApplicable = (e) => {
    if (this.state.pendingCreation.type === null) {
      return
    }

    const { points, type } = this.state.pendingCreation

    const { clientX, clientY } = e
    const svg = this.svgRef.current
    const newPoint = convertClientToLocal([clientX, clientY], svg)

    const newPendingCreation = {
      ...this.state.pendingCreation,
      points: points.concat([newPoint])
    }

    if (
      pointListLengthRanges[type].min === newPendingCreation.points.length
    ) {
      const newObject = this.addObject(newPendingCreation)

      this.setState(prevState => ({
        pendingCreation: {
          ...prevState.pendingCreation,
          type: null
        },
        selectedObjectId: newObject.id,
        selectedDot: newObject.data.points[newObject.data.points.length - 1]
      }))

      return
    }

    this.setState({
      pendingCreation: newPendingCreation
    })
  }

  clearDraggedDotSelection = () => {
    this.setState({
      draggedDot: null
    })
  }

  openAddObjectToolbar = () => {
    this.setState(prevState => ({
      toolbarType: 'addObject',
      pendingCreation: {
        type: null,
        points: [],
        indexToAppendTo: prevState.objects.findIndex(o => o.id === prevState.selectedObjectId)
      }
    }))
  }

  renderDots = (object) => {
    if (object === null) {
      return
    }

    const {
      id: objectId,
      type,
      data
    } = object

    const { Dot } = this.state

    switch (type) {
      case 'circle': {
        const [cx, cy, ex, ey] = data.points

        return [
          <Dot
            x={cx}
            y={cy}
            id={objectId}
            dataIndex={0}
            selectedDot={this.state.selectedDot}
          />,
          <Dot
            x={ex}
            y={ey}
            id={objectId}
            dataIndex={2}
            selectedDot={this.state.selectedDot}
          />
        ]
      }
      case 'straightPath': {
        const pathData = data.points

        return pathData.map(({}, i, pathData) => {
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
              dataIndex={i}
              selectedDot={this.state.selectedDot}
            />
          )
        })
        .filter(thing => thing !== null)
      }
      case 'curvedPath': {
        const pathData = data.points

        return pathData.map(({}, i, pathData) => {
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
              dataIndex={i}
              selectedDot={this.state.selectedDot}
            />
          )
        })
        .filter(thing => thing !== null)
      }
      default:
        throw new TypeError('Illegal component: ' + type)
    }
  }

  selectDot = (dot) => {
    this.setState({
      selectedDot: dot
    })
  }

  selectObject = (objectId) => {
    this.setState({
      selectedObjectId: objectId
    })
  }

  setPendingCreationType = (type) => {
    this.setState(prevState => ({
      pendingCreation: {
        ...prevState.pendingCreation,
        type
      }
    }))
  }

  updateColor = ({ rgb: { r, g, b, a } }) => {
    const pad = (str) => str.length === 2 ? str : '0' + str

    const rgb = [r, g, b]
      .map(int => int.toString(16))
      .map(pad)
      .join('')

    const alpha = pad(Math.floor(a * 255).toString(16))

    const newColor = '#' + rgb + alpha

    this.setState(prevState => ({
      objects: prevState.objects.map((object) => {
        if (object.id !== prevState.ongoingColorEdit.objectId) {
          return object
        }

        return {
          ...object,
          data: {
            ...object.data,
            [prevState.ongoingColorEdit.editedColor]: newColor
          }
        }
      })
    }))
  }

  updateDots = (e) => {
    const { clientX, clientY } = e

    const { draggedDot } = this.state
    if (draggedDot === null) {
      return
    }

    this.setState((prevState) => ({
      objects: prevState.objects.map((object) => {
        if (draggedDot.id === object.id) {
          const newCoords = convertClientToLocal(
            [clientX, clientY],
            this.svgRef.current
          )

          return {
            ...object,
            data: {
              ...object.data,
              points: object.data.points
                .slice(0, draggedDot.dataIndex)
                .concat(newCoords)
                .concat(object.data.points.slice(draggedDot.dataIndex + 2))
            }
          }
        }
        return object
      })
    }))
  }
}

export default DotsEditor
