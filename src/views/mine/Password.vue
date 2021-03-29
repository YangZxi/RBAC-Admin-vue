<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="10">
          <el-form ref="modelForm" :rules="formRules" :model="modelForm" size="small" label-width="70px">
            <el-form-item label="原密码" prop="password">
              <el-input v-model="modelForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input v-model="modelForm.newPwd" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input v-model="modelForm.confirmPwd" show-password></el-input>
            </el-form-item>

            <el-form-item style="text-align: right">
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Password",
  data() {
    var checkNewPwd = (rule, value, callback) => {
      let regx = /[\w\d]{6,18}/
      if (!regx.test(this.modelForm.newPwd)) {
        return callback(new Error("请输入6-18位的英文和数字密码"));
      }
      if (this.modelForm.newPwd && (this.modelForm.password == this.modelForm.newPwd)) {
        return callback(new Error("原密码和新密码不可以相同"));
      }
      callback();
    };
    var checkConfirmPwd = (rule, value, callback) => {
      if (this.modelForm.newPwd != this.modelForm.confirmPwd) {
        return callback(new Error("两次输入密码不相同"));
      }
      callback();
    };
    return {
      API: this.$api.PROP_API,
      modelForm: {
        id: this.$store.state.user.id,
        password: null,
        newPwd: null,
        confirmPwd: null
      },
      formRules: {
        password: [
          { min: 6, max: 18, message: "长度在6-18个字符之间", trigger: "blur"},
        ],
        newPwd: [
          { validator: checkNewPwd, trigger: "blur" },
          { min: 6, max: 18, message: "长度在6-18个字符之间", trigger: "blur"},
        ],
        confirmPwd: [
          { validator: checkConfirmPwd, trigger: "blur" },
          { min: 6, max: 18, message: "长度在6-18个字符之间", trigger: "blur"},
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs["modelForm"].validate((valid) => {
        if (valid) {
          this.$axios.post(this.$api.USER_INFO, this.modelForm).then(res => {
            if (res.code == 200) {
              let user = this.$store.state.user;
              // 将新的属性覆盖给vuex中的user
              user = Object.assign(user, this.modelForm);
              this.$store.commit("setUser", user);
            }
          }).catch(err => {

          });
        } else {
          return false;
        }
      });
    },
  },
  computed: { },
  mounted() { }
};
</script>

<style>
</style>