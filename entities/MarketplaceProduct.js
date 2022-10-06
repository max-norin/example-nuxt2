import Vue from 'vue'
import { integer, maxLength, required } from 'vuelidate/lib/validators'
import Vuelidate from 'vuelidate'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'

Vue.use(Vuelidate)

export default class MarketplaceProduct extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {
      id: null,
      name: null,
      category_id: null,
    }
  },
  props: {
    product: { required: true },
  },
  validations: {
    name: { maxLength: maxLength(255) },
    category_id: { required, integer },
  },
  created () {},
  computed: {},
  methods: {
    set (record) {
      this.id = record.id
      this.name = record.name
      this.category_id = record.category_id

      this.$v.$reset()
    },
    getUrl () {
      return `marketplaces/1/products${this.id ? `/${this.id}` : ''}`
    },
  },
}) {}
