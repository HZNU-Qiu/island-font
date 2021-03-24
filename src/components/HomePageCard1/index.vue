<template>
  <div>
    <div class="card">
      <h1>欢迎来到旧岛LMS</h1>
      <p>请记住如下网址,以便找到归乡の路</p>
      <div class="link">
        <p>KingJade.icu</p>
      </div>
      <div>
        <img class="bgImg" src="@/assets/card1-bg.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePageCard1",
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.card {
  border-radius: 8px;
  padding: 25px;
  background-color: #4577ff;
  color: #fff;
  margin: 30px;
}

.bgImg {
  position: absolute;
  left: 220px;
  top: 92px;
  width: 393px;
  height: 121px;
}

.link {
  width: 160px;
  height: 22px;
  background: #2c5fe9;
  border-radius: 11px;
  text-align: center;
  line-height: 20px;
  color: #fff;
}
</style>