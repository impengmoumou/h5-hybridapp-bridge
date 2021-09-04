class H5HybridAppBridge {
  constructor(options = {}) {
    this.NODE_ENV = options.NODE_ENV;

    this.webDev = options.webDev;
    // 本地开发：web开发
    this.isWeb =
      this.webDev &&
      this.NODE_ENV === "development" &&
      this.getUrlSearchValue("web") === "1";

    this.showConsole = options.showConsole;
    const isDebugger = this.getUrlSearchValue("debug") === "1";
    // 本地开发：显示控制台
    if (this.showConsole && (isDebugger || this.NODE_ENV === "development")) {
      const VConsole = require("vconsole");
      new VConsole();
    }

    this.reloadUrl = options.reloadUrl || "app://reloadURL";
    this.goToURL = options.goToURL || "app://goToURL";
    this.backUrl = options.backUrl || "app://back";
    this.backToUrl = options.backToUrl || "app://backToUrl";
    this.backAppUrl = options.backUrl || "app://backToApp";
    this.backHomeUrl = options.backHomeUrl || "app://backHome";

    this.timer = null;
    this.intervalTimer = null;
  }

  // Method
  setupWebViewJavascriptBridge(callback) {
    if (window["WebViewJavascriptBridge"]) {
      return callback(WebViewJavascriptBridge);
    }
    if (window["WVJBCallbacks"]) {
      return window["WVJBCallbacks"].push(callback);
    }
    window["WVJBCallbacks"] = [callback];
    const WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "https://__bridge_loaded__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }

  // 注册函数
  registerHandler(type, callback = undefined) {
    this.setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(type, function (data, responseCallback) {
        responseCallback(data);
      });
    });
  }

  // 调用函数
  callHandler(type, value = undefined, callback = undefined) {
    this.setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(type, value, callback);
    });
  }

  /**
   * 通知app处理事件
   * @param data 事件参数
   * @param callback 回调函数
   */
  callHandlerToApp(type, params = {}, callback = undefined) {
    console.log(`${type}:${JSON.stringify(params)}`);
    // 启用web开发模式：执行回调事件
    if (this.isWeb) {
      console.log(`web:${type}`);
      if (callback) {
        callback();
      }
    }
    this.callHandler(type, JSON.stringify(params), (data) => {
      console.log(`${type}:${data}`);
      const res = JSON.parse(data || "{}");
      if (callback) {
        callback(res);
      }
    });
  }

  /**
   * 获取app传入的必要数据
   * @param type 调用事件type
   * @param params 调用事件传参
   * @param callback 成功回调函数
   * @param errCallback 失败回调函数
   * @param times 超时限制
   * @param intervalTimes 间隔调用时间
   */
  getAppInfo(
    type,
    params = {},
    callback,
    errCallback,
    times = 5000,
    intervalTimes = 1000
  ) {
    if (!type) {
      if (errCallback) {
        errCallback();
      }
      return;
    }
    // 设置计时，默认5秒
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      clearInterval(this.intervalTimer);
      if (errCallback) {
        errCallback();
      }
    }, times);

    // 安卓注入时机不同，默认每隔1秒拉取app信息
    this.intervalTimer = setInterval(() => {
      this.callHandlerToApp(type, params, (data) => {
        // 拿到数据清除计时器与循环拉取
        clearTimeout(this.timer);
        clearInterval(this.intervalTimer);
        if (callback) {
          callback(data);
        }
      });
    }, intervalTimes);
  }

  /**
   * 返回事件
   * @param num
   */
  goBack(num = -1) {
    //web开发：返回页面
    if (this.isWeb) {
      console.log(`web:goBack ${num}`);
      return;
    }
    switch (num) {
      case 0: {
        //返回到app
        window.location.href = this.backAppUrl;
        return;
      }
      case 1: {
        //返回网页首页
        window.location.href = this.backHomeUrl;
        return;
      }
      case -1:
      default: {
        //返回上一页
        window.location.href = this.backUrl;
        return;
      }
    }
  }

  /**
   * 返回某个历史网页
   */
  back(url) {
    //web开发：跳转页面
    if (this.isWeb) {
      console.log(`web:${this.backToUrl}?url=${url}`);
      window.location.href = url;
      return;
    }
    window.location.href = `${this.backToUrl}?url=${url}`;
  }

  /**
   * 页面重载事件
   */
  reload() {
    //web开发：刷新页面
    if (this.isWeb) {
      console.log(`web:${this.reloadUrl}`);
      window.location.reload();
      return;
    }
    window.location.href = this.reloadUrl;
  }

  /**
   * 页面跳转
   */
  go(url) {
    //web开发：跳转页面
    if (this.isWeb) {
      console.log(`web:${this.goToURL}?url=${url}`);
      window.location.href = url;
      return;
    }
    window.location.href = `${this.goToURL}?url=${url}`;
  }

  /**
   * app跳转
   */
  goApp(url) {
    //web开发：跳转app路径
    if (this.isWeb) {
      console.log(`web:goApp ${url}`);
      return;
    }
    window.location.href = url;
  }
  /**
   * 获取路径参数值
   * @param {string} name 参数字符串
   */
  getUrlSearchValue(name) {
    const href = window.location.href;
    const hs = href.split("?");
    if (hs.length > 1) {
      const needStr = hs[1];
      const ns = needStr.split("&");
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        const t = n.split("=");

        if (t.length > 1) {
          if (name == t[0]) {
            return t[1];
          }
        }
      }
    }
  }
}
export { H5HybridAppBridge };

export default H5HybridAppBridge;
