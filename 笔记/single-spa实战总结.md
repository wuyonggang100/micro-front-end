## single-spa 实战

#### 1、搭建 react 项目

```shell
yarn init -y

yarn add webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin -D

yarn add react react-dom -S
```



### webpack 以 syetemjs 方式打包

- syetemjs ： 浏览器通用模块加载器；

- 打包命令：

```json
 "build": "webpack --env production"
```

- 打包关键配置：

```js
// 生产时遵循 system 模块规范来打包， ”“ 会打包成自执行函数
output.libraryTarget =  env.production ? "system" : "",
// 生产时忽略打包，对 react 和 react-dom 使用 cdn 方式加载，不参与打包    
externals: env.production ? ["react", "react-dom"] : [], 
```

- 打包结果使用

  > 当react和react-dom加载完毕后，才会加载 index.js。
  >
  > 

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Title</title>
    </head>
    <body>
      <script type="systemjs-importmap">
        {
          "imports": {
            "react": "https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.development.min.js",
            "react-dom": "https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"
          }
        }
      </script>
      <div id="root"></div>
      <script src="https://cdn.bootcdn.net/ajax/libs/systemjs/6.12.1/system.js"></script>
      <script>
        // 引入 index.js 前，需要先加载 react 和 react-dom 两个模块
        System.import("./index.js");
      </script>
    </body>
  </html>
  
  ```





# single-spa

> Single-spa 是一个将多个单页面应用聚合为一个整体应用的 JavaScript 微前端框架。
>
> 一个微前端的DOM不能够被其他微前端触及，

**single-spa 仅仅是一个子应用生命周期的调度者。**single-spa 为应用定义了 boostrap, load, mount, unmount 四个生命周期回调：

![image-104254498](single-spa实战总结.assets/image-104254498.png)

#### 一、微前端类型

在single-spa中，有以下三种微前端类型：

1. [single-spa applications](https://zh-hans.single-spa.js.org/docs/building-applications):为一组特定路由渲染组件的微前端。不同路由地址对应的不同应用；
2. [single-spa parcels](https://zh-hans.single-spa.js.org/docs/parcels-overview): 不受路由控制，渲染组件的微前端。一般是公共组件，可以在不同 应用中使用。
3. [utility modules](https://zh-hans.single-spa.js.org/docs/recommended-setup#utility-modules-styleguide-api-etc): 非渲染组件，用于暴露共享javascript逻辑的微前端。一般是公共方法；
4. single-spa root config ： 根应用；

#### 二、实战搭建

- 安装 single-spa 脚手架： 

```shell
yarn add create-single-spa -g
```

- 创建基座项目

  > 选择 single-spa root config 生成根应用；不使用其自带的 Layout Engine ；

  ```shell
  create-single-spa base
  ```

- 创建 react 应用, 创建 vue 应用

  > 选择 application， 选择 react / vue ，react 项目命名为 react-app , vue 项目不需要命名； vue3 暂时不支持 externals ，可以选 vue3。

  ```shell
  create-single-spa react-app
  create-single-spa vue-app
  ```

- 启动根应用， 打开 127.0.0.1:9000

  ```shell
  cd base  # 先进入根应用
  yarn start 
  ```

  

#### 三、应用注册加载

#### 3.1 注册

> 当匹配的路由是 / 时，就加载 此根应用，加载完毕后应用会向外暴露三个钩子： bootstrap,  mount;  unmount ；

路径匹配不能精准匹配， /vue3 也会匹配到 / ， 因此要用别的方法来是实现精准匹配；

```js
// xx-root-config.js
import { registerApplication, start } from "single-spa";

// 注册基座主应用
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  // activeWhen: ["/"], // 以 / 开头的就能匹配上， 因此不能精准匹配
  activeWhen: (location) => location.pathname === "/",
});

// 注册 vue3 应用
registerApplication({
  name: "@wu/vue3-app",
  app: () => System.import("@wu/vue3-app"),
  // 以 /vue3 开头的就能匹配上, 此处为子应用路由的的基本路径前缀, 需要在 vue 项目的路由作为 baseUrl 配好
  activeWhen: ["/vue3"],
});

