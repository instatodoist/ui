import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/login.vue';
import Thought from './views/thought.vue';
import TodoCompleted from './views/todo-complete.vue';
import Register from './views/register.vue';
import VerifyEmail from './views/verify.vue';
import requireAuth from './services/requireAuth';
import localStorageService from './services/localStorage';
import LabelTodo from './views/label.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      beforeEnter(to, from, next) {
        if (to.name === 'login' && localStorageService.getToken()) {
          return next(from.path || '/dashboard');
        }
        return next();
      },
      component: Login,
      meta: {
        layout: 'login',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        layout: 'login',
      },
    },
    {
      path: '/verify-email/:hash',
      name: 'verify-email',
      component: VerifyEmail,
      meta: {
        layout: 'login',
      },
    },
    {
      path: '/dashboard',
      beforeEnter: requireAuth,
      name: 'home',
      component: Home,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/inbox',
      beforeEnter: requireAuth,
      name: 'inbox',
      component: Home,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/thoughts',
      beforeEnter: requireAuth,
      name: 'thought',
      component: Thought,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/completed-todos',
      beforeEnter: requireAuth,
      name: 'cTodos',
      component: TodoCompleted,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/labelled-todos/:label',
      beforeEnter: requireAuth,
      name: 'labelledTodos',
      component: LabelTodo,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/',
      name: 'about',
      beforeEnter(to, from, next) {
        if (to.name === 'about' && localStorageService.getToken()) {
          return next('/dashboard');
        }
        return next();
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        layout: 'login',
      },
    },
  ],
});
