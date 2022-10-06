<template>
  <td>
    <div class="td-inner">
      <template v-if="!marketplace_category">
      </template>
      <template v-else-if="original_characteristics.length > 0">
        <m-pag-select
            :options="original_noselect_characteristics"
            :get-option-label="o=> o ? o.armdl_title : o"
            v-model="marketplace_characteristic"
            :class="{ 'input-warn': marketplace_characteristic && marketplace_characteristic.isEdited }"
            :get-option-key="o=> o ? o.armdl_key : o"
            :disabled="disabled"
        />
      </template>
      <template v-else-if="marketplace_characteristic">
        <span>{{ marketplace_characteristic.title }}</span>
      </template>
      <template v-else>
        не определено
      </template>
      <characteristic-tools :marketplace_characteristic="marketplace_characteristic"/>
    </div>
  </td>
</template>

<script>
import paginationMixin from '~/utils/mixins/paginationMixin'
import loadDataMixin from '~/utils/mixins/loadDataMixin'
import serverErrorsMixins from '~/utils/mixins/serverErrorsMixins'
import MPagSelect from './MPagSelect'
import CharacteristicTools from '../common/CharacteristicTools'

export default {
  name: 'MarketplaceCharacteristic',
  mixins: [loadDataMixin, paginationMixin, serverErrorsMixins],
  components: { CharacteristicTools, MPagSelect },
  props: {
    characteristic: { required: true },
    category: { required: true },
    marketplace: { required: true },
    disabled: { required: true, type: Boolean },
  },
  data () {
    return {}
  },
  async mounted () {},
  computed: {
    marketplace_category () {
      return this.category.mcm.has(this.marketplace)
          ? this.category.mcm.get(this.marketplace)
          : null
    },
    original_category () {
      return this.marketplace.getOriginalCategory(this.marketplace_category)
    },
    original_characteristics () {
      return this.original_category
          ? this.original_category.original_characteristics
          : []
    },
    original_noselect_characteristics () {
      return this.original_characteristics.filter(oc => !this.marketplace_characteristics.find(mc => mc.key === oc.armdl_key))
    },
    original_characteristic_obj () {
      return this.original_category
          ? this.original_category.original_characteristic_obj
          : []
    },
    marketplace_characteristics () {
      return this.marketplace_category.marketplace_characteristics
    },
    marketplace_characteristic: {
      get () {
        return this.characteristic.mcm.has(this.marketplace)
            ? this.characteristic.mcm.get(this.marketplace)
            : null
      },
      set (original_characteristic) {
        this.characteristic.setMarketplaceCharacteristic(this.marketplace, original_characteristic)
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.td-inner {
  > :first-child {
    width: 100%;

    /deep/ {
      > * {
        width: 100%;
      }
    }
  }
}

.input-warn {
  border-color: #ffc400;

  /deep/ {
    > * {
      border-color: inherit;
    }
  }
}
</style>
