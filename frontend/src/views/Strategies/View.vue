<template lang="pug">
  div
    h2 Strategy
    p {{ strategyId }}
    p You can configure your strategy here
    pre {{ strategy }}
    button.button(@click="createIndicator") Create Indicator
</template>

<script>
import { getStrategyQuery } from '@frontend/apollo/strategies/queries.gql';
import { createIndicatorMutation } from '@frontend/apollo/strategies/mutations.gql';

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
  methods: {
    createIndicator() {
      this.$apollo
        .mutate({
          mutation: createIndicatorMutation,
          variables: {
            strategyId: this.strategyId,
            type: 'MACD',
            signal: 'BUY',
            params: {
              short: 12,
              long: 26,
              signal: 9,
            },
            chartPeriod: 60,
            required: true,
          },
        })
        .then(async (response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
