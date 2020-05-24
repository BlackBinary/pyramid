<template lang="pug">
div(v-show="isActive")
  slot
</template>

<script>
export default {
  name: 'PyramidTabs',
  props: {
    name: { required: true },
    selected: { default: false },
  },
  data() {
    return {
      isActive: false,
    };
  },
  created() {
    this.tabs = this.$children;
  },
  mounted() {
    this.isActive = this.selected;
  },
};
</script>

<style lang="scss">

</style>
