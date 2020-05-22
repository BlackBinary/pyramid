<template lang="pug">
  .row.layout-basic
    .col-xs-3.sidemenu
      router-link.nav-item(v-for="item in menuItems" :to="item.to" :key="item.title")
        i.fa.fal(:class="item.class")
        p {{ item.title }}
    .col-xs-9
      router-view
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        {
          to: {
            name: 'Home',
          },
          title: 'Home',
          class: 'fa-home',
        },
        {
          to: {
            name: 'Strategies',
          },
          title: 'Strategies',
          class: 'fa-lightbulb',
        },
        {
          to: {
            name: 'PaperTrader',
          },
          title: 'PaperTrader',
          class: 'fa-scroll',
        },
        {
          to: {
            name: 'Account',
          },
          title: 'Account',
          class: 'fa-user',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
  .layout-basic {
    min-height: 100vh;
    .sidemenu {
      background: linear-gradient(to right, $cerise, $qocuelicot);
      -webkit-mask-image: linear-gradient(white,transparent);
      mask-image: linear-gradient(white,transparent);
      padding-top: 10px;
      .nav-item {
        text-decoration: none;
        display: flex;
        margin: 5px;
        padding: 16px;
        background: $blackCoral;
        border-radius: 12px;
        font-family: $baseFont;
        color: $white;
        display: flex;
        &:hover {
          background: $gunMetal;
        }
        i {
          margin-right: 10px;
        }
      }
    }
  }
</style>
