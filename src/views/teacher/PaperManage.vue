<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>试卷库</p>
        </div>
      </div>
      <!--  -->
      <div class="block">
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
          <p style="color: #3465a2; font-weight: bold">类型:</p>
          <ul class="difficultys">
            <li
              class="item"
              :class="{ on: typeActive === 1 }"
              @click="typeActive = 1"
            >
              正式试卷
            </li>
            <li
              class="item"
              :class="{ on: typeActive === 2 }"
              @click="typeActive = 2"
            >
              模拟试卷
            </li>
          </ul>
        </div>
        <div class="difficultyList">
          <p style="color: #3465a2; font-weight: bold">筛选:</p>
          <ul class="difficultys">
            <li
              class="item"
              :class="{ on: filterActive === 1 }"
              @click="filterActive = 1"
            >
              所有试卷
            </li>
            <li
              class="item"
              :class="{ on: filterActive === 2 }"
              @click="filterActive = 2"
            >
              我发布的试卷
            </li>
            <li
              class="item"
              :class="{ on: filterActive === 3 }"
              @click="filterActive = 3"
            >
              我的草稿箱
            </li>
          </ul>
        </div>
        <div class="pager">
          <el-pagination
            style="margin-left: 15px"
            background
            layout="total, prev, pager, next"
            :total="total"
            :page-size="15"
          >
          </el-pagination>
          <el-button
            @click="
              dialogFormVisible = true;
              isModify = false;
            "
            icon="el-icon-plus"
            type="primary"
            plain
            >添加试卷</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="main">
        <paper-card
          v-for="(sample, index) in papers"
          :key="index"
          :difficulty="sample.difficulty"
          :id="sample.id"
          :title="sample.title"
          :creator="sample.realname"
          :point="sample.point"
          :index="index"
          @modifyThis="handleModify"
          @addExForThis="toAddExercises"
        ></paper-card>
      </div>
    </div>
    <!--  -->
    <el-dialog title="试卷信息" :visible.sync="dialogFormVisible">
      <el-form label-position="right" :model="paperForm">
        <el-form-item label="试卷名称">
          <el-input style="width: 220px" v-model="paperForm.title"></el-input>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-select v-model="paperForm.type">
            <el-option label="正式试卷" :value="1"></el-option>
            <el-option label="模拟试卷" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷难度">
          <el-select v-model="paperForm.difficulty">
            <el-option label="简单" :value="1"></el-option>
            <el-option label="中等" :value="2"></el-option>
            <el-option label="困难" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷分数">
          <el-input-number
            v-model="paperForm.point"
            :min="10"
            :max="150"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="方向/类别">
          <el-cascader
            :options="optionData"
            :key="cascaderKey"
            v-model="optionValue"
            class="cascader"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePaper">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTree } from "@/api/System/courseDirection";
import { filterPapers, addPaper } from "@/api/paper.js";
import PaperCard from "./components/PaperCard.vue";
export default {
  components: {
    PaperCard,
  },
  data() {
    return {
      cascaderKey: 1,
      optionData: [],
      optionValue: [],
      filterTree: [],
      directions: [],
      categorys: [],
      directionActive: -1,
      categoryActive: -1,
      difficultyActive: -1,
      typeActive: 1,
      filterActive: 1,
      total: 0,
      queryData: {
        current: 1,
        type: 1,
        difficulty: -1,
        categoryIds: [],
        filter: 1, // 1-所有试卷 2-用户发布的试卷 3-用户草稿箱
      },
      papers: [],
      dialogFormVisible: false,
      isModify: false,
      paperForm: {
        id: "",
        title: "",
        type: 1,
        status: 0,
        point: 10,
        difficulty: 1,
        directionId: 0,
        categoryId: 0,
      },
    };
  },
  watch: {
    optionData() {
      ++this.cascaderKey;
    },
    directionActive: function () {
      this.categoryActive = -1;
      this.categorys = [];
      this.queryData.categoryIds = [];
      if (this.directionActive === -1) {
        this.filterTree.map((item) => {
          item.children.map((x) => {
            this.categorys.push(x);
            this.queryData.categoryIds.push(x.value);
          });
        });
      } else {
        this.categorys = this.directions[this.directionActive].children;
        this.categorys.map((x) => {
          this.queryData.categoryIds.push(x.value);
        });
      }
      this.listPapers();
    },
    categoryActive: function () {
      this.queryData.categoryIds = [];
      if (this.categoryActive !== -1) {
        this.queryData.categoryIds.push(
          this.categorys[this.categoryActive].value
        );
      } else {
        this.queryData.categoryIds = [];
      }
      this.listPapers();
    },
    difficultyActive: function () {
      this.queryData.difficulty = this.difficultyActive;
      this.listPapers();
    },
    typeActive: function () {
      this.queryData.type = this.typeActive;
      this.listPapers();
    },
    filterActive: function () {
      this.queryData.filter = this.filterActive;
      this.listPapers();
    },
  },
  methods: {
    toAddExercises(val) {
      this.$router.push({
        path: '/Exam/addExercises',
        query: {
          id: this.papers[val].id,
        }
      })
    },
    handleChange(value) {
      this.optionValue = value;
    },
    handleModify(val) {
      this.dialogFormVisible = true;
      this.isModify = true;
      this.paperForm = this.papers[val];
      this.optionValue = [
        this.paperForm.directionId,
        this.paperForm.categoryId,
      ];
    },
    async listPapers() {
      let res = await filterPapers(this.queryData);
      this.papers = res.data;
      if (res.data.length !== 0) {
        this.total = res.data[0].total;
      }
    },
    async savePaper() {
      this.paperForm.isModify = this.isModify;
      if (this.paperForm.title === "" || this.paperForm.title === null) {
        this.$message.error("请编辑卷头信息");
      } else {
        this.paperForm.directionId = this.optionValue[0];
        this.paperForm.categoryId = this.optionValue[1];
        await addPaper(this.paperForm);
        this._clearForm();
        this.dialogFormVisible = false;
        this.listPapers();
        this.$message.success("保存成功");
      }
    },
    _clearForm() {
      this.paperForm = {
        title: "",
        type: 1,
        status: 0,
        point: 10,
        difficulty: 1,
        directionId: 0,
        categoryId: 0,
      };
    },
  },
  async created() {
    try {
      let res = await Promise.all([getTree(), filterPapers(this.queryData)]);
      let data = res[0].data;
      this.filterTree = data;
      this.optionData = data;
      this.all = data;
      data.map((direction) => {
        this.directions.push(direction);
        direction.children.map((category) => {
          this.categorys.push(category);
        });
      });
      let data1 = res[1].data;
      this.papers = data1;
    } catch (error) {
      console.log(error);
      this.$message.error("服务异常");
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

.pager {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 20px;
}
</style>