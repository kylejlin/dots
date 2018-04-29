import React from 'react'

import './Toolbar.css'

import ToolbarButton from './ToolbarButton'

import isObjectTypePointListFixedLength from './isObjectTypePointListFixedLength'

const Toolbar = ({ editor, icons }) => (
  <div className="Toolbar">
    <img src={icons.logo} alt="Dots logo" />
    {getToolbarItems(editor, icons)}
  </div>
)

const getToolbarItems = (
  editor,
  {
    backIcon,

    newDotIcon,
    openAddObjectToolbarIcon,
    deleteObjectIcon,

    selectCreateStraightPathIcon,
    selectCreateCurvedPathIcon,
    selectCreateCircleIcon
  }
) => {
  switch (editor.state.toolbarType) {
    case 'main':
      return [
        <ToolbarButton
          src={newDotIcon}
          alt="New dot"
          isEnabled={
            editor.state.objects.find(o => o.id === editor.state.selectedObjectId)
            && editor.state.selectedDot !== null
            && editor.state.selectedDot.id === editor.state.selectedObjectId
            && !isObjectTypePointListFixedLength(editor.state.objects.find(o => o.id === editor.state.selectedObjectId).type)
          }
          onClick={editor.addDot}
        />,

        <ToolbarButton
          src={openAddObjectToolbarIcon}
          alt="New object"
          isEnabled={
            editor.state.objects.find(o => o.id === editor.state.selectedObjectId)
          }
          onClick={editor.openAddObjectToolbar}
        />,

        <ToolbarButton
          src={deleteObjectIcon}
          alt="Delete object"
          isEnabled={
            editor.state.objects.find(o => o.id === editor.state.selectedObjectId)
          }
          onClick={editor.deleteObject}
        />
      ]
    case 'addObject':
      return [
        <ToolbarButton
          src={backIcon}
          alt="Back"
          isEnabled={true}
          onClick={() => editor.setState({ toolbarType: 'main' })}
        />,

        <ToolbarButton
          src={selectCreateStraightPathIcon}
          alt="New straight path"
          isEnabled={
            true
          }
          onClick={() => editor.setPendingCreationType('straightPath')}
        />,

        <ToolbarButton
          src={selectCreateCurvedPathIcon}
          alt="New curved path"
          isEnabled={
            true
          }
          onClick={() => editor.setPendingCreationType('curvedPath')}
        />,

        <ToolbarButton
          src={selectCreateCircleIcon}
          alt="New circle"
          isEnabled={
            true
          }
          onClick={() => editor.setPendingCreationType('circle')}
        />
      ]
    default:
      throw new TypeError('Illegal toolbarType: ' + editor.state.toolbarType)
  }
}

export default Toolbar
