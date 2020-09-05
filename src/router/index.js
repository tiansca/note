import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import noteList from '@/components/noteList'
import noteDetail from '@/components/notedetail'
import editLabel from '@/components/editLabel'
import user from '@/components/user'
import Store from '@/store'

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
          path: '/user',
          name: 'user',
          component: user
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

router.beforeEach(function (to, from, next) {
    console.log(to, from)
    if (to.path === '/user' && to.query.type === 'login') {
        console.log(Store.state.user)
        if (Store.state.user) {
            return next('/')
        }
    }
    next()
})

export default router;
