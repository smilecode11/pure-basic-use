/** 将菜单树列表转成tree组件数据*/
export function menuList2tree(
  arr,
  { childrenName = "children", nameKey = "title", idKey = "id" } = {}
) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      menuName: arr[i][nameKey],
      id: arr[i][idKey],
      children: arr[i][childrenName]
    };
    if (arr[i][childrenName].length) {
      menuList2tree(arr[i][childrenName], { childrenName, nameKey, idKey });
    }
  }
  return arr;
}
