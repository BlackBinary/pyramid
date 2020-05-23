<template lang="pug">
div
  .row.m-b-xl
    h1 Dashboard
  .row.m-b-xl
    .col-xs-9 test
    .col-xs-3
      .row.m-b-lg
        .col-xs-6
          h4 Strategies
        .col-xs-6.has-text-right
          .fal.fa-plus(@click="addStrategy")
      transition-group.row(tag="div" name="list")
        .col-xs-12(v-for="(strategy, index) in myStrategies" :key="`${strategy.id}`")
          PyramidStrategyCard(:value="strategy")
      StrategyModal(v-model="addStrategyModal")
</template>

<script>
import { getMyStrategies } from '@frontend/apollo/strategies/queries.gql';

export default {
  data() {
    return {
      myStrategies: [],
      addStrategyModal: false,
    };
  },
  apollo: {
    myStrategies: {
      query: getMyStrategies,
    },
  },
  methods: {
    addStrategy() {
      this.addStrategyModal = true;
    },
  },
  components: {
    PyramidStrategyCard: () => import('@frontend/components/cards/PyramidStrategyCard'),
    StrategyModal: () => import('@frontend/views/Strategies/modals/StrategyModal'),
  },
};
</script>

<style lang="scss">

</style>
