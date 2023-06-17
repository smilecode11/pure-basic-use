export interface FormItemProps {
  id?: number;
  /** 角色名称 */
  name: string;
  /** 角色标识 */
  code: string;
  /** 备注 */
  remark: string;
  /** 状态*/
  status: string;
  /** 菜单*/
  menu: number[];
}

export interface FormProps {
  formInline: FormItemProps;
}
