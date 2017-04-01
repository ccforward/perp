<template>
  <div class="translate">
    <h1>翻译压缩代码</h1>
    <div class="trans-input">
      <r-file class="upload" v-model="sourcemap" placeholder="选择 sourcemap 文件"></r-file>
      <r-input class="input" v-model="line" label="Line"></r-input>
      <r-input class="input" v-model="col" label="Column"></r-input>
      <r-btn v-if="sourcemap&&line&&col" success @click.native="parse">解析源码信息</r-btn>
      <r-btn v-else disabled>解析源码信息</r-btn>
    </div>
    <div v-if="origin.source" class="source-file">
      <div class="source-info">
        <span v-if="origin.name" class="name">{{ origin.name }}</span> at line: <span class="position">{{origin.line}}</span>, column: <span class="position">{{origin.column}}</span> in <span class="source">{{origin.source}}</span>
      </div>
      <div class="trans-input">
        <r-file class="upload" v-model="sourceFile" :placeholder="'选择 '+origin.source+' 文件'"></r-file>
        <r-btn success class="btn-translate" @click.native="translate">翻译源代码</r-btn>
      </div>
      <ul v-show="code" class="source-code" v-html="code.source"></ul>
    </div>
  </div>
</template>

<script>
import 'whatwg-fetch'
abc()
export default {
  name: 'translate',
  data(){
    return {
      sourceFile: {},
      sourcemap: {},
      line: '',
      col: '',
      origin: {},
      code: ''
    }
  },
  mounted(){
    this.$rubik.init()
  },
  methods: {
    parse() {
      const formdata = new FormData()
      formdata.append('line', this.line)
      formdata.append('col', this.col)
      formdata.append('sourcemap', this.sourcemap[0])
      fetch('/translate/parse', {
        method: 'POST',
        body: formdata
      }).then(res => {
        return res.json()
      }).then(d => {
        if(!d.err) {
          this.origin = d.data.origin
        }
      })
    },

    translate() {
      const formdata = new FormData()
      if(this.sourceFile[0]){
        formdata.append('source', this.sourceFile[0])
        formdata.append('line', this.origin.line)
        fetch('/translate/source', {
          method: 'POST',
          body: formdata
        }).then(res => {
          return res.json()
        }).then(d => {
          if(!d.err) {
            this.code = d.data
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../node_modules/i-rubik/dist/rubik.min.css'

.translate {
  width 80%
  margin 0 auto
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
}
h1 {
  text-align center
  margin 50px 0
}
.trans-file {
  .upload {
    width 350px
  }
}
.trans-input {
  overflow hidden
  margin 20px 0

  .upload {
    float left
    width 350px
    margin-right 20px
  }
  .input {
    display inline-block
    margin-right 20px
    width 150px
  }
  .btn-translate {
    margin-top 1.5em
  }
}
.source-info {
  font-size 15px
  .name {
    color #67a6d3
  }
  .position {
    color #f60
  }
  .source {
    color #3c50e7
  }
}

.source-code {
  padding 20px 40px
  background #e1e1e1
  li {
    position relative
    list-style none
    height 20px
    line-height 20px
    text-indent 20px
    font-size 14px
    color #2196f3
    font-family Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace
    &:nth-child(2n) {
      background #ddd
    }
    &:after {
      content attr(data-no)
      position absolute
      left -50px
      top 0
      color #39b0f7
    }
  }
}
</style>
