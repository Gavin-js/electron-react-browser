import React, { Component } from 'react';
import BrowserNavbarBtn from './BrowserNavbarBtn'
import BrowserNavbarLocation from './BrowserNavbarLocation'


class BrowserNavbar extends Component {
  render() {
    return (<div id="browser-navbar">
      <BrowserNavbarBtn title="Rewind" icon="angle-double-left fa-lg" onClick={this.props.onClickHome} disabled={!this.props.page.canGoBack} />
      <BrowserNavbarBtn title="Back" icon="angle-left fa-lg" onClick={this.props.onClickBack} disabled={!this.props.page.canGoBack} />
      <BrowserNavbarBtn title="Forward" icon="angle-right fa-lg" onClick={this.props.onClickForward} disabled={!this.props.page.canGoForward} />
      <BrowserNavbarBtn title="Refresh" icon="circle-thin" onClick={this.props.onClickRefresh} disabled={!this.props.page.canRefresh} />
      <div className="input-group">
        <BrowserNavbarLocation onEnterLocation={this.props.onEnterLocation} onChangeLocation={this.props.onChangeLocation} onContextMenu={this.props.onLocationContextMenu} page={this.props.page} />
      </div>
    </div>)
  }
}
export default BrowserNavbar
