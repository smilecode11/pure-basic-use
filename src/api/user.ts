import { http } from "@/utils/http";
import { baseUrlPureApi } from "./utils";

export type LoginResult = {
  errno: number;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
  message: string;
};

export type UserResult = {
  errno: number;
  data: {
    /** 用户名 */
    nickname: string;
    account: string;
    phone: string;
    email: string;
    roleName?: string;
    roleCode?: string;
    roleId?: number;
    deptId?: number;
    deptName?: string;
    avatar?: string;
  };
  message: string;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<LoginResult>("post", baseUrlPureApi("login"), { data });
};

export const getUserInfo = (data?: object) => {
  return http.request<UserResult>("post", baseUrlPureApi("getUserInfo"), {
    data
  });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "refreshToken", {
    data
  });
};
