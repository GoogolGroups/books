<template>
  <div class="scroll-container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'WithScroll',
  emits: ['scroll'],
  mounted() {
    this.listener = () => {
      let { scrollLeft, scrollTop } = this.$el;
      this.$emit('scroll', { scrollLeft, scrollTop });
    };
    this.$el.addEventListener('scroll', this.listener);
  },
  beforeUnmount() {
    if (this.listener) {
      this.$el.removeEventListener('scroll', this.listener);
      delete this.listener;
    }
  },
};
</script>
<style>
.scroll-container {
  height: calc(100vh - 12rem);
}
.scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.200');
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.gray.300');
}
.scroll-container::-webkit-scrollbar-track {
  background-color: white;
}
</style>
