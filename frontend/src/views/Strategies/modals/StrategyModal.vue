<template lang="pug">
  PyramidModal(v-model="addStrategyModal" v-if="addStrategyModal")
      h4(slot="title") Create new Strategy
      div.form-wapper(slot="content")
        PyramidField(icon="fa-pen")
          PyramidInput(
            v-model="strategy.name"
            placeholder="Strategy Name"
          )
        PyramidField(icon="fa-pen")
          PyramidInput(
            v-model="strategy.description"
            placeholder="Strategy Description"
          )
      div(slot="footer").has-text-right
        button.button.is-black-coral.m-r-xs(@click="close") Close
        button.button.is-caribbean-green(@click="addStrategy") Create Strategy
</template>

<script>
import { createStrategyMutation } from '@frontend/apollo/strategies/mutations.gql';
import { GetMyStrategies } from '@frontend/apollo/strategies/queries.gql';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      strategy: {
        name: '',
        description: '',
      },
    };
  },
  computed: {
    addStrategyModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    close() {
      this.addStrategyModal = false;
    },
    addStrategy() {
      if (this.strategy.name.length) {
        this.$store.dispatch('addToaster', { message: 'Strategy added', type: 'success' });
        this.$apollo
          .mutate({
            mutation: createStrategyMutation,
            variables: this.strategy,
            update: (store, { data: { createStrategy } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({ query: GetMyStrategies });
              // Add our data from the mutation to the end
              data.myStrategies.push(createStrategy);
              // Write our data back to the cache.
              store.writeQuery({ query: GetMyStrategies, data });
            },
          });
        this.close();
        this.strategy = {
          name: '',
          description: '',
        };
      } else {
        this.$store.dispatch('addToaster', { message: 'Strategy name is mandatory', type: 'error' });
      }
    },
  },
  components: {
    PyramidField: () => import('@frontend/components/forms/PyramidField'),
    PyramidInput: () => import('@frontend/components/forms/PyramidInput'),
    PyramidModal: () => import('@frontend/components/modals/PyramidModal'),
  },
};
</script>

<style lang="scss">

</style>
