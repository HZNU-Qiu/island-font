<template>
  <div class="codeEditor-container">
    <div class="toolbar">
      <el-select v-model="mode" placeholder="请选择">
        <el-option v-for="item in modes" :key="item.value" :label="item.text" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" class="submit-button" @click="submit">提交</el-button>
      <el-button variant="danger" class="reset-button" @click="reset">重置</el-button>
    </div>
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
// 引入全局实例
import _CodeMirror from "codemirror";

// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/darcula.css";

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/r/r.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/swift/swift.js";
import "codemirror/mode/vue/vue.js";

// 代码块折叠相关依赖
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/fold/markdown-fold";

// 代码补齐相关依赖
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";

// 代码格式化相关依赖


// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror;

// 获取可配置选项
import modes from "./modes";

import formatCode from '@/utils/formatCode.js';

export default {
  name: "CodeEditor",
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String,
    // 外部传入的语法类型
    language: {
      type: String,
      default: "C"
    }
  },
  data() {
    return {
      // 内部真实的内容
      code: '',
      // 默认的语法类型
      mode: "javascript",
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
        lineWrapping: "wrap",
        // 主题，对应主题库 JS 需要提前引入
        theme: "darcula",
        // 显示行号
        lineNumbers: true,
        //代码折叠
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        //括号匹配
        matchBrackets: true
        //自动提示配置
        // extraKeys: { Tab: "autocomplete" }
      },
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
      modes: modes
    };
  },
  methods: {
    // 初始化
    _initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
      // 编辑器赋值
      this.coder.setValue(this.value || this.code);
      // 设置编译器的宽度和高度
      this.coder.setSize("100%", "80vh");

      // 支持双向绑定
      this.coder.on("change", coder => {
        
        this.code = coder.getValue();

        if (this.$emit) {
          this.$emit("input", this.code);
        }

      });

      // 实时代码 补齐显示
      // this.coder.on("inputRead", (cm, inputObj) => {
      //   let inputChar = inputObj.text[0];
      //   if (inputChar != "") {
      //     this.coder.showHint({
      //       completeSingle: false
      //     });
      //   }
      // });

      // 尝试从父容器获取语法类型
      if (this.language) {
        // 获取具体的语法类型对象
        let modeObj = this._getLanguage(this.language);

        // 判断父容器传入的语法是否被支持
        if (modeObj) {
          this.mode = modeObj.text;
        }
      }
    },
    // 获取当前语法类型
    _getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find(mode => {
        // 所有的值都忽略大小写，方便比较
        let currentLanguage = language.toLowerCase();
        let currentLabel = mode.text.toLowerCase();
        let currentValue = mode.value.toLowerCase();

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return (
          currentLabel === currentLanguage || currentValue === currentLanguage
        );
      });
    },
    // 更改模式
    changeMode(val) {
      const mode = this.mode;

      // 修改编辑器的语法配置
      this.coder.setOption("mode", `text/${mode}`);

      // 获取修改后的语法
      let text = this._getLanguage(mode).text.toLowerCase();

      // 允许父容器通过以下函数监听当前的语法值
      this.$emit("language-change", text);
    },
    submit() {
      this.$emit('submit',this.coder.getValue());
    },
    reset() {
      this.coder.setValue("");
    },
    formatCode(){ 
      const value = formatCode(this.mode,this.coder.getValue());
      this.coder.setValue(value);
    }
  },
  mounted() {
    // 初始化
    this._initialize();
  }
};
</script>

<style scoped>
.toolbar {
  margin: 20px;
}
.submit-button,
.format-button,
.reset-button {
  float: right;
  margin: 0 10px;
}
</style>
