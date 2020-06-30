<template>
  <el-menu class="el-menu-vertical-demo" :default-active='activeItem' @select='selectMenuItem'
          background-color="#304156" text-color="#FFF" :router="false" 
          :unique-opened="true" :collapse="isCollapse">
    <el-menu-item key="Home" index="Home" >
      <i class="el-icon-odometer"></i>
      <span>首页</span>
    </el-menu-item>
    
    <!-- 遍历当前用户拥有的菜单 -->
    <el-submenu v-for="(c, index) in menu" :key="c.name" :index="c.path">
      <template slot="title">
        <i :class="c.icon"></i>
        <span>{{c.name}}</span>
      </template>
      <el-menu-item v-for="item in c.children" :key="item.name" :index="item.component">
        <i :class="item.icon"></i>
        {{item.name}}
      </el-menu-item>
    </el-submenu>
    
  </el-menu>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      // isCollapse: false
    }  
  },
  created() {
    // this.getMenu();
    // this.clickMenuItem("Home"); // 已不需要
  },
  methods: {
    ...mapActions("menuModule", {
      getMenu: "getMenu",
      clickMenuItem: "clickMenuItem"
    }),
    selectMenuItem(index) {
      this.$router.push({
        name: index
      });
    }
  },
  computed: {
    ...mapState("menuModule", {
      menu: "menu",
      activeItem: "activeItem",
      isCollapse: "isCollapse"
    }),
    ...mapGetters("menuModule", {
      subMenu: "subMenu",
      itemMenu: "itemMenu",
    })
  }
};
</script>

<style scoped>
.el-menu > ul,
.el-menu {
  height: 100%;
}
.fa {
  padding: 0 5px;
  margin-right: 5px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 230px;
  min-height: 400px;
}
</style>
