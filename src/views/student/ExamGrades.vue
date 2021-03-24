<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>我的成绩</p>
        </div>
      </div>
      <!--  -->
      <div class="main">
        <el-row :gutter="20">
          <el-col
            :span="18"
            style="
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            "
          >
            <div v-for="(sample, index) in grades" :key="index" class="grade">
              <div class="left">
                <div class="point">
                  <p>{{ sample.grade }}</p>
                </div>
              </div>
              <div class="mid">{{ sample.name }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="pieChart">
              <PieChart
                :chartData="chartData"
                :options="chartOptions"
              ></PieChart>
              <p>成绩统计数据</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserRecord } from "@/api/Student/attendExam.js";
import PieChart from "@/components/Charts/ExperimentFeedBackChart/index.js";
export default {
  components: {
    PieChart,
  },
  data() {
    return {
      grades: [],
      chartData: null,
      chartOptions: {
        hoverBorderWidth: 20,
        responsive: true,
      },
    };
  },
  async created() {
    try {
      let res = await getUserRecord();
      let data = res.data;
      this.grades = data.grades;
      this.chartData = data.chartData;
    } catch (error) {}
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.panel {
  border: 1px solid #edecec;
  border-radius: 6px;
  margin: 5px;
  padding: 10px;
  box-shadow: 0px 0px 12px 1px #aaa;
  min-height: 800px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 30px;
  border-bottom: 1px solid #dae1ed;
}

.header-left > p {
  font-size: 24px;
  font-weight: 500;
  color: #3465a2;
}

.grade {
  width: 200px;
  height: 280px;
  border: 5px solid #76fab0;
  background-color: #53ee92;
  margin: 20px;
  display: flex;
  flex-direction: row;
  color: #05923d;
}

.left {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  width: 10%;
  font-weight: 800;
  font-size: 24px;
}

.left > .point {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 100px 0 0 100px;
  border-color: transparent transparent transparent #d2dae2;
  position: relative;
  top: 160px;
  left: 36px;
}

.point > p {
  position: relative;
  font-size: 32px;
  font: bold;
  bottom: 80px;
  right: 95px;
  color: rgb(255, 255, 255);
}

.mid {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 28px;
  color: #fff;
}

.pieChart {
  box-shadow: 2px 4px 12px 5px rgba(75, 75, 75, 0.25);
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
}

.pieChart > p {
  color: #3465a2;
  margin-left: 80px;
  font-size: 26px;
}
</style>