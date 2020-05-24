<template lang="pug">
TradingVue(
  :data="chartData"
  :color-back="colors.colorBack"
  :color-grid="colors.colorGrid"
  :color-text="colors.colorText"
  :color-candle-up="colors.colorCandleUp"
  :color-candle-dw="colors.colorCandleDw"
  :color-wick-up="colors.colorWickUp"
  :color-wick-dw="colors.colorWickDw"
  :color-scale="colors.colorScale"
  :font="font"
  :width="1600"
  :height="550"
)
</template>

<script>
import TradingVue from 'trading-vue-js';

export default {
  name: 'PyramidCandleChart',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    timeframe: {
      type: String,
      default: '1m',
    },
  },
  data() {
    return {
      ohlcv: null,
      colors: {
        colorBack: '#272731',
        colorGrid: '#454554',
        colorText: '#D8D8D8',
        colorCandleUp: '#09CEA4',
        colorCandleDw: '#EF0264',
        colorWickUp: '#09CEA4',
        colorWickDw: '#EF0264',
        colorScale: '#454554',
      },
      font: '12px "Montserrat", sans-serif',
    };
  },
  computed: {
    chartData() {
      return {
        chart: {
          type: 'Candles',
          data: this.data.map(({
            time, close, high, low, open, volume,
          }) => ([time, open, high, low, close, volume])),
          tf: this.timeframe,
        },
      };
    },
  },
  components: {
    TradingVue,
  },
};
</script>

<style lang="scss">
  .t-vue-title {
    display: none;
  }
</style>
