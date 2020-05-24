<template lang="pug">
div
  .row.m-b-xl
    h1 Dashboard
  .row.m-b-xl
    .col-xs-9
      PyramidTabs
        PyramidTab(name="Trade History" :selected="true")
          PyramidDataTable(:headers="headers" :rows="rows")
            template(v-slot="{ row }")
              td(v-for="(cols, index) in row")
                span(
                  v-if="index === 0"
                  :class='completeOrErrorClass(cols.type)'
                )
                  | {{ cols.type === 1 ? 'Sell' : 'Buy' }}
                span(
                  v-if="index === 5"
                  :class='completeOrErrorClass(cols.status)'
                )
                  | {{ cols.status === 1 ? 'Denied' : 'Completed' }}
                template(v-else) {{ cols.content }}
        PyramidTab(name="Order Book") lalalalalal 2
        PyramidTab(name="Active Orders") lalalalalal 2
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
      headers: [
        {
          name: 'Type',
        },
        {
          name: 'Id',
        },
        {
          name: 'Price',
        },
        {
          name: 'Amount',
        },
        {
          name: 'Total',
        },
        {
          name: 'Status',
        },
      ],
      rows: [
        [
          {
            type: 0,
          },
          {
            content: '30',
          },
          {
            content: '9.005,90 EUR',
          },
          {
            content: '0 BTC',
          },
          {
            content: '10 BTC',
          },
          {
            status: 0,
          },
        ],
        [
          {
            type: 0,
          },
          {
            content: '10',
          },
          {
            content: '8.200,90 EUR',
          },
          {
            content: '0 BTC',
          },
          {
            content: '10 BTC',
          },
          {
            status: 0,
          },
        ],
        [
          {
            type: 0,
          },
          {
            content: '10',
          },
          {
            content: '8.200,90 EUR',
          },
          {
            content: '0 BTC',
          },
          {
            content: '10 BTC',
          },
          {
            status: 1,
          },
        ],
        [
          {
            type: 1,
          },
          {
            content: '10',
          },
          {
            content: '8.200,90 EUR',
          },
          {
            content: '0 BTC',
          },
          {
            content: '10 BTC',
          },
          {
            status: 1,
          },
        ],
      ],
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
    completeOrErrorClass(int) {
      return int === 0 ? 'has-text-caribbean-green' : 'has-text-cerise';
    },
  },
  components: {
    PyramidStrategyCard: () => import('@frontend/components/cards/PyramidStrategyCard'),
    PyramidTabs: () => import('@frontend/components/tabs/PyramidTabs'),
    PyramidTab: () => import('@frontend/components/tabs/PyramidTab'),
    PyramidDataTable: () => import('@frontend/components/datatable/PyramidDataTable'),
    StrategyModal: () => import('@frontend/views/Strategies/modals/StrategyModal'),
  },
};
</script>

<style lang="scss">

</style>
