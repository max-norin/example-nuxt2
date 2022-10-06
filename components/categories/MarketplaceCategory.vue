<template>
  <section v-if="category_marketplace">
    <form-group
        v-if="marketplace.original_categories.length > 0"
        :validator="category_marketplace.$v.key"
        :server-errors.sync="category_marketplace.serverErrors.key"
        v-slot="{ slotInput }"
    >
      <m-pag-select
          :options="marketplace.original_categories"
          :get-option-label="o=> (typeof o !== 'object' ? o : o.title)"
          :class="{ 'input-error': !category_marketplace.key }"
          :title="category_marketplace.isInvalid ? 'Нет соответствия' : ''"
          v-model="category_marketplace"
          :disabled="isSaving"
          :get-option-key="o=> o.title"
          @input="slotInput"
      />
    </form-group>
    <div v-else class="td-inner">
      <span>{{ category_marketplace.title }}</span>
      <b-button
          icon-left="reload"
          :loading="isLoadingData"
          @click="loadCategories()"
      />
    </div>
  </section>
  <b-icon
      v-else
      icon="plus"
      @click.native="()=>{ category.addMarketplaceCategory(marketplace); loadCategories()}"
  />
</template>

<script>
import paginationMixin from '~/utils/mixins/paginationMixin'
import loadDataMixin from '~/utils/mixins/loadDataMixin'
import serverErrorsMixins from '~/utils/mixins/serverErrorsMixins'
import MPagSelect from './MPagSelect'
import MarketplaceCharacteristic from './MarketplaceCharacteristic'
import MarketplaceCharacteristicTools from './MarketplaceCharacteristicTools'
import { unknownServerErrorToast } from '~/utils/errors/ServerError'
import loadCategories from '~/middleware/marketplace/categories'
import FormGroup from '../common/FormGroup'

export default {
  name: 'MarketplaceCategory',
  mixins: [loadDataMixin, paginationMixin, serverErrorsMixins],
  components: { FormGroup, MarketplaceCharacteristicTools, MarketplaceCharacteristic, MPagSelect },
  props: {
    category: { required: true },
    marketplace: { required: true },
    isSaving: { required: true, type: Boolean },
  },
  async mounted () {},
  computed: {
    category_marketplace: {
      get () {
        return this.category.mcm.has(this.marketplace)
            ? this.category.mcm.get(this.marketplace)
            : null
      },
      set (original_category) {
        this.category.mcm.get(this.marketplace).setByOriginalCategory(original_category)
      },
    },
  },
  methods: {
    async loadCategories () {
      try {
        await this.loadData([
          loadCategories(this.$root.context),
        ])
      }
      catch (e) {
        unknownServerErrorToast()
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.input-error {
  border-color: red;

  /deep/ {
    > * {
      border-color: inherit;
    }
  }
}
</style>
