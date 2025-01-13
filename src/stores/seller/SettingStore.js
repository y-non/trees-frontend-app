import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";

export const useSettingStore = defineStore("seller-settings", {
  state: () => ({
    userData: {},
  }),
  actions: {
    getInit() {
      this.userData = storageUtil.getLocalStorageData("userAuthInfo");
    },

    async updateUserInformation(userData) {
      try {
        Loading.show();
        let imageUrl = userData.image_url;

        // Handle Avatar Upload
        if (userData.selectedFile) {
          const { data, error } = await supabase.storage
            .from("images")
            .upload(
              `users/${userData.id}/${userData.selectedFile.name}`,
              userData.selectedFile,
              { cacheControl: "3600", upsert: true }
            );

          if (error) throw error;

          // Get the public URL of the uploaded image
          const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(`users/${userData.id}/${userData.selectedFile.name}`);
          imageUrl = publicUrlData.publicUrl;
        }

        // Update user information in the database
        const { error: updateError } = await supabase
          .from("users")
          .update({
            display_name: userData.display_name,
            phone: userData.phone,
            address: userData.address,
            description: userData.description,
            image_url: imageUrl, // Update avatar URL
          })
          .eq("id", userData.id);

        if (updateError) throw updateError;
        else {
          const localUserData = storageUtil.getLocalStorageData("userData");

          await this.getUserAccountData(localUserData.id);

          Notify.create({
            message: "Cập nhật thành công!",
            type: "positive",
            position: "top",
            timeout: 1000,
          });

          // storageUtil.setLocalStorageData("userAuthInfo", userData);
        }

        Loading.hide();
      } catch (err) {
        Loading.hide();
        console.error("Lỗi khi cập nhật thông tin: ", err.message);
      }
    },

    async getUserAccountData(id) {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", id);

        this.userData = users[0];

        storageUtil.setLocalStorageData("userAuthInfo", users[0]);
      } catch (err) {
        console.error("Internal Server Error getUserAccountData(): ", err);
      }
    },
  },
});
