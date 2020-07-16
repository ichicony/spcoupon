import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/',
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {path:'/',redirect:{name:"th"}
    },  // 重定向到主页,
    {
      path: '/activity',
      name: 'activity',
      component: ()=>import('../views/activitys')
    },
    {
      path: '/rule',
      name: 'rule',
      component: ()=>import('../views/rule')
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: ()=>import('../views/exchange')
    },
    {
      path: '/th',
      name: 'th',
      component: ()=>import('../views/thcl')
    },
    {
      path: '/report',
      name: 'report',
      component: ()=>import('../views/report')
    }
  ]
})
