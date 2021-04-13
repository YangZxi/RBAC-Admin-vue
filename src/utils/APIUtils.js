/**
 * API文件
 */
const SERVER_BASE = window.localStorage.getItem("API_PATH") || "http://127.0.0.1:8999";   // 服务器地址
// const SERVER_BASE = "http://47.110.125.56:8999";   // 服务器地址
const BASE_API = SERVER_BASE + '/api';   // 服务器API地址

const apis = {
  SERVER_BASE: SERVER_BASE,
  
  LOGIN: "/login",
  LOGOUT: "/logout",
  // USER_REGISTER: "/register",
  
  // 首页API
  QUOTE: "https://api.ixiaowai.cn/ylapi/index.php/?code=json",
  HUMBLE_DOG_DIARY: "http://test.isiyuan.net/tiangou/tg.php",
  HUMBLE_DOG_DIARY1: "https://v1.alapi.cn/api/dog?format=text",
  // 首页 END
  
  // 系统管理API
  USER_API: "/user",
  USER_INFO: "/user/info",
  USER_TRACK: "/user/info/track",
  
  ROLE_API: "/role",
  ROLE_MENU_API: "/role/menu",
  
  MENU_API: "/menu",
  MENU_TREE_API: "/menu/tree",
  
  TASK_API: "/task",
  
  // 系统监控API
  LOG_API: "/log",

  SYSTEM_API: "/system",

  // 配置信息API
  PROP_API: "/prop",
  
  MAIL_API: "/mail",
  MAIL_SEND: "/mail/send",
  
  // 将数据导出成 excel 表API
  EXCEL_EXPORT: "/excel",
  
  TOKEN_QINIU: "/token/qiniu",
  FILE_UPLOAD: "/upload",
  
  // 第三方登录
  OAUTH_QQ: SERVER_BASE + "/oauth/render/qq",
}

const SERVER_UPLOAD = SERVER_BASE + "/upload";   // 上传地址
const EXCEL_EXPORT = BASE_API + apis.EXCEL_EXPORT;   // 上传地址

const apisBuild = function() {
  const regx = /^(http)[s]{0,1}(:\/\/)/;
  Object.keys(apis).forEach(key => {
    // console.log(regx.test(apis[key]), key);
    apis[key] = regx.test(apis[key]) ? apis[key] : BASE_API + apis[key];
  })
  return apis;
}

export { SERVER_BASE, SERVER_UPLOAD, EXCEL_EXPORT }

export default apisBuild()
