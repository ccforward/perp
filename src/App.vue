<template>
  <div id="app">
    <vue-range :value.sync="val" ></vue-range>
    {{ val }}
    <p></p>
    <br>
    <br>
    <vue-range>
      <div slot="start">start</div>
      <div slot="end">end</div>
    </vue-range>
    <vue-range disabled :value="30"></vue-range>
    <vue-range :bar-height="3" :value="20"></vue-range>
    <vue-range :min="10" :max="max">
      <div slot="start">10</div>
      <div slot="end">{{ max }}</div>
    </vue-range>

  </div>
</template>

<script>
import VueRange from './components/range/index.vue'

export default {
  data: () => {
    return { 
      val: 50,
      max: 80
    }
  },
  components: {
    VueRange
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

.vue-range {
  min-width: 300px;
}
</style>
