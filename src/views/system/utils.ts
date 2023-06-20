/** 将菜单树列表转成tree组件数据*/
export function List2tree(
  arr,
  {
    labelKey = "menuName",
    childrenName = "children",
    nameKey = "title",
    idKey = "id"
  } = {}
) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      [labelKey]: arr[i][nameKey],
      id: arr[i][idKey],
      children: arr[i][childrenName]
    };
    if (arr[i][childrenName].length) {
      List2tree(arr[i][childrenName], {
        labelKey,
        childrenName,
        nameKey,
        idKey
      });
    }
  }
  return arr;
}
