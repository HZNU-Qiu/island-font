<template>
  <div class="tagBox">
    <div class="iconBox">
      <img :src="'http://localhost:8020' + icon" alt="哦豁,图片莫得了" />
    </div>
    <i class="el-icon-edit-outline" @click="goToEdit"></i>
    <div class="desc">
      <p>{{ tagName }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagBox",
  props: {
    tagName: String,
    icon: String,
    id: Number,
  },
  methods: {
    goToEdit() {
      this.$emit("editThis", {
        tagName: this.tagName,
        icon: this.icon,
        id: this.id,
      });
    },
  },
};
</script>

<style scoped>
.tagBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 90px;
  margin: 20px 0 20px 0;
  cursor: pointer;
}

.iconBox {
  display: flex;
  width: 100px;
  height: 100px;
  box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
    -18px -18px 30px rgba(255, 255, 255, 1);
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #efeeee;
  transition: box-shadow 0.2s ease-out;
  position: relative;
  padding: 32px 0;
}

.iconBox:hover {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 rgba(255, 255, 255, 1),
    inset 18px 18px 30px rgba(0, 0, 0, 0.1),
    inset -18px -18px 30px rgba(255, 255, 255, 1);
  transition: box-shadow 0.2s ease-out;
}

.iconBox:hover img {
  width: 62px;
  transition: width 0.2s ease-out;
}

.tagBox:hover .desc {
  opacity: 1;
  bottom: 15px;
}

.iconBox > img {
  display: block;
  height: 64px;
  transition: width 0.2s ease-out;
}

.desc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
  color: slategray;
  font-weight: 400;
  margin-top: 0;
  position: relative;
  bottom: 50px;
  opacity: 0;
  transition: bottom 0.3s ease, opacity 0.3s ease;
}

.el-icon-edit-outline {
  color: #464646;
  position: relative;
  bottom: 95px;
  left: 35px;
}

.desc > p {
  margin: 0;
}
</style>