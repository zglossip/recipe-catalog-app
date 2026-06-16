import { createRouter, createWebHistory } from "vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/browseView/BrowseView.vue"),
  },
  {
    path: "/recipe/:id",
    component: () => import("@/views/RecipeView.vue"),
    props: true,
  },
  {
    path: "/recipe/create",
    component: () => import("@/views/createEdit/CreateEditHeaderView.vue"),
  },
  {
    path: "/recipe/create/single",
    component: () => import("@/views/createEdit/CreateSingleView.vue"),
  },
  {
    path: "/recipe/create/ingredients",
    component: () => import("@/views/createEdit/CreateEditIngredientsView.vue"),
  },
  {
    path: "/recipe/create/instructions",
    component: () =>
      import("@/views/createEdit/CreateEditInstructionsView.vue"),
  },
  {
    path: "/recipe/edit/:id",
    component: () => import("@/views/createEdit/CreateEditHeaderView.vue"),
    props: true,
  },
  {
    path: "/recipe/edit/:id/ingredients",
    component: () => import("@/views/createEdit/CreateEditIngredientsView.vue"),
    props: true,
  },
  {
    path: "/recipe/edit/:id/instructions",
    component: () =>
      import("@/views/createEdit/CreateEditInstructionsView.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
