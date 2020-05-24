<template lang="pug">
div
  .tabs.m-b-lg
    ul
      li(v-for="(tab, index) in tabs" :class="{ 'is-active': tab.isActive }")
        a(:href="tab.href" @click="selectTab(tab, index)" :ref="`tab_${index}`") {{ tab.name }}
    .active-bar(ref="activeBar")
  .tabs-details
    slot
</template>

<script>
export default {
  name: 'PyramidTabs',
  data() {
    return {
      tabs: [],
    };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab, index) {
      this.tabs = this.tabs.map((tab) => {
        const clonedTab = tab;
        clonedTab.isActive = (clonedTab.name === selectedTab.name);
        return clonedTab;
      });


      // animated the active tab selector
      const [activeTab] = this.$refs[`tab_${index}`];
      const { activeBar } = this.$refs;
      activeBar.style.width = `${activeTab.offsetWidth / 2}px`;
      activeBar.style.left = `${activeTab.offsetLeft}px`;
    },
  },
};
</script>

<style lang="scss">
.tabs {
  position: relative;

  .active-bar {
    display: block;
    background: $neonBlue;
    height: 4px;
    position: absolute;
    bottom: 0;
    left: 0;
    min-width: 20px;

    transition: all 0.2s 0s ease-in-out;
  }

  ul {
    list-style: none;

    li {
      display: inline-block;

      a {
        display: block;
        font-size: 15px;
        padding: 20px 20px 20px 0;
        color: $blackCoral;
        cursor: pointer;
        min-width: 125px;

        &:hover {
          text-decoration: none;
        }
      }

      &.is-active {
        a {
          font-weight: 800;
          color: $white;
        }
      }
    }
  }
}
.tabs-details {
  background: $gunMetal;
  border-radius: 5px;
  padding: 15px;
}
</style>
