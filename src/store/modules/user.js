import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter ,asyncRoutes,arbitrarilyRoutes,constantRoutes} from '@/router'
import router from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    // 用户名
    name: '',
    // 用户头像
    avatar: '',
    // 用户身份
    roles: [],
    // 按钮权限
    buttons: [],
    // 路由权限
    routes: [],
    // 异步路由
    asyncRoutes: [],
    allRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  GETINFO: (state,data) => {
    state.name = data.name;
    state.avatar = data.avatar;
    state.roles = data.roles;
    state.buttons = data.buttons;
    state.routes = data.routes;

  },
  GETASYNCROUTES: (state, data) => {
    //存储异步路由
    state.asyncRoutes = data;
    // 合并全部路由
    state.allRoutes = constantRoutes.concat(arbitrarilyRoutes, state.asyncRoutes)
    // 注册新的路由
    router.addRoutes(state.allRoutes)
  }
}

  // 计算异步路由
const computedAsyncRoutes = (asyncRoutes, data) => {
  return asyncRoutes.filter((item) => {
    if (data.indexOf(item.name)!=-1) {
      if (item.children&&item.children.length) {
        item.children=computedAsyncRoutes(item.children, data)
      }
      return true;
    }
  })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    // 结构出用户名和密码
    const { username, password } = userInfo

    const result = await login({ username: username.trim(), password: password })
    console.log(result)
    if (result.code === 20000) {
      console.log(1);
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('失败'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 存储数据
        commit('GETINFO', data);
        // 对比数据返回的路由和已经注册的路由
        commit('GETASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

