import { defineStore } from "pinia";
import { Dialog, Loading, Notify } from "quasar";
import { storageUtil } from "src/utils/storageUtil";
import { supabase } from "src/utils/superbase";

export const useAuthenticationStore = defineStore("authentication", {
  state: () => ({
    email: "",
    password: "",
    repassword: "",
    userList: [],
    isLogin: false,
  }),
  actions: {
    async getInit() {
      this.isLogin = storageUtil.getLocalStorageData("isLogin");
    },

    async signIn(email, password) {
      try {
        Loading.show({
          message: "Đang đăng nhập...",
        });

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.includes("@gmail.com") ? email : email + "@gmail.com",
          password,
        });

        if (error) {
          Notify.create({
            message: error.message,
            type: "negative",
            position: "top",
            timeout: 1000,
          });
          Loading.hide();
          console.error("Sign-in error:", error.message);
          return;
        }

        const user = data.user;
        await this.getUserAccountData(user.id);

        // Handle post-login actions, such as redirecting the user
        if (data.session) {
          const role = storageUtil.getLocalStorageData("userAuthInfo").role;
          localStorage.setItem("access_token", data.session.access_token);
          localStorage.setItem("refresh_token", data.session.refresh_token);
          storageUtil.setLocalStorageData("userData", data.user);
          this.isLogin = true;
          storageUtil.setLocalStorageData("isLogin", this.isLogin);

          if (role === "admin") {
            this.router.push("/admin");
            Loading.hide();
          } else {
            this.router.push("/seller/product");
            Loading.hide();
          }

          Notify.create({
            message: "Đăng nhập thành công!",
            color: "positive",
            timeout: 2000,
            position: "top",
          });
        }
      } catch (err) {
        Loading.hide();
        console.error("Error when handling signIn(email, password): ", err);
      }
    },

    async createAccount(email, password, displayName, role = "user") {
      try {
        Loading.show();
        /* METHOD 1: NOTE THAT THIS METHOD USER FOR EMAIL VERTIFICATION */
        // Step 1: Sign up the user in Supabase Authentication
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: email.includes("@gmail.com") ? email : email + "@gmail.com",
            password,
          }
        );

        if (authError) {
          Loading.hide();
          Notify.create({
            message: authError.message,
            color: "negative",
            timeout: 2000,
            position: "top",
          });
          console.error("Error creating account:", authError.message);
          return { success: false, message: authError.message };
        }

        // Step 2: Insert user data into the `users` table
        const { error: dbError } = await supabase.from("users").insert([
          {
            display_name: displayName, // Display name of the user
            email: email.includes("@gmail.com") ? email : email + "@gmail.com",
            user_id: authData.user.id, // User ID from Authentication
            role, // Role of the user (e.g., admin, user)
            provider: "email",
            disable: false,
          },
        ]);

        if (dbError) {
          Notify.create({
            message: dbError.message,
            color: "negative",
            timeout: 2000,
            position: "top",
          });
          Loading.hide();
          console.error(
            "Error inserting user data into users table:",
            dbError.message
          );
          return { success: false, message: dbError.message };
        } else {
          Loading.hide();
          Notify.create({
            message: "Tạo tài khoản thành công!",
            color: "positive",
            timeout: 2000,
            position: "top",
          });
          this.router.push("/login");
        }
      } catch (error) {
        Loading.hide();
        console.error("Unexpected error:", error);
        return { success: false, message: "An unexpected error occurred." };
      }
    },

    async signOut() {
      try {
        Dialog.create({
          title: "Xác nhận",
          message: "Bạn có chắc chắn muốn đăng xuẩt ?",
          ok: true,
          cancel: true,
        }).onOk(async () => {
          localStorage.clear();
          this.router.push("/login");

          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Error signing out:", error.message);
            return;
          }
          setTimeout(() => {
            window.location.reload();
          }, 100);
        });
      } catch (err) {
        console.error("Internal Server Error signOut(): ", err);
      }
    },

    async getUserAccountData(id) {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", id);

        storageUtil.setLocalStorageData("userAuthInfo", users[0]);
      } catch (err) {
        console.error("Internal Server Error getUserAccountData(): ", err);
      }
    },
  },
});
