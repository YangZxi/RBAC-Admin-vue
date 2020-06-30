<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addHandler">新增</el-button>
        <el-button type="success" icon="el-icon-edit" size="small" @click="modifyHandler" :disabled="isOperater">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="removeHandler" :disabled="isOperater">删除</el-button>
        <el-button type="warning" icon="el-icon-document-add" size="small" @click="exportHandler" :disabled="isOperater">导出</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="" plain size="mini" icon="el-icon-refresh" @click="getHandler()"></el-button>
        <el-button type="" plain size="mini" icon="el-icon-full-screen"></el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around" :gutter="20">
      <el-col :span="table.props.left">
        <slot name="left"></slot>
      </el-col>
      <el-col :span="table.props.span">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" body-style="{margin:0}">
            <span><b>{{table.props.title}}</b></span>
          </div>
          
          <el-table :data="pageData.records" style="width: 100%" 
              @selection-change="selectionChange"
              @row-click="rowDblClick"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <slot name="tableBody">
              <el-table-column v-for="col in table.labels" :key="col.label"
                :label="col.label" :prop="col.prop"
                :width="col.width" :fixed="col.fixed == '' ? null : col.fixed">
                <template slot-scope="scope">
                  <el-switch
                    v-if="col.prop == 'status'"
                    v-model="scope.row.status"
                    @click.native="statusChange(scope.row)"
                    :active-value="1"
                    active-color="#13ce66"
                    :inactive-value="scope.row[col.prop] > 1"
                    inactive-color="#ff4949"
                  ></el-switch>
                  <div v-else-if="col.prop.indexOf('Time') > 0">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                  </div>
                  <!-- <div v-else-if="col.slot">
                    <template ></template>
                  </div> -->
                  <span v-else>{{ scope.row[col.prop] }}</span>
                  <!-- <span v-else><slot></slot></span> -->
                </template>
              </el-table-column>
            </slot>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" @click="modifyHandler(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="removeHandler(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="block" style="margin-top: 10px;">
            <span class="demonstration"></span>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageData.current"
              :page-sizes="[5, 10, 25, 50, 100]"
              :page-size="10"
              layout="prev, pager, next, sizes"
              :total="pageData.total"
            ></el-pagination>
          </div>
          <!-- 分页 END -->
        </el-card>
      </el-col>
      <el-col :span="table.props.right">
        <slot name="right"></slot>
      </el-col>
    </el-row>
    
    <!-- 弹出框——新增和修改信息 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      width="50%">
      
      <slot name="modelForm" ></slot>
      <!-- <slot name="modelForm">111</slot> -->
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler(0)">{{dialog.submitText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  data() {
    return {
      // 删除、修改、到处按钮是否禁用
      isOperater: true,
      dialog: {
        visible: false,
        title: "",
        submitText: "提交"
      },
      pageInfo: {
        current: 1,
        size: 10,
        total: 0
      },
      // modelForm: {},
      ruleForm: {},
      method: this.$axios.get
    };
  },
  methods: {
    statusChange(value) {
      console.log(value.status);
      if (value.status != 1) {
        this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '放弃修改'
        })
          .then(() => {
            this.$message({
              type: 'info',
              message: '修改用户状态成功'
            });
          })
          .catch(action => {
            // this.$message({
            //   type: 'info',
            //   message: action === 'cancel'
            //     ? '放弃保存并离开页面'
            //     : '停留在当前页面'
            // })
            value.status = 1;
          });
      }
    },
    // 改变修改、删除、到处按钮的禁用状态
    selectionChange(selection) {
      selection.length > 0 ? this.isOperater = false : this.isOperater = true;
    },
    // 分页条数改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageInfo.size = val;
      this.getHandler();
    },
    // 当前页改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageInfo.current = val;
      this.getHandler();
    },
    /**
     * @param {Function} method
     * @param {Object} data
     */
    baseRequest(data) {
      console.log(this.API)
      this.method(this.API, data).then(res => {
        console.log(res)
        
      }).catch(err => {
        console.log(err, "1111")
        
      });
    },
    // 刷新和获取表格数据
    getHandler() {
      this.$axios.get(this.API, this.pageInfo)
        .then(res => {
          // console.log(res)
          this.$emit("update:pageData", res.data ? res.data : {current: 1, total: 0, records: []});
          console.log(res.data)
        })
        .catch(err => {
          // console.log(err)
        })
    },
    // 新增按钮
    addHandler() {
      this.dialog.title = "新增";
      this.dialog.submitText = "新增";
      this.dialog.visible = true;
      this.method = this.$axios.put;
    },
    // 修改按钮
    modifyHandler(row) {
      this.dialog.title = "修改";
      this.dialog.submitText = "更新";
      this.dialog.visible = true;
      this.method = this.$axios.post;
    },
    // 删除按钮
    removeHandler(row) {
      this.method = this.$axios.delete;
      console.log("删除了")
      this.baseRequest({id: 1});
    },
    // 导出按钮
    exportHandler() {
      
    },
    submitHandler(type) {
      console.log(this.modelForm)
      // this.baseRequest({});
    },
    // 当某一行被双击时
    rowDblClick(row) {
      console.log(row)
      this.$emit("getRoleMenu", row);
    }
  },
  mounted() {
    // this.table.forEach(el => {
      // this.modelForm[el.prop] = null
    // });
    console.log(this.API)
    this.getHandler();
  },
  watch: {
    pageInfo() {
      console.log("我变了")
    }
  },
  props: {
    pageData: Object,
    table: Object,
    modelForm: Object,
    API: String
  }
};
</script>

<style>
  .el-form-item__content {
    /* display: flex; */
  }
</style>
