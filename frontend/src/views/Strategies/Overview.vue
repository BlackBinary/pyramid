<template lang="pug">
  div
    .row.m-b-xl
      .col-xs-6
        h2 Strategies
        p Here you'll find all your strategies
      .col-xs-6.has-text-right
        button.button(@click="addStrategy") Create Strategy
    transition-group.row(tag="div" name="list")
      .col-xs-3(v-for="(strategy, index) in myStrategies" :key="`${strategy.id}`")
        PyramidStrategyCard(:value="strategy")
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
    addStrategy() {
      console.log('Add strategy');
      this.$store.dispatch('addToaster', { message: 'Strategy added', type: 'success' });
      this.$apollo
        .mutate({
          mutation: CreateStrategy,
          variables: { title: 'test', description: 'BTC SMA', type: 1 },
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
  components: {
    PyramidStrategyCard: () => import('@frontend/components/cards/PyramidStrategyCard'),
  },
};
</script>

<style lang="scss">

</style>
