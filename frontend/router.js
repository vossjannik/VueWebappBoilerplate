import VueRouter from 'vue-router'

// import vue components
import LandingPage from './components/pages/LandingPage/LandingPage.vue'
import NotFoundPage from './components/pages/NotFoundPage/NotFoundPage.vue'
import ImpressumPage from './components/pages/ImpressumPage/ImpressumPage.vue'

// configure routes
export default new VueRouter({
  routes: [
    {
      path: '/',
      beforeEnter (to, from, next) {
        next({ name: 'landing' })
      },
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: ImpressumPage,
    },
    {
      path: '/landing',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
  mode: 'history',
})
