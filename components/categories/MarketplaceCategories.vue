<template>
  <section class="MarketplaceCategories">
    <b-table
        :data="[{}]"

        detailed
        custom-detail-row
        detail-key="id"
    >

      <b-table-column label="Категория" width="30%">
        {{ category.title }}
      </b-table-column>

      <b-table-column
          v-for="marketplace of marketplaces"
          :key="marketplace.id"
          :label="'Категория ' + marketplace.title" width="30%"
      >
        <marketplace-category
            :marketplace="marketplace"
            :category="category"
            :is-saving="isSaving"
        />
      </b-table-column>

      <b-table-column width="100%"/>


      <template #detail="{ row }">
        <tr>
          <th></th>
          <th>Характеристики</th>
          <th v-for="marketplace of marketplaces" :key="marketplace.id">
            <marketplace-characteristic-tools
                :marketplace="marketplace"
                :category="category"
                :is-saving="isSaving"
            />
          </th>
        </tr>
        <tr v-for="characteristic in category.characteristics" :key="characteristic._uid">
          <td>
            <b-button
                icon-left="close"
                :disabled="isSaving"
                @click="characteristic.remove()"
            />
          </td>
          <td>
            <form-group
                :validator="characteristic.$v.title"
                :server-errors.sync="characteristic.serverErrors.title"
                v-slot="{ slotInput }"
            >
              <b-input
                  type="text"
                  v-model.trim="characteristic.title"
                  :disabled="isSaving"
                  @input="slotInput"
              />
            </form-group>
          </td>
          <marketplace-characteristic
              v-for="marketplace of marketplaces"
              :key="marketplace.id"
              :marketplace="marketplace"
              :characteristic="characteristic"
              :category="category"
              :disabled="isSaving"
          />
        </tr>
        <tr>
          <td></td>
          <td colspan="2">
            <b-button
                icon-left="plus"
                expanded
                :disabled="isSaving"
                @click="category.addCharacteristic()"
            >
              Добавить характеристику
            </b-button>
          </td>
        </tr>
      </template>
      <template #footer>
        <td></td>
        <td colspan="2">
          <b-button
              icon-left="content-save"
              expanded
              :loading="isSaving"
              @click="save"
          >
            Сохранить
          </b-button>
        </td>
      </template>
    </b-table>
  </section>
</template>

<script>
import paginationMixin from '~/utils/mixins/paginationMixin'
import loadDataMixin from '~/utils/mixins/loadDataMixin'
import serverErrorsMixins from '~/utils/mixins/serverErrorsMixins'

import MPagSelect from './MPagSelect'
import MarketplaceCharacteristic from './MarketplaceCharacteristic'
import MarketplaceCharacteristicTools from './MarketplaceCharacteristicTools'
import MarketplaceCategory from './MarketplaceCategory'
import ServerError, { unknownServerErrorToast } from '../../utils/errors/ServerError'
import ErrorToast from '../../utils/errors/ErrorToast'
import FormGroup from '../common/FormGroup'

export default {
  name: 'MarketplaceCategories',
  mixins: [loadDataMixin, paginationMixin, serverErrorsMixins],
  components: { FormGroup, MarketplaceCategory, MarketplaceCharacteristicTools, MarketplaceCharacteristic, MPagSelect },
  props: {
    category: { required: true },
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
        let data = this.category.toApi()
        if (!data) {
          return false
        }
        data = await this.$axios.put(this.category.getUrl(), data)
        this.category.set(data)
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
.MarketplaceCategories /deep/ {
  @media screen and (max-width: 1023px) {
    .table-wrapper {
      overflow-x: initial !important;
    }
  }
}

.input-error {
  border-color: red;

  /deep/ {
    > * {
      border-color: inherit;
    }
  }
}
</style>
