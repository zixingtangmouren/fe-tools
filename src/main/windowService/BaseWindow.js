const { BrowserWindow } = require('electron');
const { merge } = require('lodash');

function getDefaultOptions() {
  return {
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  };
}

/**
 * @class BaseWindow
 * @description 窗口基类
 * 主要职责：BrowserWindow 选项的初始化、实例创建、以及相关事件的监听、remote 模块的启用
 */
module.exports = class BaseWindow {
  constructor(name, options) {
    this._instance = null;
    this.name = name;
    this.options = Object.assign(getDefaultOptions(), options);
  }

  create(options) {
    const _options = merge(this.options, options);
    this._instance = new BrowserWindow(_options);
    this._instance.loadFile(`./src/render/${this.name}.html`);
    this._beforeClose();
    return this;
  }

  isCreated() {
    return this._instance !== null;
  }

  getInstance() {
    return this._instance;
  }

  show() {
    if (this._instance) {
      this._instance.show();
    }
  }

  hide() {
    if (this._instance) {
      this._instance.hide();
    }
  }

  close() {
    if (this._instance) {
      this._instance.close();
    }
  }

  destroy() {
    if (this._instance) {
      this._instance.destroy();
    }
  }

  _beforeClose() {
    require('@electron/remote/main').enable(this._instance.webContents);
    this._instance.once('closed', () => {
      this.destroy();
      this._instance = null;
    });
  }
};
