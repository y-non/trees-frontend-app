import { defineStore } from "pinia";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";

export const useIndexStore = defineStore("index", {
  state: () => ({
    listProduct: [],
    listCategories: [],
  }),
  actions: {
    async getInit() {
      this.listCategories = await this.getCategories();
      this.listProduct = await this.getListProduct();
      console.log(this.listProduct);
    },

    async getListProduct() {
      try {
        this.loadingTable = true;
        const userData = storageUtil.getLocalStorageData("userAuthInfo");
        let { data: trees, error } = await supabase
          .from("trees")
          .select("*, user_id(*)");

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
  },
});
