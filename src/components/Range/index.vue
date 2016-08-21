<template>
<div class="vue-range" :class="{ 'vue-range--disabled': disabled }">
  <slot name="start"></slot>
  <div class="vue-range-content" v-el:content>
    <div class="vue-range-runway" :style="{ 'border-top-width': barHeight + 'px' }"></div>
    <div class="vue-range-progress" :style="{ width: progress + '%', height: barHeight + 'px' }"></div>
    <div class="vue-range-thumb" v-el:thumb :style="{ left: progress + '%' }"></div>
  </div>
  <slot name="end"></slot>
</div>
</template>

<script>
import draggable from './draggable';

export default {
  name: 'vue-range',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number
    },
    barHeight: {
      type: Number,
      default: 1
    }
  },
  computed: {
    progress() {
      const value = this.value;
      if (typeof value === 'undefined' || value === null) return 0;
      return Math.floor((value - this.min) / (this.max - this.min) * 100);
    }
  },
  ready() {
    const { thumb, content } = this.$els;

    const getThumbPosition = () => {
      const contentBox = content.getBoundingClientRect();
      const thumbBox = thumb.getBoundingClientRect();

      return {
        left: thumbBox.left - contentBox.left,
        top: thumbBox.top - contentBox.top
      };
    };

    let dragState = {};
    draggable(thumb, {
      start: () => {
        if (this.disabled) return;
        const position = getThumbPosition();
        dragState = {
          thumbStartLeft: position.left,
          thumbStartTop: position.top
        };
      },
      drag: (event) => {
        if (this.disabled) return;
        const contentBox = content.getBoundingClientRect();
        const deltaX = event.pageX - contentBox.left - dragState.thumbStartLeft;
        const stepCount = Math.ceil((this.max - this.min) / this.step);
        const newPosition = (dragState.thumbStartLeft + deltaX) - (dragState.thumbStartLeft + deltaX) % (contentBox.width / stepCount);

        let newProgress = newPosition / contentBox.width;

        if (newProgress < 0) {
          newProgress = 0;
        } else if (newProgress > 1) {
          newProgress = 1;
        }

        this.value = Math.round(this.min + newProgress * (this.max - this.min));
      },
      end: () => {
        if (this.disabled) return;
        dragState = {};
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.vue-range {
  position: relative;
  display: flex;
  height: 30px;
  line-height: 30px;
  & > * {
    display: flex;
    display: -webkit-box;
  }
  & *[slot=start] {
    margin-right: 5px;
  }
  & *[slot=end] {
    margin-left: 5px;
  }
  .vue-range-content {
    position: relative;
    flex: 1;
    margin-right: 30px;
  }
  .vue-range-runway {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: -30px;
    border-top-color: #a9acb1;
    border-top-style: solid;
  }
  .vue-range-thumb {
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    cursor: move;
    box-shadow: 0 1px 3px rgba(0,0,0,.4);
  }
  .vue-range-progress {
    position: absolute;
    display: block;
    background-color: #26a2ff;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
  }
}
</style>
