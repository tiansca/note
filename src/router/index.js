import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import noteList from '@/components/noteList'
import noteDetail from '@/components/notedetail'
import editLabel from '@/components/editLabel'

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: '/noteList',
      name: 'noteList',
      component: noteList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/noteDetail',
      name: 'noteDetail',
      component: noteDetail
    },
    {
       path: '/editLabel',
       name: 'editLabel',
       component: editLabel
    },
    {
      path: '*',
      redirect: '/noteList'
    }
  ]
})

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

export default router;
