<template>
  <div id='user-login'>
    <!-- <el-card style="width: 60%;"> -->
      <div id="login-card">
        <el-row :gutter="20" type="flex" justify="center">
          <el-col :span="9">
            <div style="padding: 20px 15px 0px 35px;">
              <div id='title'>
                <h1>系统登录</h1>
              </div>
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
                <el-form-item>
                  <el-button type="primary" id='loginBtn' @click="login($api.OAUTH_QQ)" tabindex="3">QQ登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="15" style="">
            <el-image
                  style="width: 100%; height: 100%;background-color: #EBF4FF;padding: 20px;"
                  src="./img/login-bg.svg"
                  fit="contain"></el-image>
          </el-col>
        </el-row>
      </div>
    <!-- </el-card> -->
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
      },
      event: null,
    };
  },
  methods: {
    receiveMsg(e) {
      if (e.origin === this.$api.SERVER_BASE) {
        let res = JSON.parse(e.data);
        console.log(res)
        // 如果登录成功
        if (res.code == 200) {
          console.log(this)
          // 添加Token信息
          this.$store.commit("setToken", res.token);
          this.$router.push({
            name: "Home",
            params: {
              // 表示是从登录页面过来的
              login: true
            }
          });
        } else {
          this.$notify({
            title: res.msg,
            type: "warning"
          });
        }
        // 移除 message 事件
        window.removeEventListener("message", this.receiveMsg);
      }
    },
    login(url) {
      if (typeof url === "string") {
        // 创建一个子窗口用于登录
        let strWindowFeatures = "width=600,height=500,top=100,left=100,menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true";
        window.open(url, "_blank", strWindowFeatures);
        // 创建postMessage监听
        window.addEventListener("message", this.receiveMsg);
      } else {
        this.$refs["loginForm"].validate(valid => {
          if (!valid) {
            Message.error("登录信息不完整");
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: '登陆中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
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
              });
            }
            loading.close();
          }).catch(err => {
            // console.log(err)
            loading.close();
          });
          
        });
      }
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
  background-color: #F7FAFC;
  display: flex;
  justify-content: center;
  align-items: center;
}
#loginBtn {
  width: 100%;
}
#title {
  margin-bottom: 5rem;
  text-align: center;
}
#login-card {
  width: 60%;
  background-color: #FFF;
  border-radius: .5rem;
  box-shadow: 0px 1px 5px 0 rgba(0,0,0,.1), 0px 2px 2px 0 rgba(0,0,0,.06);
}
</style>
