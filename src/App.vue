<template>
  <div id="app">
    <mint-range></mint-range>
    <mint-range>
      <div slot="start">start</div>
      <div slot="end">end</div>
    </mint-range>
    <mint-range disabled :value="30"></mint-range>
    <mint-range :bar-height="3" :value="20"></mint-range>
    <mint-range :min="10" :max="100">
      <div slot="start">10</div>
      <div slot="end">100</div>
    </mint-range>
  </div>
</template>

<script>
import MintRange from './components/range/index.vue'
export default {
  components: {
    MintRange
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

.mt-range {
  width: 300px;
}
</style>
