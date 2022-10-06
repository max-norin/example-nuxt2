import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { maxLength, required } from 'vuelidate/lib/validators'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'

Vue.use(Vuelidate)

export default class UserMarketplaceAuthParamValue extends Vue.extend({
  mixins: [serverErrorsMixins],
  data () {
    return {}
  },
  props: {
    marketplace: { required: true },
  },
  validations () {
    const v = {}
    for (const param in this.marketplace.auth_param_values) {
      v[param] = { required, maxLength: maxLength(255) }
    }
    return v
  },
  created () {},
  computed: {},
  methods: {
    toApi () {
      const data = { ...this.$data }
      delete data.serverErrors
      return data
    },
    getUrl () {
      return `/marketplaces/${this.marketplace.id}/auth-params/values`
    },
  },
}) {}
