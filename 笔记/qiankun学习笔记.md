# 创建项目

- 创建以下四个项目, 基座项目需要安装react-router-dom 和 qiankun ；

**注意：如果父应用使用 browser-router， 子应用也要使用。**

```shell
create-react-app base #基座
create-react-app wu-react # react 应用
vue create wu-vue # vue3 应用
vue create vue-parcel # vue2公共组件
```

### 子应用的注册

需要在基座的入口文件内运行，如 main.js 中；

```js
// qiankun 基于 single-spa
import { registerMicroApps, start } from "qiankun";
const loader = (loading) => {
  console.log("loading。。。中");
};
c
registerMicroApps(
  [
    
  ],
  {
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
  }
);

start();

```



### vue 应用的加载

- qiankun 基座请求 vue 子应用资源时，会使用 fetch 方式，fetch  默认不允许跨域，因此在vue 子应用 webpack 配置中，子应用需要配置允许跨域；使用 umd  方式打包；

- 子应用应该是在 mount 时才渲染，即不能默认挂载渲染；且每次渲染的子应用都是一个全新实例，路由也是全新路由；

- 如果是在 qiankun 中渲染，window 中就会有个变量 ``__POWERED_BY_QIANKUN__`` ,可以用来作判断依据；

- 子应用需要向外暴露三个钩子， 者三个钩子必须要返回 promise ，使用 asnyc 函数或者 Promise 

  ```js
  export const bootstrap = async () => {
    // do something
  }
  // props 是注册时的选项
  export const mount = (props) => Promise.resolve().then(() => {
  })
  
  export const unmount = async () => {
    // do something
  }
  ```

  

