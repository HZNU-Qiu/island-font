<template>
  <div>
    <div class="card" :style="styleStr">
      <div class="left">
        <p style="margin: 0">{{ difficultyLabel }}</p>
        <div class="point">
            <p>{{point}}</p>
        </div>
      </div>
      <div class="mid">{{ title }}</div>
      <div class="tail">
        <p>{{ creator }}</p>
        <div class="btns">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="right"
          >
            <i @click="handleModify" class="el-icon-edit-outline"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="添加试题"
            placement="right"
          >
            <i @click="handleAddEx" class="el-icon-plus"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="right"
          >
            <i class="el-icon-close"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaperCard",
  props: {
    id: Number,
    difficulty: Number,
    title: String,
    creator: String,
    point: Number,
    index: Number
  },
  data() {
    return {
      colors: [
        { b: "#76fab0", bc: "rgb(29, 180, 90);", c: "rgb(227, 227, 227);" },
        { b: "#E58E8D", bc: "#EB5151", c: "rgb(227, 227, 227);" },
        { b: "rgb(227, 204, 214)", bc: "#FB7FB8", c: "rgb(227, 227, 227);" },
        { b: "#A077FA", bc: "#522EE8", c: "rgb(227, 227, 227);" },
        { b: "#DDBF5F", bc: "#C58324", c: "rgb(227, 227, 227);" },
      ],
    };
  },
  computed: {
    difficultyLabel: function () {
      switch (this.difficulty) {
        case 1:
          return "简";
        case 2:
          return "中";
        case 3:
          return "难";
      }
    },
    styleStr: function () {
      let index = this.id % 5;
      let str = `border: 5px solid ${this.colors[index].b};
        background-color: ${this.colors[index].bc};
        color: ${this.colors[index].c};`;
      return str;
    },
  },
  methods: {
    handleModify() {
      this.$emit("modifyThis", this.index);
    },
    handleAddEx() {
      this.$emit("addExForThis", this.index);
    }
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.card {
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
  width: 25%;
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
  top: 5px;
  left: 22px;
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
  flex-direction: column;
  writing-mode: vertical-lr;
  width: 50%;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 30px;
}

.tail {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  width: 25%;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  font-weight: 400;
  font-size: 20px;
}

.tail > p {
  writing-mode: vertical-lr;
}
.tail > div {
  writing-mode: vertical-lr;
}
.btns > i {
  cursor: pointer;
  margin: 2px 0;
}
</style>