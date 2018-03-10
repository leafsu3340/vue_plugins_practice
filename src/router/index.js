import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/examples/index'
import DemoToast from '@/examples/demo-toast'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: Index,
    children: [{
      path: '/toast',
      name: 'demo_toast',
      component: DemoToast,
    }, ]
  }]
})
