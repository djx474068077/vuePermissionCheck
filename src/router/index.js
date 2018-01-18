import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main'
import newsList from '@/components/news/list'
import newsAdd from '@/components/news/add'
import newsEdit from '@/components/news/edit'
import tourismList from '@/components/tourism/list'
import tourismEdit from '@/components/tourism/edit'
import tourismAdd from '@/components/tourism/add'
import insurance from '@/components/tourism/insurance'
import trash from '@/components/news/trash'
import user from '@/components/user/list'
// import order from '@/components/order/list'
// import car from '@/components/order/car'
import message from '@/components/message/list'
import permissionList from '@/components/permission/list'
import roleList from '@/components/role/list'
import menuList from '@/components/menu/list'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/main/news/list',
          component: newsList
        },
        {
          path: '/main/news/add',
          component: newsAdd
        },
        {
          path: '/main/news/edit',
          component: newsEdit
        },
        {
          path: '/main/tourism/edit',
          component: tourismEdit
        },
        {
          path: '/main/tourism/list',
          component: tourismList
        },
        {
          path: '/main/tourism/add',
          component: tourismAdd
        },
        {
          path: '/main/tourism/insurance',
          component: insurance
        },
        {
          path: '/main/news/trash',
          component: trash
        },
        {
          path: '/main/user/list',
          component: user
        },
        {
          path: '/main/message/list',
          component: message
        },
        {
          path: '/main/permission/list',
          component: permissionList
        },
        {
          path: '/main/role/list',
          component: roleList
        },
        {
          path: '/main/menu/list',
          component: menuList
        }
      ]
    }
  ]
})
