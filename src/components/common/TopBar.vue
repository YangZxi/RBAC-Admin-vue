<template>
  <div class="top-bar">
    <div class="logo">
      <span class="isCollapse" @click="collapse"><i class="fa fa-outdent"></i></span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{name: 'Home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="el in $store.state.menuModule.breadcrumb" :key="el">{{el}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="setting-btn hidden-sm-and-down">
      <el-popover
        ref="setting-btn-popover"
        placement="bottom"
        trigger="hover">
        <el-button style="margin-left: 10px;" type="text" class='setting-popover-item' @click="$router.push({ name: 'Mine' })">我的信息</el-button>
        <el-button type="text" class='setting-popover-item' @click="$router.push({ name: 'Password' })">修改密码</el-button>
        <el-button type="text" class='setting-popover-item' @click="logout">退出</el-button>
      </el-popover>
      <el-button type="text" v-popover:setting-btn-popover>个人中心 <i class="el-icon-arrow-down"/></el-button>
    </div>
  </div>
</template>

<script>
// import Router from "../../router";

export default {
  methods: {
    logout() {
      this.$axios.post(this.$api.LOGOUT).then(res => {
        if (res.code == 200) {
          this.$store.commit("setToken", null);
          this.$store.commit("setUser", null);
          this.$store.state.menuModule.menu = [];
          this.$store.state.menuModule.tabs = [];
          window.localStorage.clear();
          window.sessionStorage.clear();
          this.$router.push({
            name: "Login"
          });
        }
      })
      
    },
    collapse() {
      this.$store.state.menuModule.isCollapse = !this.$store.state.menuModule.isCollapse;
    }
  }
};
</script>

<style scoped>
.top-bar {
  height: 100%;
}

.isCollapse {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}

.logo {
  height: 100%;
  float: left;
  /* color: #409eff; */
  display: flex;
  align-items: center;
}

.setting-btn {
  height: 100%;
  float: right;
  display: flex;
  align-items: center;
}
.setting-popover-item {
  display: block;
}
</style>
