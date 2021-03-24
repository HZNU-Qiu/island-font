<template>
  <div>
    <div class="infoCard">
      <p style="color: #3465a2">个人信息</p>
      <div class="header">
        <img :src="info.avatar" alt="" />
      </div>
      <div class="details">
        <div class="detail1">
          <p style="color: #00c292; font-size: 28px;">{{ info.detail1.number }}</p>
          <p class="detailLabel">{{ info.detail1.label }}</p>
        </div>
        <div class="detail2">
          <p style="color: #fec108; font-size: 28px;">{{ info.detail2.number }}</p>
          <p class="detailLabel">{{ info.detail2.label }}</p>
        </div>
        <div class="detail3">
          <p style="color: #03a9f3; font-size: 28px;">{{ info.detail3.number }}</p>
          <p class="detailLabel">{{ info.detail3.label }}</p>
        </div>
      </div>
      <div class="footer">
        <el-tabs v-model="activeName">
          <el-tab-pane label= "最热课程" name="first">
            {{ info.hot }}
          </el-tab-pane>
          <el-tab-pane label="最新课程" name="second">
            {{ info.newest }}
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonalCard",
  props: {
    info: Object,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.infoCard {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  margin: 30px 0 0 30px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header > img {
  width: 150px;
  border-radius: 50%;
  box-shadow: 2px 2px 8px 9px rgba(75, 75, 75, 0.05);
}

.details {
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: space-between;
}

.detailLabel {
  color: #aaa;
  font-size: 14px;
}

</style>