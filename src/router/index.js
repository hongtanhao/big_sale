import Vue from 'vue';
import Router from 'vue-router';
import Table from '@/pages/table';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/table',
      component: Table
    }
  ]
});
