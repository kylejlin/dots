import React from 'react'
import './Dots.css'

class Dots extends React.Component {
  state = {
    components: []
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

        </div>
      </div>
    )
  }
}

export default Dots
