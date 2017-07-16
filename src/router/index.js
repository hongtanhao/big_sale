import Vue from 'vue'
import Router from 'vue-router'
import Table from '../pages/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'table',
      component: Table
    }
  ]
})
