export default {
  path: "/fighting",
  redirect: "/fighting/index",
  meta: {
    title: "加油菜单目录",
    rank: 100
  },
  children: [
    {
      path: "/fighting/index",
      name: "Fighting",
      component: () => import("@/views/fighting/index.vue"),
      meta: {
        title: "加油"
        // 通过设置showParent为true，显示父级, 只有一个子菜单时
      }
    },
    {
      path: "/fighting/effort",
      name: "FightingEffort",
      component: () => import("@/views/fighting/effort.vue"),
      meta: {
        title: "努力"
      }
    },
    {
      path: "/fighting/demo",
      redirect: "/fighting/demo/demo1",
      name: "FightingDemo",
      meta: {
        title: "努力demo"
      },
      children: [
        {
          path: "/fighting/demo/demo1",
          name: "FightingDemo1",
          component: () => import("@/views/fighting/demo/demo1.vue"),
          meta: {
            title: "demo-demo1"
          }
        },
        {
          path: "/fighting/demo/demo2",
          name: "FightingDemo2",
          component: () => import("@/views/fighting/demo/demo2.vue"),
          meta: {
            title: "demo-demo2"
          }
        }
      ]
    },
    {
      path: "/fighting/demo3",
      name: "FightingDemo3",
      component: () => import("@/views/fighting/demo3.vue"),
      meta: {
        title: "DEMO3"
      }
    }
  ]
} as RouteConfigsTable;
