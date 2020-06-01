<template lang="pug">
  .pyramid-card
    .pyramid-card--title-row
      slot(name="title")
    .pyramid-card--content-row
      slot(name="content")
</template>

<script>
export default {
  name: 'PyramidCard',
};
</script>

<style lang="scss">
.pyramid-card {
  display: block;
  padding: 20px;
  border-radius: 5px;
  background: $gunMetal;
  position: relative;

  .coin-card--title-row {
    padding: 20px 0;
  }

  .coin-card--content-row {
    padding: 20px 0;
  }
}
</style>
