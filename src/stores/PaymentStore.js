import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";
import { useUtilsStore } from "./UtilsStore";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    orderCode: "",
    orderData: {},
    isShowDialog: false,
  }),
  actions: {
    async getInit() {},
    async createOrder(orderData) {
      try {
        const storeUtils = useUtilsStore();
        Loading.show();
        const payload = orderData;

        const { data, error } = await supabase
          .from("orders")
          .insert(payload)
          .select("id");

        if (error) throw error;

        this.orderCode = data[0].id;

        storageUtil.setLocalStorageData("orderCode", this.orderCode);

        Notify.create({
          type: "positive",
          message: "Tạo đơn hàng thành công!",
          position: "top-right",
          timeout: 2000,
        });

        await Promise.all(
          orderData.products.map(async (cartItem) => {
            const { error } = await supabase
              .from("carts")
              .delete()
              .eq("id", cartItem.id);
          })
        );

        storeUtils.listCart = await storeUtils.getListCart();

        this.isShowDialog = true;

        Loading.hide();
      } catch (err) {
        Loading.hide();
        console.error("Internal Server Error: ", err);
      }
    },
  },
});
