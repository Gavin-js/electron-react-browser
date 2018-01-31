import React, { Component } from 'react';
const electron = require('electron')
const { remote,clipboard,shell,ipcRenderer  } = electron
const { Menu,MenuItem,BrowserWindow } = remote
const urllib = require('url')
const path = require('path')
const os = require('os')
const fs = require('fs')
 import { tabHandlers,navHandlers,pageHandlers,webviewHandlers } from '../util'
import BrowserPage from '../components/BrowserPage'
import BrowserNavbar from '../components/BrowserNavbar'
import BrowserTabs from '../components/BrowserTabs'

function createPageObject (location) {
  return {
    location: location || "file:///D:/Work/www/test/form.html",
    statusText: false,
    title: 'new tab',
    isLoading: false,
    isSearching: false,
    canGoBack: false,
    canGoForward: false,
    canRefresh: false
  }
}

export default class Browser extends Component {
  constructor(props){
    super(props)
    this.state = {
      pages: [createPageObject()],
      currentPageIndex: 0
    }
  }

  componentWillMount() {
    for (var k in tabHandlers)  tabHandlers[k]  = tabHandlers[k].bind(this)
    for (var k in navHandlers)  navHandlers[k]  = navHandlers[k].bind(this)
    for (var k in pageHandlers) pageHandlers[k] = pageHandlers[k].bind(this)
  }
  componentDidMount() {
      // attach webview events
      // for (var k in webviewHandlers)
      //   this.getWebView().addEventListener(k, webviewHandlers[k].bind(this))

      // attach keyboard shortcuts
      // :TODO: replace this with menu hotkeys
      var self = this
      document.body.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.keyCode == 80) {
          const pdfPath = path.join(os.tmpdir(), 'print.pdf')
          const win = self.getWebView()
              win.printToPDF({
                printBackground:true
              }, function (error, data) {
                if (error) throw error
                fs.writeFile(pdfPath, data, function (error) {
                  if (error) {
                    throw error
                  }
                  shell.openExternal('file://' + pdfPath)
                })
              })

        }else if (e.ctrlKey && e.keyCode == 70) { // ctrl+f
          // start search
          self.getPageObject().isSearching = true
          self.setState(self.state)

          // make sure the search input has focus
          console.log(self.getPage().refs.browserPage)
          self.getPage().refs.browserPage.querySelector('#browser-page-search input').focus()
        } else if (e.keyCode == 27) { // esc
          // stop search
          self.getPageObject().isSearching = false
          self.setState(self.state)
        }
      })
  }
  getWebView(i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.refs['page-'+i].refs.webview
  }
  getPage(i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.refs['page-'+i]
  }
  getPageObject(i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.state.pages[i]
  }
  createTab(location) {
    this.state.pages.push(createPageObject(location))
    this.setState({ pages: this.state.pages, currentPageIndex: this.state.pages.length - 1 })
  }
  closeTab(pageIndex) {
    // last tab, full reset
    if (this.state.pages.filter(Boolean).length == 1)
      return this.setState({ pages: [createPageObject()], currentPageIndex: 0 })

    this.state.pages[pageIndex] = null
    this.setState({ pages: this.state.pages })

    // find the nearest adjacent page to make active
    if (this.state.currentPageIndex == pageIndex) {
      for (var i = pageIndex; i >= 0; i--) {
        if (this.state.pages[i])
          return this.setState({ currentPageIndex: i })
      }
      for (var i = pageIndex; i < this.state.pages.length; i++) {
        if (this.state.pages[i])
          return this.setState({ currentPageIndex: i })
      }
    }
  }
  tabContextMenu(pageIndex) {
    var self = this
    var menu = new Menu()
    menu.append(new MenuItem({ label: 'New Tab', click() { self.createTab() } }))
    menu.append(new MenuItem({ label: 'Duplicate', click() { self.createTab(self.getPageObject(pageIndex).location) } }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'Close Tab', click: function() { self.closeTab(pageIndex) } }))
    menu.popup(remote.getCurrentWindow())
  }
  locationContextMenu(el) {
    var self = this
    var menu = new Menu()
    menu.append(new MenuItem({ label: 'Copy', click() {
      clipboard.writeText(el.value)
    }}))
    menu.append(new MenuItem({ label: 'Cut', click() {
      clipboard.writeText(el.value.slice(el.selectionStart, el.selectionEnd))
      self.getPageObject().location = el.value.slice(0, el.selectionStart) + el.value.slice(el.selectionEnd)
    }}))
    menu.append(new MenuItem({ label: 'Paste', click: function() {
      var l = el.value.slice(0, el.selectionStart) + clipboard.readText() + el.value.slice(el.selectionEnd)
      self.getPageObject().location = l
    }}))
    menu.append(new MenuItem({ label: 'Paste and Go', click: function() {
      var l = el.value.slice(0, el.selectionStart) + clipboard.readText() + el.value.slice(el.selectionEnd)
      self.getPageObject().location = l
      self.getPage().navigateTo(l)
    }}))
    menu.popup(remote.getCurrentWindow())
  }
  webviewContextMenu(e) {
    var self = this
    var menu = new Menu()
    if (e.href) {
      menu.append(new MenuItem({ label: '新标签打开', click() { self.createTab(e.href) } }))
      menu.append(new MenuItem({ label: '复制链接地址', click() { clipboard.writeText(e.href) } }))
    }
    if (e.img) {
      // menu.append(new MenuItem({ label: '保存图片', click() { alert('todo') } }))
      menu.append(new MenuItem({ label: '复制图片链接', click() { clipboard.writeText(e.img) } }))
      menu.append(new MenuItem({ label: '新标签打开图片', click() { self.createTab(e.img) } }))
    }
    if (e.hasSelection)
      menu.append(new MenuItem({ label: '复制',accelerator: 'CmdOrCtrl+C', click() { self.getWebView().copy() } }))
      menu.append(new MenuItem({ label: '全选',accelerator: 'CmdOrCtrl+A', click() { self.getWebView().selectAll() } }))
      // menu.append(new MenuItem({ type: 'separator' }))
      // menu.append(new MenuItem({ label: 'Inspect Element', click: function() { self.getWebView().inspectElement(e.x, e.y) } }))
      menu.popup(remote.getCurrentWindow())
  }



  render() {
    const { pages = [],currentPageIndex = 0 } = this.state
    return (<div>
      <BrowserTabs ref="tabs" pages={pages} currentPageIndex={currentPageIndex} {...tabHandlers} />
      <BrowserNavbar ref="navbar" {...navHandlers} page={pages[currentPageIndex]} />
      {pages.map(function (page, i) {
        if (!page)
          return
        return (<BrowserPage ref={'page-'+i} key={'page-'+i} {...pageHandlers} page={page} pageIndex={i} isActive={i == currentPageIndex} />)
      })}
    </div>)
  }
}
