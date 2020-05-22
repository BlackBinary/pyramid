<template lang="pug">
  .row.layout-basic
    .col-xs-2.sidemenu
      router-link.nav-item(v-for="item in menuItems" :to="item.to" :key="item.title")
        i.fa.fal(:class="item.class")
        p {{ item.title }}
      img.sidemenu-background(alt="Pyramid Project Gradient" src="@assets/login-background.png")
    .col-xs-10
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
      background: $gunMetal;
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
          background: lighten($blackCoral, 20%);
        }
        i {
          margin-right: 10px;
        }
      }
      .sidemenu-background {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
</style>
