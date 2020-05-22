<template lang="pug">
  div.layout-basic
    .row.topbar
      img.topbar-logo(alt="Pyramid Project Logo" src="@assets/logo-login.png")
    .row
      .col-xs-2.sidemenu
        router-link.nav-item(v-for="item in menuItems" :to="item.to" :key="item.title")
          .far(:class="item.class")
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
    .topbar {
      height: 62px;
      background: lighten($gunMetal, 20%);;
      .topbar-logo {
        object-fit: scale-down;
        padding: 6px;
        height: 50px;
        width: 50px;
      }
    }
    .sidemenu {
      min-height: calc(100vh - 62px);
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
        .far {
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
