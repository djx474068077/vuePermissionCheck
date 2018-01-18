// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
// lodash: 对数组、对象、字符串等常见数据类型进行处理的一个库
import _ from 'lodash'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(VueAxios, axios)
Vue.use(_)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
