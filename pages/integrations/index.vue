<template>
  <section>
    <section v-if="record" class="user-data w-300 mv-20 mh-center">
      <h2>{{ marketplace.title }}</h2>
      <form-group
          v-for="(auth_param, key) in marketplace.auth_param_values"
          :key="key"
          :label="key"
          :validator="record.$v[key]"
          :server-errors.sync="record.serverErrors[key]"
          v-slot="{ slotInput }"
      >
        <b-input
            type="text"
            v-model.trim="record.$v[key].$model"
            @input="slotInput"
            :placeholder="key"
            :disabled="isSaving"
        />
      </form-group>

      <b-field>
        <b-button
            expanded
            native-type="submit"
            icon-left="content-save"
            :disabled="isSaving"
            @click="save"
        >
          Сохранить
        </b-button>
      </b-field>
      <!--      <b-field>-->
      <!--        <router-link :to="{ name: 'integrations-marketplace_id', params: { marketplace_id: 1 } }">-->
      <!--          <b-button-->
      <!--              expanded-->
      <!--              native-type="submit"-->
      <!--              icon-left="download"-->
      <!--          >-->
      <!--            Загрузить товары с Wildberries-->
      <!--          </b-button>-->
      <!--        </router-link>-->
      <!--      </b-field>-->
    </section>
  </section>
</template>

<script>
import loadDataMixin from '@/utils/mixins/loadDataMixin'
import { unknownServerErrorToast } from '@/utils/errors/ServerError'
import FormGroup from '@/components/common/FormGroup'
import UserMarketplaceAuthParamValue from '~/entities/UserMarketplaceAuthParamValue'

export default {
  name: 'Integrations',
  layout: 'user',
  components: { FormGroup },
  mixins: [loadDataMixin],
  props: {},
  data () {
    return {
      isSaving: false,
      record: null,
    }
  },
  mounted () {
    const auth_param_values = Object.assign({}, this.marketplace.auth_param_values)
    this.record = new UserMarketplaceAuthParamValue({ data: auth_param_values, propsData: { marketplace: this.marketplace } })
  },
  computed: {
    marketplace () {
      return this.$store.getters.MARKETPLACES[0]
    },
  },
  methods: {
    async save () {
      this.record.$v.$touch()
      if (this.record.$v.$invalid) {
        return false
      }

      this.isSaving = true
      try {
        const data = { auth_param_values: this.record.toApi() }
        await this.$axios.put(this.record.getUrl(), data)
        this.record.resetServerErrors(this.record.serverErrors)
      }
      catch (e) {
        let isCatch = this.record.setServerErrors(this.record.serverErrors, e)

        if (!isCatch) {
          unknownServerErrorToast()
        }
      }
      finally {
        this.isSaving = false
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

h2 {
  font-size: 2rem;
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
}

</style>
