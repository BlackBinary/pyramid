<template lang="pug">
  div
    h2 Strategies
    p Here you'll find all your strategies
    button.button(@click="addStrategy") Create Strategy
    .row
      .col-xs-3(v-for="strategy in myStrategies")
        .strategy-card(@click="openStrategy(strategy)")
          h2 {{ strategy.title }}
            .far.fa-arrow-right
          p {{ strategy.description }}
</template>

<script>
import { CreateStrategy } from '@frontend/apollo/strategies/mutations.gql';
import { getMyStrategies } from '@frontend/apollo/strategies/queries.gql';

export default {
  data() {
    return {
      myStrategies: [],
    };
  },
  apollo: {
    myStrategies: {
      query: getMyStrategies,
    },
  },
  methods: {
    openStrategy(strategy) {
      console.log(strategy);
      console.log(`open strategy ${strategy.id}`);
      this.$router.push({ name: 'StrategyView', params: { strategyId: strategy.id } });
    },
    addStrategy() {
      console.log('Add strategy');
      this.$apollo
        .mutate({
          mutation: CreateStrategy,
          variables: { title: 'test', type: 1 },
          update: (store, { data: { createStrategy } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: getMyStrategies });
            // Add our data from the mutation to the end
            data.myStrategies.push(createStrategy);
            // Write our data back to the cache.
            store.writeQuery({ query: getMyStrategies, data });
          },
        });
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
