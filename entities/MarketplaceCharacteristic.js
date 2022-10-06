import Vue from 'vue'

export default class MarketplaceCharacteristic extends Vue.extend({
  mixins: [],
  data () {
    return {
      id: null,
      marketplace_category_id: null,
      characteristic_id: null,
      key: null,
      title: null,

      required: false,
      dictionary: null,
      use_only_dictionary_values: false,
      is_available: true,
      is_number: false,
      max_count: 1,
      units: null,

      isEdited: false,
    }
  },
  props: {
    marketplace_category: { required: true },
    characteristic: { required: true },
  },
  created () {},
  computed: {
    marketplace () {
      return this.marketplace_category.marketplace
    },
    armdl_key () {
      return this.key
    },
    armdl_title () {
      return this.title
    },
    isDefined () {
      return this.key && this.title
    },
  },
  methods: {
    toApi () {
      return {
        id: this.id,
        key: this.key,
        title: this.title,

        required: this.required,
        dictionary: this.dictionary,
        use_only_dictionary_values: this.use_only_dictionary_values,
        is_available: this.is_available,
        is_number: this.is_number,
        max_count: this.max_count,
        units: this.units,

        marketplace_id: this.marketplace_category.marketplace.id,
      }
    },
    set (record) {
      this.id = record.id
      this.key = record.key
      this.title = record.title

      this.required = record.required
      this.dictionary = record.dictionary
      this.use_only_dictionary_values = record.use_only_dictionary_values
      this.is_available = record.is_available
      this.is_number = record.is_number
      this.max_count = record.max_count
      this.units = record.units

      this.isEdited = false
    },
    equal (characteristic) {
      this.key
    },
    setProperty (key, value) {
      if (this[key] !== value) {
        this.isEdited = true
        this[key] = value
      }
    },
    setByOriginalCharacteristic (original_characteristic) {
      this.setProperty('key', original_characteristic.armdl_key)
      this.setProperty('title', original_characteristic.armdl_key)

      this.setProperty('required', original_characteristic.required)
      this.setProperty('dictionary', original_characteristic.dictionary)
      this.setProperty('use_only_dictionary_values', original_characteristic.useOnlyDictionaryValues)
      this.setProperty('is_available', original_characteristic.isAvailable)
      this.setProperty('is_number', original_characteristic.isNumber)
      this.setProperty('max_count', original_characteristic.maxCount)
      this.setProperty('units', original_characteristic.units)
    },
  },
}) {}


