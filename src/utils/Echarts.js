/**
 * 各种画echarts图表的方法都封装在这里
 * 注意：这里echarts没有采用按需引入的方式，只是为了方便学习
 */

import echarts from 'echarts'

const install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          resize: function (id) {
            echarts.init(document.getElementById(id)).resize();
          },
          //画一条简单的线
          homeChart: function (id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();

            const optionData = {
              title: {
                text: ''
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                name: '邮件营销',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: '联盟广告',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: '视频广告',
                type: 'line',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                name: '直接访问',
                type: 'line',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320]
              },
              {
                name: '搜索引擎',
                type: 'line',
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
              }
              ]
            };
            this.chart.setOption(optionData);
            window.onresize = () => {
              this.chart.resize();
            }
            setTimeout(() => {
              this.chart.resize(chart);
            }, 200)
          },
          cpuChart: function (id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();

            var data = [
              { name: "1", value: 820 },
              { name: "2", value: 932 }, 
              { name: "3", value: 901 }, 
              { name: "4", value: 934 }, 
              { name: "5", value: 1290 }, 
              { name: "6", value: 1330 }, 
              { name: "7", vlaue: 1320 }
            ]
            data = []

            var optionData = {
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.map(el => el.name)
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: data.map(el => el.value),
                type: 'line',
                areaStyle: {}
              }]
            };


            this.chart.setOption(optionData);
            window.onresize = () => {
              this.chart.resize();
            }
            setTimeout(() => {
              this.chart.resize(id);
            }, 200)

            return this.chart;
          },
          memoryChart: function (id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();

            var data = []

            var optionData = {
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.map(el => el.name)
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: data.map(el => el.value),
                type: 'line',
                areaStyle: {}
              }]
            };


            this.chart.setOption(optionData);
            window.onresize = () => {
              this.chart.resize();
            }
            setTimeout(() => {
              this.chart.resize(id);
            }, 200)

            return this.chart;
          }
        }
      }
    }
  })
}

export default {
  install
}
