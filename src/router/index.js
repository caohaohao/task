import Vue from 'vue'
import VueRouter from 'vue-router'
import TaskStatus from '@/views/taskstatus/TaskStatus'
import BuildTask from '@/views/buildtask/BuildTask'
import WorkMain from '@/views/worksituation/WorkMain'
import TurnStatus from '@/views/turnwork/TurnStatus'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/taskstatus/taskoverview'
  },
  // 工作态势
  {
    path: '/workmain',
    component: WorkMain
  },
  // 交班情况
  {
    path: '/turnstatus',
    component: TurnStatus
  },
  // 任务台账
  {
    path: '/taskstatus',
    component: TaskStatus,
    children: [

      {
        path: 'taskoverview',
        name: 'taskoverview',
        component: () => import(/* webpackChunkName: "about" */ '../views/taskstatus/TaskOverview.vue')
      },
      {
        path: 'execution',
        name: 'execution',
        component: () => import(/* webpackChunkName: "about" */ '../views/taskstatus/Execution.vue')
      },
      {
        path: 'accomplish',
        name: 'accomplish',
        component: () => import(/* webpackChunkName: "about" */ '../views/taskstatus/Accomplish.vue')
      },
      {
        path: 'overdue',
        name: 'overdue',
        component: () => import(/* webpackChunkName: "about" */ '../views/taskstatus/Overdue.vue')
      },
      {
        path: 'mytask',
        name: 'mytask',
        component: () => import(/* webpackChunkName: "about" */ '../views/taskstatus/Mytask.vue')
      }

    ]
  },
  {
    path: '/buildtask',
    name: 'buildtask',
    component: BuildTask,
    children: [
      {
        path: 'builddetail',
        name: 'builddetail',
        component: () => import('../views/buildtask/BuildDetail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
