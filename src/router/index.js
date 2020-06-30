import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

const router = new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login")
    }, {
      path: "",
      name: "AdminHome",
      component: () => import("@/components/AdminHome"),
      children: [
        {
          path: "/",
          name: "Home",
          component: () => import("@/views/Home"),
          meta: { keepAlive: false }
        }, {
          path: "/mine",
          name: "Mine",
          component: () => import("@/views/Mine"),
          meta: { keepAlive: false }
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
          component: () => import("@/components/Forbidden")
        }, {
          path: "/404",
          name: "NotFound",
          component: () => import("@/components/NotFound")
        }, 
      ],
    },
  ]
})

export default router
