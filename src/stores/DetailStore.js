import { defineStore } from "pinia";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";
import { Utils } from "src/utils/Utils";
import { useUtilsStore } from "./UtilsStore";
import { Notify } from "quasar";

export const userDetailStore = defineStore("detail", {
  state: () => ({
    objectData: {},
    isLoading: false,

    listCategories: [],
    listProduct: [],
    slide: 0,
  }),
  actions: {
    async getInit() {
      this.listCategories = await this.getCategories();
      this.listProduct = await this.getListProduct();

      this.listProduct = Utils.chunkArray(this.listProduct, 3);
    },

    async getItemById(id) {
      try {
        this.isLoading = true;
        let { data: trees, error } = await supabase
          .from("trees")
          .select("*")
          .eq("id", id);

        if (error) {
          return false;
        } else {
          if (trees.length) {
            this.isLoading = false;
            return trees[0];
          } else {
            this.router.push("/404");
          }
        }
        this.isLoading = false;
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async getListProduct() {
      try {
        let { data: trees, error } = await supabase
          .from("trees")
          .select("*, user_id(*), category(*)");

        return trees;
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async getCategories() {
      try {
        const { data, error } = await supabase.from("categories").select();

        return data;
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async clickAddToCard(itemAdd) {
      try {
        const isLogin = storageUtil.getLocalStorageData("isLogin") || false;

        if (isLogin) {
          const storeUtils = useUtilsStore();

          const checkItemExist = storeUtils.listCart.find(
            (item) => item.product_id.id === itemAdd.id
          );

          if (checkItemExist) {
            checkItemExist.numberAdd = itemAdd.number;

            const result = await this.updateDataCart(checkItemExist);

            if (result) {
              Notify.create({
                message: "Thêm vào giỏ hàng thành công!",
                type: "positive",
                timeout: 2000,
                position: "top-right",
              });
            }
          } else {
            const result = await this.addToCart(itemAdd);

            if (result) {
              Notify.create({
                message: "Thêm vào giỏ hàng thành công!",
                type: "positive",
                timeout: 2000,
                position: "top-right",
              });
            }
          }

          storeUtils.listCart = await storeUtils.getListCart();
        } else {
          Notify.create({
            type: "negative",
            message: "Vui lòng đăng nhập để thực hiện tính năng này!",
            position: "top-right",
            timeout: 2000,
          });
        }
      } catch (err) {
        console.error("Internal Server Error: ");
      }
    },

    async addToCart(dataAdd) {
      try {
        const userData = storageUtil.getLocalStorageData("userAuthInfo");

        const payload = {
          user_id: userData.id,
          product_id: dataAdd.id,
          quantity: dataAdd.number,
        };

        const { data, error } = await supabase
          .from("carts")
          .insert(payload)
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

    async updateDataCart(dataUpdate) {
      try {
        const payload = {
          quantity: (dataUpdate.numberAdd += dataUpdate.quantity),
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
  },
});
