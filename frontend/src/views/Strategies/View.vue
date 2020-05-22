<template lang="pug">
  div
    h2 Strategy
    p {{ strategyId }}
</template>

<script>
export default {
  data() {
    return {
      strategyId: this.$route.params.strategyId,
    };
  },
};
</script>
