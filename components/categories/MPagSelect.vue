<template>
  <v-select
      :options="paginated"
      v-model="computedValue"
      :filterable="false"
      @search="onSearch"
      :disabled="disabled"
      :get-option-key="getOptionKey"
      :get-option-label="getOptionLabel"
      :clearable="false"
  >
    <template #list-footer>
      <li class="pagination">
        <b-button :disabled="!hasPrevPage" @click="offset -= limit" icon-left="chevron-left"/>
        <b-button :disabled="!hasNextPage" @click="offset += limit" icon-left="chevron-right"/>
      </li>
    </template>
  </v-select>
</template>

<script>
import VSelect from 'vue-select'

export default {
  name: 'm-pag-select',
  components: { VSelect },
  props: {
    value: {},
    options: { required: true, type: Array },
    getOptionKey: {},
    getOptionLabel: {},
    disabled: { type: Boolean, default: _ => false },
  },
  data () {
    return {
      newValue: this.value,
      search: '',
      offset: 0,
      limit: 10,
    }
  },
  async mounted () {},
  computed: {
    computedValue: {
      get () {
        return this.newValue
      },
      set (value) {
        this.newValue = value
        this.$emit('input', value)
      },
    },
    filtered () {
      return this.options.filter((option) => {
        const label = this.getOptionLabel ? this.getOptionLabel(option) : option
        return label.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
      })
    },
    paginated () {
      return this.filtered.slice(this.offset, this.limit + this.offset)
    },
    hasNextPage () {
      const nextOffset = this.offset + this.limit
      return Boolean(
          this.filtered.slice(nextOffset, this.limit + nextOffset).length,
      )
    },
    hasPrevPage () {
      const prevOffset = this.offset - this.limit
      return Boolean(
          this.filtered.slice(prevOffset, this.limit + prevOffset).length,
      )
    },
    key () {
      return this.getOptionKey ? this.getOptionKey(this.value) : this.value
    },
  },
  methods: {
    onSearch (query) {
      this.search = query
      this.offset = 0
    },
  },
  watch: {
    value (value) {
      this.newValue = value
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
