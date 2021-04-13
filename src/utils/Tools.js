import Vue from 'vue'
import store from '@/store'
import axios from '@/utils/XMLHttpRequest'
import {
  SERVER_BASE,
  EXCEL_EXPORT
} from './APIUtils';

/**
 * 这是对外暴露的检查角色的方法
 * @param {Object} component  组件名称
 */
const verifyAuth = function(component) {
  if (component == "Home") return true;
  if (component == "NotFound") return true;
  if (component == "Forbidden") return true;
  // 如果用户信息还是空的
  if (!store.state.user) {
    return false;
  }
  // console.log(store.state.user);
  return prVerifyAuth(store.state.user.menus, component, 0);
}

/**
 * 路由跳转之前做的权限检查
 * @param {Object} meuns      菜单集合
 * @param {String} component  组件名称
 * @param {Number} deep       递归深度
 */
const maxDeep = 3; // 最大递归深度
const prVerifyAuth = function(menus, component, deep) {
  // console.warn(menus, component)
  if (menus == null || menus.length == 0 || deep >= maxDeep) return false;
  for (let el of menus) {
    if (el.component == component) return true;
    else if (prVerifyAuth(el.children, component, deep + 1)) return true;
  }
  return false;
}

const clearObj = function(source, vm) {
  Object.keys(source).forEach(key => {
    // console.log(key)
    if (Array.isArray(source[key])) {
      // console.log(vm)
      source[key].splice(0);
    } else {
      vm.$set(source, key, null);
    }
  });
}

/**
 * 拷贝对象
 * @param {Object} source
 * @param {Object} target
 * @param {Object} vm
 */
const copyObj = function(source, target, vm) {
  // console.log(vm)
  Object.keys(source).forEach(key => {
    vm.$set(source, key, target[key]);
  });
  return source;
}

const getDeepObj = function(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const buildAvatar = function(avatar = "") {
  let path = SERVER_BASE;
  if (avatar == null) avatar = "";
  if (avatar.indexOf("http") == 0) {
    return avatar;
  }
  if (avatar.charAt(0) == "/") {
    path += avatar;
  } else {
    path += "/" + avatar;
  }
  // console.log(path);
  return path;
}

/**
 * @param {Array} table 需要导出的数据
 * @param {Array} columns 渲染表格的表头排序，同时也是表头名
 * @param {Array} exclude 不需要导出的数据
 */
const exportExcel = function(table, columns, filename = "导出数据", exclude = []) {
  columns.filter(col => {
    return (!exclude.includes(col.key));
  });
  // let obj = {
  //   "name": filename,
  //   "columns": columns,
  //   "data": table
  // }
  console.log(table, columns);
  let form = document.createElement("form");
  form.action = EXCEL_EXPORT;
  form.method = "POST";
  form.style.display = "none";
  let input = "<input name='{1}' value='{2}'/>";
  let formHtml = "<input name='_token' value='" + window.localStorage.getItem("token") + "'/>";
  formHtml += "<input name='name' value='" + filename + "'/>";
  columns.forEach((el, index) => {
    formHtml += "<input name='columns[" + index + "].key' value='" + el.key + "'/>";
    formHtml += "<input name='columns[" + index + "].value' value='" + el.value + "'/>";
  });
  // table.forEach((el, index) => {
  //   Object.keys(el).forEach((key) => {
  //     // console.log("data[" + index + "]." + key)
  //     formHtml += "<input name='data[" + index + "]." + key + "' value='" + el[key] + "'/>"
  //   });
  // });
  formHtml += "<input name='data' value='" + JSON.stringify(table) + "'/>";
  
  form.innerHTML = formHtml;
  console.log(formHtml);
  document.body.appendChild(form);
  form.submit();
  
  return
  table.forEach((el, index) => {
    Object.keys(el).forEach((key) => {
      // console.log("data[" + index + "]." + key)
      formData.append("data[" + index + "]." + key, el[key]);
    });
  });
  console.log(formData);
  
  return
  axios.post(EXCEL_EXPORT, obj, false).then(res => {
    
  }).catch(err => {
    
  });
  return;
  // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
  let tableHtml = "<table border='1'><caption>" + filename + "</caption>{1}{2}</table>";
  let thead = "<tr>";
  columns.forEach(col => {
    if (!exclude.includes(col.key)) thead += "<th>" + col.value + "</th>";
  });
  thead += "</tr>";
  let tbody = "";
  table.forEach(rowData => {
    tbody += "<tr>";
    columns.forEach(col => {
      if (!exclude.includes(col.key)) tbody += "<td>" + rowData[col.key] + "</td>";
    });
    tbody += "</tr>";
  });
  console.log(thead);
  console.log(tbody);
  // return;
  tableHtml = tableHtml.replace("{1}", thead);
  tableHtml = tableHtml.replace("{2}", tbody);
  console.log(tableHtml);
  var html = "<html><head><meta charset='utf-8' /></head><body>" + tableHtml + "</body></html>";
  // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
  var blob = new Blob([html], {
    type: "application/vnd.ms-excel"
  });
  var a = document.createElement("a");
  // 利用URL.createObjectURL()方法为a元素生成blob URL
  a.href = URL.createObjectURL(blob);
  // 设置文件名
  a.download = filename + ".xls";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const fullScreen = function(element = document) {
  console.log(element)
  let isFullSceen = element.isFullScreen || element.mozIsFullScreen || element.webkitIsFullScreen;
  let requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;
  if (isFullSceen) { //根据是否处于全屏状态 来进行切换 
    if (element.exitFullscreen) {
      element.exitFullscreen();
    } else if (element.mozCancelFullScreen) {
      element.mozCancelFullScreen();
    } else if (element.webkitCancelFullScreen) {
      element.webkitCancelFullScreen();
    } else if (element.msExitFullscreen) {
      element.msExitFullscreen();
    }
  } else {
    requestMethod.call(element); //打开全屏
    // element.requestMethod();
  }
  //返回操作后的全屏状态 
  return !isFullSceen;
}

const tools = {
  copyObj: copyObj,
  clearObj: clearObj,
  getDeepObj: getDeepObj,
  verifyAuth: verifyAuth,
  buildAvatar: buildAvatar,
  exportExcel: exportExcel,
  fullScreen: fullScreen
}


export default tools;
