export interface FormItemProps {
  id?: number;
  name: string; //  部门名
  head?: string; // 部门负责人
  headMobile?: string; // 负责人手机号
  headEmail?: string; // 负责人邮箱
  remark?: string; // 备注
  rank?: number; // 排序, 只针对顶级路由
  parentDept?: number; // 上级部门
  status: "0" | "1"; // 0 表示启用 1 表示禁用
}

export interface FormProps {
  formInline: FormItemProps;
  allDepts: Array<any>;
}
