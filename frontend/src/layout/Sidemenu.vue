<template lang="pug">
  div.layout-basic
    .sidemenu
      img.logo(alt="Pyramid Project Logo" src="@assets/logo-white.svg")
      span.pyramid-name Pyramid
      div.navigation
        router-link.nav-item(v-for="item in menuItems" :to="item.to" :key="item.title")
          .fal.nav-item--icon(:class="item.class")
          span.nav-item--title {{ item.title }}
    .content
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
          class: 'fa-tachometer-fast',
        },
        {
          to: {
            name: 'Strategies',
          },
          title: 'Strategies',
          class: 'fa-chess',
        },
        {
          to: {
            name: 'PaperTrader',
          },
          title: 'PaperTrader',
          class: 'fa-toilet-paper',
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
  background: $raisinBlack;

  .sidemenu {
    min-height: 100vh;
    background: $gunMetal;
    width: 108px;
    text-align: center;
    padding: 15px 15px;
    box-sizing: border-box;
    position: fixed;

    .pyramid-name {
      font-weight: 600;
      font-size: 10.5px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .logo {
      object-fit: scale-down;
      padding: 6px;
      height: 50px;
      width: 50px;
    }

    .navigation {
      margin-top: 25px;
      padding: 25px 0;
      border-top: 1px solid $blackCoral;

      .nav-item {
        display: block;
        position: relative;
        width: 100%;
        height: 55px;
        line-height: 55px;
        color: $blackCoral;
        transition: all 0.3s 0s ease;

        .nav-item--icon {
          font-size: 18px;
        }

        .nav-item--title {
          position: absolute;
          display: block;
          opacity: 0;
          top: 50%;
          left: -200%;
          line-height: 20px;
          font-size: 12px;
          background: $black;
          border-radius: 2px;
          padding: 0 6px;
          font-size: 9px;
          margin-top: -13px;
          margin-left: 20px;
          color: $white;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;

          transition: left 0.3s 0.1s ease, opacity 0.1s 0s ease;
        }

        &:hover {
          color: $white;

          .nav-item--title {
            display: block;
            left: 50%;
            opacity: 1;

            transition: left 0.3s 0s ease, opacity 0.1s 0.2s ease;
          }
        }

        &.router-link-active {
          color: $white;
        }
      }
    }
  }

  .content {
    margin-left: 108px;
    padding: 93px 114px;
  }
}
</style>
