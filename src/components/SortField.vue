<template>
  <span>
    <span>{{field}}</span>
    <span v-if="currentSort === field">
      <i v-if="currentSortDir === 'desc'" class="fa fa-sort-amount-down" aria-hidden="true"></i>
      <i v-if="currentSortDir === 'asc'" class="fa fa-sort-amount-up" aria-hidden="true"></i>
    </span>
  </span>
</template>

<script>

export default {
  name: 'sort-field',

  props: {
    field: String,
    currentSort: String,
    currentSortDir: String
  },

  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
