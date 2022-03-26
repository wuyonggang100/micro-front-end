// 存储加载到的依赖和回调
let lastRegister;

// 保存 window上的属性
function saveGlobalProps() {
  for (let p in window) {
    set.add(p);
  }
}
// 获取 window 上新增加的属性,一次只能获取一个
function getGlobalProp() {
  let result;
  for (let p in window) {
    if (set.has(p)) continue;
    result = window[p];
    /*
     * 用 load 方法加载的模块都没有 default 属性，而 webpack 按照 system方式 打包后的模块会有 default 属性，
     * 并且要用此属性来运行； 因此要加上 default 属性， 如 react_dom__WEBPACK_IMPORTED_MODULE_1__["default"]
     *
     */

    result.default = result;
  }
  return result;
}

// 创建 script 标签加载 js
function load(id) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = id;
    // script.async = true;
    document.head.appendChild(script);
    script.addEventListener("load", function () {
      console.log("index加载成功-----");
      // console.log("lastRegister----", lastRegister);
      // 加载后获取到依赖和回调, 保存起来，将变量清空
      let _lastRegister = lastRegister;
      lastRegister = undefined;
      // 如果没有依赖，也要返回正确结构
      if (!_lastRegister) {
        resolve([[], function () {}]);
        return;
      }
      resolve(_lastRegister);
    });
  });
}

function SystemJS() {}

SystemJS.prototype.register = function (deps, declare) {
  lastRegister = [deps, declare];
};

SystemJS.prototype.import = function (id) {
  return new Promise((resolve, reject) => {
    const lastSepIndex = window.location.href.lastIndexOf("/");
    // 去掉 index.htnl 后的路径
    const baseUrl = location.href.slice(0, lastSepIndex + 1);
    // 如果相对路径
    if (id.startsWith("./")) {
      // 得到需要加载的文件的绝对路径， 以 index.htmml 为参照路径的相对路径;
      resolve(baseUrl + id.slice(2));
    }
  }).then((id) => {
    // 加载目标 index.js
    console.log("id-----", id);
    let exec;
    return load(id)
      .then((registerition) => {
        function _export() {}
        // registerition[0] 是依赖列表 ；registerition[1] 是打包得到的回调, 回调执行后会得到一个对象 {setters, execute}
        // 回调执行的结果
        let declared = registerition[1](_export);
        exec = declared.execute; // 执行函数
        // 加载依赖完毕后，调用 setters
        return [registerition[0], declared.setters];
        console.log(declared, registerition[0]);
      })
      .then((info) => {
        // load().then 中返回的是 promise
        let ps = info[0].map((dep, i) => {
          let setter = info[1][i];

          // 加载 dep 时，当前 System.register 已经运行完毕，此时 registerition[0] 为空数组 [];
          return load(dep).then((r) => {
            // 此时 r 为 空数组 []
            let p = getGlobalProp(); // 获取的window上的全局属性，一次只能获取一个， 如 react 或 react-dom
            setter(p);
          });
        });
        return Promise.all(ps);
      })
      .then((res) => {
        debugger;
        exec();
      });
  });
};

// -------------先将 window 上原本的属性存起来-------------
let set = new Set();
saveGlobalProps();

window.SystemJS = SystemJS;
