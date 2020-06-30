// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-chalk/display.css'

import Antd from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css'
// import Button from 'ant-design-vue/lib/button';
// import 'ant-design-vue/dist/antd.css';

// Vue.component(Button.name, Button)


// import echarts
import charts from '@/utils/Echarts.js'
Vue.use(charts)

// import api
import APIUtils from '@/utils/APIUtils'
Vue.prototype.$api = APIUtils;

// import Tools
import Tools from '@/utils/Tools'
Vue.prototype.$tools = Tools;

// import requets of axios
import axios from '@/utils/XMLHttpRequest'
Vue.prototype.$axios = axios;

import Notification from 'element-ui';
Vue.prototype.$tips = Notification;

// import common component
import components from "@/components/index"
Vue.use(components)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Antd)

// router fitter
let flag = true;
router.beforeEach((to, from, next) => {
  console.log(to)
  // console.log(store.dispatch("menuModule/clickMenuItem", to.path))
  // store.state.menuModule.dispatch("clickMenuItem", to.name)
  if (to.name != "Login" && !store.state.token) {
    next({ name: "Login" });
  }
  // 如果是登录页面
  else if (to.name == "Login") {
    if (store.state.token) {
      // 且有登录信息，将保持原页面不进行跳转
      // 不要太快了，不然体验不好
      console.log("已登录了")
      setTimeout(() => {
        next(false);
      }, 1500);
    } else {
      next();
    }
    
  }
  else {
    // 添加Tabs
    console.log(store.dispatch("menuModule/clickMenuItem", to.name))
    if (to.name == "Home" || to.name == "Mine") {
      next();
    } else if (to.path == "/" && to.name != "Home" || to.name == null) {
      next({ name: "NotFound" });
    } else if (!Tools.verifyAuth(to.name)) {
      next({ name: "Forbidden" })
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
