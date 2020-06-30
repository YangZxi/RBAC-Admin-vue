<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="10">
          <el-form ref="modelForm" :rules="formRules" :model="modelForm" size="small" label-width="70px">
            <el-form-item label="头像">
              <el-row type="flex" align="middle">
                <el-col :span="10">
                  <el-upload
                    class="avatar-uploader"
                    :action="$api.FILE_UPLOAD"
                    :show-file-list="false"
                    :headers="headers" 
                    name="files"
                    :data="{type: 'avatar'}"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload" >
                    <el-avatar v-if="modelForm.avatar" :size="100" :src="$tools.buildAvatar(modelForm.avatar)" >
                      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                    </el-avatar>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-col>
                <el-col :span="12">
                  <!-- <span>点击上传新头像</span> -->
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="modelForm.id" style="display: none" :disabled="true"></el-input>
              <el-input v-model="modelForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="modelForm.nickname" ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="modelForm.gender" placeholder="请选择">
                    <el-option
                      v-for="item in genderOps"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model.number="modelForm.age"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model="modelForm.email"></el-input>
            </el-form-item>
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

        <el-col :span="14">
          <el-timeline>
            <el-timeline-item v-for="item in loginTrack" :key="item.id" :timestamp="item.loginTime" placement="top">
              <el-card>
                <h4>在IP {{item.loginIp}} 登录</h4>
                <!-- <p></p> -->
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Mine",
  data() {
    var checkNewPwd = (rule, value, callback) => {
      let regx = /[\w\d]{6,18}/
      if (!regx.test(this.modelForm.newPwd)) {
        return callback(new Error("请输入6-18位的英文和数字密码"));
      }
      if (!(!this.modelForm.newPwd || (this.modelForm.newPwd.trim() == ""))
        &&  (this.modelForm.password == this.modelForm.newPwd)) {
        return callback(new Error("原密码和新密码不可以相同"));
      }
      callback();
    };
    var checkConfirmPwd = (rule, value, callback) => {
      let regx = /[\w\d]{6,18}/
      if (this.modelForm.newPwd != this.modelForm.confirmPwd) {
        return callback(new Error("两次输入密码不相同"));
      }
      callback();
    };
    return {
      API: this.$api.PROP_API,
      headers: {
        Authorization: "Bearer " + this.$store.state.token,
      },
      loginTrack: [],
      genderOps: [
        { value: "", label: "请选择性别" },
        { value: "男", label: "男" },
        { value: "女", label: "女" }
      ],
      modelForm: {
        id: null,
        username: "",
        nickname: "",
        avatar: "",
        email: "",
        age: null,
        gender: ""
      },
      formRules: {
        nickname: [
          { required: true, message: "用户昵称不可以为空", trigger: "blur" },
          { min: 4, max: 10, message: "长度在4-10个字符之间", trigger: "blur" }
        ],
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
      original: null
    };
  },
  methods: {
    beforeAvatarUpload() {},
    handleAvatarSuccess(res, file, fileList) {
      console.log(res)
      if (res.code == 200) {
        this.$notify({
          title: res.msg,
          type: "success"
        });
        this.modelForm.avatar = res.data;
        console.log(this.modelForm.avatar)
      } else {
        this.$notify({
          title: res.msg,
          type: "waring"
        });
      }
    },
    handleAvatarError(err) {
      this.$notify({
        title: "上传失败",
        type: "error"
      });
    },
    queryHandler() {
      
    },
    onSubmit() {
      this.$refs["modelForm"].validate((valid) => {
        if (valid) {
          console.log(this.modelForm);
          this.$axios.post(this.$api.USER_INFO, this.modelForm).then(res => {
            console.log(res)
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
    onSendMail() {
      let data = new FormData();
      Object.keys(this.sendForm).forEach(key => {
        data.append(key, this.sendForm[key]);
        // console.log(key)
        // console.log(this.sendForm[key])
      });
      // console.log(data)
      // return
      this.$axios.post(this.$api.MAIL_SEND, data, true, {
          "Content-Type": "application/x-www-form-urlencoded"
        }).then(res => {
          if (res.code == 200) {
            // this.$message({
            //   type: "success",
            //   message: res.msg
            // });
          }
        }).catch(err => {
          this.$notify({
            title: res.msg,
            type: "error"
          });
        });
    },
    queryUserTrack() {
      this.$axios.get(this.$api.USER_TRACK, { size: 5 }, false).then(res => {
        if (res.code == 200) {
          console.log(res.data)
          this.loginTrack = res.data;
        }
      }).catch(err => {
        this.$notify({
          title: res.msg,
          type: "error"
        });
      });
    }
  },
  computed: {
    buildAvatar() {
      // lry suy
      return this.$api.SERVER_UPLOAD + this.$tools.buildAvatar(this.modelForm.avatar);
    }
  },
  mounted() {
    this.queryUserTrack();
    let timer = setInterval(() => {
      if (this.$store.state.user) {
        clearInterval(timer);
        Object.keys(this.modelForm).forEach(key => {
          this.modelForm[key] = this.$store.state.user[key];
        });
      }
    }, 50);
    
    console.log(this.$api)
  }
};
</script>

<style>
</style>