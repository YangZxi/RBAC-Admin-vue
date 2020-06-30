<template>
  <div>
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="发件箱配置" name="first">
          <el-row>
            <el-col :span="12">
              <el-form ref="modelForm" :model="modelForm" size="small" label-width="100px">
                <el-form-item label="邮箱账号">
                  <el-input v-model="modelForm.email_username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱密码">
                  <el-input v-model="modelForm.email_password" show-password></el-input>
                </el-form-item>
                <el-form-item label="邮件发送名称">
                  <el-input v-model="modelForm.email_send_name"></el-input>
                </el-form-item>
                <el-form-item label="服务器地址">
                  <el-input v-model="modelForm.email_server_host"></el-input>
                </el-form-item>
                <el-form-item label="端口">
                  <el-input v-model="modelForm.email_server_port"></el-input>
                </el-form-item>
                <el-form-item label="是否开启SSL" prop="ssl">
                  <el-switch
                    v-model="modelForm.email_ssl"
                    :active-value="true"
                    active-color="#13ce66"
                    :inactive-value="false"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-form-item>
                <el-form-item style="text-align: right">
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="邮件发送" name="second">
          <el-row>
            <el-col :span="16">
              <el-form ref="modelForm" :model="sendForm" size="small" label-width="100px">
                <el-form-item label="收件箱" prop="to">
                  <el-input v-model="sendForm.to"></el-input>
                </el-form-item>
                <el-form-item label="主题" prop="subject">
                  <el-input v-model="sendForm.subject"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                  <el-input type="textarea" v-model="sendForm.content"></el-input>
                </el-form-item>
                <el-form-item label="模板" prop="template">
                  <el-select v-model="sendForm.template" placeholder="请选择模板">
                    <el-option
                      v-for="item in templates"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否HTML" prop="isHtml">
                  <el-switch
                    v-model="sendForm.isHtml"
                    :active-value="true"
                    active-color="#13ce66"
                    :inactive-value="false"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-form-item>
                <el-form-item style="text-align: right">
                  <el-button type="primary" @click="onSendMail">发送</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane> -->
        <!-- <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      API: this.$api.PROP_API,
      propType: "email",
      modelForm: {
        email_username: "",
        email_password: "",
        email_send_name: "",
        email_server_host: "",
        email_server_port: "",
        email_ssl: false,
      },
      templates: [
        {value: "", label: "不使用模板"},
        {value: "mail-1.html", label: "模板一"}
      ],
      sendForm: {
        to: "",
        subject: "",
        content: "",
        template: "",
        isHtml: false,
      },
      original: null,
    };
  },
  methods: {
    tabClick() {

    },
    queryHandler() {
      this.$axios.get(this.API, {type: "email"}, false).then(res => {
        console.log(res)
        if (res.code == 200) {
          console.log(res.data);
          this.original = res.data;
          res.data.forEach(el => {
            this.modelForm[el.propKey.toLowerCase()] = el.propValue;
          });
        }
      }).catch(err => {

      });
    },
    onSubmit() {
      this.original.forEach(el => {
        el.propValue = this.modelForm[el.propKey];
      });
      console.log(this.original);
      // return;
      this.$axios.post(this.API, JSON.stringify(this.original), true).then(res => {
        if (res.code == 200) {

        }
      }).catch(err => {

      });
    },
    onSendMail() {
      // this.$axios.req({
      //   method: "post",
      //   url: this.$api.MAIL_SEND,
      //   data: this.sendForm,
      //   headers: {"Content-Type": "application/form-data"},
      // });
      // return
      let data = new FormData();
      Object.keys(this.sendForm).forEach(key => {
        data.append(key, this.sendForm[key]);
        // console.log(key)
        // console.log(this.sendForm[key])
      })
      // console.log(data)
      // return
      this.$axios.post(this.$api.MAIL_SEND, data, true, {"Content-Type": "application/x-www-form-urlencoded"}).then(res => {
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
        })
      });


    }
  },
  mounted() {
    this.queryHandler();
  }
};
</script>

<style>

</style>