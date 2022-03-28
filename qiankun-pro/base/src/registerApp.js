// qiankun 基于 single-spa
import { registerMicroApps, start } from "qiankun";
const loader = (loading) => {
  console.log("loading。。。中");
};
const apps = [
  {
    name: "wu-vue",
    entry: "//localhost:8081",
    container: "#container",
    activeRule: "/vue",
    loader,
  },
  {
    name: "wu-react",
    entry: "//localhost:3001",
    container: "#container",
    activeRule: "/react",
    loader,
  },
];
registerMicroApps(apps, {
  beforeLoad() {
    console.log("加载前");
  },
  beforeMount() {
    console.log("挂载前");
  },
  afterMount() {
    console.log("挂载后");
  },
  beforeUnmount() {
    console.log("销毁前");
  },
  afterUnmount() {
    console.log("销毁后");
  },
});

start();