<template lang="pug">
  .strategy-card
    .strategy-card--hitarea(@click="openStrategy(strategy)")
      h3 {{ strategy.name }}
      span {{ strategy.description }}
    .strategy-card--button-wrapper
      button.button.m-r-sm.square(
        @click="playPauseStrategy(strategy)"
        :class="{'is-black-coral': strategyIsPaused, 'is-neon-blue': !strategyIsPaused}"
      )
        .far.fa-play(v-if="!strategyIsPaused")
        .far.fa-pause(v-if="strategyIsPaused")
      button.button.is-black-coral.square(@click="deleteStrategy(strategy)")
        .far.fa-trash
</template>

<script>
import { DeleteStrategy } from '@frontend/apollo/strategies/mutations.gql';
import { GetMyStrategies } from '@frontend/apollo/strategies/queries.gql';

export default {
  name: 'PyramidStrategyCard',
  props: {
    value: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
      }),
    },
  },
  data() {
    return {
      strategyIsPaused: false,
    };
  },
  computed: {
    strategy() {
      return this.value;
    },
  },
  methods: {
    openStrategy(strategy) {
      this.$router.push({ name: 'StrategyView', params: { strategyId: strategy.id } });
    },
    deleteStrategy(strategy) {
      console.log('Delete strategy');
      console.log(strategy);
      this.$store.dispatch('addToaster', { message: 'Strategy deleted', type: 'success' });
      this.$apollo
        .mutate({
          mutation: DeleteStrategy,
          variables: { id: this.strategy.id },
          update: (store) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: GetMyStrategies });
            console.log(data);
            // Add our data from the mutation to the end
            data.myStrategies = data.myStrategies.filter((t) => t.id !== this.strategy.id);
            // Write our data back to the cache.
            store.writeQuery({ query: GetMyStrategies, data });
          },
        });
    },
    playPauseStrategy(strategy) {
      console.log(strategy);
      this.strategyIsPaused = !this.strategyIsPaused;
      const message = this.strategyIsPaused ? `Strategy ${this.strategy.title} Paused` : `Strategy ${this.strategy.title} Started`;
      this.$store.dispatch('addToaster', { message, type: 'success' });
    },
  },
};
</script>

<style lang="scss">
.strategy-card {
  background: $gunMetal;
  margin-bottom: 20px;
  position: relative;
  border-radius: 5px;

  transition: all 0.2s 0s ease-in-out;

  &:hover {
    background: lighten($gunMetal, 2%);
  }

  &:before {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    background: $neonBlue;
    width: 4px;
    border-radius: 5px;
  }

  &--hitarea {
    cursor: pointer;
    padding: 23px 150px 23px 30px;

    h3 {
      font-size: 15px;
    }
  }

  &--button-wrapper {
    position: absolute;
    top: 50%;
    right: 11px;
    transform: translateY(-50%);
  }
}
</style>
