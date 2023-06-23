import { ref, reactive, onMounted, computed, toRaw, h } from "vue";
import { ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { type PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { FormItemProps } from "./types";
import {
  getAccountList,
  createAccount,
  editAccount,
  setAccountStatus,
  deleteAccount,
  getAllDeptWithLevel,
  getRoleList
} from "@/api/system";
import editForm from "./form.vue";
import { List2tree } from "../utils";

export const useAccount = () => {
  const loading = ref(true);
  const formRef = ref();
  const form = reactive({
    deptId: null,
    nickname: "",
    phone: "",
    status: "",
    pageSize: 10,
    currentPage: 1
  });
  const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const dataList = ref([]);
  const dataListWithDepts = ref([]);
  const dataListWithRoles = ref([]);
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  const columns: TableColumnList = [
    {
      label: "账号编号",
      prop: "id",
      minWidth: 130
    },
    {
      label: "账号",
      prop: "account",
      minWidth: 130
    },
    {
      label: "账号昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"0"}
          inactive-value={"1"}
          active-text="已开启"
          inactive-text="已关闭"
          inline-prompt
          onChange={() => onStatusChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createdAt",
      formatter: ({ createdAt }) => dayjs(createdAt).format("YYYY-MM-DD HH:mm")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function onStatusChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === "0" ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.account
      }</strong>账号吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );

        setAccountStatus({ id: row.id, status: row.status }).then(resp => {
          const { errno, msg } = resp;
          if (errno === 0) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改账号状态", {
                type: "success"
              });
            }, 300);
          } else {
            message(`操作失败${msg}`, {
              type: "error"
            });
          }
        });
      })
      .catch(() => {
        row.status === "0" ? (row.status = "1") : (row.status = "0");
      });
  }
  const onSearch = async (resetCurrentPage?: boolean) => {
    if (resetCurrentPage) {
      form.currentPage = 1;
      pagination.currentPage = 1;
    }
    loading.value = true;
    try {
      const { data } = await getAccountList(toRaw(form)); //  获取角色列表数据
      dataList.value = data.list;
      pagination.total = data.total;
    } catch (error) {
      message(error.message, {
        type: "error"
      });
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    }
  };
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch(true);
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

  const openDialog = (title = "新增", row?: FormItemProps) => {
    addDialog({
      title: `${title}账号`,
      props: {
        formInline: {
          id: row?.id ?? "",
          account: row?.account ?? "",
          nickname: row?.nickname ?? "",
          pwd: row?.pwd ?? "",
          role: row?.role ?? "",
          dept: row?.dept ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          remark: row?.remark ?? "",
          status: row?.status ?? "0"
        },
        allDepts: dataListWithDepts,
        allRoles: dataListWithRoles
      },
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`${title}成功`, {
            type: "success"
          });
          done();
          onSearch();
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (title === "新增") {
              const addResp = await createAccount(curData); //  新增账号
              if (addResp.errno === 0) {
                chores();
              } else {
                message(addResp.msg, {
                  type: "error"
                });
              }
            } else {
              const editResp = await editAccount(curData); //  编辑账号
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

  const handleDelete = row => {
    deleteAccount({ id: row.id }).then(resp => {
      const { errno, msg, data } = resp;
      if (errno === 0) {
        message(`操作成功${data.id}`, { type: "success" });
        onSearch();
      } else {
        message(`操作失败${msg}`);
      }
    });
  };

  const handleResetPass = row => {
    console.log("TODO: _重置为默认密码", row);
  };

  onMounted(() => {
    onSearch();
    // 获取部门数据
    getRoleList({
      pageSize: 500,
      currentPage: 1
    }).then(resp => {
      // console.log("_getRoleList", resp);
      dataListWithRoles.value = resp.data.list;
    });
    // 获取角色数据
    getAllDeptWithLevel().then(resp => {
      // console.log("_getAllDeptWithLevel", resp);
      dataListWithDepts.value = List2tree(resp.data, {
        labelKey: "name",
        childrenName: "children",
        nameKey: "name",
        idKey: "id"
      });
    });
  });

  return {
    form,
    formRef,
    loading,
    buttonClass,
    onSearch,
    resetForm,
    pagination,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    dataList,
    openDialog,
    handleDelete,
    handleResetPass,
    columns
  };
};
