import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
	state: {
    token: window.localStorage.getItem("token") ? window.localStorage.getItem("token") : null,
		user: null,
    loading: true,
		themeColor: null,
	},
	mutations: {
    setToken(state, token) {
    	state.token = token;
      window.localStorage.setItem("token", token);
    },
		setUser(state, user) {
			state.user = user;
		},
    setLoding(state, lodding) {
			state.lodding = lodding;
		},
		setThemeColor(state, themeColor) {
			state.themeColor = themeColor;
		}
	}
})

export default store