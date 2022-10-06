<template>
  <section>
    <form-group
        v-if="product_characteristic.hasMarketplaceCharacteristic(marketplace)"
        :validator="$v"
        :server-errors.sync="serverErrors"
        v-slot="{ slotInput }"
    >
      <b-input
          type="text"
          ref="input"
          v-model.trim="$model"
          :placeholder="product_characteristic.value"
          :disabled="disabled"
          @input="slotInput"
      />
    </form-group>
    <characteristic-tools
        :marketplace_characteristic="marketplace_characteristic"
    />
  </section>
</template>

<script>
import FormGroup from '~/components/common/FormGroup'
import CharacteristicTools from '../common/CharacteristicTools'

export default {
  name: 'MarketplaceProductCharacteristic',
  components: { CharacteristicTools, FormGroup },
  props: {
    product_characteristic: { required: true },
    marketplace: { required: true },
    disabled: { required: true, type: Boolean },
  },
  data () {
    return {}
  },
  async mounted () {},
  computed: {
    $v () {
      return this.marketplace_product_characteristic
          ? this.marketplace_product_characteristic.$v.value
          : undefined
    },
    serverErrors () {
      return this.marketplace_product_characteristic
          ? this.marketplace_product_characteristic.serverErrors.value
          : []
    },
    $model: {
      get () {
        return this.marketplace_product_characteristic
            ? this.marketplace_product_characteristic.value
            : null
      },
      set (value) {
        if (this.marketplace_product_characteristic) {
          this.marketplace_product_characteristic.value = value
        }
        else {
          this.product_characteristic.addMarketplaceProductCharacteristic(this.marketplace, value)
        }
      },
    },
    marketplace_characteristic () {
      return this.product_characteristic.characteristic && this.product_characteristic.characteristic.mcm.has(this.marketplace)
          ? this.product_characteristic.characteristic.mcm.get(this.marketplace)
          : null
    },
    marketplace_product_characteristic () {
      return this.product_characteristic.mppcm.has(this.marketplace)
          ? this.product_characteristic.mppcm.get(this.marketplace)
          : null
    },
  },
  methods: {},
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
section {
  display: flex;
  align-items: center;

  /deep/ {
    .field {
      margin: 0;
    }
  }
}
</style>
