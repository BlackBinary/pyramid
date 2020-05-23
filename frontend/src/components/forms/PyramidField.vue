<template lang="pug">
  .field
    i.fal(v-if="icon" :class="icon")
    slot
</template>

<script>
export default {
  name: 'PyramidField',
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.field {
  display: flex;
  .fal {
    margin-right: 10px;
    font-size: 16px;
    line-height: 38px;
    color: $blackCoral;
  }

  .input {
    margin-bottom: 10px;
  }
}
</style>
