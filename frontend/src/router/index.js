import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@frontend/views/Login.vue'),
  },
  {
    path: '/main',
    component: () => import(/* webpackChunkName: "main" */ '@frontend/layout/Sidemenu.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@frontend/views/Home.vue'),
      },
      {
        path: 'strategies',
        name: 'Strategies',
        component: () => import(/* webpackChunkName: "strategies" */ '@frontend/views/Strategies.vue'),
      },
      {
        path: 'papertrader',
        name: 'PaperTrader',
        component: () => import(/* webpackChunkName: "papertrader" */ '@frontend/views/PaperTrader.vue'),
      },
      // {
      //   path: '/about',
      //   name: 'About',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "about" */ '@frontend/views/Home.vue'),
      // },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
