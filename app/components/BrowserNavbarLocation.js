import React, { Component } from 'react';

function normalizedUri(input) {
  var prefix = 'http://';

  if (!/^([^:\/]+)(:\/\/)/g.test(input) && !prefix.includes(input)) {
    input = prefix + input;
  }

  return input
}
class BrowserNavbarLocation extends Component {
  onKeyDown(e) {
    if (e.keyCode == 13)
      this.props.onEnterLocation(normalizedUri(e.target.value))
  }
  onChange(e) {
    this.props.onChangeLocation(normalizedUri(e.target.value))
  }
  render() {
    return <input type="text" onKeyDown={this.onKeyDown.bind(this)} onChange={this.onChange.bind(this)} onContextMenu={this.props.onContextMenu} value={this.props.page.location} />
  }
}
export default BrowserNavbarLocation
