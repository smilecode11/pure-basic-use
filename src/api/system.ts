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

/** 删除角色*/
export const deleteRole = ({ id }) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("deleteRole"), {
    data: {
      id
    }
  });
};

/** 新增菜单*/
export const createMenu = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("createMenu"), {
    data
  });
};

/** 获取菜单(树形结构)*/
export const getAllMenuWithLevel = (data?: object) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("getAllMenuWithLevel"),
    {
      data
    }
  );
};

/** 修改菜单状态*/
export const setMenuStatus = ({ id, status }) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("setMenuStatus"),
    {
      data: {
        id,
        status
      }
    }
  );
};

/** 修改菜单*/
export const editMenuItem = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("editMenuItem"), {
    data
  });
};

/** 删除菜单*/
export const deleteMenu = ({ id }) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("deleteMenu"), {
    data: {
      id
    }
  });
};
