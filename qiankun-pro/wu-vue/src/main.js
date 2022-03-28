import { createApp } from "vue";
import App from "./App.vue";
import routes from "./router";
// import store from "./store";
import { createWebHistory, createRouter } from "vue-router";

let history;
let router;
let app;
function render(props = {}) {
  history = createWebHistory("/vue");
  router = createRouter({
    history,
    routes,
  });
  app = createApp(App);
  const { container } = props;
  // 如果是在 qiankun 中，就渲染到容器中，否则据渲染到自己应用的容器中
  app.use(router).mount(container ? container.querySelector("#app") : "#app");
}

// 不是在qiankun 中使用时，需要独立运行；
debugger;
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 需要暴露接入协议，即三个钩子函数,必须都返回 promise
export async function bootstrap() {
  console.log("vue3 app 启动成功");
}
export async function mount(props) {
  console.log("vue3 app 挂载成功");
  console.log(props);
  render(props);
}
export async function unmount() {
  console.log("vue3 app 销毁了");
  history = null;
  app = null;
  router = null;
}
