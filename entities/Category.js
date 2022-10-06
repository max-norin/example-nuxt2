import Vue from 'vue'
import { maxLength, required } from 'vuelidate/lib/validators'
import Vuelidate from 'vuelidate'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import MarketplaceCategory from './MarketplaceCategory'
import Characteristic from './Characteristic'
import getMap from '~/utils/getMap'
import ServerError from '../utils/errors/ServerError'

Vue.use(Vuelidate)

export default class Category extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      title: null,

      marketplace_categories: [],
      characteristics: [],
    }
  },
  validations: {
    title: { required, maxLength: maxLength(255) },
  },
  created () {
    this.marketplace_categories = this.marketplace_categories.map(i => {
      return new MarketplaceCategory({ data: i, store: this.$store, propsData: { category: this } })
    })
    this.characteristics = this.characteristics.map(i => {
      return new Characteristic({ data: i, store: this.$store, propsData: { category: this } })
    })
  },
  computed: {
    marketplace_category_map () {
      const map = new Map()
      if (this.marketplace_categories && this.marketplace_categories.length > 0) {
        const marketplace_map = this.$store.getters.MARKETPLACE_MAP
        for (let i = 0; i < this.marketplace_categories.length; i++) {
          const cm = this.marketplace_categories[i]
          if (marketplace_map[cm.marketplace_id]) {
            const marketplace = marketplace_map[cm.marketplace_id]
            map.set(marketplace, cm)
          }
        }
      }
      return map
    },
    mcm () {
      return this.marketplace_category_map
    },
    marketplace_category_obj () {
      return getMap(this.marketplace_categories, 'id')
    },
    characteristic_obj () {
      return getMap(this.characteristics, 'id')
    },
    characteristic_obj_title () {
      return getMap(this.characteristics, 'title')
    },
    characteristic_obj_lower_case_title () {
      return getMap(this.characteristics, 'lower_case_title')
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

        marketplace_categories: [],
        characteristics: [],
      }
      for (let i = 0; i < this.marketplace_categories.length; i++) {
        const record = this.marketplace_categories[i].toApi()
        if (!record) {
          result = false
        }
        data.marketplace_categories.push(record)
      }
      for (let i = 0; i < this.characteristics.length; i++) {
        const record = this.characteristics[i].toApi()
        if (!record) {
          result = false
        }
        data.characteristics.push(record)
      }

      if (!result) {
        return false
      }

      return data
    },
    addCharacteristic (title) {
      const record = new Characteristic(({ data: { title }, store: this.$store, propsData: { category: this } }))
      this.characteristics.push(record)
      return record
    },
    removeCharacteristic (characteristic) {
      const index = this.characteristics.findIndex(item => item === characteristic)
      this.characteristics.splice(index, 1)
    },
    set (record, copy = false) {
      this.id = record.id
      this.title = record.title

      if (copy) {
        this.marketplace_categories = record.marketplace_categories
          ? record.marketplace_categories.slice()
          : []
        this.characteristics = record.characteristics
          ? record.characteristics.slice()
          : []
      }
      else {
        const marketplace_categories_length = record.marketplace_categories ? record.marketplace_categories.length : 0
        if (marketplace_categories_length !== this.marketplace_categories.length) {
          throw new ServerError({}, 'Произошла ошибка сохранения в marketplace_categories', true)
        }
        const characteristics_length = record.characteristics ? record.characteristics.length : 0
        if (characteristics_length !== this.characteristics.length) {
          throw new ServerError({}, 'Произошла ошибка сохранения в characteristics', true)
        }

        for (let i = 0; i < marketplace_categories_length; i++) {
          this.marketplace_categories[i].set(record.marketplace_categories[i])
        }
        for (let i = 0; i < characteristics_length; i++) {
          this.characteristics[i].set(record.characteristics[i])
        }
      }

      this.$v.$reset()
    },
    getUrl () {
      return `${Category.URL_PREFIX}${this.id ? `/${this.id}` : ''}`
    },
    addMarketplaceCategory (marketplace) {
      const data = {
        marketplace_id: marketplace.id,
      }
      const mc = new MarketplaceCategory({ data, store: this.$store, propsData: { category: this } })
      this.marketplace_categories.push(mc)
    },
  },
}) {}

Object.defineProperty(Category, 'URL_PREFIX', {
  value: 'categories',
  writable: false,
  configurable: false,
})
