<template>
  <div>
    <div class="panel">
      <div class="header">
        <div class="header-left">
          <p>提交队列</p>
        </div>
        <div class="header-right">
          <el-input
            class="search_input"
            v-model="searchKey"
            placeholder="输入姓名筛选"
          >
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>

          <el-button
            @click="returnToCoding"
            style="margin-left: 30px"
            icon="el-icon-arrow-left"
            plain
            >返回</el-button
          >
        </div>
      </div>
      <!--  -->
      <div class="body">
        <el-row :gutter="20">
          <el-col style="padding: 20px" :span="18">
            <el-table
              :data="
                tableData.filter(
                  (data) =>
                    !searchKey ||
                    data.name.toLowerCase().includes(searchKey.toLowerCase())
                )
              "
              style="width: 100%"
              :default-sort="{ prop: 'date', order: 'descending' }"
            >
              <el-table-column prop="result" label="运行结果" width="190">
                <template>
                  <el-tag :type="tagStyle" effect="dark">
                    {{ tagContent }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="codeLang" label="编程语言" width="100">
              </el-table-column>
              <el-table-column
                prop="codeSize"
                label="代码大小"
                sortable
                width="120"
              >
              </el-table-column>
              <el-table-column
                prop="avgTime"
                label="消耗时间"
                sortable
                width="120"
              >
              </el-table-column>
              <el-table-column
                prop="avgMemory"
                label="内存占用"
                sortable
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="submitTime"
                label="提交时间"
                sortable
                width="180"
              >
              </el-table-column>
              <el-table-column prop="name" label="提交者"> </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="6">
            <el-card
              style="margin: 30px 0; min-height: 300px; cursor: pointer"
              shadow="hover"
            >
              <el-select
                style="width: 100%"
                v-model="filterResult"
                placeholder="难度进行筛选"
              >
                <el-option label="Accepted" :value="0"></el-option>
                <el-option label="CTLE" :value="1"></el-option>
                <el-option label="RTLE" :value="2"></el-option>
                <el-option label="MLE" :value="3"></el-option>
                <el-option label="Runtime Error" :value="4"></el-option>
                <el-option label="System Error" :value="5"></el-option>
                <el-option label="Wrong Answer" :value="-1"></el-option>
              </el-select>

              <ul class="langList">
                <li
                  @click="handleChangeLang(index)"
                  class="item"
                  v-for="(sample, index) in langs"
                  :key="index"
                >
                  {{ sample.label }}
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
        <div class="footer">
          <el-pagination
            background
            :page-size="30"
            @current-change="handlePageChanged"
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
import { queryQueue } from "@/api/experiments";
export default {
  data() {
    return {
      id: 0,
      tableData: [],
      searchKey: "",
      current: 1,
      total: 0,
      filterLang: "c",
      filterResult: 0,
      langs: [
        { label: "Clang", value: "c" },
        { label: "C++", value: "cpp" },
        { label: "Java", value: "java" },
        { label: "Python3", value: "py3" },
      ],
    };
  },
  computed: {
    tagStyle: function () {
      switch (this.filterResult) {
        case -1:
        case 4:
        case 5:
          return "danger";
        case 0:
          return "success";
        case 1:
        case 2:
        case 3:
          return "warning";
      }
    },
    tagContent: function () {
      switch (this.filterResult) {
        case -1:
          return "Wrong Answer";
        case 0:
          return "Accepted";
        case 1:
          return "CTLE";
        case 2:
          return "RTLE";
        case 3:
          return "MLE";
        case 4:
          return "Runtime Error";
        case 5:
          return "System Error";
      }
    },
  },
  watch: {
    filterResult: async function () {
      this.total = 0;
      let data = {};
      data.experimentId = this.id;
      data.current = this.current;
      data.codeLang = this.filterLang;
      data.result = this.filterResult;
      let res = await queryQueue(data);
      this.tableData = res.data;
      if (res.data.length === 0) {
        this.total = 0;
      } else {
        this.total = this.tableData[0].total;
      }
    },
  },
  methods: {
    async handleChangeLang(val) {
      this.total = 0;
      let data = {};
      data.experimentId = this.id;
      data.current = this.current;
      this.filterLang = this.langs[val].value;
      data.codeLang = this.filterLang;
      data.result = this.filterResult;
      let res = await queryQueue(data);
      this.tableData = res.data;
      if (res.data.length === 0) {
        this.total = 0;
      } else {
        this.total = this.tableData[0].total;
      }
    },
    async handlePageChanged(val) {
      this.total = 0;
      let data = {};
      data.experimentId = this.id;
      this.current = val;
      data.current = val;
      this.filterLang = this.langs[val].value;
      data.codeLang = this.filterLang;
      data.result = this.filterResult;
      let res = await queryQueue(data);
      this.tableData = res.data;
      if (res.data.length === 0) {
        this.total = 0;
      } else {
        this.total = this.tableData[0].total;
      }
    },
    returnToCoding() {
      this.$router.push({
        path: "/experiment/coding",
        query: {
          id: this.id,
        },
      });
    },
  },
  async created() {
    this.id = this.$route.query.id;
    let data = {};
    data.experimentId = this.id;
    data.current = this.current;
    data.codeLang = this.filterLang;
    data.result = this.filterResult;
    let res = await queryQueue(data);
    this.tableData = res.data;
    if (res.data.length === 0) {
      this.total = 0;
    } else {
      this.total = this.tableData[0].total;
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
  border-radius: 20px 0 0 20px;
  transition: all 0.7s;
}

.search_input >>> .el-input__inner:focus {
  width: 300px;
  transition: all 0.7s;
}

.langList {
  padding: 10px 0;
  list-style: none;
  border-radius: 5px;
}

.langList > .item {
  border: 1px solid rgba(36, 36, 34, 0.1);
  padding: 10px 15px;
  color: #3465a2;
  font: bold;
}

.langList > .item:hover {
  background-color: rgba(48, 48, 48, 0.1);
}
</style>