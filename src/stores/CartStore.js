import { defineStore } from "pinia";
import { Dialog } from "quasar";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";
import { useUtilsStore } from "./UtilsStore";

export const useCartStore = defineStore("cart", {
  state: () => ({
    listCart: [],
    filterProduct: "",
    tableMultiSelect: [],
  }),
  actions: {
    async getInit() {
      this.listCart = await this.getListCart();
      console.log(this.listCart);
      this.listCart = this.listCart.map((item) => {
        return {
          ...item,
          name: item.product_id.name,
        };
      });
    },

    async getListCart() {
      try {
        const userData = storageUtil.getLocalStorageData("userAuthInfo");

        let { data: carts, error } = await supabase
          .from("carts")
          .select("*, product_id(*)")
          .eq("user_id", userData.id);

        if (error) {
          console.error("Caught error when fetching data cart: ", error);
        } else {
          return carts;
        }
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async updateDataCart(dataUpdate) {
      try {
        const payload = {
          quantity: dataUpdate.quantity,
        };

        const { data, error } = await supabase
          .from("carts")
          .update(payload)
          .eq("id", dataUpdate.id)
          .select();

        if (error) {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        console.error("Internal Server Erorr: ", err);
      }
    },

    async deleteCart(id) {
      try {
        const { error } = await supabase.from("carts").delete().eq("id", id);
        if (error) {
          Dialog.create({
            title: "Thông báo",
            message: `Lỗi xóa giỏ hàng: ${error}`,
          });
        } else {
          this.listCart = await this.updateNewCartData();
        }
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async updateNewCartData() {
      try {
        const storeUtils = useUtilsStore();
        storeUtils.listCart = await storeUtils.getListCart();

        return storeUtils.listCart;
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    clickToOrder(listOrder) {
      try {
        console.log(JSON.stringify(listOrder, null, 2));
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },
  },
});
