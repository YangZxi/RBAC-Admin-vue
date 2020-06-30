<template>
  <el-container>
    <!-- <i  v-loading.fullscreen.lock="this.$store.state.user == null"></i> -->
    <el-container id='root-container' >
      <!-- 侧边栏 -->
      <el-aside>
         <left-nav/>
      </el-aside>
      
      <!-- 右边内容 -->
      <el-container>
        <!-- 头部 -->
        <el-header>
          <top-bar/>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <right-tabs/>
        </el-main>
        
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import LeftNav from "./common/LeftNav.vue";
import RightTabs from "./common/RightTabs";
import TopBar from "./common/TopBar";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isLoading: this.$store.state.user == null,
    }
  },
  methods: {
    ...mapActions("menuModule", {
      getMenu: "getMenu",
      clickMenuItem: "clickMenuItem"
    }),
    /**
     * 因为菜单数据过来有延迟
     * 所以可能页面渲染好以后Tab标签没有添加上去
     * 这里主动添加Tab标签
     */
    addTab() {
      console.log(this.$router.currentRoute);
      this.clickMenuItem(this.$router.currentRoute.name);
    }
  },
  async created() {
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    // 页面首次加载，获取用户信息（其中包含了菜单数据）
    // 注意！！！这是同步的请求
    await this.getMenu();
    this.addTab();
    loading.close();
    // console.log(111111111)
    // this.openFullScreen();
  },
  components: {
    LeftNav,
    RightTabs,
    TopBar
  }
};
</script>

<style scoped>
.el-container {
  height: 100%;
  width: 100%;
}
.el-header {
  /* background-color: #2b3749; */
}
.el-aside {
  /* height: 100%; */
  width: auto !important;
  /* min-width: 200px; */
}
.el-main {
  /* height: 100%; */
  padding: 0;
  width: 100%;
  background: #F3F5F8;
}
</style>
