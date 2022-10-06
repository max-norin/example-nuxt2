import Vue from 'vue'
import MarketplaceCharacteristic from './MarketplaceCharacteristic'
import ServerError from '~/utils/errors/ServerError'
import { maxLength, required } from 'vuelidate/lib/validators'
import Vuelidate from 'vuelidate'
import serverErrorsMixins from '~/utils/mixins/serverErrorsMixins'
import getMap from '~/utils/getMap'

Vue.use(Vuelidate)

export default class Characteristic extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      category_id: null,
      title: null,

      marketplace_characteristics: [],
    }
  },
  props: {
    category: { required: true },
  },
  validations: {
    title: { required, maxLength: maxLength(255) },
  },
  created () {
    this.marketplace_characteristics = this.marketplace_characteristics.map(i => {
      const marketplace_category = this.category.marketplace_category_obj[i.marketplace_category_id]
      const propsData = { marketplace_category, characteristic: this }
      return new MarketplaceCharacteristic({ data: i, store: this.$store, propsData })
    })
  },
  computed: {
    marketplace_characteristic_map () {
      const map = new Map()
      if (this.marketplace_characteristics && this.marketplace_characteristics.length > 0) {
        const marketplace_obj = this.$store.getters.MARKETPLACE_MAP
        for (let i = 0; i < this.marketplace_characteristics.length; i++) {
          const mc = this.marketplace_characteristics[i]
          if (mc.characteristic_id && marketplace_obj[mc.characteristic_id]) {
            const marketplace = marketplace_obj[mc.characteristic_id]
            map.set(marketplace, mc)
          }
          else if (mc.marketplace) {
            map.set(mc.marketplace, mc)
          }
        }
      }
      return map
    },
    mcm () {
      return this.marketplace_characteristic_map
    },
    marketplace_characteristic_obj () {
      return getMap(this.marketplace_characteristics, 'id')
    },
    lower_case_title () {
      return this.title
        ? this.title.toLowerCase()
        : null
    },
  },
  methods: {
    toApi () {
      let result = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        result = false
      }
      const data = {
        id: this.id,
        title: this.title,

        marketplace_characteristics: [],
      }
      for (let i = 0; i < this.marketplace_characteristics.length; i++) {
        const record = this.marketplace_characteristics[i].toApi()
        if (!record) {
          result = false
        }
        data.marketplace_characteristics.push(record)
      }

      if (!result) {
        return false
      }

      return data
    },
    set (record) {
      this.id = record.id
      this.title = record.title

      const marketplace_characteristics_length = this.marketplace_characteristics.length
      if (marketplace_characteristics_length !== record.marketplace_characteristics.length) {
        throw new ServerError({}, 'Произошла ошибка сохранения в marketplace_characteristics', true)
      }

      for (let i = 0; i < marketplace_characteristics_length; i++) {
        this.marketplace_characteristics[i].set(record.marketplace_characteristics[i])
      }
    },
    remove () {
      this.category.removeCharacteristic(this)
    },
    setMarketplaceCharacteristic (marketplace, original_characteristic) {
      if (this.mcm.has(marketplace)) {
        const mc = this.mcm.get(marketplace)
        mc.setByOriginalCharacteristic(original_characteristic)
      }
      else if (this.category.marketplace_category_map.has(marketplace)) {
        const marketplace_category = this.category.marketplace_category_map.get(marketplace)
        this.addMarketplaceCharacteristic(marketplace_category, original_characteristic)
      }
    },
    addMarketplaceCharacteristic (marketplace_category, original_characteristic) {
      const record = new MarketplaceCharacteristic({ data: {}, store: this.$store, propsData: { marketplace_category, characteristic: this } })
      record.setByOriginalCharacteristic(original_characteristic)
      this.marketplace_characteristics.push(record)
    },
  },
}) {}
