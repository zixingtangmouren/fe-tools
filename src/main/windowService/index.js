const BaseWindow = require('./BaseWindow');

/**
 * @class WindowServices
 * @description 窗口服务
 * 主要职责：注册窗口、创建窗口、获取窗口
 */
class WindowServices {
  constructor() {
    this._cacheWindows = {};
  }

  registerWindow(name, options) {
    if (this._cacheWindows[name]) {
      throw new Error(`Window ${name} already exists`);
    }
    this._cacheWindows[name] = new BaseWindow(name, options);
  }

  create(name, options) {
    if (!this._cacheWindows[name]) {
      throw new Error(`Window ${name} is not registered`);
    }

    if (this._cacheWindows[name].isCreated()) {
      this._cacheWindows[name].show();
      return;
    }

    return this._cacheWindows[name].create(options);
  }

  getWindow(name) {
    if (!this._cacheWindows[name]) {
      throw new Error(`Window ${name} is not registered`);
    }

    return this._cacheWindows[name];
  }

  exists(name) {
    return !!this._cacheWindows[name];
  }
}

module.exports = new WindowServices();
