import React, { Component } from 'react';

class BrowserPageStatus extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive)
      this.refs.input.getDOMNode().focus()
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.isActive != nextProps.isActive)
  }
  onKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      this.props.onPageSearch(e.target.value)
    }
  }
  render() {
    var status = this.props.page.statusText
    if (!status && this.props.page.isLoading)
      status = 'Loading...'
    return(<div id="browser-page-status" className={status ? 'visible' : 'hidden'}>{status}</div>)
  }
}
export default BrowserPageStatus
