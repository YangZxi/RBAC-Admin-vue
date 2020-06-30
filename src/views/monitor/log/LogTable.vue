<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="12">
        <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addHandler">新增</el-button> -->
        <!-- <el-button type="success" icon="el-icon-edit" size="small" @click="modifyHandler(undefined)" :disabled="isOperater != 1">修改</el-button> -->
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="removeHandler(undefined)"
          :disabled="isOperater == 0"
        >删除</el-button>
        <el-button
          type="warning"
          icon="el-icon-document-add"
          size="small"
          @click="exportHandler"
          :disabled="isOperater == 0"
        >导出</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type plain size="mini" icon="el-icon-refresh" @click="queryHandler()"></el-button>
        <el-button type plain size="mini" icon="el-icon-full-screen"></el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around" :gutter="20">
      <el-col>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" body-style="{margin:0}">
            <span>
              <b></b>
            </span>
          </div>

          <el-table
            :data="pageData.records"
            style="width: 100%"
            @selection-change="selectionChange"
            @row-click="rowDblClick"
            @select="rowSelect"
            row-key="id"
            ref="table"
            v-loading="table.loading"
            :lazy="false"
            :tree-props="{children: 'children', hasChildren: 'status'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand" label="详情" fixed="left" >
              <template slot-scope="scope">
                <el-form label-position="left" class="" >
                  <el-form-item label="请求方法" >
                    <span style="color: #333">
                      {{scope.row.method}}
                    </span>
                  </el-form-item>
                  <el-form-item label="参数：" >
                    <span style="color: #f56c6c">
                      {{scope.row.content}}
                    </span>
                    <!-- <json-view :json="JSON.parse(scope.row.content)" ></json-view> -->
                    <!-- <json-viewer :value="scope.row.content" ></json-viewer> -->
                    <!-- <json-viewer :value="JSON.parse(scope.row.content)" ></json-viewer> -->
                  </el-form-item>
                </el-form>
                
              </template>
            </el-table-column>
            <el-table-column label="日志标题" prop="title" fixed="left" >
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column label="日志类型" prop="type" width="120">
              <template slot-scope="scope">
                <!-- <i v-if="scope.row.icon.startsWith('el-icon') " class="scope.row.icon">11</i> -->
                <!-- <i :class="scope.row.icon"></i> -->
                <el-tag v-if="scope.row.type == 'INFO'" type>INFO</el-tag>
                <el-tag v-else-if="scope.row.type == 'ERROR'" type="warning">ERROR</el-tag>
                <el-tag v-else type="info">按钮</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="IP" prop="ip" width="150"></el-table-column>
            <el-table-column label="调用方法" prop="method" width="220">
              <template slot-scope="scope">
                <span>
                  {{scope.row.method}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="耗时" prop="time" width="100">
              <template slot-scope="scope">
                <el-tag type="danger">{{scope.row.time}}ms</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="记录时间" prop="createTime" width="170">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" :width="logType == 'INFO' ? 75 : 170" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" v-if="logType == 'ERROR'" @click="viewError(scope.row)">查看异常</el-button>
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

    <el-dialog :title="dialog.title" width="90%"
      top="5vh"
      custom-class="dialog-log"
      :visible.sync="dialog.visible">
      <div class="error-box" v-html="dialog.error"><!-- {{dialog.error}} --></div>
    </el-dialog>
  </div>
</template>

<script>
import JsonView from "@/components/JsonView"
// import JsonViewer from 'vue-json-viewer';
export default {
  name: "MenuTable",
  components: {
    JsonView,
    // JsonViewer,
  },
  props: {
    API: String,
    logType: String
  },
  data() {
    return {
      // 删除、修改、到处按钮是否禁用
      isOperater: 0,
      dialog: {
        title: "",
        error: "",
        visible: false,
      },
      table: {
        loading: true,
        rows: []
      },
      pageInfo: {
        current: 1,
        size: 10,
        total: 0,
        parentMenu: 0,
        type: this.logType
      },
      pageData: { current: 1, total: 0, records: [] },
      method: this.$axios.get
    };
  },
  methods: {
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
    /**
     * 查看异常信息
     */
    viewError(row) {
      this.dialog.title = row.title;
      this.dialog.error = row.error == null ? "" : row.error.trim();
      this.dialog.visible = true;
    },
    //
    // 以下是和CRUD有关的方法
    //
    /**
     * @param {Function} method
     * @param {Object} data
     */
    baseRequest(method, data, isShow = true) {
      console.log(this.API);
      return this.$axios[method](this.API, data, isShow)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            // this.modelForm = {type: 1, order: 3, status: 1}
            this.dialog.visible = false;
          }
          return res;
        })
        .catch(err => {
          console.log(err, "1111");
          Promise.reject(err);
        });
    },
    // 刷新和获取表格数据
    queryHandler(isShow = true) {
      this.table.loading = true;
      this.$axios
        .get(this.API, this.pageInfo, isShow)
        .then(res => {
          // console.log(res)
          this.pageData = res.data ? res.data : { current: 1, total: 0, records: [] };
          this.table.loading = false;
          // console.log(res.data)
        })
        .catch(err => {
          this.table.loading = false;
          // console.log(err)
        });
    },
    // 删除按钮
    removeHandler(rows = this.table.rows) {
      this.$alert("本次操作一经确认将无法撤回，是否继续", "角色删除", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        console.log("删除了");
        console.log(rows);
        let ids = [];
        if (Array.isArray(rows)) {
          ids = rows.map(el => el.id);
        } else {
          ids = [rows.id];
        }
        this.$axios.delete(this.API, ids).then(res => {
          this.queryHandler(false);
        });
      }).catch(action => {});
    },
    // 导出按钮
    exportHandler() {},
    // 当某一行被双击时
    rowDblClick(row) {
      // console.log(row)
      // this.$emit("getRoleMenu", row);
    },
    //
    // 这下面是关于表单的方法
    //
    typeChange(val) {
      console.log(val);
      // this.type = val;
    }
  },
  computed: {
    formatText(text) {
      return text.trim();
    }
  },
  mounted() {
    // this.table.forEach(el => {
    // this.modelForm[el.prop] = null
    // });
    console.log(this.API);
    this.queryHandler();
  },
  watch: {
    pageInfo() {
      console.log("我变了");
    }
  }
};
</script>

<style scope>
.error-box {
  text-indent: -2rem;
  white-space: pre-line;
  margin-left: 5rem;
}

</style>
