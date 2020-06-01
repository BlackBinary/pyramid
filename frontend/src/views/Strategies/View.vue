<template lang="pug">
  div
    h2 Strategy
    p {{ strategyId }}
    p You can configure your strategy here
    pre {{ strategy }}
</template>

<script>
import { getStrategyQuery } from '@frontend/apollo/strategies/queries.gql';

export default {
  data() {
    return {
      strategy: {},
      strategyId: this.$route.params.strategyId,
    };
  },
  apollo: {
    strategy: {
      query: getStrategyQuery,
      variables() {
        return {
          id: this.strategyId,
        };
      },
    },
  },
};
</script>
