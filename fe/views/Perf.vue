<template>
  <div class="data-content perfs">
    <p>
      <span>按日期查询</span>
      <input class="input-date" type="date" v-model="search.date" placeholder="按日期查询" @change="selDate">
    </p>
    <div class="link-search">
      <r-input class="link-input" type="text" v-model="search.link" placeholder="搜索链接（前五日历史数据）"></r-input>
      <r-btn info small @click.native="searchLink"><r-icon>search</r-icon></r-btn>
    </div>
    <PerfList :perfData="perfs"></PerfList>
    <r-pagination v-if="page.total>1" class="fl" :total="page.total" :cur="page.current" :cb="fetchErrors"></r-pagination>
    <r-loader half :show="loading"></r-loader>
  </div>
</template>

<script>
import PerfList from '@/components/PerfList'
import queryString from 'query-string'
import 'whatwg-fetch'

export default {
  name: 'Performance',
  data() {
    return {
      perfs: {},
      api: '',
      search: {
        link: '',
        date: ''
      },
      url: {
        latest: '/performance/latest',
        day: '/performance/day/',
        link: '/performance/link/'
      },
      page: {
        total: 0,
        limit: 30
      },
      loading: false
    }
  },
  components: {
    PerfList
  },
  created() {
    this.api = this.url.latest
    this.fetchErrors()
  },
  methods: {
    selDate() {
      const d = this.search.date.replace(/-/g, '')
      this.api = `${this.url.day}${d}`
      this.fetchErrors(1)
    },
    searchLink() {
      const link = encodeURIComponent(this.search.link)
      this.api = `${this.url.link}${link}?days=5`
      this.fetchErrors(1)
    },
    fetchErrors(page) {
      this.loading = true
      const params = queryString.stringify({
        page: page || 1,
        limit: this.page.limit
      })
      let url = `${this.api}?${params}`
      if(this.api.indexOf('?')>0){
        url = `${this.api}&${params}`
      }
      fetch(url)
      .then(res => {
        return res.json()
      })
      .then(d => {
        this.loading = false
        if(!d.err) {
          this.perfs = d.data
          this.page.total = d.page.total
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.link-search {
  .link-input {
    width 500px
    display inline-block
  }
  .btn {
    padding .3rem .7rem
    vertical-align middle
  }
}
</style>