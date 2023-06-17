import { http } from "@/utils/http";
import { baseUrlPureApi } from "@/api/utils";
import { BaseResult, BaseListResult } from "./types";

/** 获取角色列表*/
export const getRoleList = (data?: object) => {
  return http.request<BaseListResult<any>>(
    "post",
    baseUrlPureApi("getRoleList"),
    { data }
  );
};

/** 新增角色*/
export const createRole = (data?: object) => {
  return http.request<BaseResult<{ id: number }>>(
    "post",
    baseUrlPureApi("createRole"),
    {
      data
    }
  );
};

/** 修改角色状态*/
export const setRoleStatus = ({ id, status }) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("setRoleStatus"),
    {
      data: {
        id,
        status
      }
    }
  );
};

/** 修改角色*/
export const editRole = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("editRole"), {
    data
  });
};
