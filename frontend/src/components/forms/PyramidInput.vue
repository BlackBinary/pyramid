<template lang="pug">
  input.input(v-model="computedValue" :type="type" :placeholder="placeholder")
</template>

<script>
export default {
  name: 'PyramidInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: 'Type text here',
    },
  },
  data() {
    return {
      newValue: this.value,
    };
  },
  computed: {
    computedValue: {
      get() {
        return this.newValue;
      },
      set(value) {
        this.newValue = value;
        this.$emit('value', value);
      },
    },
  },
};
</script>

<style lang="scss">
.input {
  background: transparent;
  border: 0px solid transparent;
  border-bottom: 1px solid $blackCoral;
  line-height: 35px;
  color: $white;
  width: 100%;

  transition: border-color 0.2s 0s ease;

  &:focus {
    outline: none;
    border-color: $white;
  }
}
</style>
