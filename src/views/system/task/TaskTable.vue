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
            <el-table-column label="描述" prop="desc" type="expand">
              <template slot-scope="scope">
                {{scope.row.desc}}
              </template>
            </el-table-column>
            <el-table-column label="任务名称" prop="name" width="120"></el-table-column>
            <el-table-column label="Cron" prop="cron" width="150"></el-table-column>
            <el-table-column label="类名" prop="className" width="250"></el-table-column>
            <!-- <el-table-column label="方法名" prop="methodName" width="70"></el-table-column> -->
            <el-table-column label="状态" prop="status" width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  @click.native="statusChange(scope.row)"
                  :active-value="1"
                  active-color="#13ce66"
                  :inactive-value="0"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="200">
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
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="modelForm.name" placeholder="请输入任务名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="cron" prop="cron">
              <el-input v-model="modelForm.cron" placeholder="'请输入cron表达式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="类名" prop="className">
              <el-input v-model="modelForm.className" placeholder="请输入全限定类名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务描述" prop="desc">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入任务描述" v-model="modelForm.desc">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitHandler(0)" size="medium">{{dialog.submitText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TaskTable",
  data() {
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
        name: null,
        cron: null,
        desc: null,
        className: null,
        methodName: null,
        userId: null,
        status: null,
        createTime: null
      },
      form: {
        roles: [],
        formRules: {
          name: [
            { required: true, message: "任务名称不可以为空", trigger: "blur" },
            { min: 2, max: 10, message: "长度在2-10个字符之间", trigger: "blur" }
          ],
          cron: [
            { required: true, message: "Cron表达式不可以为空", trigger: "blur" },
          ],
          className: [
            { required: true, message: "类名不可以为空", trigger: "blur"},
          ],
          // parentMenu: [{ required: true, message: "请选择上级菜单或目录", trigger: "blur" }],
        },
      },
      pageData: {current: 1, total: 0, records: []},
      method: "get"
    };
  },
  methods: {
    statusChange(value) {
      // console.log(value);
      if (value.status != 1) {
        this.$alert("是否将当前任务【" + value.nickname + "】暂停？", "暂停任务", {
          distinguishCancelAndClose: true,
          confirmButtonText: "暂停",
          cancelButtonText: "取消"
        }).then(() => {
          this.$axios.post(this.API, {id: value.id, status: 0}, false).then(res => {
            console.log(res)
            if (res.code == 200) {
              // this.modelForm = {type: 1, order: 3, status: 1}
              this.$notify({
                title: "暂停任务成功",
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
              title: "开启任务成功",
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
    baseRequest(method = "get", data, isShow = true) {
      console.log(this.API)
      return this.$axios[method](this.API, data, isShow).then(res => {
        console.log(res)
        if (res.code == 200) {
          // this.modelForm = {type: 1, order: 3, status: 1}
          this.dialog.visible = false;
        }
        return res;
      }).catch(err => {
        Promise.reject(err);
      });
    },
    // 刷新和获取表格数据
    queryHandler(isShow = true) {
      this.table.loading = true;
      this.$axios.get(this.API, this.pageInfo, isShow).then(res => {
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
      this.method = "put";
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
      this.method = "post";
    },
    // 删除按钮
    removeHandler(rows = this.table.rows) {
      this.$alert("本次操作一经确认将无法撤回，是否继续", "角色删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: '取消'
      }).then(() => {
        this.method = this.$axios.delete;
        // console.log("删除了")
        // console.log(rows)
        let ids = [];
        if (Array.isArray(rows)) {
          ids = rows.map(el => el.id);
        } else {
          ids = [rows.id];
        }
        this.$axios.delete(this.API, ids).then(res => {
          this.queryHandler(false);
        });
      }).catch(action => {
        
      });
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
          this.baseRequest(this.method, this.modelForm);
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
