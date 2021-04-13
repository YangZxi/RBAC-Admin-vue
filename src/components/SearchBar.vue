<template>
  <el-form :inline="true" :model="searchForm">
    <el-row type="flex" justify="start" :gutter="0">
      <el-form-item label="" size="mini">
        <el-input v-model="searchForm.word" :placeholder="this.wordPlace"></el-input>
      </el-form-item>
      <el-form-item label="" size="mini" v-show="dateShow">
        <div class="block">
          <span class="demonstration"></span>
          <el-date-picker
            v-model="dateScope"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            style="width: 280px"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item size="mini" v-show="statusShow">
        <el-select
          v-model="searchForm.status"
          placeholder="菜单状态状态"
          style="width: 150px" >
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item size="mini">
        <el-button type="success" icon="el-icon-search" @click="searchHandler">搜索</el-button>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="warning" icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      // 搜索表单
      dateScope: null,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  props: {
    searchForm: Object,
    // 搜索输入框占位符
    wordPlace: {
      type: String,
      default: "请输入搜索关键词"
    },
    statuses: {
      type: Array,
      default: () => {
        return [ 
          { value: 1, label: '启用' }, 
          { value: 0, label: '禁用' },
          { value: 2, label: '已删除' }
        ];
      }
    },
    dateShow: {
      type: Boolean,
      default: true
    },
    statusShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    searchHandler() {
      this.$emit("search-click", {
        dateScope: this.dateScope
      });
    },
    resetForm() {

    },
  },

};
</script>

<style >
</style>