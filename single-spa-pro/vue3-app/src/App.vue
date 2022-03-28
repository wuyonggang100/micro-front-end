<template>
  <div id="nav">
    <!--    父应用传过来的数据-->
    <h1>{{ info }}</h1>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>
<script>
import { onMounted } from "vue";
export default {
  props: {
    info: Object,
    default: () => ({}),
  },
  setup(props) {
    onMounted(() => {
      console.log("onMounted----");
      console.log(props);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
