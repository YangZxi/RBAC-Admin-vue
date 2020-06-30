<template>
  <div class="box">
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
</template>

<script>
  export default {
    name: "Pagination",
    data() {
      return {
        
      }
    },
    methods: {
      // 分页条数改变
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        // this.pageInfo.size = val;
        // console.log(this.$parent.$parent.$parent.$parent.pageInfo)
        console.log()
        this.pageInfo.size = val
        this.$emit("queryHandler");
        // this.getHandler();
      },
      // 当前页改变
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageInfo.current = val;
        this.$emit("queryHandler");
      },
    },
    props: {
      pageData: Object,
      pageInfo: Object,
    }
  }
</script>

<style>
  .box {
    margin-top: 15px;
  }
</style>
