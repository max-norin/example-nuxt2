<template>
  <section>
    <b-table
        :data="product.market_product_characteristics"
        custom-row-key="characteristic_id"
    >

      <b-table-column custom-key="close" v-slot="{ row: product_characteristic }">
        <b-button
            icon-left="close"
            :disabled="isSaving"
            @click.native="product_characteristic.remove()"
        />
      </b-table-column>

      <b-table-column custom-key="characteristic" width="30%" header-class="characteristic-col">
        <template #header>
          <p>
            <span>Характеристика</span>
            <b-button
                icon-left="chevron-down"
                title="Добавить все характеристики"
                :disabled="isSaving"
                @click="product.addAllProductCharacteristics()"
            />
          </p>
        </template>
        <template #default="{ row: product_characteristic }">
          <form-group
              :validator="product_characteristic.$v.characteristic_id"
              :server-errors.sync="product_characteristic.serverErrors.characteristic_id"
              v-slot="{ slotInput }"
          >
            <m-pag-select
                :options="product.noselect_characteristics"
                :get-option-label="o=> o.title"
                :value="product_characteristic.characteristic"
                :get-option-key="o=> o.id"
                :reduce="o=> o.id"
                :disabled="isSaving"
                @input="o => { product_characteristic.characteristic_id = o.id; slotInput(); }"
            />
          </form-group>
        </template>
      </b-table-column>

      <b-table-column label="Market" width="30%" v-slot="{ row: product_characteristic }">
        <form-group
            :validator="product_characteristic.$v.value"
            :server-errors.sync="product_characteristic.serverErrors.value"
            v-slot="{ slotInput }"
        >
          <b-input
              type="text"
              v-model.trim="product_characteristic.value"
              :disabled="isSaving"
              @input="slotInput"
          />
        </form-group>
      </b-table-column>

      <b-table-column
          v-for="marketplace of marketplaces"
          :key="marketplace.id"
          :label="'Marketplace ' + marketplace.title" width="30%"
          v-slot="{ row: product_characteristic }"
      >
        <marketplace-product-characteristic
            :product_characteristic="product_characteristic"
            :marketplace="marketplace"
            :disabled="isSaving"
        />
      </b-table-column>

      <b-table-column width="100%"/>

      <template #footer>
        <td>
          <b-button
              icon-left="content-save"
              expanded
              :loading="isSaving"
              @click="save"
          />
        </td>
        <td>
          <b-button
              icon-left="plus"
              expanded
              :disabled="isSaving || product.noselect_characteristics.length === 0"
              @click="_ => product.addProductCharacteristic()"
          />
        </td>
      </template>
    </b-table>
  </section>
</template>

<script>

import MPagSelect from '../categories/MPagSelect'
import ServerError, { unknownServerErrorToast } from '../../utils/errors/ServerError'
import ErrorToast from '../../utils/errors/ErrorToast'
import FormGroup from '../common/FormGroup'
import MarketplaceProductCharacteristic from './MarketplaceProductCharacteristic'

export default {
  name: 'ProductCharacteristics',
  mixins: [],
  components: { MarketplaceProductCharacteristic, FormGroup, MPagSelect },
  props: {
    product: { required: true },
  },
  data () {
    return {
      isSaving: false,
    }
  },
  async mounted () {},
  computed: {
    marketplaces () {
      return this.$store.getters.MARKETPLACES
    },
  },
  methods: {
    async save () {
      this.isSaving = true
      try {
        let data = this.product.toApi()
        if (!data) {
          return false
        }
        data = await this.$axios.put(this.product.getUrl(), data)
        this.product.set(data)
      }
      catch (e) {
        if (e instanceof ServerError && e.loading) {
          ErrorToast(e.message)
          location.reload()
        }
        else {
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
/deep/ .characteristic-col {
  .th-wrap, span {
    width: 100%;
  }

  p {
    display: flex;
    align-items: center;
  }

  .icon {
    margin: 0 !important;
    width: 0.5em !important;
  }
}
</style>
