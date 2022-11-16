import type { RouteComponent } from "vue-router"

type MenuEntry = {
  id: string
  title: string
  component: RouteComponent
}

export const menu: MenuEntry[] = [
  {
    id: "mind-game",
    title: "Mind Game",
    component: () => import("../views/MindGameView.vue"),
  },
]
