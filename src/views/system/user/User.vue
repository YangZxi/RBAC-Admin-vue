<template>
  <div>
    <el-card>
      <search-bar :searchForm="searchForm" @search-click="searchHandler"></search-bar>
      <el-row>
        <!-- 使用组件的形式 -->
        <data-table :API="API" ref="dataTable" :searchForm="searchForm">
          
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
      searchForm: {
        word: null,
        startTime: null,
        endTime: null,
        status: 1,
      },
      API: this.$api.USER_API,
    }
  },
  methods: {
    searchHandler(formData) {
      if (formData.dateScope != null) {
        this.searchForm.startTime = formData.dateScope[0];
        this.searchForm.endTime = formData.dateScope[1];
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
      // return
      this.$refs.dataTable.queryHandler(1);
    },
    /**
     * 清空表单
     */
    resetForm() {
      this.searchForm = {};
      this.dateScope = null;
    }
  },
  mounted() {
    // console.log(this.API)
    // console.log(this)
  },
  components: { DataTable }
};
</script>

<style>
  
</style>
