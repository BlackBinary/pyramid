<template lang="pug">
div
  .row.m-b-xl
    .col-xs-6
      h2 Strategies
      p Here you'll find all your strategies
    .col-xs-6.has-text-right
      button.button(@click="addStrategy") Create Strategy
  transition-group.row(tag="div" name="list")
    .col-xs-3(v-for="(strategy, index) in strategies" :key="`${strategy.id}`")
      PyramidStrategyCard(:value="strategy")
  StrategyModal(v-model="addStrategyModal")
</template>

<script>
import { getStrategiesQuery } from '@frontend/apollo/strategies/queries.gql';

export default {
  data() {
    return {
      strategies: [],
      addStrategyModal: false,
    };
  },
  apollo: {
    strategies: {
      query: getStrategiesQuery,
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
