import React, { Component } from 'react';

class BrowserNavbarBtn extends Component {
  render() {
    return (<a href="#" className={this.props.disabled ? 'disabled' : ''} title={this.props.title} onClick={this.props.onClick}><i className={'fa fa-' + this.props.icon} /></a>)
  }
}
export default BrowserNavbarBtn
