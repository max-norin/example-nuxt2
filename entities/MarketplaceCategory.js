import Vue from 'vue'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import { maxLength, required } from 'vuelidate/lib/validators'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

export default class MarketplaceCategory extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      category_id: null,
      marketplace_id: null,
      key: null,
      title: null,
    }
  },
  props: {
    category: { required: true },
  },
  validations: {
    key: { required, maxLength: maxLength(255) },
    title: { required, maxLength: maxLength(255) },
  },
  created () {},
  computed: {
    marketplace () {
      return this.$store.getters.MARKETPLACE_MAP[this.marketplace_id]
    },
    original_category () {
      return this.marketplace.getOriginalCategory(this)
    },
    marketplace_characteristics () {
      return this.category.characteristics.reduce((arr, c) => {
        const result = c.marketplace_characteristics.find(mc => mc.marketplace_category === this)
        if (result) {
          arr.push(result)
        }
        return arr
      }, [])
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
        key: this.key,
        title: this.title,

        marketplace_id: this.marketplace.id,
      }
    },
    set (record) {
      this.id = record.id
      this.key = record.key
      this.title = record.key
    },
    setByOriginalCategory (original_category) {
      this.key = original_category.title
      this.title = original_category.title
    },
    resetByOriginalCategory () {
      for (let i = 0; i < this.marketplace_characteristics.length; i++) {
        const marketplace_characteristic = this.marketplace_characteristics[i]
        const original_characteristic = this.original_category.getOriginalCharacteristic(marketplace_characteristic)

        if (original_characteristic) {
          marketplace_characteristic.setByOriginalCharacteristic(original_characteristic)
        }
      }
    },
  },
}) {}


