import Store from '@/store/store'
import APIUtils from '@/utils/APIUtils'
import axios from '@/utils/XMLHttpRequest'
import router from '@/router'

Store.registerModule('menuModule', {
  namespaced: true,
  state: {
    menu: [
      
    ],
    tabs: [],
    breadcrumb: [],
    activeItem: '',
    isCollapse: false,
    getMenuFlag: false,
  },
  getters: {
    subMenu(state) {
      var subs = state.menu.filter(f => f.sub).map(f => f.sub)
      console.log(subs)
      return Array.from(new Set(subs))
    },
    itemMenu(state) {
      return (sub, group) => {
        var items = state.menu
          .filter(f => f.sub == sub && f.group == group && f.name)
          .map(f => {
            return {
              name: f.name,
              index: f.path
            }
          });
        return Array.from(new Set(items))
      }
    }
  },
  mutations: {
    initMenu(state, menu) {
      // 拼接 router 路径，格式 => 父类别的 path + 当前选项的 path
      menu.forEach(c => c.children.forEach(el => el.path = c.path + el.path));
      console.log(menu);
      state.menu = menu;
    },
    initTabs(state, tabs) {
      state.tabs = tabs;
    },
    addTab(state, tab) {
      if (tab != null) {
        state.tabs.push(tab);
      }
    },
    switchTab(state, nowIndex) {
      state.activeItem = nowIndex;
      // router.push({ name: nowIndex });
      // state.activeItem = "/system/menu";
      if (nowIndex != "Home") {
        state.menu.forEach(c => c.children.forEach(el => {
          if (el.component == nowIndex) {
            state.breadcrumb = [c.name, el.name];
            return;
          }
        }));
      } else {
        state.breadcrumb = [];
      }
      // console.log(state.breadcrumb)
    },
    breadcrumb(state, data) {
      state.breadcrumb = data;
    }
  },
  actions: {
    async getMenu(context) {
      // MenuApi.getMenu().then(res => {
      //     context.commit('initMenu', res);
      // });
      // console.log(USER_INFO)
      await axios.get(APIUtils.USER_INFO, {}, false).then(res => {
        Store.commit("setUser", res.data)
        console.log(Store.state.user)
        const menu = context.state.menu.concat(res.data.menus);
        context.commit("initMenu", res.data.menus)
      })
    },
    async clickMenuItem(context, index, flag = true) {
      if (!index || index == "NotFound") return;
      // console.warn(index)
      if (index != "Home") {
        var tab = context.state.tabs.find(f => f.index == index)
        console.error(context.state.tabs)
        if (!tab) {
          // let menu = context.state.menu.find(f => f.index == index)
          let newTab = null;
          context.state.menu.forEach((c) => {
            // console.log(c)
            c.children.forEach(el => {
              // console.log(el)
              if (el.component == index) {
                newTab = {
                  label: el.name,
                  // index: el.path,
                  path: el.path,
                  index: el.component,
                  closable: true,
                  icon: el.icon,
                  component: el.component,
                }
                // context.commit("breadcrumb", [c.name, el.name]);
                return;
              }
            });
          });
          console.log(newTab)
          // 这里加入了 “@/” 所以后面的地址开头无需左斜线
          // let component = import(`@/views${menu.index ? menu.index + "/" + menu.component : 'components/NotFound'}`)
          // try {
          //   newTab.componentPath = "views" + newTab.path + '/' + newTab.component;
          //   let component = import("@/" + newTab.componentPath)
          // } catch(err) {
          //   router.push({
          //     name: "NotFound"
          //   });
          // }

          context.commit('addTab', newTab)
        }
      }
      context.commit('switchTab', index);
    },
    closeTab(context, index) {
      // 当前点击 tab 的下标
      let indexNum = context.state.tabs.findIndex(f => f.index == index);
      // 当前活动的选项
      let activeItem = context.state.activeItem;
      // 删除点击关闭的选项
      let newTabs = context.state.tabs.filter(f => f.index != index);
      context.commit('initTabs', newTabs)
      if (activeItem == index) {
        // 选择前一个选项卡
        context.commit('switchTab', indexNum == 0 ? "Home" : newTabs[indexNum - 1].index)
        router.push({
          name: indexNum == 0 ? "Home" : newTabs[indexNum - 1].index
        })
      }
    }
  }
})
