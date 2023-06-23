import { onMounted, reactive, ref, h, toRaw } from "vue";
import { ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";
import { usePublicHooks } from "../../hooks";
import { List2tree } from "../../utils";
import { FormItemProps } from "./types";
import { type PaginationProps } from "@pureadmin/table";
import { clone } from "@pureadmin/utils";
const deepClone = obj => clone(obj, true);

import editForm from "../form.vue";
import {
  createMenu,
  getAllMenuWithLevel,
  setMenuStatus,
  editMenuItem,
  deleteMenu
} from "@/api/system";

export function useMenu() {
  const form = reactive({
    title: "",
    name: "",
    status: "",
    pageSize: 0,
    currentPage: 1
  });
  const formRef = ref();
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "title",
      formatter: ({ title, id }) => `${title}_${id}`
    },
    {
      label: "图标",
      prop: "icon",
      width: "60",
      cellRenderer: scope => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <IconifyIconOnline icon={scope.row.icon} />
          </div>
        );
      }
    },
    {
      label: "标识",
      prop: "name"
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"0"}
          active-text="已启用"
          inactive-value={"1"}
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onStatusChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];
  const dataList = ref([]); //  数据列表数据
  const treeMenus = ref([]); //  上级菜单数据
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 25, 50, 100, 500]
  });
  const onSearch = async (resetCurrentPage?: boolean) => {
    if (resetCurrentPage) {
      form.currentPage = 1;
      pagination.currentPage = 1;
    }
    loading.value = true;
    //  获取菜单数据
    const { data } = await getAllMenuWithLevel(toRaw(form));
    dataList.value = data;
    //  合成上级菜单数据
    treeMenus.value = [
      {
        menuName: "顶级菜单(一级菜单层级设置使用)",
        id: 0,
        children: List2tree(deepClone(data))
      }
    ];
    loading.value = false;
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch(true);
  };

  /** 角色状态启用/停用*/
  function onStatusChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === "1" ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const { id, status } = row;
        const { errno, msg } = await setMenuStatus({ id, status });
        if (errno === 0) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.status === "1" ? "停用" : "启用"}${row.name}`, {
            type: "success"
          });
          // console.log("_data", data);
        } else {
          message(`${msg}`, {
            type: "error"
          });
        }
      })
      .catch(() => {
        row.status === "0" ? (row.status = "1") : (row.status = "0");
      });
  }
  /**  编辑/新增菜单弹窗*/
  const openDialog = (title = "新增", row?: FormItemProps) => {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          id: row?.id ?? "",
          type: row?.type ?? "0",
          name: row?.name ?? "",
          title: row?.title ?? "",
          routePath: row?.routePath ?? "",
          redirectRoutePath: row?.redirectRoutePath ?? "",
          component: row?.component ?? "",
          icon: row?.icon ?? "",
          rank: row?.rank ?? 99,
          showLink: row?.showLink ?? "0",
          parentMenu: row?.parentMenu ?? 0,
          showParent: row?.showParent ?? "0",
          roles: row?.roles ?? [],
          status: row?.status ?? "0",
          hiddenTag: row?.hiddenTag ?? "0"
        },
        allMenus: treeMenus
      },
      width: "50%",
      // top: "2%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        // console.log("_FormRef", curData);
        function chores() {
          message(`${title}成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (title === "新增") {
              const addResp = await createMenu(curData); //  新增菜单
              // console.log("_addResp", addResp);
              if (addResp.errno === 0) {
                chores();
              } else {
                message(addResp.msg, {
                  type: "error"
                });
              }
              chores();
            } else {
              const editResp = await editMenuItem(curData); //  编辑菜单
              if (editResp.errno === 0) {
                chores();
              } else {
                message(editResp.msg, {
                  type: "error"
                });
              }
            }
          }
        });
      }
    });
  };
  const handleDelete = async row => {
    await deleteMenu({ id: row.id });
    onSearch();
  };
  onMounted(() => {
    onSearch();
  });
  return {
    form,
    onSearch,
    loading,
    resetForm,
    columns,
    openDialog,
    dataList,
    pagination,
    handleDelete
  };
}
