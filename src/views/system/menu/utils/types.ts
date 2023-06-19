export interface FormItemProps {
  id?: number;
  /** 菜单名*/
  title: string;
  /** 菜单标识(唯一)*/
  name: string;
  /** 菜单类型 0 目录 1 菜单 2 按钮*/
  type: "0" | "1" | "2";
  /** 路由地址*/
  routePath?: string;
  /** 重定向路由地址*/
  redirectRoutePath?: string;
  /** 组件路径*/
  component?: string;
  /** 图标*/
  icon?: string;
  /** 菜单右侧额外图标*/
  extraIcon?: {
    svg: boolean; // 是否是svg
    name: string; // iconfont名称，目前只支持iconfont，后续拓展
  };
  rank?: number; // 排序, 只针对顶级路由
  showLink?: "0" | "1"; //  是否在菜单中显示 0 表示是, 1 表示否
  parentMenu?: number; // 上级菜单
  showParent?: boolean; // 是否显示父级菜单
  roles?: Array<string>; // 页面级别权限设置
  auths?: Array<string>; //  按钮级别权限设置
  keepAlive?: "0" | "1"; // 是否缓存该路由页面 0 表示缓存 1 表示不缓存
  frameSrc?: string; // 需要内嵌的 iframe 链接地址
  frameLoading?: boolean; // 内嵌 iframe 是否开启首次加载动画
  transition?: {
    // 当前页面动画，这里是第一种模式，比如 name: "fade" 更具体看后面链接 https://cn.vuejs.org/api/built-in-components.html#transition
    name: string;
    // 当前页面进场动画，这里是第二种模式，比如 enterTransition: "animate__fadeInLeft"
    enterTransition: string;
    // 当前页面离场动画，这里是第二种模式，比如 leaveTransition: "animate__fadeOutRight"
    leaveTransition: string;
  };
  // 当前菜单名称或自定义信息禁止添加到标签页 0 表示隐藏, 1 表示不隐藏
  hiddenTag?: "1" | "0";
  // 显示在标签页的最大数量，需满足后面的条件：不显示在菜单中的路由并且是通过query或params传参模式打开的页面。在完整版全局搜dynamicLevel即可查看代码演示
  dynamicLevel?: number;
  status: "0" | "1"; // 0 表示启用 1 表示禁用
}

export interface FormProps {
  formInline: FormItemProps;
  allMenus: Array<any>;
}
