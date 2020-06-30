<template>
  <div id='user-login'>
    <div>
      <div id='title'>
        <h1>系统登录</h1>
      </div>
      <div id='loginPnl'>
          <el-form :model="userData" :rules="loginRules" ref="loginForm">
            <el-form-item prop="username">
              <el-input v-model="userData.username" tabindex="1" :autofocus="true">
                <template slot="prepend">账户：</template>
              </el-input>
            </el-form-item >
            <el-form-item prop="password">
              <el-input type="password" v-model="userData.password" tabindex="2"  @keyup.enter.native="login">
                <template slot="prepend">密码：</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" id='loginBtn' @click="login" tabindex="3">登录</el-button>
            </el-form-item>
          </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Account from "@/api/Account";
import { Message } from "element-ui";
import Router from "../router";

export default {
  data() {
    return {
      userData: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [{ required: true, message: "请输入账户名称" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate(valid => {
        if (!valid) {
          Message.error("登录信息不完整");
          return;
        }
        this.$axios.post(this.$api.LOGIN, JSON.stringify(this.userData)).then(res => {
          if (res.code == 200) {
            // 添加Token信息
            this.$store.commit("setToken", res.token);
            this.$router.push({
              name: "Home",
              params: {
                // 表示是从登录页面过来的
                login: true
              }
            })
          }
        }).catch(err => {
          // console.log(err)
        })
      });
    }
  },
  mounted() {
    this.$loading().close();
    if (this.$route.params.msg) {
      this.$notify({
        title: this.$route.params.msg,
        // message: "dada",
        type: 'warning'
      })
    }
  }
};
</script>

<style scoped>
#user-login {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
}
#loginPnl {
  width: 20rem;
  margin: 0 auto;
}
#loginBtn {
  width: 100%;
}
#title {
  margin-bottom: 5rem;
  text-align: center;
}
</style>
