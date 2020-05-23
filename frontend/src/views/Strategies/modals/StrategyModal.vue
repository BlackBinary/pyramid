<template lang="pug">
  PyramidModal(v-model="addStrategyModal" v-if="addStrategyModal")
      h4(slot="title") Create new Strategy
      div.form-wapper(slot="content")
        PyramidField(icon="fa-pen")
          PyramidInput(
            v-model="strategy.title"
            placeholder="Strategy Title"
          )
        PyramidField(icon="fa-pen")
          PyramidInput(
            v-model="strategy.description"
            placeholder="Strategy Description"
          )
      div(slot="footer").has-text-right
        button.button.is-black-coral.m-r-xs Cancel
        button.button.is-caribbean-green(@click="addStrategy") Create Strategy
</template>

<script>
import { CreateStrategy } from '@frontend/apollo/strategies/mutations.gql';
import { getMyStrategies } from '@frontend/apollo/strategies/queries.gql';

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
        title: '',
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
    addStrategy() {
      if (this.strategy.title.length) {
        this.$store.dispatch('addToaster', { message: 'Strategy added', type: 'success' });
        this.$apollo
          .mutate({
            mutation: CreateStrategy,
            variables: {
              title: this.strategy.title,
              description: this.strategy.description,
              type: 1,
            },
            update: (store, { data: { createStrategy } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({ query: getMyStrategies });
              // Add our data from the mutation to the end
              data.myStrategies.push(createStrategy);
              // Write our data back to the cache.
              store.writeQuery({ query: getMyStrategies, data });
            },
          });
        this.addStrategyModal = false;
        this.strategy = {
          title: '',
          description: '',
        };
      } else {
        this.$store.dispatch('addToaster', { message: 'Strategy titles are mandatory', type: 'error' });
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
