<template>
  <div>
    <div class="header">
      <div class="header-left">
        <p>实验题列表</p>
      </div>
      <div class="header-right">
        <el-select v-model="difficulty" placeholder="难度进行筛选">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="简单" :value="1"></el-option>
          <el-option label="中等" :value="2"></el-option>
          <el-option label="困难" :value="3"></el-option>
        </el-select>
        <el-input
          class="search_input"
          v-model="searchKey"
          placeholder="输入题目名称筛选"
        >
          <template slot="append"><i class="el-icon-search"></i></template>
        </el-input>
      </div>
    </div>
    <div class="mainer">
      <el-row :gutter="20">
        <el-col class="tablePanel" :span="18">
          <el-table
            :data="
              tableData.filter(
                (data) =>
                  !searchKey ||
                  data.title.toLowerCase().includes(searchKey.toLowerCase())
              )
            "
            style="width: 100%"
          >
            <el-table-column prop="done" width="35">
              <template v-slot="props">
                <i
                  v-if="props.row.result === 0"
                  style="color: #67c23a"
                  class="el-icon-check"
                ></i>
              </template>
            </el-table-column>
            <el-table-column prop="displayId" label="实验序号" width="100">
            </el-table-column>
            <el-table-column prop="title" label="实验名称" width="200">
              <template v-slot="props">
                <p
                  @click="toProgram(props.row.id)"
                  style="color: #3465a2; margin: 0; cursor: pointer"
                >
                  {{ props.row.title }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="difficulty" label="难度" width="100">
              <template v-slot="props">
                <el-tag v-show="props.row.difficulty === 1" type="success"
                  >简单</el-tag
                >
                <el-tag v-show="props.row.difficulty === 2" type="warning"
                  >中等</el-tag
                >
                <el-tag v-show="props.row.difficulty === 3" type="danger"
                  >困难</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="point" label="能力点数" width="100">
            </el-table-column>
            <el-table-column prop="label" label="标签" width="100">
              <template v-slot="props">
                <el-tag v-if="props.row.labelName === null" type="info"
                  >暂无</el-tag
                >
                <el-tag v-else type="primary">{{ props.labelName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="submitNum" label="提交总数" width="150">
            </el-table-column>
            <el-table-column prop="ACRate" label="正确率"> </el-table-column>
          </el-table>
        </el-col>
        <!--  -->
        <el-col :span="5">
          <el-card class="labels" style="margin: 30px 10px; cursor: pointer; min-height: 300px" shadow="hover">
            <div>
              暂无标签
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="footer">
        <el-pagination
          background
          @current-change="handlePageChanged"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { filterAndList } from "@/api/experiments";
export default {
  data() {
    return {
      difficulty: 0,
      searchKey: "",
      total: 0,
      labelId: 0,
      labels: [],
      tableData: [],
      current: 1,
    };
  },
  watch: {
    difficulty: async function () {
      let data = {};
      data.difficulty = this.difficulty;
      data.current = this.current;
      data.labelId = this.labelId;
      let res = await filterAndList(data);
      this.tableData = res.data;
      this.total = this.tableData[0].total;
    },
  },
  methods: {
    toProgram(id) {
      this.$router.push({
        path: "/experiment/coding",
        query: {
          id,
        },
      });
    },
    async handlePageChanged(val) {
      try {
        let data = {};
        data.difficulty = this.difficulty;
        data.current = val;
        data.labelId = this.labelId;
        let res = await filterAndList(data);
        this.tableData = res.data;
        this.total = this.tableData[0].total;
      } catch (error) {
        this.$message.error("服务异常");
      }
    },
  },
  async created() {
    let data = {};
    data.difficulty = this.difficulty;
    data.current = this.current;
    data.labelId = this.labelId;
    let res = await filterAndList(data);
    this.tableData = res.data;
    this.total = this.tableData[0].total;
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
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
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
  float: right;
  border-radius: 20px 0 0 20px;
  transition: all 0.7s;
}

.search_input >>> .el-input__inner:focus {
  width: 300px;
  transition: all 0.7s;
}

.tablePanel {
  padding: 10px 5px 20px 5px;
  border-radius: 5px;
  box-shadow: 1px 4px 8px 4px rgba(158, 145, 145, 0.1);
  margin: 30px 0 20px 20px;
}

.footer {
  padding: 15px;
}

.labels {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  font-size: 26px;
}
</style>