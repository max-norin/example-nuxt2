import Vue from 'vue'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import { integer, maxLength, required } from 'vuelidate/lib/validators'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

export default class ProductCharacteristic extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      marketplace_characteristic_id: null,
      characteristic_id: null,
      value: null,
    }
  },
  props: {
    product: { required: true },
  },
  validations: {
    marketplace_characteristic_id: { integer },
    characteristic_id: { required, integer },
    value: {
      required: function (val) {return !!this.marketplace_characteristic_id || required(val)},
      maxLength: maxLength(255),
    },
  },
  created () { },
  computed: {
    category () {
      return this.product.category
    },
    characteristic () {
      return this.characteristic_id
        ? this.product.category.characteristic_obj[this.characteristic_id]
        : null
    },
    marketplace_characteristic () {
      return this.marketplace_characteristic_id && this.characteristic
        ? this.characteristic.marketplace_characteristic_obj[this.marketplace_characteristic_id]
        : null
    },
    marketplace_product_characteristics () {
      return this.product.product_characteristics.filter(ch => {
        return ch.characteristic === this.characteristic && ch.marketplace_characteristic
      })
    },
    marketplace_product_characteristic_map () {
      const map = new Map()
      for (let i = 0; i < this.marketplace_product_characteristics.length; i++) {
        const mpc = this.marketplace_product_characteristics[i]
        if (mpc.marketplace_characteristic && mpc.marketplace_characteristic.marketplace) {
          map.set(mpc.marketplace_characteristic.marketplace, mpc)
        }
      }
      return map
    },
    mppcm () {
      return this.marketplace_product_characteristic_map
    },

  },
  methods: {
    toApi () {
      let result = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        result = false
      }

      if (!result) {
        return false
      }

      return {
        id: this.id,
        marketplace_characteristic_id: this.marketplace_characteristic_id,
        characteristic_id: this.characteristic_id,
        value: this.value,
      }
    },
    set (record) {
      this.id = record.id
      this.marketplace_characteristic_id = record.marketplace_characteristic_id
      this.characteristic_id = record.characteristic_id
      this.value = record.value
    },
    addMarketplaceProductCharacteristic (marketplace, value = '') {
      const marketplace_characteristic = this.characteristic.marketplace_characteristic_map.get(marketplace)
      const data = {
        marketplace_characteristic_id: marketplace_characteristic.id,
        characteristic_id: this.characteristic_id,
        value,
      }
      const record = new ProductCharacteristic({ data, store: this.$store, propsData: { product: this.product } })
      this.product.product_characteristics.push(record)
    },
    hasMarketplaceCharacteristic (marketplace) {
      return this.characteristic
        ? this.characteristic.marketplace_characteristic_map.has(marketplace)
        : false
    },
    remove () {
      this.product.removeProductCharacteristic(this)
    },
  },
}) {}

