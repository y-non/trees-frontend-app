import { defineStore } from "pinia";
import { Dialog, Loading, Notify } from "quasar";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";

export const useSellerProductStore = defineStore("seller-product", {
  state: () => ({
    tableMultiSelect: [],
    filterTable: "",
    newProduct: {},

    listProduct: [],
    listCategories: [],
    showAddDialog: false,
  }),
  actions: {
    async getInit() {
      this.listCategories = await this.getCategories();
      this.listProduct = await this.getListProduct();
    },

    async getListProduct() {
      try {
        const userData = storageUtil.getLocalStorageData("userAuthInfo");
        let { data: trees, error } = await supabase
          .from("trees")
          .select("*")
          .eq("user_id", userData.id);

        return trees;
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async createNewProduct(newData) {
      try {
        Loading.show();

        const userData = storageUtil.getLocalStorageData("userAuthInfo");

        // Check if an image is selected
        let imageUrl = null;
        if (newData.imageFile) {
          // Upload the image to the Supabase bucket
          const { data: imageUploadData, error: imageUploadError } =
            await supabase.storage
              .from("images") // Replace "images" with your bucket name if different
              .upload(
                `products/${newData.code}_${Date.now()}.jpg`,
                newData.imageFile,
                {
                  cacheControl: "3600",
                  upsert: false,
                }
              );

          if (imageUploadError) {
            throw new Error(`Image upload failed: ${imageUploadError.message}`);
          }

          // Generate a public URL for the uploaded image
          const { data: publicUrlData, error: publicUrlError } =
            supabase.storage.from("images").getPublicUrl(imageUploadData.path);

          if (publicUrlError) {
            throw new Error(
              `Failed to get public URL: ${publicUrlError.message}`
            );
          }

          imageUrl = publicUrlData.publicUrl;
        }

        const payload = {
          code: newData.code,
          name: newData.name,
          description: newData.description,
          category: newData.category.id,
          price: +newData.price,
          stock: +newData.stock,
          user_id: userData.id,
          image_url: imageUrl, // Save the image URL in the database
        };

        const { data, error } = await supabase
          .from("trees")
          .insert(payload)
          .select();

        if (error) {
          Dialog.create({
            title: "Thông báo",
            message: `Lỗi thực thi!`,
            ok: true,
            cancel: false,
          });
        } else {
          this.listProduct = await this.getListProduct();
          Notify.create({
            message: "Tạo mới thành công!",
            color: "positive",
            timeout: 2000,
            position: "top",
          });
          this.showAddDialog = false;
          this.newProduct = {};
        }
        Loading.hide();
      } catch (err) {
        Loading.hide();
        Dialog.create({
          title: "Lỗi",
          message: `Internal Server Error: ${err.message}`,
          ok: true,
          cancel: false,
        });
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
