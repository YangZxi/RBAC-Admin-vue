<template>
  <div>
    <el-row type="flex" justify="space-between" style="position: sticky;">
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addHandler">新增</el-button>
        <el-button type="success" icon="el-icon-edit" size="small" @click="modifyHandler(undefined)" :disabled="isOperater != 1">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="removeHandler(undefined)" :disabled="isOperater == 0">删除</el-button>
        <el-button type="warning" icon="el-icon-document-add" size="small" @click="exportHandler" :disabled="isOperater == 0">导出</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="" plain size="mini" icon="el-icon-refresh" @click="queryHandler()"></el-button>
        <el-button type="" plain size="mini" icon="el-icon-full-screen"></el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around" :gutter="20">
      <el-col >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" body-style="{margin:0}">
            <span><b></b></span>
          </div>
          
          <el-table :data="pageData.records" style="width: 100%" 
              @selection-change="selectionChange"
              @row-click="rowDblClick"
              @select="rowSelect"
              row-key="id"
              ref="table"
              v-loading="table.loading">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户名" prop="username" fixed="left">
              <template slot-scope="scope">
                  <span>{{scope.row.username}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="昵称" prop="nickname" width="120"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="150"></el-table-column>
            <el-table-column label="性别" prop="gender" width="70"></el-table-column>
            <el-table-column label="年龄" prop="age" width="70"></el-table-column>
            <el-table-column label="状态" prop="status" width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  @click.native="statusChange(scope.row)"
                  :active-value="1"
                  active-color="#13ce66"
                  :inactive-value="scope.row.status > 1"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="入职时间" prop="createTime" width="200">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" @click="modifyHandler(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="removeHandler(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <my-pagination :pageData="pageData" :pageInfo="pageInfo" @queryHandler="queryHandler"></my-pagination>
          <!-- 分页 END -->
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 弹出框——新增和修改信息 -->
    <el-dialog
      :title="dialog.title + '角色'"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      @open="queryRoles"
      @close="dialogClose"
      width="50%">
      
      <!-- slot name="modelForm" ></slot> -->
      <el-form :model="modelForm" :rules="form.formRules" ref="modelForm" status-icon label-position="right" size="small" label-width="80px">
        <el-row type="flex" justify="space-between">
          <el-col :span="24" style="display: none;">
            <el-form-item label="id">
              <el-input v-model="modelForm.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="modelForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="modelForm.nickname" placeholder="'请输入用户昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="modelForm.email" placeholder="请输入用户收件邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input type="number" v-model="modelForm.age"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="modelForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户角色" prop="roleIds">
              <el-select v-model="modelForm.roleIds" multiple placeholder="请选择用户角色" style="width: 100%;">
                <el-option
                  v-for="role in form.roles"
                  :key="role.id"
                  :label="role.nameZh"
                  :value="role.id">
                  <span style="float: left">{{ role.nameZh }}</span>
                  <span style="float: right; color: #8492a6; font-size: 12px">{{ role.name }}</span>
                </el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false" size="medium">取 消</el-button>
        <el-button @click="resetPassword" size="medium">重置密码</el-button>
        <el-button type="primary" @click="submitHandler(0)" size="medium">{{dialog.submitText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserTable",
  data() {
    var checkPath = (rule, value, callback) => {
      if (this.modelForm.type != 3 && !value) {
        return callback(new Error("路径不能为空"));
      }
      callback();
    };
    var checkComponent = (rule, value, callback) => {
      if (this.modelForm.type == 2 && !value) {
        return callback(new Error("组件名称不能为空"));
      }
      callback();
    };
    var checkPermission = (rule, value, callback) => {
      if (this.modelForm.type == 3 && !value) {
        return callback(new Error("权限标识不能为空"));
      }
      callback();
    };
    return {
      // 删除、修改、到处按钮是否禁用
      isOperater: 0,
      table: {
        loading: true,
        rows: [],
      },
      dialog: {
        visible: false,
        title: "",
        submitText: "提交"
      },
      pageInfo: {
        current: 1,
        size: 10,
        total: 0,
        parentMenu: 0
      },
      modelForm: {
        id: null,
        username: null,
        nickname: null,
        email: null,
        gender: null,
        age: null,
        roleIds: []
      },
      form: {
        roles: [],
        formRules: {
          username: [
            { required: true, message: "用户名不可以为空", trigger: "blur" },
            { min: 5, max: 20, message: "长度在5-20个字符之间", trigger: "blur" }
          ],
          nickname: [
            // { validator: checkNickname, trigger: "blur" },
            { max: 10, message: "昵称最长为10个字符", trigger: "blur" },
          ],
          email: [
            // { required: true, validator: checkEmail, trigger: "blur" },
            { required: true, type: "email", message: "长度在2-20个字符之间", trigger: "blur"},
            { min: 6, max: 30, message: "长度在6-30个字符之间"},
          ],
          // parentMenu: [{ required: true, message: "请选择上级菜单或目录", trigger: "blur" }],
        },
      },
      pageData: {current: 1, total: 0, records: []},
      method: this.$axios.get
    };
  },
  methods: {
    statusChange(value) {
      // console.log(value);
      if (value.status != 1) {
        this.$alert("是否将当前【" + value.nickname + "】设置为禁用状态", "禁用用户", {
          distinguishCancelAndClose: true,
          confirmButtonText: "禁用",
          cancelButtonText: "取消"
        }).then(() => {
          this.$axios.post(this.API, {id: value.id, status: 0}, false).then(res => {
            console.log(res)
            if (res.code == 200) {
              // this.modelForm = {type: 1, order: 3, status: 1}
              this.$notify({
                title: "修改状态成功",
                type: "success"
              })
            }
          }).catch(err => {
            this.$notify({
              title: "修改错误",
              type: "error"
            })
          });
        }).catch(action => {
          value.status = 1;
        });
      } else {
        this.$axios.post(this.API, {id: value.id, status: 1}, false).then(res => {
          console.log(res)
          if (res.code == 200) {
            // this.modelForm = {type: 1, order: 3, status: 1}
            this.$notify({
              title: "修改状态成功",
              type: "success"
            })
          }
        }).catch(err => {
          this.$notify({
            title: "修改错误",
            type: "error"
          })
        });
      }
    },
    // 表格中的选择项发生改变事件
    selectionChange(selection) {
      // 改变修改、删除、到处按钮的禁用状态
      this.isOperater = selection.length;
      this.table.rows = selection;
    },
    // 表格行被选择事件
    rowSelect(selection, row) {
      console.log(selection, row);
      // this.table.row = row;
    },
    //
    // 以下是和CRUD有关的方法
    //
    /**
     * @param {Function} method
     * @param {Object} data
     */
    baseRequest(data) {
      console.log(this.API)
      return this.method(this.API, data).then(res => {
        console.log(res)
        if (res.code == 200) {
          // this.modelForm = {type: 1, order: 3, status: 1}
          this.dialog.visible = false;
        }
        return res;
      }).catch(err => {
        console.log(err, "1111")
        Promise.reject(err);
      });
    },
    // 刷新和获取表格数据
    queryHandler() {
      this.table.loading = true;
      this.$axios.get(this.API, this.pageInfo).then(res => {
        // console.log(res)
        this.pageData = res.data ? res.data : {current: 1, total: 0, records: []};
        this.table.loading = false;
        // console.log(res.data)
      }).catch(err => {
        this.table.loading = false;
        // console.log(err)
      })
    },
    // 新增按钮
    addHandler() {
      // this.clearForm(this.modelForm);
      this.dialog.title = "新增";
      this.dialog.submitText = "新增";
      this.dialog.visible = true;
      this.method = this.$axios.put;
    },
    // 修改按钮
    modifyHandler(row = this.table.rows.slice(-1)[0]) {
      this.modelForm = row;
      // 查询当前用户的角色信息（id数组）
      this.$axios.get(this.$api.ROLE_API, {userId: row.id}).then(res => {
        if (res.code == 200) {
          // this.modelForm.roleIds = res.data;
          // 请勿使用上面的方式进行赋值，可能出现无法双向绑定失效
          this.$set(this.modelForm, "roleIds", res.data);
          // 强制刷新视图
          // this.$forceUpdate();
        }
      });
      this.dialog.title = "修改";
      this.dialog.submitText = "更新";
      this.dialog.visible = true;
      this.method = this.$axios.post;
    },
    // 删除按钮
    removeHandler(rows = this.table.rows) {
      this.$alert("本次操作一经确认将无法撤回，是否继续", "角色删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: '取消'
      }).then(() => {
        this.method = this.$axios.delete;
        console.log("删除了")
        console.log(rows)
        if (Array.isArray(rows)) {
          this.baseRequest(rows.map(el => el.id)).then(res => this.queryHandler());
        } else {
          this.baseRequest([rows.id]).then(res => this.queryHandler());
        }
      }).catch(action => {
        
      });
    },
    resetPassword() {
      this.$axios.post(this.API, { id: this.modelForm.id, isReset: true }, false).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "密码重置成功",
            type: "success"
          });
        }
      })
    },
    // 导出按钮
    exportHandler() {
      
    },
    /**
     * 表单提交 新增or更新
     * @param {Object} type
     */
    submitHandler(type) {
      console.log(this.modelForm)
      this.$refs["modelForm"].validate((valid) => {
        if (valid) {
          this.baseRequest(this.modelForm);
        } else {
          return false;
        }
      });
    },
    // 当某一行被双击时
    rowDblClick(row) {
      // console.log(row)
    },
    //
    // 这下面是关于表单的方法
    // 
    typeChange(val) {
      console.log(val)
      // this.type = val;
    },
    // 这将在对话框被打开的时候进行调用
    queryRoles() {
      if (this.form.roles.length == 0) {
        this.$axios.get(this.$api.ROLE_API, {size: 20}, false).then(res => {
          // console.log(res.data);
          this.form.roles = res.data.records;
        });
      }
    },
    dialogClose() {
      // this.$tools.clearObj(this.modelForm, this);
      this.modelForm = {};
      // this.$refs["modelForm"].resetFields();

    },
  },
  computed: {
    
  },
  mounted() {
    this.queryHandler();
  },
  watch: {
    pageInfo() {
      console.log("我变了")
    }
  },
  props: {
    // pageData: Object,
    // table: Object,
    // modelForm: Object,
    API: String
  },
};
</script>

<style>
  .el-form-item__content {
    /* display: flex; */
  }
</style>
