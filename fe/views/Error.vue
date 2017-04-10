<template>
  <div class="data-content errors">
    <ErrorList :errorData="errors"></ErrorList>
    <r-pagination class="fl" :total="page.total" :cur="page.current" :cb="fetchErrors"></r-pagination>
  </div>
</template>

<script>
import ErrorList from '@/components/ErrorList'
import queryString from 'query-string'
import 'whatwg-fetch'

export default {
  name: 'errors',
  data() {
    return {
      errors: {},
      page: {
        total: 0,
        limit: 2
      }
    }
  },
  components: {
    ErrorList
  },
  created() {
    this.fetchErrors()
  },
  methods: {
    fetchErrors(page) {
      const params = queryString.stringify({
        page: page || 1,
        limit: this.page.limit
      })
      fetch(`/errors/latest?${params}`, {
        method: 'GET',
      }).then(res => {
        return res.json()
      }).then(d => {
        if(!d.err) {
          this.errors = d.data
          this.page.total = d.page.total
        }
      })
    }
  }
}
</script>
