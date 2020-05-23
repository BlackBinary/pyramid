<template lang="pug">
  .toast(:class="toastClass")
    i.fal(:class="toastIcon")
    span.toast--message {{ toast.message }}
</template>

<script>
export default {
  name: 'PyramidToaster',
  props: {
    value: {
      type: Object,
      default: () => ({
        message: 'Add a message',
        type: 'success',
      }),
    },
  },
  computed: {
    toast() {
      return this.value;
    },
    toastClass() {
      switch (this.toast.type) {
        case 'warning':
          return 'is-warning';
        case 'success':
          return 'is-success';
        case 'error':
          return 'is-error';
        default:
          return '';
      }
    },
    toastIcon() {
      switch (this.toast.type) {
        case 'warning':
          return 'fa-exclamation-triangle';
        case 'success':
          return 'fa-badge-check';
        case 'error':
          return 'fa-bomb';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss">
  .toast {
    display: inline-block;
    padding: 15px 30px 15px 20px;
    border-radius: 6px;
    line-height: 25px;
    background: $blue;
    margin-bottom: 20px;
    font-weight: 600;

    i {
      font-size: 15px;
      margin-right: 15px;
    }

    &.is-success {
      background: $caribbeanGreen;
    }

    &.is-warning {
      background: $qocuelicot;
    }

    &.is-error {
      background: $cerise;
    }
  }
</style>
