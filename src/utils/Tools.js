import Vue from 'vue'
import store from '@/store'
import { SERVER_BASE } from './APIUtils';

/**
 * 这是对外暴露的检查角色的方法
 * @param {Object} component  组件名称
 */
const verifyAuth = function(component) {
  if (component == "Home") return true; 
  if (component == "NotFound") return true; 
  if (component == "Forbidden") return true; 
  // 如果用户信息还有还是空的
  if (!store.state.user) {
    return false;
  }
  console.log(store.state.user)
  return prVerifyAuth(store.state.user.menus, component, 0);
}

/**
 * 路由跳转之前做的权限检查
 * @param {Object} meuns      菜单集合
 * @param {String} component  组件名称
 * @param {Number} deep       最大递归深度
 */
const maxDeep = 3;
const prVerifyAuth = function(menus, component, deep) {
  // console.warn(menus, component)
  if (menus == null || menus.length == 0 || deep >= maxDeep) {
    return false;
  }
  for (let el of menus) {
    // console.error(el.component + "===" + component)
    if (el.component == component) {
      return true;
    } else {
      if (prVerifyAuth(el.children, component, deep + 1)) {
        return true;
      }
    }
  }
  
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
  console.log(path)
  return path;
}

const tools = {
  copyObj: copyObj,
  clearObj: clearObj,
  verifyAuth: verifyAuth,
  buildAvatar: buildAvatar,
}


export default tools;