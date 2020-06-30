<template>
  <div>
    <el-row type="flex" justify="space-between">
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
              v-loading="table.loading"
              :lazy="true"
              :load="tableLoad"
              :tree-props="{children: 'children', hasChildren: 'status'}">
              
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="菜单名称" prop="name" fixed="left">
              <template slot-scope="scope">
                  <i :class="scope.row.icon" style="margin-right: 5px;"></i>
                  <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="图标" prop="icon" width="70">
              <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
              </template>
            </el-table-column> -->
            <el-table-column label="组件路径" prop="path" width="120"></el-table-column>
            <el-table-column label="组件名称" prop="component" width="120"></el-table-column>
            <el-table-column label="排序" prop="order" width="70"></el-table-column>
            <el-table-column label="类型" prop="type" width="70">
              <template slot-scope="scope">
                <!-- <i v-if="scope.row.icon.startsWith('el-icon') " class="scope.row.icon">11</i> -->
                <!-- <i :class="scope.row.icon"></i> -->
                <el-tag v-if="scope.row.type == 1" type="danger">目录</el-tag>
                <el-tag v-else-if="scope.row.type == 2" type="warning">菜单</el-tag>
                <el-tag v-else-if="scope.row.type == 3" type="info">按钮</el-tag>
              </template>
            </el-table-column>
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
      :title="dialog.title + '菜单'"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      width="50%">
      
      <!-- slot name="modelForm" ></slot> -->
      <el-form :model="modelForm" :rules="form.formRules" ref="modelForm" status-icon label-position="right" size="small" label-width="80px">
        <el-row type="flex" justify="space-between">
          <el-col :span="24">
            <el-form-item label="类型">
              <el-radio-group v-model="modelForm.type" size="small" >
                <el-radio-button :disabled="modelForm.id != null && modelForm.type != 1 ? 'disabled' : null"
                  :label="1">目录</el-radio-button>
                <el-radio-button :disabled="modelForm.id != null && modelForm.type != 2 ? 'disabled' : null"
                  :label="2">菜单</el-radio-button>
                <el-radio-button :disabled="modelForm.id != null && modelForm.type != 3 ? 'disabled' : null"
                  :label="3">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="display: none;">
            <el-form-item label="id">
              <el-input v-model="modelForm.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="form.lable[modelForm.type] + '名称'" prop="name">
              <el-input v-model="modelForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="modelForm.type != 3">
            <el-form-item :label="form.lable[modelForm.type] + '路径'" prop="path">
              <el-input v-model="modelForm.path" :placeholder="'请输入' + form.lable[modelForm.type] + '路径'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="modelForm.type == 2">
            <el-form-item label="组件名称" prop="component">
              <el-input v-model="modelForm.component" placeholder="请输入组件名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="modelForm.type == 3">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="modelForm.permission" placeholder="请输入权限标识"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="modelForm.type != 3">
            <el-form-item label="图标" >
              <el-input :prefix-icon="modelForm.icon" v-model="modelForm.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="modelForm.order" :min="1" :max="100" label="排序" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="modelForm.type == 1 ? 7 :12">
            <el-form-item label="状态">
              <el-select v-model="modelForm.status" placeholder="默认状态为启用">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="modelForm.type == 1 ? 16 :24">
            <el-form-item :label="modelForm.type == 3 ? '上级菜单' : '上级目录'" prop="parentMenu">
              <!-- <el-select v-model="modelForm.parent_menu" placeholder="请选择上级类目" style="width: 100%;">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="2"></el-option>
              </el-select> -->
              <el-cascader 
                style="width: 100%;"
                v-model="modelForm.parentMenu"
                :options="form.menuTree"
                :props="{ checkStrictly: true, value: 'id', label: 'name', lazy: false, emitPath: false }">
                <template slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length == 0 ? data.children = null : data.children.length }}) </span>
                </template>
              </el-cascader>
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
  name: 'MenuTable',
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
        name: "",
        type: 1,
        parent_menu: null,
        icon: null,
        order: 9,
        path: null,
        component: null,
        permission: null,
        status: 1
      },
      form: {
        lable: ["", "目录", "菜单", "按钮"],
        type: 1,
        menuTree: [{ id: "0", name: "根目录" }],
        formRules: {
          name: [
            { required: true, message: "名称不可以为空", trigger: "blur" },
            { min: 4, max: 8, message: "长度在3-5个字符之间", trigger: "blur" }
          ],
          path: [
            { required: true, validator: checkPath, trigger: "blur" },
          ],
          component: [
            { required: true, validator: checkComponent, trigger: "blur" },
            { min: 2, max: 20, message: "长度在2-20个字符之间"},
          ],
          permission: [
            { required: true, validator: checkPermission, trigger: "blur" },
            { min: 5, max: 20, message: "长度在5-20个字符之间"},
          ],
          parentMenu: [{ required: true, message: "请选择上级菜单或目录", trigger: "blur" }],
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
        this.$alert("是否将当前" + value.name + "设置为禁用状态，这将会影响其所有子菜单", "禁用菜单", {
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
      }
    },
    // 表格树形懒加载
    tableLoad(tree, treeNode, resolve) {
      // console.log(tree, treeNode, resolve)
      let data = { current: 1, size: 100, parentMenu: tree.id};
      this.$axios.get(this.API, data).then(res => {
        if (res.code == 200) {
          console.log(res.data)
          resolve(res.data.records);
        }
      })
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
    clearForm(obj) {
      Object.keys(obj).forEach(key => {
        obj[key] = null;
      });
      // if (this.$refs.modelForm != undefined) {
      //   console.log("chongzhi")
      //   this.$refs["modelForm"].resetFields();
      // }
    },
    // 新增按钮
    addHandler() {
      // this.clearForm(this.modelForm);
      this.modelForm = {type: 1, order: 3, status: 1}
      this.dialog.title = "新增";
      this.dialog.submitText = "新增";
      this.dialog.visible = true;
      this.method = this.$axios.put;
    },
    // 修改按钮
    modifyHandler(row = this.table.rows.slice(-1)[0]) {
      // this.clearForm(this.modelForm);
      // 判断是否是从表格里的编辑按钮触发的
      row.parentMenu = row.parentMenu == 0 ? "0" : row.parentMenu;
      this.modelForm = row;
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
          this.baseRequest(rows.map(el => el.id));
        } else {
          this.baseRequest([rows.id]);
        }
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
          this.baseRequest(this.modelForm);
        } else {
          return false;
        }
      });
    },
    // 当某一行被双击时
    rowDblClick(row) {
      // console.log(row)
      // this.$emit("getRoleMenu", row);
    },
    //
    // 这下面是关于表单的方法
    // 
    typeChange(val) {
      console.log(val)
      // this.type = val;
    },
    /**
     * 加载权限树
     */
    queryMenuTree() {
      this.$axios.get(this.$api.MENU_API, {showType: "tree"}, false).then(res => {
        console.log(this.form.menuTree);
        this.form.menuTree = this.form.menuTree.concat(res.data);
      });
    },
  },
  mounted() {
    // this.table.forEach(el => {
      // this.modelForm[el.prop] = null
    // });
    console.log(this.API)
    this.queryHandler();
    this.queryMenuTree();
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

</style>
