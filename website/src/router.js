import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home'
import Login from './views/system/login'
import Register from './views/system/register'
import Terms from './views/terms'
import Privacy from './views/privacy'
import Links from './views/links'
import Auth from './views/auth'
import Story from './views/story'
import HowTo from './views/howto'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/', name: 'home', component: Home
    },
    {
      path: '/login', name: 'login', component: Login
    },
    {
      path: '/register', name: 'register', component: Register
    },
    {
      path: '/howto', name: 'howto', component: HowTo
    },
    {
      path: '/story', name: 'story', component: Story
    },
    {
      path: '/terms', name: 'terms', component: Terms
    },
    {
      path: '/privacy', name: 'privacy', component: Privacy
    },
    {
      path: '/auth/action', name: 'auth', component: Auth
    },
    {
      path: '/links/invites', name: 'links', component: Links
    },
    {
      path: '/management',
      name: 'management',
      component: () => import(/* webpackChunkName: "management" */ './views/management.vue'),
      children: [
        {
          path: 'users',
          component: () => import(/* webpackChunkName: "management" */ './components/management/users.vue')
        },
        {
          path: 'trips',
          component: () => import(/* webpackChunkName: "management" */ './components/management/trips.vue')
        },
        {
          path: 'flags',
          component: () => import(/* webpackChunkName: "management" */ './components/management/flags.vue')
        }
      ]

    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/about.vue')
    }
  ]
})
