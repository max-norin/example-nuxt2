import Vue from 'vue'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'

export default class OriginalCharacteristic extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      name: null,
      dictionary: null,
      isAvailable: true,
      required: false,
      charcType: '',
      useOnlyDictionaryValues: false,
      isNumber: false,
      maxCount: 1,
      units: null,
    }
  },
  created () {},
  computed: {
    armdl_key () {
      return this.name
    },
    armdl_title () {
      return this.name
    },
  },
  methods: {},
}) {}

