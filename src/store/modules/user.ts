import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi, getUserInfo } from "@/api/user";
import { UserResult, LoginResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  type DataInfo,
  setToken,
  setUserInfo,
  removeToken,
  sessionKey
} from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    username:
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "",
    avatar:
      storageSession().getItem<DataInfo<number>>(sessionKey)?.avatar ?? "",
    roles: storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<LoginResult>((resolve, reject) => {
        getLogin(data)
          .then(async data => {
            if (data && data.errno === 0) {
              setToken(data.data);
              resolve(data);
            } else {
              reject(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 获取用户信息&设置缓存*/
    async getUserInfo() {
      return new Promise<UserResult>((resolve, reject) => {
        getUserInfo()
          .then(resp => {
            // console.log("_userResp", resp);
            if (resp && resp.errno === 0) {
              const { nickname, roleCode, avatar } = resp.data;
              setUserInfo({ username: nickname, roles: [roleCode], avatar });
              resolve(resp);
            } else {
              reject(resp.message);
            }
          })
          .catch(err => reject(err));
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.avatar = "";
      removeToken();
      storageSession().clear();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