// 启动应用
start({
  urlRerouteOnly: true,
});
```

> 基座中第三方包的 cdn 加载 和 子应用的引入加载

```ejs
// 子应用
<script type="systemjs-importmap">
    {
      "imports": {
        "@wu/root-config": "//localhost:9000/wu-root-config.js",
        "@wu/vue3-app": "//localhost:8081/js/app.js",
        "@wu/react-app": "//localhost:4000/js/wu-react-app.js",
      }
    }
  </script>
```





#### 3.2 应用加载

> 除 vue 项目外，每个项目下的 webpack 配置中有个配置 orgName 和  projectName，当前应用被其他应用使用时， 需要用 System.import(@orgName/projectName)  方式来加载，如：orgName为 wu，projectName    为  root-config ;
>
> ```js
> # 加载根应用
> System.import('@wu/root-config');
> ```

- 从根应用出发，iudex.js 中会根据加载根应用的 入口 wu-root-config.js； 然后此入口中再根据逻辑加载其其他子应用；

  ```JS
  System.import('@wu/root-config');
  ```

- 每个应用需要暴露出 三个钩子， bootstrap ， mount， unmount；vue 应用hi用一个插件 vue-cli-single-spa-plugin 将 入口文件 main.js 改写；每个应用都可以独立运行；

- vue 应用的加载路由需要加前缀，此前缀与注册时的基本路径相同；

  ```js
  // router.js
  const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL),
    history: createWebHistory('vue3'),
    routes,
  });
  
  ```



#### 3.3 应用通信

- ##### 可以在注册时传个属性 customProps ; 

  子应用会接收到其中的属性， 不包含 customProps  本身。默认会有三个属性 "name", "mountParcel", "singleSpa" ；都会被当作 props 属性传入；

  ```js
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
  ```

- ##### vue 子应用中接收

  对于 vue 应用， 首先会在 main.js 中接收到，传过来的数据会添加到props 里，如上， vue2 中可以直接使用 this.info 获取到；vue3中 在 props.info 中也能获取到。然S后需要传给 APP.vue

  ```js
  // main.js
  const vueLifecycles = singleSpaVue({
    createApp,
    appOptions: {
      render() {
        return h(App, {
          info: this.info,
          // 以下是single-spa默认传入的三个属性
          name: this.name,
          mountParcel: this.mountParcel,
          singleSpa: this.singleSpa,
        });
      },
    },
    handleInstance(app) {
      app.use(router);
      app.use(store);
    },
  });
  ```

>  在 app.vue 中以 props 的形式接收 info 

```vue
props: {
    info: Object,
    default: () => ({}),
},
```

- ##### react 应用

  - 接收： 会在根组件的 props 中接收到基座传入的数据；

  - 路由依赖加载：single-spa 创建的react 应用 默认会将 react 和 react-dom 用 systemJS 使用 cdn 作为第三方依赖加载，因此需要使用 importmap 加载；对于react-router-dom, 需要我们手动进行 cdn 加载， 在 webpack 配置中加入 externals ；
  - 路由的前缀为 /react,  需要与 基座中注册时对应；

  ```js
  // webpack.config.js
  externals: ["react-router-dom"],
  ```

  

  ```ejs
  // 第三方包
  <script type="systemjs-importmap">
      {
        "imports": {
          "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
          "react": "https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.development.js",
          "react-router-dom": "https://cdn.bootcdn.net/ajax/libs/react-router-dom/5.2.0/react-router-dom.js"
        }
      }
    </script>
  ```

  

  ```jsx
  // 根应用
  import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
  import home from "./components/home";
  import about from "./components/about";
  
  export default function Root(props) {
    return (
      <BrowserRouter basename="/react">
        <section>{props.name} is mounted!</section>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <div>{JSON.stringify(props)}</div>
        <Switch>
          <Route path="/" exact component={home}></Route>
          <Route path="/about" component={about}></Route>
          <Redirect to="/"></Redirect>
        </Switch>
      </BrowserRouter>
    );
  }
  ```

  

## 总结

- single -spa 主要是对子应用的调度以及通信，通过 registerApplication 方法注册子应用，在路由匹配到的时候就加载对应子应用；
- 使用 importmap 方式来加载第三方包，多个子应用可以共享版本；也可以某个子应用单独使用不同版本；













