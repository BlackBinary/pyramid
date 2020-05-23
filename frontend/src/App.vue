<template lang="pug">
  div#app
    router-view
    transition-group.messageArea(name="slide-in-right" tag="ul")
      li(v-for="(toaster, index) in toasters" :key="`toaster_${index}`")
        PyramidToaster(
          :value="toaster"
        )
</template>

<script>
export default {
  computed: {
    toasters() {
      return this.$store.state.toasters;
    },
  },
  components: {
    PyramidToaster: () => import('@frontend/components/alerts/PyramidToaster'),
  },
};
</script>

<style lang="scss">
#app {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


.messageArea {
  position: fixed;
  top: 50px;
  right: 50px;
  text-align: right;
  pointer-events: none;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 901;
}
</style>
