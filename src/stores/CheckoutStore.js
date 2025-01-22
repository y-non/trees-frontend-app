import { defineStore } from "pinia";

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    orderObject: {},
  }),
  actions: {},
});
