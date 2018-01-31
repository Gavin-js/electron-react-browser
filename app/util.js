const electron = require('electron')
const { remote,clipboard,shell,ipcRenderer  } = electron
const { Menu,MenuItem,BrowserWindow } = remote
const urllib = require('url')
const path = require('path')
const os = require('os')
const fs = require('fs')

const EventHandle = {
  tabHandlers: {
    onNewTab() {
      this.createTab()
    },
    onTabClick(e, page, pageIndex) {
      this.setState({ currentPageIndex: pageIndex })
    },
    onTabContextMenu(e, page, pageIndex) {
      this.tabContextMenu(pageIndex)
    },
    onTabClose(e, page, pageIndex) {
      this.closeTab(pageIndex)
    },
    onMaximize() {
      if (remote.getCurrentWindow())
        remote.getCurrentWindow().maximize()
      else
        remote.unmaximize()
    },
    onMinimize() {
      remote.getCurrentWindow().minimize()
    },
    onClose() {
      remote.getCurrentWindow().close()
    }
  },

  navHandlers: {
    onClickHome() {
      this.getWebView().goToIndex(0)
    },
    onClickBack() {
      this.getWebView().goBack()
    },
    onClickForward() {
      this.getWebView().goForward()
    },
    onClickRefresh() {
      this.getWebView().reload()
    },
    onClickBundles() {
      var location = urllib.parse(this.getWebView().getURL()).path
      this.getPage().navigateTo('/bundles/view.html#'+location)
    },
    onClickVersions() {
      var location = urllib.parse(this.getWebView().getURL()).path
      this.getPage().navigateTo('/bundles/versions.html#'+location)
    },
    onClickSync: console.log.bind(console, 'sync'),
    onEnterLocation(location) {
      this.getPage().navigateTo(location)
    },
    onChangeLocation(location) {
      var page = this.getPageObject()
      page.location = location
      this.setState(this.state)
    },
    onLocationContextMenu(e) {
      this.locationContextMenu(e.target)
    }
  },
  pageHandlers: {
    onDidStartLoading(e, page) {
      page.isLoading = true
      page.title = false
      this.setState(this.state)
    },
    onDomReady(e, page, pageIndex) {
      var webview = this.getWebView(pageIndex)
      webview.openDevTools()
      page.canGoBack = webview.canGoBack()
      page.canGoForward = webview.canGoForward()
      page.canRefresh = true
      this.setState(this.state)
    },
    onDidStopLoading(e, page, pageIndex) {
      // update state
      var webview = this.getWebView(pageIndex)
      page.statusText = false
      page.location = webview.getURL()
      page.canGoBack = webview.canGoBack()
      page.canGoForward = webview.canGoForward()
      if (!page.title)
        page.title = page.location
      page.isLoading = false
      this.setState(this.state)
    },
    onPageTitleSet(e) {
      var page = this.getPageObject()
      page.title = e.title
      page.location = this.getWebView().getURL()
      this.setState(this.state)
    },
    onContextMenu(e, page, pageIndex) {
      this.getWebView(pageIndex).send('get-contextmenu-data', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    },
    onNewWindowOpen(e){
      console.log(e)
      e.preventDefault()
      this.createTab(e.url)
    },
    onFormSubmit(e){
      console.log(e)
    },
    onIpcMessage(e, page) {
      if (e.channel == 'status') {
        page.statusText = e.args[0]
        this.setState(this.state)
      }
      else if (e.channel == 'contextmenu-data') {
        this.webviewContextMenu(e.args[0])
      }
    }
  }
}
module.exports = EventHandle
