<template lang="pug">
  transition(name="modal-transition")
    .pyramid-modal
      .pyramid-modal--background(@click="close()")
      .pyramid-modal--card
        .pyramid-modal--title(v-if="slotTitle")
          slot(name="title")
          .fal.fa-times.pyramid-modal--close(@click="close()")
        .pyramid-modal--content(v-if="slotContent")
          slot(name="content")
        .pyramid-modal--footer(v-if="slotFooter")
          slot(name="footer")
</template>

<script>
export default {
  name: 'PyramidModal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isOpen: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    slotTitle() {
      return this.$slots.title;
    },
    slotContent() {
      return this.$slots.content;
    },
    slotFooter() {
      return this.$slots.footer;
    },
  },
  methods: {
    close() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss">
.pyramid-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 900;

  &--background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($raisinBlack, 0.5);
  }

  &--card {
    position: relative;
    background: $gunMetal;
    border-radius: 7px;
    width: 350px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 40px);
    box-shadow: 0 15px 25px 0 rgba($shadowColor, 0.6);


    .pyramid-modal--close {
      color: $white;
      top: 30px;
      right: 30px;
      position: absolute;
      z-index: 2;
      font-size: 18px;
      cursor: pointer;
    }

    .pyramid-modal--title {
      padding: 20px;
      height: 40px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .pyramid-modal--content {
      padding: 20px;
      color: $white;
      -webkit-overflow-scrolling: touch;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: auto;
    }

    .pyramid-modal--footer {
      padding: 20px;
      height: 40px;
      flex-shrink: 0;
    }
  }
}
</style>
