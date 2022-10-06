import Vue from 'vue'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import getMap from '../utils/getMap'
import OriginalCharacteristic from './OriginalCharacteristic'

export default class OriginalCategory extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      title: null,

      original_characteristics: [],
    }
  },
  created () {},
  computed: {
    original_characteristic_obj () {
      return getMap(this.original_characteristics, 'type')
    },
  },
  methods: {
    setOriginalCharacteristics (records) {
      // unique array
      this.original_characteristics = records.map(i => new OriginalCharacteristic({ data: i, store: this.$store }))
    },
    getOriginalCharacteristic (marketplaceCharacteristic) {
      return this.original_characteristic_obj[marketplaceCharacteristic.key]
    },
  },
}) {}

