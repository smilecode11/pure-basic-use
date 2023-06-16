import { http } from "@/utils/http";
import { baseUrlPureApi } from "@/api/utils";

type Result = {
  errno: number;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlPureApi("getAsyncRoutes"));
};
