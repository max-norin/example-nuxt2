import Vue from 'vue'
import { integer, maxLength, required } from 'vuelidate/lib/validators'
import Vuelidate from 'vuelidate'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import ProductCharacteristic from './ProductCharacteristic'
import ServerError from '../utils/errors/ServerError'

Vue.use(Vuelidate)

export default class Product extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      title: null,
      code: null,
      category_id: null,

      product_characteristics: [],
    }
  },
  validations: {
    title: { required, maxLength: maxLength(255) },
    code: { required, maxLength: maxLength(255) },
    category_id: { required, integer },
  },
  created () {
    this.product_characteristics = this.product_characteristics.map(i => {
      return new ProductCharacteristic({ data: i, store: this.$store, propsData: { product: this } })
    })
  },
  computed: {
    category () {
      return this.$store.getters['market/CATEGORY_MAP'][this.category_id]
    },
    market_product_characteristics () {
      return this.product_characteristics.filter(ch => !ch.marketplace_characteristic)
    },
    noselect_characteristics () {
      return this.category.characteristics.filter(ch => !this.market_product_characteristics.find(pch => pch.characteristic === ch))
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
        code: this.code,
        category_id: this.category_id,

        product_characteristics: [],
      }

      for (let i = 0; i < this.product_characteristics.length; i++) {
        const record = this.product_characteristics[i].toApi()
        if (!record) {
          result = false
        }
        data.product_characteristics.push(record)
      }

      if (!result) {
        return false
      }

      return data
    },
    set (record, copy = false) {
      this.id = record.id
      this.title = record.title
      this.code = record.code
      this.category_id = record.category_id

      if (copy) {
        this.product_characteristics = record.product_characteristics
          ? record.product_characteristics.slice()
          : []
      }
      else {
        const product_characteristics_length = this.product_characteristics.length
        if (product_characteristics_length !== record.product_characteristics.length) {
          throw new ServerError({}, 'Произошла ошибка сохранения в product_characteristics', true)
        }

        for (let i = 0; i < product_characteristics_length; i++) {
          this.product_characteristics[i].set(record.product_characteristics[i])
        }
      }

      this.$v.$reset()
    },
    getUrl () {
      return `${Product.URL_PREFIX}${this.id ? `/${this.id}` : ''}`
    },
    addProductCharacteristic (data = {}) {
      const record = new ProductCharacteristic({ data, store: this.$store, propsData: { product: this } })
      this.product_characteristics.push(record)
      return record
    },
    removeProductCharacteristic (product_characteristic) {
      const index = this.product_characteristics.findIndex(item => item === product_characteristic)
      this.product_characteristics.splice(index, 1)
    },
    addAllProductCharacteristics () {
      const noselect_characteristics = this.noselect_characteristics.slice()
      for (let i = 0; i < noselect_characteristics.length; i++) {
        const data = { characteristic_id: noselect_characteristics[i].id }
        this.addProductCharacteristic(data)
      }
    },
  },
}) {}

Object.defineProperty(Product, 'URL_PREFIX', {
  value: 'products',
  writable: false,
  configurable: false,
})
