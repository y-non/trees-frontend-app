import { defineStore } from "pinia";

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    orderObject: {},
  }),
  actions: {
    clickOrder() {
      try {
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },
  },
});
