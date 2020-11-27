<template>
  <el-tabs :value="activeItem" @tab-remove="closeTab" class="content-body"
    @tab-click="tabClick" type="card" >
    <el-tab-pane label="首页" name="Home" :lazy="true">
      <span slot="label">
        <i class="el-icon-odometer" style="margin-right: 5px;"></i>
        首页
      </span>
    </el-tab-pane>
    <el-tab-pane v-for="item in tabs" :label="item.label" :key="item.index" :name="item.index"  :closable="item.closable">
      <span slot="label">
        <i :class="item.icon" style="margin-right: 5px;"></i>
        {{item.label}}
      </span>
      <!-- <async-component :componentPath="item.componentPath" class="async-component"></async-component> -->
    </el-tab-pane>
    <!-- <transition-group mode="out-in">
      <keep-alive v-if="$route.meta.keepAlive" :key="$route.name">
        <router-view v-if="$route.meta.keepAlive" :key="$route.name"></router-view>
      </keep-alive>
      <router-view v-else :key="$route.name"></router-view>
    </transition-group> -->
    <transition mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </el-tabs>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import AdminHome from "@/views/Home";
import AsyncComponent from "../AsyncComponent";

export default {
  computed: {
    ...mapState("menuModule", {
      tabs: "tabs",
      activeItem: "activeItem"
    })
  },
  methods: {
    ...mapActions("menuModule", {
      closeTab: "closeTab"
    }),
    ...mapMutations("menuModule",{
      switchTab:"switchTab"
    }),
    tabClick(e){
      // this.switchTab(e.name)
      console.log(e)
      this.$router.push({
        name: e.name
      });
    },
    drag() {
      alert(1)
    }
  },
  mounted() {
    console.log(this.tabs)
  },
  components: {
    AdminHome,
    AsyncComponent
  }
};
</script>
<style scoped>
.content-body {
  height: 100%;
}

.v-enter,.v-leave-to{
  opacity: 0;
  transform: translateX(0,200px)
}
/* .v-enter-active,.v-leave-active{
  transition: all .4s ease-in-out;
} */
.v-enter-active{
  transition: all 0.6s ease-in-out;
  transition-delay: 0s;
}
.v-leave-active{
  transition: all 0.6s ease-in-out;
}

</style>
