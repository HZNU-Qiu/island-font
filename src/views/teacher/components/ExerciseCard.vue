<template>
  <div class="card">
    <div class="header">
      <p>{{ data.directionName }} | {{ data.categoryName }}</p>
      <img class="tag" src="@/assets/tag.png" alt="error" />
    </div>
    <div class="body">
      <div v-html="data.content" class="content"></div>
      <div class="options">
        <p class="needOptions" v-show="data.options === null">缺少选项</p>
        <div class="item" v-for="(sample, index) in data.options" :key="index">
          {{ String.fromCharCode(index + 65) }} {{ sample }}
        </div>
      </div>
      <p class="answer">{{ "正确答案: " + rightAnswer }}</p>
      <p class="hint">{{ "提示: " + hint }}</p>
      <p class="remark">{{ "解析: " + remark }}</p>
    </div>
    <div class="footer">
      <p>{{ "创建者: " + data.userName }}</p>
      <div v-show="isMine !== 1" class="optionsBtn">
        <el-button v-show="isMine === 3" type="danger" plain>删除</el-button>
        <el-button
          v-show="isMine !== 1"
          type="primary"
          @click="handleEdit"
          plain
          >编辑</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExerciseCard",
  props: {
    data: Object,
    isMine: Number,
  },
  computed: {
    rightAnswer: function () {
      if (this.data.answer.length > 1) {
        let arr = [];
        arr = this.data.answer.split(";");
        let str = ""
        arr.map((x) => {
          str += String.fromCharCode(parseInt(x) + 64);
        });
        return str;
      }
      return String.fromCharCode(parseInt(this.data.answer) + 64);
    },
    hint: function () {
      if (this.data.hint === null || this.data.hint === "") {
        return "这道题很简单,所以没有提示";
      } else {
        return this.data.hint;
      }
    },
    remark: function () {
      if (this.data.remark === null || this.data.remark === "") {
        return "略";
      } else {
        return this.data.remark;
      }
    },
  },
  methods: {
    handleEdit() {
      this.$router.push({
        path: "/exerciseManage/exerciseEdition",
        query: {
          id: this.data.id,
        },
      });
    },
  },
};
</script>

<style scoped>
* {
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}
.tag {
  position: relative;
  bottom: 35px;
}

.card {
  width: 90%;
  padding: 20px 30px 5px 30px;
  box-shadow: 0 5px 8px 0 rgba(95, 101, 105, 0.3);
  border-radius: 8px;
  margin-top: 20px;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  color: #3465a2;
}

.needOptions {
  color: #f56c6c;
}

.answer,
.hint,
.remark {
  color: #607d8b;
  word-break: break-all;
}

.footer {
  border-top: 1px solid #ccc;
  font-weight: bold;
  color: #3465a2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>