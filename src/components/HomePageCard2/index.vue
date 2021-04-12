<template>
  <div>
    <div class="card">
      <div class="leftBox">
        <p>研发团队</p>
        <ul class="team">
          <li>
            <span class="team-shadow"><i></i></span>
            <span>策划&研发</span>
            <span>K.J</span>
          </li>
          <li>
            <span class="team-shadow"><i></i></span>
            <span>设计</span>
            <span>K.J</span>
          </li>
          <li>
            <span class="team-shadow"><i></i></span>
            <span>致谢</span>
            <span>杭州师范大学密码学实验室</span>
            <span>山东青岛大学OJ研发组</span>
          </li>
        </ul>
      </div>
      <div class="rightBox">
        <img src="@/assets/test.png" alt="" />
        <p>旧岛小程序</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePageCard2",
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  padding: 22px;
  background-color: #f17f42;
  color: #ffeee4;
  margin-top: 30px;
}

.leftBox > p {
  font-size: 22px;
  font-weight: 900;
}

.leftBox > ul > li {
  list-style: none;
}

.team-shadow {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  width: 14px;
  height: 14px;
  border-radius: 14px;
  background-color: #fff;
  -webkit-transform: translateY(2px);
  transform: translateY(2px);
}

.team-shadow > i {
  position: absolute;
  top: 25%;
  left: 25%;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background-color: #ffb9a4;
}

.leftBox > ul > li > span {
    margin-left: 10px;
}

.rightBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 60px;
    position: relative;
    top: 20px;
}

.rightBox > img {
    width: 75px;
}

.team {
    margin: 0;
    padding: 0;
}
</style>