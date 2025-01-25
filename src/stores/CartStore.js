import { defineStore } from "pinia";
import { Dialog } from "quasar";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";
import { useUtilsStore } from "./UtilsStore";
import { base64Utils } from "src/utils/base64";

export const useCartStore = defineStore("cart", {
  state: () => ({
    listCart: [],
    filterProduct: "",
    tableMultiSelect: [],
  }),
  actions: {
    async getInit() {
      this.listCart = await this.getListCart();
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
          .select("*, product_id(*, category(*), user_id(*))")
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
        //check if order including the item of users still haven't add payment method yet
        let isAddPayment = true;
        listOrder.forEach((item) => {
          if (!item.product_id.user_id.is_updated_bank_data) {
            isAddPayment = false;
          }
        });

        if (isAddPayment) {
          // Convert the object to a JSON string
          const jsonString = JSON.stringify(listOrder);

          // Convert the string to a Uint8Array (array of bytes)
          const stringData = new TextEncoder().encode(jsonString);

          // Encode to Base64
          const base64 = base64Utils.bytesToBase64(stringData);

          storageUtil.setLocalStorageData("listOrders", base64);

          this.router.push(`/checkout`);
        } else {
          Dialog.create({
            title: "Thông báo",
            message:
              "Có người bán chưa thêm thông tin thanh toán, Vui lòng chỉ chọn những sản phẩm đã được kiểm duyệt!",
            ok: true,
            cancel: false,
          });
        }
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },
  },
});
