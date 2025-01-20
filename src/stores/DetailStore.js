import { defineStore } from "pinia";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";
import { Utils } from "src/utils/Utils";

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
        console.log(itemAdd);
        return;

        const payload = {};

        const { data, error } = await supabase
          .from("carts")
          .insert(payload)
          .select();
      } catch (err) {
        console.error("Internal Server Error: ");
      }
    },
  },
});
