import Store from '@/store/store'
import APIUtils from '@/utils/APIUtils'
import axios from '@/utils/XMLHttpRequest'
import router from '@/router'

Store.registerModule('menuModule', {
  namespaced: true,
  state: {
    menus: [ ],
    menusOriginal: { }, // id:menu
    tabs: [ ],
    breadcrumb: [ ],
    activeItem: '',
    isCollapse: false,
    getMenuFlag: false,
  },
  getters: {
    subMenu(state) {
      var subs = state.menus.filter(f => f.sub).map(f => f.sub)
      return Array.from(new Set(subs))
    },
    itemMenu(state) {
      return (sub, group) => {
        var items = state.menus
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
    initMenus(state, menus) {
      // 对二级菜单拼接 router 路径，格式 = 父类别的 path + 当前选项的 path
      menus.forEach(c => c.children.forEach(el => el.path = c.path + el.path));
      state.menus = menus;
    },
    setMenusOriginal(state, value) {
      state.menusOriginal = value;
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
      if (nowIndex != "Home") {
        state.menus.forEach(parentM => parentM.children.forEach(sonM => {
          if (sonM.component == nowIndex) {
            state.breadcrumb = [parentM.name, sonM.name];
            return;
          }
        }));
      } else {
        state.breadcrumb = [];
      }
    },
    breadcrumb(state, data) {
      state.breadcrumb = data;
    }
  },
  actions: {
    async getMenu(context) {
      await axios.get(APIUtils.USER_INFO, {}, false).then(res => {
        Store.commit("setUser", res.data)
        console.log(Store.state.user)
        context.commit("initMenus", res.data.menus);
        context.commit("setMenusOriginal", res.data.menusOriginal);
      })
    },
    async clickMenuItem(context, route) {
      let index = route.name;
      if (route.name === "NotFound" || route.name === "Forbidden") return;
      // 当标签栏中没有当前点击的标签时，执行下面的语句创建一个
      if (index != "Home" && !context.state.tabs.find(f => f.index == index)) {
        let newTab = null;
        A:for (let m of context.state.menus) {
          for (let el of m.children) {
            if (el.component == index) {
              newTab = {
                label: el.name,
                path: el.path,
                index: el.component,
                closable: true,
                icon: el.icon
              }
              break A;
            }
          }
        }
        
        // 当在后台传来的菜单中找不到对应的路径，就可能为无需后台提供的标签，则通过index中的meta标签创建
        if (!newTab) {
          newTab = {
            label: route.meta.tabName,
            path: route.path,
            index: route.name,
            closable: true,
            icon: "el-icon-s-help"
          }
        }
        // console.log(newTab)
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
        // 添加标签到vuex
        context.commit('addTab', newTab)
      }
      // 通过index选择新创建的标签或已存在标签
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
