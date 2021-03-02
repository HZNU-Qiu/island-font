<template>
  <div class="block">
    <div class="directionList">
      <p style="color: #3465a2; font-weight: bold">方向:</p>
      <ul class="directions">
        <li
          @click="directionAllActive"
          class="item"
          :class="{ on: directionActive === -1 }"
        >
          全部
        </li>
        <li
          @click="directionsActive(index)"
          class="item"
          :class="{ on: directionActive === index }"
          v-for="(sample, index) in directions"
          :key="index"
        >
          {{ sample.label }}
        </li>
      </ul>
    </div>
    <div class="categoryList">
      <p style="color: #3465a2; font-weight: bold">类别:</p>
      <ul class="categorys">
        <li
          @click="categoryAllActive"
          class="item"
          :class="{ on: categoryActive === -1 }"
        >
          全部
        </li>
        <li
          @click="categorysActive(index)"
          class="item"
          :class="{ on: categoryActive === index }"
          v-for="(sample, index) in categorys"
          :key="index"
        >
          {{ sample.label }}
        </li>
      </ul>
    </div>
    <div class="difficultyList">
      <p style="color: #3465a2; font-weight: bold">难度:</p>
      <ul class="difficultys">
        <li
          @click="difficultyAllActive"
          class="item"
          :class="{ on: difficultyActive === -1 }"
        >
          全部
        </li>
        <li
          @click="difficultysActive(index)"
          class="item"
          :class="{ on: difficultyActive === index }"
          v-for="(sample, index) in difficulty"
          :key="index"
        >
          {{ sample }}
        </li>
      </ul>
    </div>
    <div class="difficultyList">
      <p style="color: #3465a2; font-weight: bold">题型:</p>
      <ul class="difficultys">
        <li
          @click="typeAllActive"
          class="item"
          :class="{ on: typeActive === -1 }"
        >
          全部
        </li>
        <li
          @click="typesActive(index)"
          class="item"
          :class="{ on: typeActive === index }"
          v-for="(sample, index) in type"
          :key="index"
        >
          {{ sample }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getTree } from "@/api/System/courseDirection";
export default {
  name: "CategoryList",
  data() {
    return {
      directionActive: -1,
      categoryActive: -1,
      typeActive: -1,
      difficultyActive: -1,
      all: [],
      directions: [],
      categorys: [],
      type: ["单选题", "多选题", "判断题"],
      difficulty: ["简单", "中等", "困难"],
      options: {
        flag: "",
        directionId: -1,
        categoryId: -1,
        difficultyId: -1,
        type: -1,
      },
    };
  },
  methods: {
    directionAllActive() {
      this.directions = [];
      this.categorys = [];
      this.all.map((direction) => {
        this.directions.push(direction);
        direction.children.map((category) => {
          this.categorys.push(category);
        });
      });
      this.options.flag = 1;
      this.options.categoryId = -1;
      this.options.directionId = -1;
      this.categoryActive = -1;
      this.directionActive = -1;
      this.$emit("changed", this.options);
    },
    directionsActive(index) {
      this.categorys = this.all[index].children;
      this.directionActive = index;
      this.options.flag = 1;
      this.options.categoryId = -1;
      this.options.directionId = this.directions[index].value;
      this.categoryActive = -1;
      this.$emit("changed", this.options);
    },
    categoryAllActive() {
      this.options.flag = 2;
      this.options.categoryId = -1;
      this.categoryActive = -1;
      this.$emit("changed", this.options);
    },
    categorysActive(index) {
      this.categoryActive = index;
      this.options.flag = 2;
      this.options.categoryId = this.categorys[index].value;
      this.$emit("changed", this.options);
    },
    typeAllActive() {
      this.typeActive = -1;
      this.options.flag = 4;
      this.options.type = -1;
      this.$emit("changed", this.options);
    },
    typesActive(index) {
      this.typeActive = index;
      this.options.flag = 4;
      this.options.type = index + 1;
      this.$emit("changed", this.options);
    },
    difficultyAllActive() {
      this.difficultyActive = -1;
      this.options.flag = 3;
      this.options.difficultyId = -1;
      this.$emit("changed", this.options);
    },
    difficultysActive(index) {
      this.difficultyActive = index;
      this.options.flag = 3;
      this.options.difficultyId = index + 1;
      this.$emit("changed", this.options);
    },
  },
  async created() {
    try {
      let res = await getTree();
      let data = res.data;
      this.all = data;
      data.map((direction) => {
        this.directions.push(direction);
        direction.children.map((category) => {
          this.categorys.push(category);
        });
      });
    } catch (error) {
      console.log(error);
      this.$message.error("服务异常");
    }
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.block {
  padding: 10px 20px;
  width: 100%;
  background: #eeeeee;
}

.on {
  border: 1px solid #3465a2;
  color: #3465a2;
  background: rgba(12, 35, 138, 0.05);
  border-radius: 4px;
}

.directionList,
.categoryList,
.difficultyList {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
}

.directions,
.categorys,
.difficultys {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
}

.item {
  list-style: none;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  padding: 8px;
  margin: 0 4px;
  cursor: pointer;
}
</style>