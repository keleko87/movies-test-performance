import Vue from 'vue'
import Router from 'vue-router'
import MoviesList from '@/components/MoviesList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'moviesList',
      component: MoviesList
    }
  ]
})
