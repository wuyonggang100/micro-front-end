import { registerApplication, start } from "single-spa";

// 注册基座
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  // activeWhen: ["/"], // 以 / 开头的就能匹配上， 因此不能精准匹配
  activeWhen: (location) => location.pathname === "/",
});

// 注册 vue 应用
registerApplication({
  name: "@wu/vue3-app",
  // 此处会取找 importsmap 中的 key,因此要一致
  app: () => System.import("@wu/vue3-app"),
  // 以 /vue3 开头的就能匹配上, 此处为子应用路由的的基本路径前缀, 需要在 vue 项目的路由作为 baseUrl 配好
  activeWhen: ["/vue3"],
  customProps: {
    // 自定义 props，从子应用的 bootstrap, mount, unmount 回调可以拿到
    info: {
      authToken: "xc67f6as87f7s9d",
    },
  },
});

// 注册 react 应用
registerApplication({
  name: "@wu/react-app",
  app: () => System.import("@wu/react-app"),
  activeWhen: ["/react"],
  customProps: {
    info: {
      authToken: "xc67f6as87f7s9d",
    },
  },
});

start({
  urlRerouteOnly: true,
});
