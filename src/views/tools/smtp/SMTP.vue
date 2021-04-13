<template>
  <div>
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="邮件发送" name="sendMail">
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
        
        <el-tab-pane label="发件箱配置" name="setting">
          <el-row>
            <el-col :span="11">
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
                  <el-input v-model.number="modelForm.email_server_port"></el-input>
                </el-form-item>
                <el-form-item label="是否开启SSL" prop="ssl">
                  <el-switch
                    v-model="modelForm.email_ssl"
                    active-value="true"
                    active-color="#13ce66"
                    inactive-value="false"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-form-item>
                <el-form-item style="text-align: right">
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12" :offset="1">
              <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <span>快速配置</span>
                </div>
                <table>
                  <tr v-for="(p, index) in platforms" :key="index" style="height: 40px;">
                    <td style="padding-right: 10px;">{{p.name}} </td>
                    <td>
                      <el-button @click="setServer(v.value)" v-for="(v, index1) in p.setting" :key="index1"
                        type="danger" size="mini" plain>{{v.label}}</el-button>
                    </td>
                  </tr>
                </table>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "sendMail",
      API: this.$api.MAIL_API,
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
      platforms: [
        {name: "网易免费邮", setting: [
          {label: "SMTP", value: ["smtp.ym.163.com", 25, false]},
          {label: "SMTP加密", value: ["smtp.ym.163.com", 994, true]},
          {label: "POP", value: ["pop.ym.163.com", 110, false]},
          {label: "POP加密", value: ["pop.ym.163.com", 995, true]},
        ]},
        {name: "QQ邮箱", setting: [
          {label: "SMTP加密", value: ["smtp.qq.com", 995, true]},
          {label: "POP加密", value: ["pop.qq.com", 465, true]},
        ]}
      ]
    };
  },
  methods: {
    tabClick() {
      // dont thing
    },
    queryHandler() {
      this.$axios.get(this.$api.PROP_API, {type: "email"}, false).then(res => {
        if (res.code == 200) {
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
      this.$axios.post(this.API, JSON.stringify(this.original), true).then(res => {
        if (res.code == 200) {

        }
      }).catch(err => {

      });
    },
    onSendMail() {
      let data = new FormData();
      Object.keys(this.sendForm).forEach(key => {
        data.append(key, this.sendForm[key]);
      })
      this.$axios.post(this.$api.MAIL_SEND, data, true, {"Content-Type": "application/x-www-form-urlencoded"}).then(res => {
        if (res.code == 200) {
        }
      }).catch(err => {
        this.$notify({
          title: res.msg,
          type: "error"
        })
      });
    },
    setServer(value) {
      this.modelForm.email_server_host = value[0];
      this.modelForm.email_server_port = value[1];
      this.modelForm.email_ssl = value[2] + "";
    }
  },
  mounted() {
    this.queryHandler();
  },
  watch: { }
};
</script>

<style>

</style>