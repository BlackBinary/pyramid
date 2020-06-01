<template lang="pug"e>
.vue-select(v-if="checkOptions", :style="'width:' + width + 'px'")
  select(:id="id", :name="name", @change="onChange")
    option(v-for="option in options", :key="option.value", :value="option.value") {{ option.label }}
  i.fal.fa-chevron-down.select--icon
</template>

<style lang="scss" scoped>
.vue-select {
  color: $white;
  border-bottom: 1px solid $blackCoral;
  display: inline-block;
  font-family: inherit;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 160px;

  select {
    color: $white;
    -webkit-appearance: none;
    background: transparent;
    background-image: none;
    padding: 5px 8px 5px 0;
    box-shadow: none;
    font-size: 14px;
    width: 130%;
    border: 0;
    &:focus {
      outline: none;
    }
  }
  .select--icon {
    color: $blackCoral;
    transition: opacity 0.5s;
    position: absolute;
    opacity: 0.5;
    right: 5px;
    top: 7px;
  }
  &:hover {
    .select--icon {
      opacity: 1;
    }
  }
}
</style>

<script>
export default {
  name: 'PyramidSelect',
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: 'select',
    },
    width: {
      type: Number,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    checkOptions() {
      if (this.options.length) {
        return this.options;
      }
      window.console.error(`${this.name} couldn't render without options`);
      return false;
    },
  },
  methods: {
    onChange(selected) {
      this.$emit('input', selected.target.id);
    },
  },
};
</script>
