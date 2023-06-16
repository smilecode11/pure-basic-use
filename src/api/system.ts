import { http } from "@/utils/http";
import { baseUrlPureApi } from "@/api/utils";

type Result = {
  errno: number;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

export const getRoleList = (data?: object) => {
  return http.request<Result>("post", baseUrlPureApi("getRoleList"), { data });
};
