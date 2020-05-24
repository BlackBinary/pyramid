<template lang="pug">
  .coin-card(:class="{ 'is-active': data.isActive }")
    .coin-card--title {{ data.title }}
    .coin-card--value {{ data.value }}
    .coin-card--icon.far(:class="iconClass()")
</template>

<script>
export default {
  name: 'PyramidCoinCard',
  props: {
    data: {
      type: Object,
      default: () => ({
        title: '',
        value: '',
        goingUp: false,
        isActive: false,
      }),
    },
  },
  methods: {
    iconClass() {
      return { 'fa-chart-line has-text-caribbean-green': this.data.goingUp, 'fa-chart-line-down has-text-cerise': !this.data.goingUp };
    },
  },
};
</script>

<style lang="scss">
.coin-card {
  display: block;
  padding: 20px;
  border-radius: 5px;
  background: $gunMetal;
  position: relative;
  cursor: pointer;

  &.is-active {
    background: $blue;
  }

  .coin-card--title {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .coin-card--value {
    font-size: 17px;
  }

  .coin-card--icon {
    position: absolute;
    font-size: 20px;
    right: 20px;
    bottom: 20px;
  }
}
</style>
