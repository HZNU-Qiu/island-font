<template>
  <div>
    <div class="item">
      <div class="itemDetail">
        <div class="detailBox">
          <div class="title">{{ title }}</div>
          <div class="borderLine"></div>
          <div class="data">{{ data }}</div>
        </div>
      </div>
      <div class="itemIcon">
        <img src="@/assets/icon.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePageTag",
  props: {
    title: String,
    data: Number,
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.item {
  display: flex;
  width: 90%;
  height: 100%;
  background: #fff;
  box-shadow: 0 2px 14px 0 #f3f3f3;
  border-radius: 8px;
  margin-left: 30px;
}

.itemDetail {
  flex: 1;
}

.detailBox {
  margin: 12px 0 0 30px;
}

.title {
  margin-bottom: 2px;
  height: 20px;
  line-height: 20px;
  color: #495468;
  font-size: 14px;
  font-weight: 400;
}

.borderLine {
  width: 46px;
  height: 2px;
  background: #495468;
}

.data {
  margin-top: 7px;
  height: 48px;
  font-size: 32px;
  color: #495468;
  line-height: 38px;
  letter-spacing: 2px;
}

.itemIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  background: rgba(69, 119, 255, 0.1);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.itemIcon > img {
  width: 28px;
  height: 33px;
}
</style>