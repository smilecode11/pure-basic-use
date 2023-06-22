import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  account: [{ required: true, message: "账号为必填项", trigger: "blur" }],
  nickname: [{ required: true, message: "昵称为必填项", trigger: "blur" }],
  password: [{ required: true, message: "密码为必填项", trigger: "blur" }],
  role: [{ required: true, message: "角色为必填项", trigger: "blur" }],
  dept: [{ required: true, message: "部门为必填项", trigger: "blur" }],
  phone: [{ required: true, message: "手机号为必填项", trigger: "blur" }],
  email: [{ required: true, message: "邮箱为必填项", trigger: "blur" }]
});
