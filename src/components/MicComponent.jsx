import React, { Component } from "react"
import { ReactMic } from "react-mic"

export class MicComponent extends Component {
  constructor() {
    super()
    this.state = {
      key: 0,
    }
  }

  render() {
    // eslint-disable-next-line
    const key = ++this.state.key
    const { record, bgCol, stCol, onStop, onClick } = this.props

    return (
      <ReactMic
        key={key}
        record={record}
        className="w-100"
        backgroundColor={bgCol}
        strokeColor={stCol}
        mimeType="audio/mp3"
        onStop={onStop}
        onData={onClick}
      />
    )
  }
}

export default MicComponent
