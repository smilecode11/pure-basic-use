<template>
  <div class="pass-control">
    <el-form
      ref="formRef"
      :model="form"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="orgPass">
        <el-input clearable v-model="form.orgPass" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input
          v-model="form.pass"
          type="password"
          clearable
          :maxlength="18"
          :minlength="4"
          @input="strengthShow"
          placeholder="请输入密码 8~18 位"
        />
        <div class="pass-see mt-2">
          <span
            id="weak"
            :class="{
              weak: stregthLevel === 'weak',
              medium: stregthLevel === 'medium',
              strong: stregthLevel === 'strong'
            }"
          >
            弱
          </span>
          <span
            id="medium"
            :class="{
              medium: stregthLevel === 'medium',
              strong: stregthLevel === 'strong'
            }"
          >
            中
          </span>
          <span
            id="strong"
            :class="{
              strong: stregthLevel === 'strong'
            }"
          >
            强
          </span>
        </div>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPass">
        <el-input
          v-model="form.confirmPass"
          type="password"
          clearable
          :maxlength="16"
          :minlength="6"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit(formRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { editPassword } from "@/api/system";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";

export default defineComponent({
  setup() {
    const form = reactive({
      orgPass: "",
      pass: "",
      confirmPass: ""
    });
    const formRef = ref<FormInstance>();
    const handleSubmit = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate(async valid => {
        if (valid) {
          console.log("submit!", form);
          const editResp = await editPassword({
            passwordOld: form.orgPass,
            passwordNew: form.pass
          });
          console.log("_editResp", editResp);
          const { errno, data, message: failMessage } = editResp;
          if (errno === 0) {
            message(`${data.msg}, 即将为你登出!`, { type: "success" });
            setTimeout(() => {
              useUserStoreHook().logOut();
            }, 1500);
          } else {
            message(`${failMessage}`, { type: "error" });
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };

    const stregthLevel = ref<"weak" | "medium" | "strong" | "">("");
    // 密码强度
    const strengthShow = () => {
      // 弱密码：全是数字或全是字母，4-16个字符
      const weakReg = /^[0-9]{4,18}$|^[a-zA-Z]{4,18}$/;
      // 中密码：数字和26个英文字母，4-18个字符
      const mediumReg = /^[A-Za-z0-9]{4,18}$/;
      // 强密码：由数字、26个英文字母或者特殊字符组成，4-18个字符
      const strongReg = /^[A-Za-z0-9]|[!@#$%^&*()_<>?~`{}\\|[\]]{4,18}$/;
      const password = form.pass;
      if (null !== password) {
        if (password.length >= 4 && password.length <= 18) {
          if (password.match(weakReg)) {
            stregthLevel.value = "weak";
          } else if (password.match(mediumReg)) {
            stregthLevel.value = "medium";
          } else if (password.match(strongReg)) {
            stregthLevel.value = "strong";
          }
        } else {
          stregthLevel.value = "";
        }
      }
    };

    const checkConfirmPass = (rule: any, value: any, callback: any) => {
      if (value !== form.pass) {
        callback(new Error("输入密码不一致"));
      } else {
        callback();
      }
    };

    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (
        !/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){4,18}$/.test(
          value
        )
      ) {
        callback(new Error("密码格式应为4-18位数字、字母、符号的任意两种组合"));
      } else {
        callback();
      }
    };

    const rules = reactive<FormRules>({
      orgPass: [
        {
          required: true,
          message: "输入原密码",
          trigger: "blur"
        }
      ],
      pass: [
        {
          required: true,
          message: "输入新密码",
          trigger: "blur"
        },
        {
          validator: checkPass,
          trigger: "change"
        }
      ],
      confirmPass: [
        {
          required: true,
          message: "确认确认密码",
          trigger: "blur"
        },
        {
          validator: checkConfirmPass,
          trigger: "change"
        }
      ]
    });
    return {
      formRef,
      form,
      rules,
      handleSubmit,
      strengthShow,
      stregthLevel
    };
  }
});
</script>

<style scoped lang="scss">
#weak,
#medium,
#strong {
  display: inline-block;
  height: 15px;
  width: 60px;
  border-top: 4px solid gainsboro;
  margin-left: 5px;
  font-size: 12px;
  text-align: center;
  transition: 0.3s;
  &.weak {
    border-color: yellow;
  }
  &.medium {
    border-color: blue;
  }
  &.strong {
    border-color: green;
  }
}
</style>
