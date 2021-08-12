/**
 * 获取路径参数值
 * @param {string} str 参数字符串
 */
const getUrlSearchValue = (name) => {
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
};

module.exports = { getUrlSearchValue };
