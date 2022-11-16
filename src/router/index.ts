import { createRouter, createWebHistory } from "vue-router"
import { menu } from "./menu"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...menu.map((menuEntry) => ({
      path: `/${menuEntry.id}`,
      name: menuEntry.id,
      component: menuEntry.component,
    })),
    {
      path: "/",
      redirect: menu[0].id,
    },
  ],
})

export default router
