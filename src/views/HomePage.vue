<template>
  <div class="panel">
    <el-row :gutter="20">
      <el-col :span="12">
        <HomePageCard1></HomePageCard1>
      </el-col>
      <el-col :span="12">
        <HomePageCard2></HomePageCard2>
      </el-col>
    </el-row>
    <!--  -->
    <el-row :gutter="10">
      <el-col :span="6">
        <HomePageTag :title="tags[0].title" :data="tags[0].data"></HomePageTag>
      </el-col>
      <el-col :span="6">
        <HomePageTag :title="tags[1].title" :data="tags[1].data"></HomePageTag>
      </el-col>
      <el-col :span="6"
        ><HomePageTag :title="tags[2].title" :data="tags[2].data"></HomePageTag
      ></el-col>
      <el-col :span="6"
        ><HomePageTag :title="tags[3].title" :data="tags[3].data"></HomePageTag
      ></el-col>
    </el-row>
    <!--  -->
    <el-row>
      <el-col :span="6">
        <PersonalCard :info="info"></PersonalCard>
      </el-col>
      <el-col :span="18">
        <div class="chart">
          <LineChart :chart-data="chartData" :options="chartOptions"></LineChart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HomePageCard1 from "@/components/HomePageCard1/index.vue";
import HomePageCard2 from "@/components/HomePageCard2/index.vue";
import HomePageTag from "@/components/HomePageTag/index.vue";
import PersonalCard from "@/components/PersonalCard/index.vue";
import { getHomePageInfo } from "@/api/common.js";
import LineChart from "@/components/Charts/LoginLineChart/index.js";
export default {
  components: {
    HomePageCard1,
    HomePageCard2,
    HomePageTag,
    PersonalCard,
    LineChart,
  },
  data() {
    return {
      tags: [],
      info: {},
      chartData: null,
      chartOptions: {
        hoverBorderWidth: 20,
        maintainAspectRatio: false,
        responsive: true,
      },
    };
  },
  methods: {
    generateData() {
      let newArray = [];
      let newArray2 = [];
      for (let i = 0; i < 15; i++) {
        let randomValue = Math.floor(Math.random() * 10 + 20);
        let randomValue1 = Math.floor(Math.random() * 5 + 20);
        newArray.push(randomValue);
        newArray2.push(randomValue1);
      }

      this.chartData = {
        labels: [
          "-14Day",
          "-13Day",
          "-12Day",
          "-11Day",
          "-10Day",
          "-9Day",
          "-8Day",
          "-7Day",
          "-6Day",
          "-5Day",
          "-4Day",
          "-3Day",
          "-2Day",
          "-1Day",
          "0Day",
        ],
        datasets: [
          {
            label: "教师登录次数",
            backgroundColor: "rgba(175, 20, 99, 0.1)",
            borderColor: "#f87979",
            data: newArray,
          },
          {
            label: "学生登录次数",
            backgroundColor: "rgba(20, 200, 99, 0.1)",
            borderColor: "#4CC0C0",
            data: newArray2,
          },
        ],
      };
    },
  },
  async created() {
    let res = await getHomePageInfo();
    let infoData = res.data;
    this.tags = infoData.tagData;
    this.info = infoData.info;
    this.info.avatar = "http://localhost:8020" + this.$store.getters.avatar;
    this.generateData();
  },
};
</script>

<style scoped>
.panel {
  background-color: #f9fafb;
  padding-bottom: 200px;
}

.chart {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-top: 30px;
  margin-left: 30px;
}
</style>