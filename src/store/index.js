import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import app from './modules/app'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import user from './modules/user'

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    tagsView,
    user
  },
  getters
})

export default store
