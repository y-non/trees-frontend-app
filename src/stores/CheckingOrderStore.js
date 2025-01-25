import { defineStore } from "pinia";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";

export const useCheckingOrderStore = defineStore("checking-order", {
  state: () => ({ listOrders: [], tab: "all" }),
  actions: {
    async getInit() {
      this.listOrders = await this.getListOrder();
    },

    async getListOrder() {
      try {
        const userData = storageUtil.getLocalStorageData("userAuthInfo");
        let { data: orders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userData.id);

        console.log(orders);

        if (error) {
          console.error("Caught error when fetching orders data: ", error);
        } else {
          return orders;
        }
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },
  },
});
