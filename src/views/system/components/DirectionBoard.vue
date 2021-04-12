<template>
  <div class="box" v-bind:style="{ background: boxColor[this.id % 5] }">
    <h1>{{ name }}</h1>
    <p>{{ description }}</p>
    <div class="tooltip">
      <i class="el-icon-edit-outline" @click.prevent.stop="modify"></i>
      <span class="tooltiptext">点我编辑</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DirectionBoard",
  props: {
    id: Number,
    name: String,
    description: String,
  },
  data() {
    return {
      boxColor: [
        "linear-gradient(to right, #fb7299, #ff5c7c)",
        "linear-gradient(to right, #fb72e9, #ff5ce9)",
        "linear-gradient(to right, #bd72fb, #b05cff)",
        "linear-gradient(to right, #8672fb, #675cff)",
        "linear-gradient(to right, #51c464, #45ad3c)",
      ],
      oldData: {
        id: this.id,
        name: this.name,
        description: this.description,
      },
    };
  },
  methods: {
    modify() {
      this.$emit("modifyThis", this.oldData);
    },
  },
};
</script>

<style scoped>
.box {
  width: 300px;
  height: 200px;
  display: flex;
  flex-flow: column;
  text-align: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  background-image: linear-gradient(to right, #51c464, #45ad3c);
  transition: all 0.5s;
  margin: 30px 22px;
  overflow: hidden;
  padding-top: 60px;
}

.box::after {
  content: "";
  position: relative;
  top: 100px;
  left: 0;
  width: 600px;
  height: 70px;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(255, 255, 255, 0.3),
    rgba(0, 0, 0, 0)
  );
  transform: rotate(-45deg) translate(0, -360px);
}

.box:hover {
  margin-top: -20px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

.box:hover::after {
  transition: 1s;
  transform: rotate(-45deg) translate(0, 100px);
}

.tooltip {
  position: relative;
  left: 130px;
  bottom: 170px;
}

.el-icon-edit-outline {
  font-size: 24px;
}

/* Tooltip 文本 */
.tooltip > .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* 定位 */
  position: absolute;
  top: -5px;
  right: 55%;
  z-index: 1;
}

/* 鼠标移动上去后显示提示框 */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>