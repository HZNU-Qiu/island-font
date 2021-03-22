<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>旧岛课程</p>
        </div>
        <div class="header-right">
          <el-input class="search_input" placeholder="输入课程名称筛选">
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>
        </div>
      </div>
      <!--  -->
      <div class="main">
        <div class="filterHeader">
          <div class="directionList">
            <p style="color: #3465a2; font-weight: bold">方向:</p>
            <ul class="directions">
              <li
                class="item"
                @click="directionActive = -1"
                :class="{ on: directionActive === -1 }"
              >
                全部
              </li>
              <li
                class="item"
                :class="{ on: directionActive === index }"
                @click="directionActive = index"
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
                class="item"
                @click="categoryActive = -1"
                :class="{ on: categoryActive === -1 }"
              >
                全部
              </li>
              <li
                class="item"
                @click="categoryActive = index"
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
                @click="difficultyActive = -1"
                class="item"
                :class="{ on: difficultyActive === -1 }"
              >
                全部
              </li>
              <li
                class="item"
                :class="{ on: difficultyActive === 1 }"
                @click="difficultyActive = 1"
              >
                简单
              </li>
              <li
                class="item"
                :class="{ on: difficultyActive === 2 }"
                @click="difficultyActive = 2"
              >
                中等
              </li>
              <li
                class="item"
                :class="{ on: difficultyActive === 3 }"
                @click="difficultyActive = 3"
              >
                困难
              </li>
            </ul>
          </div>
          <el-divider></el-divider>
          <div class="difficultyList">
            <p style="color: #3465a2; font-weight: bold">筛选:</p>
            <ul class="difficultys">
              <li
                @click="filterActive = 0"
                class="item"
                :class="{ on: filterActive === 0 }"
              >
                全部课程
              </li>
              <li
                class="item"
                :class="{ on: filterActive === 1 }"
                @click="filterActive = 1"
              >
                我的课程
              </li>
            </ul>
          </div>
          <el-pagination
            style="margin-left: 16px"
            background
            layout="total, prev, pager, next"
            :total="total"
            :page-size="20"
          >
          </el-pagination>
        </div>
        <!--  -->
        <div class="courses">
          <div
            class="courseCard"
            v-for="(sample, index) in courses"
            :key="index"
          >
            <div
              class="card-header"
              v-bind:style="{ background: boxColor[sample.id % 5] }"
            >
              <h1>{{ sample.name }}</h1>
            </div>
            <div class="card-body">
              <p>{{ sample.name }}</p>
            </div>
            <div class="card-footer">
              <p v-show="sample.difficulty === 1">初级</p>
              <p v-show="sample.difficulty === 2">中级</p>
              <p v-show="sample.difficulty === 3">高级</p>
              <el-button
                style="height: 40px; margin-top: 5px"
                size="mini"
                icon="el-icon-tickets"
                plain
                @click="toCourseDetail(sample.id)"
                type="primary"
                >查看详情</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTree } from "@/api/System/courseDirection";
import { filterCourse } from "@/api/Teacher/courseManage.js";
export default {
  data() {
    return {
      boxColor: [
        "linear-gradient(to right, #fb7299, #ff5c7c)",
        "linear-gradient(to right, #fb72e9, #ff5ce9)",
        "linear-gradient(to right, #bd72fb, #b05cff)",
        "linear-gradient(to right, #8672fb, #675cff)",
        "linear-gradient(to right, #51c464, #45ad3c)",
      ],
      filterTree: [],
      directions: [],
      categorys: [],
      directionActive: -1,
      categoryActive: -1,
      difficultyActive: -1,
      filterActive: 0,
      current: 1,
      total: 0,
      queryData: {
        directionId: -1,
        categoryId: -1,
        difficulty: -1,
        filter: 0,
        current: 1,
      },
      courses: [],
    };
  },
  watch: {
    directionActive: function () {
      this.categoryActive = -1;
      this.categorys = [];
      if (this.directionActive === -1) {
        this.queryData.directionId = -1;
        this.filterTree.map((item) => {
          item.children.map((x) => {
            this.categorys.push(x);
          });
        });
      } else {
        this.queryData.directionId = this.directions[
          this.directionActive
        ].value;
        this.categorys = this.directions[this.directionActive].children;
      }
      this.handleFilter();
    },
    categoryActive: function () {
      if (this.categoryActive !== -1) {
        this.queryData.categoryId = this.categorys[this.categoryActive].value;
      } else {
        this.queryData.categoryId = -1;
      }
      this.handleFilter();
    },
    difficultyActive: function () {
      this.queryData.difficulty = this.difficultyActive;
      this.handleFilter();
    },
    filterActive: function () {
      this.queryData.filter = this.filterActive;
      this.handleFilter();
    },
  },
  methods: {
    async handleFilter() {
      try {
        let res = await filterCourse(this.queryData);
        this.courses = res.data.rows;
        this.total = res.data.count;
      } catch (error) {}
    },
    toCourseDetail(id) {
      this.$router.push({
        path: '/student/courseCatalog',
        query: {
          id: id
        }
      })
    }
  },
  async created() {
    try {
      let res = await Promise.all([getTree(), filterCourse(this.queryData)]);
      let data = res[0].data;
      this.filterTree = data;
      data.map((direction) => {
        this.directions.push(direction);
        direction.children.map((category) => {
          this.categorys.push(category);
        });
      });
      let data1 = res[1].data.rows;
      this.total = res[1].data.count;
      this.courses = data1;
    } catch (error) {}
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

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

.header-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search_input >>> .el-input-group__append {
  border-left: 0;
  border-radius: 0 20px 20px 0;
  background: #3465a2;
  color: #dae1ed;
}

.search_input >>> .el-input__inner {
  width: 150px;
  border-radius: 20px 0 0 20px;
  transition: all 0.7s;
}

.search_input >>> .el-input__inner:focus {
  width: 300px;
  transition: all 0.7s;
}

.filterHeader {
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

.courseCard {
  width: 300px;
  height: 280px;
  box-shadow: 2px 2px 12px 5px rgba(12, 35, 138, 0.1);
  border-radius: 5px;
  margin: 30px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  border-radius: 5px 5px 0 0;
}

.card-body {
  height: 10%;
  padding-left: 10px;
  font-size: 16px;
}

.card-footer {
  padding: 0 10px;
  color: #aaa;
  display: flex;
  justify-content: space-between;
}

.courses {
  display: flex;
  flex-wrap: wrap;
}
</style>