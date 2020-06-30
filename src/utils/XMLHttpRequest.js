import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Notification } from 'element-ui'
import { SERVER_BASE } from "./APIUtils"

// 请求是否带上cookie
axios.defaults.withCredentials = false;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	// 在发送请求之前做些什么
  try {
    if (config.data.id && config.data.id == 1) {
      notity("error", "系统保留数据，请勿操作");
      return null;
    }
  } catch(err) {
    
   }
  // 添加此之前添加Token
  // console.log(store.state.token)
  if (isMyApi(config)) {
    config.headers["Authorization"] = "Bearer " + store.state.token;
  }
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么
  // 如果响应信息中带有token，则添加新token
  console.log(response)
  if (response.data.code == 200 && response.data.token) {
    // store.commit("setToken", response.data.token);
  }
  if (response.config.headers["Show-Time"] == undefined && typeof response.data.msg != undefined) {
    response.data.msg = null;
  }
	return response.data;
}, function (error) {
	// 对响应错误做点什么
  console.log(error)
  let data = error.response.data ? error.response.data : {code: 404, msg: null, data: null};
  // console.log(data)
  // 如果不是对后台的请求，将进行跳过
  if (!isMyApi(error.response.config)) {
    data = {code: 200, msg: null, data: null};
    return Promise.reject(data);
  }
  if (error.response.config.headers["Show-Time"] == undefined 
    && data.code != 401) {
    data.msg = null;
  }
  // 如果是登录过期或没有通过认证
  if (data.code == 401) {
    logout();
  }
	return Promise.reject(data);
});


/**
 * 判断是否我们自己的接口
 * @param {Object} config
 */
function isMyApi(config) {
  return config.url.indexOf(SERVER_BASE) == -1 ? false : true;
}

/**
 * 退出方法
 */
function logout() {
  // 删除token
  store.commit("setToken", "");
  // store.state.menuModule.commit("initTabs", []);
  store.state.menuModule.menu = [];
  store.state.menuModule.tabs = [];
  console.log(store.state.menuModule.tabs)
  // 跳转至登录界面
  router.push({
    name: "Login",
    params: {
      // msg: data.msg
    }
  })
}

/**
 * 通知
 */
function notity(type, msg = null) {
    console.log(msg)
  if (msg != null && msg.trim() != "") {
    msg = msg.split("###")
    Notification({
      title: msg[0],
      message: msg[1],
      type: type
    });    
  }
}

function request(method, url, data, headers = {}, isShow = true) {
	method = method.toUpperCase();
	// console.log(headers, isShow);
  // 如果要展示页面提醒
  if (isShow) headers["Show-Time"] = "Hello";
	return axios({
		method: method,
		url: url,
    data: data !== "GET" ? data : null,
		// data: method === 'POST' || method === 'PUT' ? data : null,
		params: method === "GET" ? data : null,
		// `headers` 是即将被发送的自定义请求头
		// headers: headers ? headers : {"Content-Type": "application/json;charset=UTF-8"},
		headers: Object.assign({"Content-Type": "application/json;charset=UTF-8"}, headers),
	}).then(res => {
    // console.log(res);
    if (res.code == 200) {
      notity("success", res.msg);
    } else {
      notity("warning", res.msg)
    }
		return res;
	}).catch(err => {
    console.log(err);
    notity("error", err.msg);
    // 将错误往方面调用的页面传
		return Promise.reject(err);
	});
}

var oos = {
	"qiniu": function(data) {
      var observable = qiniu.upload(data.file, data.path + data.file.name, data.token, {region: qiniu.region.z2});
      // var subscription = observable.subscribe(observer) // 上传开始
      // or
      var subscription = observable.subscribe((res) => {
			console.log(res)
		}, (err) => {
			console.log(err.message)
		}, (res) => {
			console.log(res)
			let resource = {
				fileName: res.key,
				hash: res.hash,
				fileType: res.mimeType,
				fileSize: res.size
			}
			return request("post", data.url, resource); 
		}) // 这样传参形式也可以
		// subscription.unsubscribe() // 上传取消
	}
}

export default {
  "req": axios,
	"get": function get(url, data, isShow) {
		return request("get", url, data, undefined, isShow);
	},
	"post": function post(url, data, isShow, headers) {
		return request("post", url, data, headers, isShow);
	},
	"put": function put(url, data, isShow) {
		return request("put", url, data, undefined, isShow);
	},
	"delete": function deleteR(url, data, isShow) {
		return request("delete", url, data, undefined, isShow);
	},
	"upload": function upload(url, data, isShow) {
		if (url.indexOf("http") == 0) {
			return request("post", url, data, {"Content-Type": "application/x-www-form-urlencoded"}, isShow);
		} else {
			return oos[url](data);
		}
		
	}

}
