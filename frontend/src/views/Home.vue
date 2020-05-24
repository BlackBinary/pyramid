<template lang="pug">
div
  .row.m-b-xl
    .col-xs-2(v-for="(coinCard, index) in coinCards")
      PyramidCoinCard(:data="coinCard" @click.native="setChartWithCoinData(index)")
  .row.m-b-xl
    .col-xs-12
      PyramidCandleChart(v-model="chartData")
  .row.m-b-xl
    .col-xs-12
  .row.m-b-xl
    .col-xs-8
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
        PyramidTab(name="Order Book") Test 1
        PyramidTab(name="Active Orders") Test 2
    .col-xs-1
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
      coinCards: [
        {
          title: 'euro / btc',
          value: '9,803.12',
          goingUp: true,
          isActive: true,
        },
        {
          title: 'EUR / ETH',
          value: '9,803.12',
          goingUp: true,
          isActive: false,
        },
        {
          title: 'EUR / LTC',
          value: '9,803.12',
          goingUp: false,
          isActive: false,
        },
      ],
      chartData: [
        [1551128400000, 33, 37.1, 14, 14, 196],
        [1551132000000, 13.7, 30, 6.6, 30, 206],
        [1551135600000, 29.9, 33, 21.3, 21.8, 74],
        [1551139200000, 21.7, 25.9, 18, 24, 140],
        [1551142800000, 24.1, 24.1, 24, 24.1, 29],
      ],
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
    setChartWithCoinData(index) {
      this.coinCards = this.coinCards.map((coinCard) => ({
        ...coinCard,
        isActive: false,
      }));
      this.coinCards[index].isActive = true;

      // @TO-DO set ChartData
    },
  },
  components: {
    PyramidStrategyCard: () => import('@frontend/components/cards/PyramidStrategyCard'),
    PyramidTabs: () => import('@frontend/components/tabs/PyramidTabs'),
    PyramidTab: () => import('@frontend/components/tabs/PyramidTab'),
    PyramidDataTable: () => import('@frontend/components/datatable/PyramidDataTable'),
    PyramidCandleChart: () => import('@frontend/components/chart/PyramidCandleChart'),
    PyramidCoinCard: () => import('@frontend/components/cards/PyramidCoinCard'),
    StrategyModal: () => import('@frontend/views/Strategies/modals/StrategyModal'),
  },
};
</script>

<style lang="scss">

</style>
