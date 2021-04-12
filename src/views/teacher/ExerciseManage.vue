<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>理论练习题库</p>
        </div>
      </div>
      <div class="main">
        <CategoryList @changed="filterExercises"></CategoryList>
        <div class="main-header">
          <div style="display: flex; flex-direction: row; align-items: center">
            <p style="color: #3465a2; font-weight: bold">筛选:</p>
            <ul class="filter">
              <li @click="listAll" class="item" :class="{ on: isAll === 1 }">
                全部题目
              </li>
              <li @click="listMine" class="item" :class="{ on: isAll === 2 }">
                我发布的题目
              </li>
              <li @click="listDraft" class="item" :class="{ on: isAll === 3 }">
                我的草稿箱
              </li>
            </ul>
          </div>
          <el-button
            @click="toExerciseEditor(0)"
            icon="el-icon-plus"
            type="primary"
            plain
            >创建新题目</el-button
          >
        </div>
        <div class="pageBox">
          <el-pagination
            @current-change="currentPageChanged"
            background
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
        <div class="exercisesPanel">
          <div v-show="exercises.length === 0" class="noneBox">
            还没有相关题目哦,赶紧去添加吧
          </div>
          <ExerciseCard
            v-for="(sample, index) in exercises"
            :key="index"
            :data="sample"
            :isMine="parseInt(options.filter)"
          ></ExerciseCard>
        </div>
        <div class="pageBox">
          <el-pagination
            @current-change="currentPageChanged"
            background
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import ExerciseCard from "./components/ExerciseCard";
import { getByConditions } from "@/api/exercise";
export default {
  components: {
    CategoryList,
    ExerciseCard,
  },
  data() {
    return {
      isAll: 1,
      total: 0,
      exercises: [],
      options: {
        directionId: -1,
        categoryId: -1,
        difficulty: -1,
        type: -1,
        filter: 1,
        current: 1,
      },
    };
  },
  methods: {
    async listAll() {
      this.isAll = 1;
      this.options.filter = 1;
      try {
        let res = await getByConditions(this.options);
        this.total = res.data.total;
        this.exercises = res.data.list;
      } catch (error) {}
    },
    async listMine() {
      this.isAll = 2;
      this.options.filter = 2;
      try {
        let res = await getByConditions(this.options);
        this.total = res.data.total;
        this.exercises = res.data.list;
      } catch (error) {}
    },
    async listDraft() {
      this.isAll = 3;
      this.options.filter = 3;
      try {
        let res = await getByConditions(this.options);
        this.total = res.data.total;
        this.exercises = res.data.list;
      } catch (error) {}
    },
    async filterExercises(params) {
      this.options.directionId = params.directionId;
      this.options.categoryId = params.categoryId;
      this.options.difficulty = params.difficultyId;
      this.options.type = params.type;
      try {
        let res = await getByConditions(this.options);
        this.total = res.data.total;
        this.exercises = res.data.list;
      } catch (error) {}
    },
    toExerciseEditor(id) {
      this.$router.push({
        path: "/exerciseManage/exerciseEdition",
        query: {
          id: id,
        },
      });
    },
    async currentPageChanged(val) {
      this.options.current = val;
      try {
        let res = await getByConditions(this.options);
        this.total = res.data.total;
        this.exercises = res.data.list;
      } catch (error) {}
    },
  },
  async created() {
    try {
      let filter = this.$route.query.filter;
      if (filter !== null && filter !== "" && filter !== undefined) {
        this.options.filter = filter;
        this.isAll = filter;
      }
      let res = await getByConditions(this.options);
      this.total = res.data.total;
      this.exercises = res.data.list;
    } catch (error) {
      this.$message.error("服务器异常");
    }
  },
};
</script>

<style scoped>
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

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background: #eee;
  padding: 10px 40px;
  border-top: 1px solid #ccc;
}

.filter {
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

.on {
  color: #3465a2;
  background: rgba(12, 35, 138, 0.05);
  border-radius: 4px;
}

.pageBox {
  margin: 10px 0;
  display: flex;
  align-items: center;
  background: #eee;
  width: 100%;
  padding: 10px 30px;
}

.exercisesPanel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exercisesPanel > .noneBox {
  width: 90%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: #aaa;
}
</style>