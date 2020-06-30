<template>
  <div>
    <!-- <el-card class="box-card"> -->
      <el-card class="box-card">
        <el-row type="flex" :gutter="10" justify="start" align="" >
          <el-col :span="10">
            <i class="fa fa-gears"></i> 系统：{{infoData.osName}}
          </el-col>
          <el-col :span="10">
            本项目已经苟活：
            <span>{{parseInt(infoData.runDateTime / (24*60*60*1000))}}天 </span>
            <span>{{parseInt(infoData.runDateTime / (60*60*1000))}}时 </span>
            <span>{{parseInt(infoData.runDateTime / (60*1000))}}分</span>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>系统信息</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <el-row type="flex" :gutter="10" justify="space-between" align="" style="text-align: center">
          <el-col :md="6" :sm="12" :xs="24">
            <div>CPU使用率</div>
            <a-progress type="circle" :percent="infoData.usedCpu / infoData.totalCpu * 100" class="info-card">
              <template #format="">
                <span style="color: #333">{{(infoData.usedCpu / infoData.totalCpu * 100).toFixed(2)}}%</span>
                <!-- <span style="color: #333">使用{{item.user}}</span> -->
              </template>
            </a-progress>
            <div>
              {{infoData.cpuCount}} 核心
            </div>
          </el-col>

          <el-col :md="6" :sm="12" :xs="24">
            <div>内存使用率</div>
            <a-progress type="circle" :percent="infoData.usedMemory / infoData.totalMemory * 100" class="info-card">
              <template #format="">
                <span style="color: #333">{{(infoData.usedMemory / infoData.totalMemory * 100).toFixed(2)}}%</span>
                <!-- <span style="color: #333">使用{{item.user}}</span> -->
              </template>
            </a-progress>
            <div>
              {{(infoData.usedMemory).toFixed(1)}}GB / {{(infoData.totalMemory).toFixed(2)}}GB
            </div>
          </el-col>
          
          <el-col :md="6" :sm="12" :xs="24" v-for="(item,index) in infoData.disks" :key="index">
            <div>磁盘使用率（{{item.name}}）</div>
            <a-progress type="circle" :percent="item.used / item.total * 100" class="info-card">
              <template #format="">
                <span style="color: #333">{{(item.used / item.total * 100).toFixed(2)}}%</span>
                <!-- <span style="color: #333">使用{{item.user}}</span> -->
              </template>
            </a-progress>
            <div style="font-size: 14px">
              {{(item.used).toFixed(2)}}GB / {{(item.total).toFixed(2)}}GB
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-row>
        <el-col :span="12">
          <el-card class="box-card" body-style="{ width:100% }" ref="chartCard">
            <div slot="header" class="clearfix">
              <span>CPU使用率统计图</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="click()">刷新</el-button> -->
            </div>
            <div id="cpuChart" style="width: 100%;height: 300px;">
              
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" body-style="{ width:100% }" ref="chartCard">
            <div slot="header" class="clearfix">
              <span>内存使用率统计图</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="click()">刷新</el-button> -->
            </div>
            <div id="memoryChart" style="width: 100%;height: 300px;">
              
            </div>
          </el-card>
        </el-col>
      </el-row>

    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  name: "SystemInfo",
  data() {
    return {
      API: this.$api.SYSTEM_API,
      timer: null,
      cpuChart: null,
      cpuChartData: [],
      memoryChart: null,
      memoryChartData: [],
      infoData: {
        osName: "",
        runDateTime: 1076490,
        totalMemory: 100.00,
        usedMemory: 13.27,
        totalCpu: 100.00,
        usedCpu: 67.00,
        cpuCount: 2,
        disks: [
          { name: "", total: 156.12, used: 30.26},
          { name: "", total: 256.12, used: 100.26}
        ]
      },
    }
  },
  methods: {
    querySystemData() {
      this.$axios.get(this.API, null, false).then(res => {
        if (res.code == 200) {
          this.infoData = res.data;
          // console.log(this.infoData);
          // console.log(this.infoData.disks);
          
          // 构建CPU统计图
          this.cpuChartData.push({ name: new Date().getSeconds(), value: res.data.usedCpu });
          this.cpuChart.setOption({
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.cpuChartData.map(el => el.name)
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: this.cpuChartData.map(el => el.value),
              type: 'line',
              areaStyle: {}
            }]
          });

          this.memoryChartData.push({ 
            name: new Date().getSeconds(), 
            value: (res.data.usedMemory * 1024) 
          });
          this.memoryChart.setOption({
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.memoryChartData.map(el => el.name)
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: this.memoryChartData.map(el => el.value),
              type: 'line',
              areaStyle: {}
            }]
          });
        }
      }).catch(err => {

      });
    }
  },
  mounted() {
    this.cpuChart = this.$chart.cpuChart("cpuChart");
    this.memoryChart = this.$chart.cpuChart("memoryChart");
    this.querySystemData();
    this.timer = setInterval(() => {
      // console.log(this.$chart.systemInfoChart())
      this.querySystemData();
    }, 500 * 10)
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.info-card {
  margin: 10px auto;
}

.details i.fa {
  font-size: 50px;
  padding: 10px 15px;
  margin-right: 10px;
  border-radius: 10px;
}
</style>