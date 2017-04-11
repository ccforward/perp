<template>
  <div class="error-list">
    <h2 class="date-title">{{perfData.date}}</h2>
    <table class=" bordered highlight striped">
      <thead>
        <tr>
          <th>链接</th>
          <th>总加载时长</th>
          <th>标题</th>
          <th>系统</th>
          <th>客户端时间</th>
          <th>详细</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in perfData.perfs">
          <td><a target="_blank" :href="item.link">{{ item.link }}</a></td>
          <td class="light-green-text"><b>{{ item.total }}</b></td>
          <td>{{ item.title }}</td>
          <td>{{ item.os }}</td>
          <td>{{ item.time }}</td>
          <td><r-btn info small @click.native="showDetail(item, 'modalDetail')">详情</r-btn></td>
        </tr>
      </tbody>
    </table>

    <r-modal class="detail-content" id="modalDetail">
      <r-card>
        <ol class="detail-list">
          <li><b>链接: </b> <a target="_blank" :href="detail.link">{{ detail.link }}</a></li>
          <li><b>性能统计：</b><br> 
          <table class="highlight bordered narrow">
            <thead>
              <tr>
                <th>total</th>
                <th>domReady</th>
                <th>readyStart</th>
                <th>redirect</th>
                <th>appcache</th>
                <th>unloadEvent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ detail.total }}</td>
                <td>{{ detail.domReady }}</td>
                <td>{{ detail.readyStart }}</td>
                <td>{{ detail.redirect }}</td>
                <td>{{ detail.appcache }}</td>
                <td>{{ detail.unloadEvent }}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>dnsLookup</th>
                <th>connect</th>
                <th>request</th>
                <th>initDomTree</th>
                <th>loadEvent</th>
              </tr>
              
            </thead>
            <tbody>
              <tr>
                <td>{{ detail.dnsLookup }}</td>
                <td>{{ detail.connect }}</td>
                <td>{{ detail.request }}</td>
                <td>{{ detail.initDomTree }}</td>
                <td>{{ detail.loadEvent }}</td>
              </tr>
            </tbody>
          </table>
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
  name: 'performance-list',
  props: ['perfData'],
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
