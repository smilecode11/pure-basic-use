export interface FormItemProps {
  id?: number;
  account?: string; //  账号名称
  pwd?: string;
  nickname?: string; // 账号昵称
  role?: string; //  账号角色
  dept?: string; //  所属部门
  phone?: string; // 手机号
  email?: string; // 账号邮箱
  remark?: string;
  status?: "0" | "1"; // 0 表示启用 1 表示停用
  createdAt?: Date;
}

export interface FormProps {
  formInline: FormItemProps;
  allDepts: any[];
  allRoles: any[];
}
