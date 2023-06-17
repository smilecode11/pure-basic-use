import { reactive, ref, h, onMounted, toRaw } from "vue";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import editForm from "../form.vue";

import { FormItemProps } from "./types";
import { type PaginationProps } from "@pureadmin/table";
import { usePublicHooks } from "../../hooks";

import { getRoleList, createRole, setRoleStatus, editRole } from "@/api/system";

export function useRole() {
  const form = reactive({
    name: "",
    code: "",
    status: "",
    pageSize: 10,
    currentPage: 1
  });
  const switchLoadMap = ref({});
  const loading = ref(true);
  const { switchStyle } = usePublicHooks();
  const formRef = ref();

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
        const { errno, msg, data } = await setRoleStatus({ id, status });
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
          console.log("_data", data);
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
  const columns: TableColumnList = [
    {
      label: "编号",
      prop: "id",
      minWidth: 50
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "code",
      minWidth: 150
    },
    {
      label: "状态",
      minWidth: 130,
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
      label: "备注",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "创建时间",
      minWidth: 180,
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
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 25, 50, 100, 500]
  });

  async function onSearch(resetCurrentPage?: boolean) {
    if (resetCurrentPage) {
      form.currentPage = 1;
      pagination.currentPage = 1;
    }
    loading.value = true;
    const { data } = await getRoleList(toRaw(form)); //  获取角色列表数据
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch(true);
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    // 编辑时, 数据初始化

    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          id: row?.id ?? "",
          name: row?.name ?? "",
          code: row?.code ?? "",
          remark: row?.remark ?? "",
          status: row?.status ?? "0",
          menu: row?.menu ?? []
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        // console.log("_FormRef", FormRef, curData);
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
              const addResp = await createRole(curData); //  新增角色
              if (addResp.errno === 0) {
                chores();
              } else {
                message(addResp.msg, {
                  type: "error"
                });
              }
            } else {
              const editResp = await editRole(curData); //  编辑角色
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
  }

  const handleDelete = row => {
    console.log("_handleDelete", row);
    onSearch();
  };
  const handleDatabase = () => {
    console.log("_handleDatabase");
  };
  const handleMenu = () => {
    console.log("_handleMenu");
  };
  const buttonClass = () => {
    console.log("_buttonClass");
  };
  const handleSelectionChange = () => {
    console.log("_handleSelectionChange");
  };
  const handleSizeChange = pageSize => {
    form.pageSize = pageSize;
    onSearch(true);
  };
  const handleCurrentChange = currentPage => {
    form.currentPage = currentPage;
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    onSearch,
    resetForm,
    openDialog,
    columns,
    dataList,
    pagination,
    handleDelete,
    handleDatabase,
    handleMenu,
    buttonClass,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange
  };
}
