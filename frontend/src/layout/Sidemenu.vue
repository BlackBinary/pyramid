<template lang="pug">
  .row
    .col-xs-2
      ul
        li
          router-link(:to="{ name: 'Home' }") Home
        li
          router-link(:to="{ name: 'Strategies' }") Strategies
        li
          router-link(:to="{ name: 'PaperTrader' }") Paper Trader
        li
          router-link(:to="{ name: 'Home' }") Account
    .col-xs-10
      router-view
</template>

<style lang="scss">
</style>
