<template lang="pug">
  div
    h2 Strategies
    p Here you'll find all your strategies
    .row
      .col-xs-3(v-for="strategy in strategies")
        .strategy-card(@click="openStrategy")
          h2 {{ strategy.name }}
            .far.fa-arrow-right
</template>

<script>
export default {
  data() {
    return {
      strategies: Array(10).fill(0).map(() => ({
        name: 'Strategy',
        type: 'TEST',
      })),
    };
  },
  methods: {
    openStrategy() {
      console.log('click');
    },
  },
};
</script>

<style lang="scss">
  .strategy-card {
    h2 {
      font-size: 28px;
      .far {
        padding-left: 8px;
      }
    }
    min-height: 200px;
    background: lighten($blackCoral, 20%);
    margin: 10px;
    padding: 10px;
    &:hover {
      cursor: pointer;
      background: lighten($blackCoral, 40%);
    }
  }
</style>
