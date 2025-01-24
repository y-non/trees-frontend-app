import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import axios from "axios";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";

export const useSettingStore = defineStore("seller-settings", {
  state: () => ({
    userData: {},
    listBankData: [],
    filterBanks: [],
    bankSelected: "",
  }),
  actions: {
    async getInit() {
      this.userData = storageUtil.getLocalStorageData("userAuthInfo");
      this.listBankData = await this.fetchBankData();
      this.listBankData = this.listBankData.map((item) => {
        return {
          ...item,
          name: `${item.name} - ${item.shortName}`,
        };
      });
    },

    async updateUserInformation(userData) {
      try {
        const isHaveBankSelect = userData.bank_name?.id ? true : false;

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

        let payload = {
          display_name: userData.display_name,
          phone: userData.phone,
          address: userData.address,
          description: userData.description,
          image_url: imageUrl,
        };

        if (isHaveBankSelect) {
          payload.bank_name = userData.bank_name.shortName;
          payload.is_updated_bank_data = true;
          payload.account_name = userData.account_name;
          payload.account_number = userData.account_number;
        }

        // Update user information in the database
        const { error: updateError } = await supabase
          .from("users")
          .update(payload)
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

          await this.resetData();

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

    async fetchBankData() {
      try {
        const axiosInstance = axios.create();
        const url = "https://api.vietqr.io/v2/banks";

        const result = await axiosInstance.get(url);

        if (result) {
          return result.data.data;
        } else {
          console.error("Caught error when fetching bank data!");
        }
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    /* FUNCTIONAL */
    /* Function for handle filter bank in input */
    filterFn(val, update) {
      try {
        if (val === "") {
          update(() => {
            this.filterBanks = this.listBankData;
          });

          return;
        }

        update(() => {
          const needed = val.toLowerCase().split(" ");
          this.filterBanks = this.listBankData.filter((bank) => {
            return needed.every((k) => {
              return Object.values(bank).join(" ").toLowerCase().includes(k);
            });
          });
        });
      } catch (err) {
        console.error("Internal Server Error: ", err);
      }
    },

    async resetData() {
      try {
        const userData = storageUtil.getLocalStorageData("userAuthInfo");
        await this.getUserAccountData(userData.user_id);

        await this.getInit();
      } catch (err) {}
    },
  },
});
