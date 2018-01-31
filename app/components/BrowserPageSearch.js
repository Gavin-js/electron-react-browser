import React, { Component } from 'react';

class BrowserPageSearch extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive)
      this.refs.input.focus()
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
    return(<div id="browser-page-search" className={this.props.isActive ? 'visible' : 'hidden'}>
      <input ref="input" type="text" placeholder="Search..." onKeyDown={this.onKeyDown.bind(this)} />
    </div>)
  }
}
export default BrowserPageSearch
