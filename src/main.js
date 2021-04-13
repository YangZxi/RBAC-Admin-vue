// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'

import Antd from 'ant-design-vue/es';;
import 'ant-design-vue/dist/antd.css';
import Result from 'ant-design-vue/lib/result';

Vue.component(Result.name, Result);

// import echarts
import charts from '@/utils/Echarts.js';
Vue.use(charts);

// import requets of axios
import axios from '@/utils/XMLHttpRequest'
Vue.prototype.$axios = axios;

// import api
import APIUtils from '@/utils/APIUtils';
Vue.prototype.$api = APIUtils;

// import http action
import HttpUtils from '@/utils/HttpUtils';
Vue.prototype.$http = HttpUtils;

// import Tools
import Tools from '@/utils/Tools'
Vue.prototype.$tools = Tools;

// import Tools
import LogUtils from '@/utils/LogUtils'
Vue.prototype.$log = LogUtils;

// import element-Notification
import Notification from 'element-ui';
Vue.prototype.$tips = Notification;

// import common component
import components from "@/components/index";
Vue.use(components);

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.use(Antd);

// router fitter
router.beforeEach((to, from, next) => {
  // 如果没有登录
  if ( !store.state.token ) {
    if (to.name !== "Login") next({ name: "Login" }); // 没有登录就访问登录以外的页面
    else next();
  }
  else {
    if (to.name == "Login") { // 有登录信息，将保持原页面不进行跳转
      // 不要太快了，不然体验不好
      console.log("已登录了")
      setTimeout(() => {
        next(false);
      }, 1500);
    } else {
      if (to.path == null || to.name == null) {
        next({ name: "NotFound" });
      } else if (!to.meta.anonymous && !Tools.verifyAuth(to.name)) { // 禁止匿名访问且没有权限
        next({ name: "Forbidden" })
      } else {
        // 添加Tabs
        store.dispatch("menuModule/clickMenuItem", to);
        next();
      }
    }
  }
});

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
