<template>
  <div class="padding-10-h home-page" v-loading="isLoading" >
    <el-row :gutter="10" type="flex" justify="space-around" class="" v-if="user">
      <el-col :md="12" :sm="24">
        <el-row type="flex" justify="center" align="middle" :gutter="0" class="padding-10 home-panel">
          <el-col :md="6" :sm="4" :xs="6">
            <!-- <el-avatar v-if="user.avatar" :size="100" :src="$tools.buildAvatar(user.avatar)" > -->
              <!-- <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/> -->
            <!-- </el-avatar> -->
            <img :src="$tools.buildAvatar(user.avatar)" alt="" width="90%" style="border-radius: 50%;" />
          </el-col>
          <el-col :md="14" :sm="16" :xs="24" class="user-info">
            <p>{{hello()}}<br>{{quote}}</p>
            <!-- <p style="font-size: 14px;">
              {{user.nickname ? user.nickname : user.username}}
              <span style="padding: 0 5px;">|</span>
              管理员
            </p> -->
            <p style="margin: 15px 0;"></p>
            <p style="font-size: 14px;">
              上次登录时间：{{ user.userLoginTracks.length > 0 ? user.userLoginTracks[0].loginIp : "127.0.0.1" }}
            </p>
            <p style="font-size: 14px;">
              上次登录时间：{{ user.userLoginTracks.length > 0 ? user.userLoginTracks[0].loginTime : "0000-00-00 00:00:00" }}
            </p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="12" :sm="24">
        <el-row class="padding-10 home-panel">
          <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type" style="margin: 0 5px;">{{ tag.name }}</el-tag>
          <p style="text-indent: 2rem;">
            <b>舔狗日记：</b>
            {{diary}}
            </p>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="10" justify="space-around" align="middle" class="details">
      <el-col :md="6" :sm="12" :xs="24">
        <el-row type="flex" justify="center" align="middle" class="padding-10 home-panel">
          <i class="fa fa-address-card" style="color: #40c9c6;background: #e3f8fa;"></i>
          <span>
            <b>注册用户：</b>
            100
          </span>
        </el-row>
      </el-col>
      <el-col :md="6" :sm="12" :xs="24">
        <el-row type="flex" justify="center" align="middle" class="padding-10 home-panel">
          <i class="fa fa-comments" style="color: #be63f9;background: #f5e6fe;"></i>
          <span>
            <b>总评论数：</b>
            100
          </span>
        </el-row>
      </el-col>
      <el-col :md="6" :sm="12" :xs="24">
        <el-row type="flex" justify="center" align="middle" class="padding-10 home-panel">
          <i class="fa fa-paw" style="color: #FF9E3D;background: #FFEAD6;"></i>
          <span>
            <b>今日访问：</b>
            100
          </span>
        </el-row>
      </el-col>
      <el-col :md="6" :sm="12" :xs="24">
        <el-row type="flex" justify="center" align="middle" class="padding-10 home-panel">
          <i class="fa fa-heartbeat" style="color: #fc573b;background: #ffe6e2;"></i>
          <span>
            <b>风险警告：</b>
            100
          </span>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" body-style="{width:100%}" ref="chartCard">
          <div slot="header" class="clearfix">
            <span>近期访问趋势</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="click()">刷新</el-button>
          </div>
          <div id="chart" style="width: 100%;height: 300px;">
            
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      user: {
        userLoginTracks: [],
      },
      quote: "今天又列了几个任务清单呢😀",
      diary: "今天我还是照常给你发消息，汇报日常工作，你终于回了我四个字：“嗯嗯，好的”， 你开始愿意敷衍我了，我太感动了受宠若惊。我愿意天天给你发消息。就算你天天骂我，我也不觉得烦。",
      tags: [
        { name: '自由', type: 'success' },
        { name: '快乐', type: 'danger' },
        { name: '享受', type: 'warning' },
      ],
    };
  },
  methods: {
    hello: function () {
      const hello = [
        "午夜了，{}", "深夜了，{}", "凌晨了，{}",
        "太阳升起来了，{}", "早上好，{}，记得吃早餐哦", "早上好，{}，愉快的一天开始了",
        "中午好，{}，要午睡才能事半功倍呢", "下午好，{}，工作一天了，适当放松下", "太阳都快下山了，{}，你还没下班吗",
        "晚上好，{}", "{}记得早点休息", "你可真是熬夜小王子呢，{}"
      ]
      const i = parseInt(new Date().getHours() / 2);
      return hello[i].replace("{}", this.user.nickname ? this.user.nickname : this.user.username);
    },
    getQuote() {
      // this.$axios.get(this.$api.QUOTE).then(res => {
      //   // console.log(res);
      //   this.quote = res;
      // })
    },
    getDiary() {
      this.$axios.get(this.$api.HUMBLE_DOG_DIARY1).then(res => {
        // console.log(res);
        this.diary = res;
      })
    },
  },
  computed: {
    
  },
  filters: {
    buildAvatar(avatar) {
      // alert(avatar)
      if (avatar == undefined) {
        return "";
      }
      console.log(this)
      return this.$api.SERVER_UPLOAD + this.$tools.buildAvatar(avatar);
    }
  },
  mounted() {
    // this.user = this.$store.state.user;
    // console.log(this.$store.state.user)
    this.$chart.homeChart('chart');
    this.getQuote();
    this.getDiary();
    console.log(this.$api)
    let timer = setInterval(() => {
      if (this.$store.state.user) {
        clearInterval(timer);
        this.user = this.$store.state.user;
        console.log(this.user)
        this.isLoading = false;
      }
    }, 50);
    // console.log(this.$refs.chartCard)
  }
};
</script>

<style scoped="scoped">
.home-panel {
  background: #fff;
  height: 100%;
}

.user-info > p {
  margin: 5px 0;
}

.user-info > p:nth-child(n + 2) {
  color: #00000073;
}

.details i.fa {
  font-size: 50px;
  padding: 10px 15px;
  margin-right: 10px;
  border-radius: 10px;
}

.el-col {
  border-radius: 5px;
  margin: 5px 0;
}

#chart {
  width: 200px;
}
</style>
