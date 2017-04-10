<template>
  <div class="error-list">
    <h2 class="date-title">{{errorData.date}}</h2>
    <table class="bordered highlight striped">
      <thead>
        <tr>
          <th>链接</th>
          <th>标题</th>
          <th>系统</th>
          <th>异常信息</th>
          <th>客户端时间</th>
          <th>详细</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in errorData.errs">
          <td><a target="_blank" :href="item.link">{{ item.link }}</a></td>
          <td>{{ item.title }}</td>
          <td>{{ item.os }}</td>
          <td class="red-text">{{ item.msg }}</td>
          <td>{{ item.time }}</td>
          <td><r-btn info small @click.native="showDetail(item, 'modalDetail')">详情</r-btn></td>
        </tr>
      </tbody>
    </table>

    <r-modal class="detail-content" id="modalDetail">
      <r-card>
        <ol class="detail-list">
          <li><b>链接: </b> <a target="_blank" :href="detail.link">{{ detail.link }}</a></li>
          <li><b>异常信息：</b><br> 
          <p>
            <a target="_blank" :href="detail.url">{{ detail.url }}</a>
            <span>at line: {{ detail.line }}  column: {{ detail.col }}</span>
            <a target="_blank" :href="'/translate.html?line='+detail.line+'&col='+detail.col">源码翻译</a>
          </p>
          <p class="red-text">{{ detail.msg }}</p>
          <pre class="red-text" v-html="detail.errStack"></pre>
          </li>
          <li><b>标题: </b> {{ detail.title }}</li>
          <li><b>系统: </b> {{ detail.os }}</li>
          <li><b>UA: </b> {{ detail.ua }}</li>
          <li><b>IP: </b> {{ detail.ip }}</li>
          <li><b>宽*高: </b> {{ detail.size }}</li>
          <li v-if="detail.referer"><b>Referer: </b> {{ detail.referer }}</li>
          <li>
            <b>客户端时间: </b> {{ detail.time }}
            <b>服务端时间: </b> {{ detail.date }}
          </li>
          <li>{{ detail.other }}</li>
        </ol>
        <r-card-row actions="actions">
          <r-placeholder/>
          <r-btn class="blue white-text" @click.native="close('modalDetail')">确认</r-btn>
        </r-card-row>
      </r-card>
    </r-modal>
  </div>
</template>

<script>
export default {
  name: 'error-list',
  props: ['errorData'],
  data() {
    return {
      detail: {}
    }
  },
  methods: {
    showDetail(item, id) {
      this.detail = item
      this.$rubik.bridge.pub(`modal:open:${id}`)
    },
    close(id) {
      this.$rubik.bridge.pub(`modal:close:${id}`)
    }
  }
}
</script>
