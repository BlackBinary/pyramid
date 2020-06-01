<template lang="pug">
  div
    .strategy-title.m-b-xl
      h2 Strategy: {{ strategy.name }}
      p {{ strategy.description }}
    .strategy-content
      PyramidCard.m-b-xl(v-if="conditionalIndicators.length === 0")
        div(slot="content" style="text-align: center; padding: 50px;")
          div
            p Start by adding indicators to your strategy
          button.button(@click="addIndicators") Add Indicators
      PyramidTabs.m-b-xl(v-else)
          PyramidTab(
            v-for="(indicator, index) in conditionalIndicators"
            :name="indicator.label"
            :selected="index === 0"
          )
            PyramidField(icon="fa-chart-line")
              PyramidInput(
                v-model="indicator.meta.buyValue"
                placeholder="Buy Value"
              )
            PyramidField(icon="fa-chart-line-down")
              PyramidInput(
                v-model="indicator.meta.sellValue"
                placeholder="Sell Value"
              )
      PyramidCard.m-b-xl(v-if="conditionalIndicators.length > 0")
        .row(slot="title")
          .col-xs-6
            h4.m-t-md Indicator conditionals
          .col-xs-6.has-text-right
            button.button(@click="addConditional") Add Conditional
        .row(slot="content")
          .col-xs-12
            .strategy-contitionals(v-for="(conditional, index) in conditionals")
              span When:
              PyramidSelect(
                v-model="conditional.indicator1"
                :options="conditionalIndicators"
                id="indicator1" name="indicator1"
              )
              PyramidSelect(
                v-model="conditional.conditionalType"
                :options="conditionalTypes"
                id="conditionalTypes" name="conditionalTypes"
              )
              PyramidSelect(
                v-model="conditional.indicator2"
                :options="conditionalIndicators"
                id="indicator2" name="indicator2"
              )
              PyramidSelect(
                v-model="conditional.conditionalAction"
                :options="conditionalActions"
                id="conditionalActions"
                name="conditionalActions"
              )
              .strategy-conditional--actions
                .far.fa-trash(@click="deleteContitional(index)")
</template>

<script>
import { GetStrategyById } from '@frontend/apollo/strategies/queries.gql';

export default {
  data() {
    return {
      strategy: {},
      indicators: [
        {
          value: 1,
          label: 'MDA',
          meta: {
            buyValue: '',
            sellValue: '',
          },
        },
        {
          value: 2,
          label: 'MACD',
          meta: {
            buyValue: '',
            sellValue: '',
          },
        },
        {
          value: 3,
          label: 'SMA',
          meta: {
            buyValue: '',
            sellValue: '',
          },
        },
      ],
      conditionalIndicators: [],
      conditionalTypes: [
        {
          value: 1,
          label: 'Crosses',
        },
        {
          value: 2,
          label: 'Equals',
        },
        {
          value: 3,
          label: 'Match',
        },
      ],
      conditionalActions: [
        {
          value: 1,
          label: 'Buy',
        },
        {
          value: 2,
          label: 'Sell',
        },
        {
          value: 3,
          label: 'Wait',
        },
      ],
      conditionals: [],
    };
  },
  apollo: {
    strategy: {
      query: GetStrategyById,
      variables() {
        return {
          id: this.$route.params.strategyId,
        };
      },
    },
  },
  methods: {
    addIndicators() {
      this.conditionalIndicators = this.indicators;
    },
    addConditional() {
      this.conditionals.push({
        conditionalAction: 1,
        conditionalType: 2,
        indicator1: 1,
        indicator2: 1,
      });
    },
    deleteContitional(index) {
      this.conditionals.splice(index, 1);
    },
  },
  components: {
    PyramidCard: () => import('@frontend/components/cards/PyramidCard'),
    PyramidSelect: () => import('@frontend/components/forms/PyramidSelect'),
    PyramidTabs: () => import('@frontend/components/tabs/PyramidTabs'),
    PyramidTab: () => import('@frontend/components/tabs/PyramidTab'),
    PyramidInput: () => import('@frontend/components/forms/PyramidInput'),
    PyramidField: () => import('@frontend/components/forms/PyramidField'),
  },
};
</script>

<style lang="scss">
  .strategy-contitionals {
    display: flex;
    width: 100%;
    justify-content: space-between;
    line-height: 30px;
    padding: 5px 10px;
    box-sizing: border-box;

    &:nth-child(even) {
      background: rgba(lighten($blackCoral, 0.1%), 0.2);
    }
  }
</style>
