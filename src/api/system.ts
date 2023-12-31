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

/** 新增部门*/
export const createDept = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("createDept"), {
    data
  });
};

/** 获取部门(树形结构)*/
export const getAllDeptWithLevel = (data?: object) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("getAllDeptWithLevel"),
    {
      data
    }
  );
};

/** 修改部门状态*/
export const setDeptStatus = ({ id, status }) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("setDeptStatus"),
    {
      data: {
        id,
        status
      }
    }
  );
};

/** 修改部门*/
export const editDeptItem = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("editDeptItem"), {
    data
  });
};

/** 删除部门*/
export const deleteDept = ({ id }) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("deleteDept"), {
    data: {
      id
    }
  });
};

/** 新增账号*/
export const createAccount = (data?: object) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("createAccount"),
    {
      data
    }
  );
};

/** 获取账号列表*/
export const getAccountList = (data?: object) => {
  return http.request<BaseListResult<any>>(
    "post",
    baseUrlPureApi("getAccountList"),
    { data }
  );
};

/** 修改账号状态*/
export const setAccountStatus = ({ id, status }) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("setAccountStatus"),
    {
      data: {
        id,
        status
      }
    }
  );
};

/** 修改账号*/
export const editAccount = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("editAccount"), {
    data
  });
};

/** 删除账号*/
export const deleteAccount = ({ id }) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("deleteAccount"),
    {
      data: {
        id
      }
    }
  );
};

/** 修改账号密码*/
export const editPassword = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("editPassword"), {
    data
  });
};

/** 修改头像*/
export const editAvatar = (data?: object) => {
  return http.request<BaseResult<any>>("post", baseUrlPureApi("editAvatar"), {
    data
  });
};

/** 修改个人信息*/
export const updateUserInfo = (data?: object) => {
  return http.request<BaseResult<any>>(
    "post",
    baseUrlPureApi("updateUserInfo"),
    {
      data
    }
  );
};
