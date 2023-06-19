import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  type: [{ required: true, message: "菜单类型为必选", trigger: "blur" }],
  name: [{ required: true, message: "菜单标识为必填项", trigger: "blur" }],
  title: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }]
});
