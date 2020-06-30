import Http from "./http"
export default {
  getMenu() {
    return Http.get("/menu", {
      adapter: async (config) => {
          return {
            code: 200,
            msg: "success",
            data: [
              // { name: "用户管理", sub: "系统管理", index: "User", component: "views/User" },
              // { name: "角色管理", sub: "系统管理", index: "UserRole", component: "views/UserRole" },
              // { name: "菜单管理", sub: "系统管理", index: "Menu", component: "views/Mene" },
              { id: 1, name: "系统管理", index: "/system", icon: "el-icon-s-operation", children: [
                  { id: 2, name: "员工管理", index: "/user", component: "User", icon: "el-icon-user-solid" },
                  { id: 3, name: "角色管理", index: "/role", component: "Role", icon: "fa fa-user-plus" },
                  { id: 4, name: "菜单管理", index: "/menu", component: "Menu", icon: "fa fa-list" },
                  // { id: 5, name: "帖子管理", index: "/post", component: "Post", icon: "fa fa-archive" },
                  // { id: 6, name: "评论管理", index: "/comment", component: "Comment", icon: "fa fa-comment" },
                  { id: 7, name: "定时任务", index: "/schedule", component: "Schedule", icon: "el-icon-timer" },
                ]
              },
              { id: 9, name: "系统监控", index: "/monitor", icon: "el-icon-data-line", children: [
                  { id: 10, name: "操作日志", index: "/operateLog", component: "OperateLog", icon: "fa fa-history" },
                  { id: 11, name: "异常日志", index: "/exceptionLog", component: "ExceptionLog", icon: "fa fa-bug" },
                  { id: 12, name: "主机状态", index: "/systemStatus", component: "SystemStatus", icon: "fa fa-heartbeat" }
                ],
              },
              { id: 13, name: "系统工具", index: "/tools", icon: "el-icon-menu", children: [
                  { id: 14, name: "SMTP管理", index: "/smtp", component: "Smtp", icon: "fa fa-envelope" },
                ],
              }


            ]
          }
      }
    });
  }
}
