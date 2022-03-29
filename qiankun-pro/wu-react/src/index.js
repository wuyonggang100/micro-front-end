import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const render = (props = {}) => {
  const { container } = props;
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
};

// 非 qiankun 中运行时，独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 需要暴露接入协议，即三个钩子函数,必须都返回 promise
export async function bootstrap() {
  console.log("react app 启动成功");
}
export async function mount(props) {
  console.log("react app 挂载成功");
  console.log(props);
  render(props);
}
export async function unmount(props = {}) {
  const { container } = props;
  // 将应用卸载
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
  console.log("react app 销毁了");
}
