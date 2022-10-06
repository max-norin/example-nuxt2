<template>
  <section>
    <b-button
        :disabled="isLoadingData || isSaving || !original_category || original_characteristics.length > 0"
        icon-left="chevron-down"
        title="Загрузить характеристики категории"
        :loading="isLoadingData"
        @click="loadCharacteristics()"
    />
    <b-button
        :disabled="isLoadingData || isSaving || !original_category || original_characteristics.length === 0"
        icon-left="arrow-left-right"
        title="Распределить характеристики"
        @click="distributeCharacteristics()"
    />
  </section>
</template>

<script>
import serverErrorsMixins from '~/utils/mixins/serverErrorsMixins'
import MPagSelect from './MPagSelect'
import { unknownServerErrorToast } from '~/utils/errors/ServerError'
import loadDataMixin from '~/utils/mixins/loadDataMixin'

export default {
  name: 'MarketplaceCharacteristicTools',
  mixins: [loadDataMixin, serverErrorsMixins],
  components: { MPagSelect },
  props: {
    category: { required: true },
    marketplace: { required: true },
    isSaving: { required: true, type: Boolean },
  },
  data () {
    return {}
  },
  async mounted () {},
  computed: {
    original_category () {
      return this.marketplace_category
          ? this.marketplace.getOriginalCategory(this.marketplace_category)
          : null
    },
    original_characteristics () {
      return this.original_category
          ? this.original_category.original_characteristics
          : []
    },
    marketplace_category () {
      return this.category.mcm.has(this.marketplace)
          ? this.category.mcm.get(this.marketplace)
          : null
    },
  },
  methods: {
    distributeCharacteristics () {
      for (let i = 0; i < this.original_characteristics.length; i++) {
        const original_characteristic = this.original_characteristics[i]
        const title = original_characteristic.armdl_title
        let characteristic = this.category.characteristic_obj_title[title]
        if (!characteristic) {
          characteristic = this.category.characteristic_obj_lower_case_title[title.toLowerCase()]
        }
        if (!characteristic) {
          characteristic = this.category.addCharacteristic(title)
        }
        if (characteristic.mcm.has(this.marketplace)) {
          const marketplace_characteristic = characteristic.mcm.get(this.marketplace)
          if (!marketplace_characteristic.isDefined) {
            marketplace_characteristic.setByOriginalCharacteristic(original_characteristic)
          }
        }
        else {
          characteristic.addMarketplaceCharacteristic(this.marketplace_category, original_characteristic)
        }
      }
    },
    async loadCharacteristics () {
      try {
        await this.loadData([
          (async _ => {
            const params = {
              method: 'GET',
              url: 'https://suppliers-api.wildberries.ru/content/v1/object/characteristics/list/filter?name=' + this.original_category.title,
            }
            const characteristics = (await this.$axios.post('/marketplaces/1/api', params)).data
            this.original_category.setOriginalCharacteristics(characteristics)
          })(),
        ])
      }
      catch (e) {
        debugger
        unknownServerErrorToast()
      }
      this.marketplace_category.resetByOriginalCategory()
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
