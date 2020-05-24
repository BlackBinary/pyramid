<template lang="pug">
.pyramid-datatable
  table
    thead
      tr
        th(v-for="header in headers") {{ header.name }}
    tbody
      tr(v-for="row in rows")
        slot(v-bind:row="row")
</template>

<script>
export default {
  name: 'PyramidDataTable',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
.pyramid-datatable {
  table {
    width: 100%;
    text-align: left;

    th {
      color: $blackCoral;
      text-transform: uppercase;
      letter-spacing: 4px;
      font-size: 10px;
    }

    th, td {
      padding: 10px;
      font-weight: 600;

      &:first-child {
        padding-left: 30px;
      }

      &:last-child {
        padding-right: 30px;
      }
    }

    tbody {
      tr {
        &:hover {
          background: rgba(lighten($blackCoral, 0.1%), 0.4);
        }
        &:nth-child(even) {
          background: rgba(lighten($blackCoral, 0.1%), 0.2);

          &:hover {
            background: rgba(lighten($blackCoral, 0.1%), 0.4);
          }
        }
      }
    }
  }
}
</style>
