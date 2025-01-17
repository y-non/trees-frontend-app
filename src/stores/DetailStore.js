import { defineStore } from "pinia";
import { supabase } from "src/utils/superbase";

export const userDetailStore = defineStore("detail", {
  state: () => ({
    objectData: {},
    isLoading: false,
    objectOrder: {
      number: 1,
    },
    listCategories: [],
    listProduct: [],
  }),
  actions: {
    async getInit() {
      this.listCategories = await this.getCategories();
      this.listProduct = await this.getListProduct();
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
