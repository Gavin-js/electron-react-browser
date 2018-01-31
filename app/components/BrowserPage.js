import React, { Component } from 'react';
import BrowserPageSearch from './BrowserPageSearch'
import BrowserPageStatus from './BrowserPageStatus'

function webviewHandler (self, fnName) {
  return function (e) {
    if (self.props[fnName])
      self.props[fnName](e, self.props.page, self.props.pageIndex)
  }
}

var webviewEvents = {
  'load-commit': 'onLoadCommit',
  'did-start-loading': 'onDidStartLoading',
  'did-stop-loading': 'onDidStopLoading',
  'did-finish-load': 'onDidFinishLoading',
  'did-fail-load': 'onDidFailLoad',
  'did-get-response-details': 'onDidGetResponseDetails',
  'did-get-redirect-request': 'onDidGetRedirectRequest',
  'dom-ready': 'onDomReady',
  'page-title-set': 'onPageTitleSet',
  'close': 'onClose',
  'destroyed': 'onDestroyed',
  'ipc-message': 'onIpcMessage',
  'console-message': 'onConsoleMessage',
  'new-window':'onNewWindowOpen'
}

function resize () {
  Array.prototype.forEach.call(document.querySelectorAll('webview'), function (webview) {
    var obj = webview && webview.querySelector('::shadow object')
    if (obj)
      obj.style.height = (window.innerHeight - 59) + 'px' // -61 to adjust for the tabs and navbar regions
  })
}
class BrowserPage extends Component {
  onFormSubmit(e){
    // this.props.onFormSubmit(e)
  }
  componentDidMount() {

    // setup resize events
    window.addEventListener('resize', resize)
    setTimeout(resize,90)
    // setTimeout(()=>{
    //   this.refs.webview.executeJavaScript(`
    //     var forms = document.querySelectorAll('form');
    //     var formArray = Array.prototype.slice.call(forms);
    //     console.log(formArray);
    //     formArray.map(el=>el.addEventListener("submit",${this.onFormSubmit},false));
    //     `)
    // },100)
    // attach webview events
    for (var k in webviewEvents)
      this.refs.webview.addEventListener(k, webviewHandler(this, webviewEvents[k]))

    // set location, if given
    if (this.props.page.location)
      this.navigateTo(this.props.page.location)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', resize)
  }

  navigateTo(l) {
    var webview = this.refs.webview
    // webview.setAttribute('src', l)
    webview.src = l
    // setTimeout(()=>{
    //   webview.loadURL(l,{
    //     postData: [{
    //       type: 'rawData',
    //       bytes: Buffer.from('hello=world')
    //     }],
    //     extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
    //   })
    // },100)
  }

  onPageSearch(query) {
    this.refs.webview.executeJavaScript('window.find("'+query+'", 0, 0, 1)')
  }

  render() {
    const dataset = {
      plugins:'on',
      allowpopups:'on'
    }
    return (<div id="browser-page" ref="browserPage" className={this.props.isActive ? 'visible' : 'hidden'}>
            <BrowserPageSearch isActive={this.props.page.isSearching} onPageSearch={this.onPageSearch.bind(this)} />
            <webview ref="webview" id="webview" preload="./preload/main.js" {...dataset} onContextMenu={this.props.onContextMenu} />
            <BrowserPageStatus page={this.props.page} />
          </div>)
  }
}
export default BrowserPage
