<template lang="pug">
div
  .row.m-b-xl
    .col-xs-2(v-for="(coinCard, index) in coinCards")
      PyramidCoinCard(
        :data="coinCardData(coinCard, index)"
        @click.native="activeCardIndex = index"
      )
  .row.m-b-xl
    .col-xs-12
      PyramidCandleChart(:data="historicCandles")
  .row.m-b-xl
    .col-xs-12
  .row.m-b-xl
    .col-xs-8
      PyramidTabs
        PyramidTab(name="Trade History" :selected="true")
          PyramidDataTable(:headers="headers" :rows="tradeRows")
            template(v-slot="{ row }")
              td(v-for="(val, key) in row")
                span(
                  v-if="key === 'type'"
                  :class="completeOrErrorClass(val === 'BUY')"
                ) {{ val }}
                span(
                  v-if="key === 'status'"
                  :class="completeOrErrorClass(val === 'complete')"
                ) {{ val }}
                span(
                  v-if="key === 'amount'"
                ) {{ val }} {{ row.symbol }}
                span(
                  v-if="key === 'total'"
                ) {{ row.total }}
                span(v-else) {{ val }}
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
        .col-xs-12(v-for="(strategy, index) in strategies" :key="`${strategy.id}`")
          PyramidStrategyCard(:value="strategy")
      StrategyModal(v-model="addStrategyModal")
</template>

<script>
import { getStrategiesQuery } from '@frontend/apollo/strategies/queries.gql';
import { getHistoricCandlesQuery } from '@frontend/apollo/chart/queries.gql';

export default {
  data() {
    return {
      activeCardIndex: 0,
      trades: [
        {
          type: 'BUY',
          price: 9005.90,
          amount: 30,
          symbol: 'BTC',
          status: 'failed',
        },
        {
          type: 'SELL',
          price: 10005.90,
          amount: 29,
          symbol: 'ETH',
          status: 'complete',
        },
      ],
      strategies: [],
      historicCandles: [],
      addStrategyModal: false,
      coinCards: [
        {
          title: 'btc / eur',
          symbol: 'btceur',
          value: 9803.12,
          goingUp: true,
          isActive: true,
        },
        {
          title: 'eth / btc',
          symbol: 'ethbtc',
          value: 9803.12,
          goingUp: true,
          isActive: false,
        },
        {
          title: 'ltc / btc',
          symbol: 'ltcbtc',
          value: 9803.12,
          goingUp: false,
          isActive: false,
        },
      ],
      headers: [
        {
          name: 'Type',
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
    };
  },
  apollo: {
    strategies: {
      query: getStrategiesQuery,
    },
    // trades: {
    //   query: getTradesQuery,
    // },
    historicCandles: {
      query: getHistoricCandlesQuery,
      pollInterval: 1000 * 60,
      variables() {
        return {
          symbol: this.activeCardData.symbol,
        };
      },
    },
  },
  computed: {
    activeCardData() {
      return this.coinCards[this.activeCardIndex];
    },
    tradeRows() {
      return this.trades.map((trade) => {
        const total = trade.amount * trade.price;
        return {
          ...trade,
          total,
        };
      });
    },
  },
  methods: {
    coinCardData(coinCard, index) {
      return {
        ...coinCard,
        isActive: this.activeCardIndex === index,
      };
    },
    addStrategy() {
      this.addStrategyModal = true;
    },
    completeOrErrorClass(bool) {
      return bool === true ? 'has-text-caribbean-green' : 'has-text-cerise';
    },
    setChartWithCoinData(index) {
      this.coinCards = this.coinCards.map((coinCard) => ({
        ...coinCard,
        isActive: false,
      }));
      this.coinCards[index].isActive = true;
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
