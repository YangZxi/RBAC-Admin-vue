<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="searchFrom">
        <el-row type="flex" justify="start" :gutter="0">
          <el-form-item label="" size="mini"><el-input v-model="searchFrom.name" placeholder="请输入菜单名称进行查询"></el-input></el-form-item>
          <el-form-item label="" size="mini">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                v-model="searchFrom.dateScope"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                style="width: 280px;"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item size="mini">
            <el-select v-model="searchFrom.status" placeholder="菜单状态状态" style="width: 150px;">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item size="mini">
            <el-button type="success" icon="el-icon-search" @click="searchHandler">搜索</el-button>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="warning" icon="el-icon-refresh-left" native-type="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <!-- 使用组件的形式 -->
        <data-table :API="API" >
          
        </data-table>
      </el-row>
    </el-card>
    
  </div>
</template>

<script>
import DataTable from "./UserTable"
export default {
  data() {
    return {
      // 搜索表单
      searchFrom: {
        name: '',
        dateScope: null,
        status: null,
      },
      API: this.$api.USER_API,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      statusOpt: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 2,
          label: '禁用'
        }
      ],
      // 从后台来的数据，和字段对应
      pageData: {currentPage: 2, totalCount: 100, records: this.$store.state.menuModule.menu}
            
    }
  },
  methods: {
    searchHandler() {
      
    },
    /**
     * 清空表单
     */
    
  },
  mounted() {
    // console.log(this.API)
  },
  components: { DataTable }
};
</script>

<style>
  
</style>
