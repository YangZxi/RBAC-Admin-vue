<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* 右边标签选显卡 */
.el-tabs__header {
    background: #FFF;
}
/* 右边标签页 */
.el-tabs__content {
    padding: 0 20px;
    color: #606266;
}
</style>
