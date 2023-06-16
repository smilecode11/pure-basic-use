export interface FormItemProps {
  /** 角色名称 */
  name: string;
  /** 角色编号 */
  code: string;
  /** 备注 */
  remark: string;
}

export interface FormProps {
  formInline: FormItemProps;
}
