<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>服务器监控</p>
        </div>
      </div>
      <!--  -->
      <el-row class="main" :gutter="20">
        <el-col :span="8">
          <div class="detail">
            <div class="detailHeader">
              <img class="image" src="@/assets/ECS.png" alt="" />
              <!--  -->
              <div class="name">
                <p style="color: #409eff; font-size: 22px; font-weight: 900">
                  判题服务器
                </p>
                <p>Super Admin</p>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="detailBody">
              <p>服务器参数</p>
              <div class="dataset">
                <p class="items">服务器版本: {{ dataSet.judger_version }}</p>
                <p class="items" style="margin-left: 16px">
                  CPU占用: {{ dataSet.cpu }} %
                </p>
                <p class="items" style="margin-left: 16px">
                  内核数量: {{ dataSet.cpu_core }}
                </p>
                <p class="items" style="margin-left: 16px">
                  内存占用: {{ dataSet.memory }}%
                </p>
                <p class="items" style="margin-left: 32px">
                  主机ID: {{ dataSet.hostname }}
                </p>
              </div>
            </div>
          </div>
          <!--  -->
        </el-col>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <HomePageTag :title="'部署服务器数'" :data="1"></HomePageTag>
            </el-col>
            <el-col :span="8">
              <HomePageTag :title="'测试仓库容量(GB)'" :data="20"></HomePageTag>
            </el-col>
            <el-col :span="8">
              <HomePageTag :title="'已持续运行了(天)'" :data="56"></HomePageTag>
            </el-col>
          </el-row>
          <div class="chart">
            <LineChart
              :chart-data="chartData"
              :options="chartOptions"
            ></LineChart>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { PingJudgeServer } from "@/api/common.js";
import HomePageTag from "@/components/HomePageTag";
import LineChart from "@/components/Charts/LoginLineChart/index.js";
export default {
  components: {
    HomePageTag,
    LineChart,
  },
  data() {
    return {
      dataSet: {
        cpu: -1,
        cpu_core: 0,
        hostname: "",
        judger_version: "",
        memory: -1,
      },
      chartData: null,
      chartOptions: {
        hoverBorderWidth: 20,
        maintainAspectRatio: false,
        responsive: true,
      },
    };
  },
  methods: {
    async generateData() {
      let res = await PingJudgeServer();
      this.dataSet = res.data.data;
      let newArray = [];
      let newArray2 = [];
      for (let i = 0; i < 12; i++) {
        let randomValue = Math.floor(Math.random() * 3.1 + 10);
        let randomValue1 = Math.floor(Math.random() * 5 + 60);
        newArray.push(randomValue);
        newArray2.push(randomValue1);
      }
      this.chartData = {
        labels: [
          "-24h",
          "-22h",
          "-20h",
          "-12h",
          "-6h",
          "-4h",
          "-1h",
          "-30min",
          "-10min",
          "-1min",
          "0s",
        ],
        datasets: [
          {
            label: "CPU占用",
            backgroundColor: "rgba(175, 20, 99, 0.1)",
            borderColor: "#f87979",
            data: newArray,
          },
          {
            label: "内存占用",
            backgroundColor: "rgba(20, 200, 99, 0.1)",
            borderColor: "#4CC0C0",
            data: newArray2,
          },
        ],
      };
    },
    updateData() {
      if (this && !this._isDestroyed) {
        this.generateData();
        setTimeout(this.updateData, 5000);
      }
    },
  },
  async created() {
    try {
      let res = await PingJudgeServer();
      this.dataSet = res.data.data;
      this.updateData();
    } catch (error) {}
  },
};
</script>

<style scoped>
.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 5px;
  padding: 10px 10px 100px 10px;
  min-height: 600px;
  box-shadow: 0px 0px 12px 1px #aaa;
  background-color: #ecebeb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #dae1ed;
  background-color: #fcfcfc;
}

.header-left > p {
  font-size: 24px;
  font-weight: 500;
  color: #3465a2;
}

.main {
  padding-top: 30px;
}

.detail {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.detail .detailHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.detail .detailHeader p {
  margin: 10px 0 0 10px;
}

.dataset {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
}

.dataset .items {
  color: rgb(82, 82, 82);
}

.chart {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  margin: 30px 0 0 10px;
}
</style>