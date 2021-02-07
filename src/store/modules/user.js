import { login, getInfo, logout } from '@/api/common'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    id: '',
    token: getToken(),
    name: '',
    realName: '',
    roles: [],
    openId: '',
    avatar: ''
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_REALNAME: (state, realName) => {
      state.realName = realName
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_OPENID: (state, open_id) => {
      state.openId = open_id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      //userInfo.username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response.data;
          setToken(data.token);
          commit('SET_TOKEN', data.token);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data;
          let roles = ['anon'];
          if (data.type === 8) {
            roles = ['teacher'];
          }
          else if (data.type === 4) {
            roles = ['student'];
          }
          else if (data.type === 16) {
            roles = ['system'];
          }
          response.roles = roles;
          commit('SET_ID', data.id);
          commit('SET_ROLES', roles);
          commit('SET_NAME', data.username);
          commit('SET_REALNAME', data.realname);
          commit('SET_OPENID', data.open_id)
          commit('SET_AVATAR', data.avatar)
          resolve(response);
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve()
      })
    }
  }
}

export default user