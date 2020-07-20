<template>
  <div style="margin: 0px 0px 15px 0px">
    <el-row type="flex" justify="space-between" class="header">
      <el-col :span="12">
        <div>
          <span>Languages</span>
          <el-select v-model="selected_language" :value="language" v-on:change="onLangChange" class="adjust">
            <el-option v-for="item in languages" :key="item" :value="item">{{item}}</el-option>
          </el-select>

          <el-tooltip
            content="Reset to default code definition"
            placement="top"
            style="margin-left: 10px"
          >
            <el-button icon="el-icon-refresh" @click="onResetClick"></el-button>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="fl-right">
          <span>Theme</span>
          <el-select v-model="selected_theme" :value="theme" @on-change="onThemeChange" class="adjust">
            <el-option v-for="item in themes" :key="item.label" :value="item.value">{{item.label}}</el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <codemirror :value="value" :options="options" @change="onEditorCodeChange" ref="myEditor"></codemirror>
  </div>
</template>
<script>
  import { codemirror } from 'vue-codemirror-lite'
  // theme
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/material.css'
  // mode
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/python/python.js'
  // active-line.js
  import 'codemirror/addon/selection/active-line.js'
  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/indent-fold.js'
  export default {
    name: 'CodeMirror',
    components: {
      codemirror
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      languages: {
        type: Array,
        default: () => {
          return ['C', 'C++', 'Java', 'Python3']
        }
      },
      language: {
        type: String,
        default: 'C++'
      },
      theme: {
        type: String,
        default: 'solarized'
      }
    },
    data () {
      return {
        options: {
          // codemirror options
          tabSize: 4,
          mode: 'text/x-csrc',
          theme: 'solarized',
          lineNumbers: true,
          line: true,
          // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          lineWrapping: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        },
        mode: {
          'C++': 'text/x-csrc',
          'Python3': 'text/x-python'
        },
        themes: [
          {label: 'Monokai', value: 'monokai'},
          {label: 'Solarized_Light', value: 'solarized'},
          {label: 'Material', value: 'material'}
        ],
        selected_language: 'C++',
        selected_theme: 'solarized'
      }
    },
    methods: {
      onEditorCodeChange (newCode) {
        this.$emit('update:value', newCode)
      },
      onLangChange (newVal) {
        this.editor.setOption('mode', this.mode[newVal])
        this.$emit('changeLang', newVal)
      },
      onThemeChange (newTheme) {
        this.editor.setOption('theme', newTheme)
        this.$emit('changeTheme', newTheme)
      },
      onResetClick () {
        this.$emit('resetCode')
      }
    },
    computed: {
      editor () {
        // get current editor object
        return this.$refs.myEditor.editor
      }
    },
    watch: {
      'selected_theme' (newVal, oldVal) {
        this.editor.setOption('theme', newVal)
      }
    }
  }
</script>

<style lang="scss" scoped>
.header {
  margin: 5px 5px 15px 5px;
  .adjust {
    width: 140px;
    margin-left: 10px;
  }
  .fl-right {
    float: right;
  }
}
</style>

<style>
.CodeMirror {
  height: 600px !important;
}
.CodeMirror-scroll {
  min-height: 300px;
  max-height: 1000px;
}
</style>