<template>
  <div class="exercise">
    <div v-html="exercise.content" class="content"></div>
    <div v-if="exercise.type === 1" class="options">
      <div class="item" v-for="(x, i) in exercise.options" :key="i">
        <span
          @click="handleSelect(i + 1)"
          :class="[
            'chooser',
            {
              isActive:
                parseInt(exercise.current) === parseInt(i + 1) && !showResult,
            },
            {
              isWrong:
                parseInt(exercise.current) === parseInt(i + 1) &&
                parseInt(exercise.answer) !== parseInt(exercise.current) &&
                showResult,
            },
            { isRight: parseInt(exercise.answer) === i + 1 && showResult },
          ]"
          >{{ String.fromCharCode(i + 65) }}</span
        >
        {{ x }}
      </div>
    </div>
    <!-- 多选 -->
    <div v-if="exercise.type === 2" class="options">
      <div class="item" v-for="(x, i) in exercise.options" :key="i">
        <span
          @click="handleMultiSelect(i)"
          style="border-radius: 8px"
          :class="[
            'chooser',
            { isActive: exercise.multiArray[i] && !showResult },
            {
              isWrong:
                exercise.multiArray[i] !== exercise.rightArray[i] &&
                showResult &&
                exercise.rightArray[i] === 0,
            },
            {
              isRight:
                exercise.multiArray[i] === exercise.rightArray[i] &&
                showResult &&
                exercise.rightArray[i] === 1,
            },
          ]"
          >{{ String.fromCharCode(i + 65) }}</span
        >
        {{ x }}
      </div>
    </div>
    <!-- 判断 -->
    <div v-if="exercise.type === 3" class="options">
      <div class="item">
        <span
          @click="handleSelect(1)"
          :class="[
            'chooser',
            { isActive: exercise.current === 1 && !showResult },
            {
              isWrong:
                parseInt(exercise.current) === parseInt(1) &&
                parseInt(exercise.answer) !== parseInt(exercise.current) &&
                showResult,
            },
            { isRight: parseInt(exercise.answer) === 1 && showResult },
          ]"
          >T</span
        >
      </div>
      <div class="item">
        <span
          @click="handleSelect(2)"
          :class="[
            'chooser',
            { isActive: exercise.current === 2 && !showResult },
            {
              isWrong:
                parseInt(exercise.current) === parseInt(2) &&
                parseInt(exercise.answer) !== parseInt(exercise.current) &&
                showResult,
            },
            { isRight: parseInt(exercise.answer) === 2 && showResult },
          ]"
          >F</span
        >
      </div>
    </div>
    <div v-show="showResult" class="hidden">
      <p v-show="exercise.type === 1" style="color: #607d8b" class="answer">
        {{ "正确答案: " + String.fromCharCode(parseInt(exercise.answer) + 64) }}
      </p>
      <p v-show="exercise.type === 2" style="color: #607d8b" class="answer">
        {{ "正确答案: " + multiAnswer }}
      </p>
      <p style="color: #607d8b" class="hint">
        {{ "提示: " + (exercise.hint ? exercise.hint : "无") }}
      </p>
      <p style="color: #607d8b" class="remark">
        {{ "解析: " + exercise.remark }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentExerciseCard",
  props: {
    exercise: Object,
    showResult: Boolean,
  },
  computed: {
    multiAnswer: function () {
      if (this.exercise.type === 2) {
        let len = this.exercise.rightArray.length;
        let str = "";
        for (let i = 0; i < len; i++) {
          if (this.exercise.rightArray[i]) str += String.fromCharCode(parseInt(i) + 65);
        }
        return str;
      }
    },
  },
  data() {
    return {
      studentAnswer: "",
    };
  },
  methods: {
    handleSelect(select) {
      if (!this.showResult) {
        this.exercise.current = parseInt(select);
        if (this.exercise.type === 1) {
          this.studentAnswer = select;
          this.exercise.studentAnswer = this.studentAnswer;
          if (this.exercise.answer === this.studentAnswer.toString()) {
            this.exercise.result = 1;
          } else {
            this.exercise.result = 0;
          }
        } else if (this.exercise.type === 3) {
          this.studentAnswer = select;
          this.exercise.studentAnswer = this.studentAnswer;
          if (this.exercise.answer === this.studentAnswer.toString()) {
            this.exercise.result = 1;
          } else {
            this.exercise.result = 0;
          }
        }
      }
    },
    handleMultiSelect(select) {
      if (!this.showResult) {
        if (this.exercise.multiArray[select] === 1) {
          this.$set(this.exercise.multiArray, select, 0);
        } else {
          this.$set(this.exercise.multiArray, select, 1);
        }
        let str = "",
          arr = [];
        this.exercise.multiArray.map((x, i) => {
          if (x !== 0) {
            arr.push(i + 1);
          }
        });
        str = arr.join(";");
        this.exercise.studentAnswer = str;
        if (this.exercise.answer === this.exercise.studentAnswer) {
          this.exercise.result = 1;
        } else {
          this.exercise.result = 0;
        }
      }
    },
  },
};
</script>

<style scoped>
.exercise {
  padding: 20px;
  margin: 20px 5px;
  border-radius: 5px;
  box-shadow: 2px 2px 12px 5px rgba(12, 35, 138, 0.1);
}

.options > .item {
  margin: 10px 0;
  border: none;
}

.chooser {
  border: 1px solid #3465a2;
  border-radius: 50%;
  color: #3465a2;
  padding: 1px 7px;
  cursor: pointer;
}

.isActive {
  background-color: #3465a2;
  color: #ffe;
}

.el-radio-group {
  display: flex;
  flex-direction: column;
}

.el-radio-group >>> .el-radio-button__inner {
  width: 90%;
  margin: 5px;
  border: 1px solid #aaa;
  border-radius: 5px;
  display: flex;
  justify-content: left;
}

.isWrong {
  background-color: #d10000;
  color: #fff;
  border-color: #d10000;
}

.isRight {
  background-color: #00ff22;
  color: #fff;
  border-color: #00ff22;
}
</style>