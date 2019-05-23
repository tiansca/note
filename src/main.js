// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import { Toast } from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faUser, faChartLine, faAmericanSignLanguageInterpreting,faUserCircle,faBars,faPlus,faBookmark,faSortDown,faCheck,faTimes,faStar,faCheckSquare,faSquare,faTrash,faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import $ from './util.js';

Vue.prototype.$axios = axios;
Vue.prototype.$ = $;
import qs from 'qs';
Vue.prototype.qs = qs.stringify;

library.add(
  faUser,
  faChartLine,
  faAmericanSignLanguageInterpreting,
  faUserCircle,
  faBars,
  faPlus,
  faBookmark,
  faSortDown,
  faCheck,
  faTimes,
  faStar,
  faCheckSquare,
  faSquare,
  faTrash,
    faAngleLeft
);

Vue.$toast = Vue.prototype.$toast = Toast;

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Mint)

Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.filter('formatDate',function(value, type){
    value = Number(value)
  let date = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  if(type){
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
  }else {
    return y + '-' + MM + '-' + d ;
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


// formatDate: function (value, type) {
//   let date = new Date(value);
//   let y = date.getFullYear();
//   let MM = date.getMonth() + 1;
//   MM = MM < 10 ? ('0' + MM) : MM;
//   let d = date.getDate();
//   d = d < 10 ? ('0' + d) : d;
//   let h = date.getHours();
//   h = h < 10 ? ('0' + h) : h;
//   let m = date.getMinutes();
//   m = m < 10 ? ('0' + m) : m;
//   let s = date.getSeconds();
//   s = s < 10 ? ('0' + s) : s;
//   if(type){
//     return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
//   }else {
//     return y + '-' + MM + '-' + d ;
//   }
// },
