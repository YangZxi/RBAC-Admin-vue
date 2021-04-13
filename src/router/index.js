import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

/**
 * value[default]: value表示属性名，default表示属性的默认值
 * 
 * keepAlive[false]: 为false表示每次进入当前tab页面都会重新渲染，具体请参考 https://cn.vuejs.org/v2/api/#keep-alive
 * anonymous[false]: 匿名请求，设置为true表示这个组件或路径只需要登录即可访问，无需其他权限
 * tabName['']: 标签名，这个将显示在tab标签页上
 */

const router = new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login")
    }, {
      path: "/",
      // name: "AdminHome",
      component: () => import("@/components/AdminHome"),
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/views/Home"),
          meta: { keepAlive: true, anonymous: true }
        }, 
        
        // 个人中心
        {
          path: "/mine",
          name: "Mine",
          component: () => import("@/views/mine/Mine"),
          meta: { keepAlive: false, anonymous: true, tabName: '我的信息' }
        }, {
          path: "/mine/password",
          name: "Password",
          component: () => import("@/views/mine/Password"),
          meta: { keepAlive: false,  anonymous: true , tabName: '修改密码'}
        }, 
        
        
        // 系统管理
        {
          path: "/system/user",
          name: "User",
          component: () => import("@/views/system/user/User"),
          meta: { keepAlive: false }
        }, {
          path: "/system/role",
          name: "Role",
          component: () => import("@/views/system/role/Role"),
          meta: { keepAlive: false }
        }, {
          path: "/system/menu",
          name: "Menu",
          component: () => import("@/views/system/menu/Menu"),
          meta: { keepAlive: false }
        }, {
          path: "/system/task",
          name: "Task",
          component: () => import("@/views/system/task/Task"),
          meta: { keepAlive: false }
        },

        // 系统监控
        {
          path: "/monitor/log/operate",
          name: "OperateLog",
          component: () => import("@/views/monitor/log/OperateLog"),
          meta: { keepAlive: false }
        }, {
          path: "/monitor/log/exception",
          name: "ExceptionLog",
          component: () => import("@/views/monitor/log/ExceptionLog"),
          meta: { keepAlive: false }
        }, {
          path: "/monitor/system",
          name: "SystemInfo",
          component: () => import("@/views/monitor/system/SystemInfo"),
          meta: { keepAlive: true }
        },
        {
          path: "/monitor/druid",
          name: "Druid",
          component: () => import("@/views/monitor/druid/Druid"),
          meta: { keepAlive: true }
        },


        // 系统工具
        {
          path: "/tools/smtp",
          name: "SMTP",
          component: () => import("@/views/tools/smtp/SMTP"),
          meta: { keepAlive: false }
        },
        
        
        {
          path: "/403",
          name: "Forbidden",
          component: () => import("@/components/Forbidden"),
          meta: { anonymous: true }
        }, {
          path: "/404",
          name: "NotFound",
          component: () => import("@/components/NotFound"),
          meta: { anonymous: true }
        }, 
      ],
    },
  ]
})

export default router
