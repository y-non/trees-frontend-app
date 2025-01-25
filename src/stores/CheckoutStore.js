import { defineStore } from "pinia";
import { storageUtil } from "src/utils/storageUtil";

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    orderObject: {},
  }),
  actions: {
    clickOrder(listOrder, userOrderData) {
      try {
        const sellerData = listOrder[0].product_id.user_id;
        storageUtil.setLocalStorageData("userOrderData", userOrderData);
        storageUtil.setLocalStorageData("sellerData", sellerData);

        this.router.push("/payment");
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },
  },
});
