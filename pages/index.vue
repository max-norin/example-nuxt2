<template>
  <section class="section">
    <b-table
        class="overflow-table"
        :data="records"
        :loading="isLoadingData"

        detailed
        hoverable
        detail-key="id"

        paginated
        :current-page.sync="page"
        :per-page="perPage"
        :mobile-cards="true"
    >
      <b-table-column label="ID" width="40" numeric v-slot="{ row }">
        {{ row.id }}
      </b-table-column>

      <b-table-column label="Категория" width="25%" v-slot="{ row }">
        {{ row.category ? row.category.title : '' }}
      </b-table-column>

      <b-table-column label="Актикул" width="20%" v-slot="{ row }">
        {{ row.code }}
      </b-table-column>

      <b-table-column label="Наименование" width="25%" v-slot="{ row }">
        {{ row.title }}
      </b-table-column>

      <b-table-column width="100%" v-slot="{ row }"></b-table-column>

      <b-table-column v-slot="{ row }">
        <b-icon
            v-if="editingIsAvailable(row)"
            icon="circle-edit-outline"
            title="Редактировать"
            @click.native.stop="edit(row)"
        />
      </b-table-column>

      <b-table-column v-slot="{ row }">
        <b-icon
            v-if="deletionIsAvailable(row)"
            :icon="!row.deleted_at ? 'cancel' : 'check'"
            :title="!row.deleted_at ? 'Удалить' : 'Восстановить'"
            @click.native.stop="confirmDeletion(row)"
        />
      </b-table-column>


      <template #detail="{ row }">
        <product-characteristics :product="row"/>
      </template>


      <template #footer v-if="creationIsAvailable">
        <th/>
        <th>
          <div class="th-wrap is-numeric">{{ editable_idTitle(record) }}</div>
        </th>
        <th>
          <form-group
              :validator="record.$v.category_id"
              :server-errors.sync="record.serverErrors.category_id"
              v-slot="{ slotInput }"
          >
            <b-select
                v-model.trim="record.$v.category_id.$model"
                @input="slotInput"
                placeholder="Категория"
                :disabled="isSaving"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}</option>
            </b-select>
          </form-group>
        </th>
        <th>
          <form-group
              :validator="record.$v.code"
              :server-errors.sync="record.serverErrors.code"
              v-slot="{ slotInput }"
          >
            <b-input
                type="text"
                v-model.trim="record.$v.code.$model"
                @input="slotInput"
                placeholder="Артикул"
                :disabled="isSaving"
            />
          </form-group>
        </th>
        <th>
          <form-group
              :validator="record.$v.title"
              :server-errors.sync="record.serverErrors.title"
              v-slot="{ slotInput }"
          >
            <b-input
                type="text"
                v-model.trim="record.$v.title.$model"
                @input="slotInput"
                placeholder="Наименование"
                :disabled="isSaving"
            />
          </form-group>
        </th>
        <th/>

        <th colspan="2">
          <b-button
              outlined
              :loading="isSaving"
              @click="save"
          >
            {{ editable_buttonTitle(record) }}
          </b-button>
        </th>
      </template>
    </b-table>
  </section>
</template>

<script>
import loadDataMixin from '@/utils/mixins/loadDataMixin'
import { unknownServerErrorToast } from '@/utils/errors/ServerError'
import FormGroup from '@/components/common/FormGroup'
import Product from '@/entities/Product'
import paginationMixin from '../utils/mixins/paginationMixin'
import titles from '~/utils/titles/titles'
import Treeselect from '@riophae/vue-treeselect'
import ProductCharacteristics from '../components/products/ProductCharacteristics'

export default {
  name: 'Products',
  layout: 'user',
  middleware: ['products', 'categories'],
  components: { ProductCharacteristics, FormGroup, Treeselect },
  mixins: [loadDataMixin, paginationMixin],
  data () {
    return {
      isSaving: false,
      record: new Product({ store: this.$store }),
    }
  },
  computed: {
    records () {
      return this.$store.getters['market/PRODUCTS']
    },
    perPage () {
      return 12
    },
    creationIsAvailable () {
      return !this.$store.getters.HAS_VIEWED_USER
    },
    categories () {
      return this.$store.getters['market/CATEGORIES']
    },
  },
  methods: {
    editingIsAvailable (record) {
      return this.creationIsAvailable && !record.deleted_at
    },
    deletionIsAvailable (record) {
      return this.creationIsAvailable
    },
    async save () {
      this.record.$v.$touch()
      if (this.record.$v.$invalid) {
        return false
      }

      this.isSaving = true
      try {
        if (this.record.id) {
          await this.$store.dispatch('market/UPDATE_PRODUCT', this.record)
        }
        else {
          await this.$store.dispatch('market/CREATE_PRODUCT', this.record)
        }

        this.record.resetServerErrors()
        this.reset()
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
    edit (record) {
      this.record.set(record, true)
      this.record.$v.$reset()
    },
    reset () {
      this.edit({})
    },
    confirmDeletion (record) {
      this.$buefy.dialog.confirm({
        message: titles.confirmDeletion,
        onConfirm: _ => this.remove(record),
        cancelText: 'Отмена',
        confirmText: 'Да',
      })
    },
    async saveMarketplaceProduct (record) {
      record.$v.$touch()
      if (record.$v.$invalid) {
        return false
      }

      this.isSaving = true
      try {
        const data = { ...record.$data }
        data.product_id = record.product.id
        if (data.id) {
          const recordData = await this.$axios.put(record.getUrl(), data)
          record.set(recordData)
        }
        else {
          const recordData = await this.$axios.post(record.getUrl(), data)
          record.set(recordData)
        }

        record.resetServerErrors()
      }
      catch (e) {
        let isCatch = record.setServerErrors(record.serverErrors, e)
        if (!isCatch) {
          unknownServerErrorToast()
        }
      }
      finally {
        this.isSaving = false
      }
    },
    async remove (record) {
      {
        this.isSaving = true
        try {
          this.$store.dispatch('market/DELETE_PRODUCT')
        }
        catch (e) {
          unknownServerErrorToast()
        }
        finally {
          this.isSaving = false
          if (this.record.id === record.id) {
            this.reset()
          }
        }
      }
    },
    normalizer (node) {
      return {
        id: node.category_id,
        label: node.title,
        children: node.children.length === 0 ? undefined : node.children,
      }
    },
    async setCategory (node, record) {
      const data = await this.$axiosApiKey.post('https://api-seller.ozon.ru/v3/category/attribute', {
        'attribute_type': 'ALL',
        'category_id': [36120208],// [node.category_id],
        'language': 'DEFAULT',
      })
      record.attributes = data[0].attributes
    },
    async send (record) {
      await this.saveMarketplaceProduct(record.marketplace_product)
      try {
        await this.$axiosApiKey.post('https://api-seller.ozon.ru/v2/product/import', {
          items: [
            {
              // "attributes": [],
              'barcode': record.barcode,
              'category_id': record.marketplace_product.category_id,
              // "color_image": "string",
              // "complex_attributes": [],
              'depth': record.depth,
              'dimension_unit': record.dimension_unit,
              'height': record.height,
              // "images": [],
              // "primary_image": "string",
              // "images360": [],
              'name': record.title,
              'offer_id': record.code,
              'old_price': record.old_price ? record.old_price.toString() : '',
              // "pdf_list": [],
              // "premium_price": "string",
              'price': record.price.toString(),
              'vat': record.vat.toString(),
              'weight': record.weight,
              'weight_unit': record.weight_unit,
              'width': record.width,
            }],
        })
      }
      catch (e) {
        unknownServerErrorToast()
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
section {
  height: 100%;
  padding: 10px 0;
}

.form__form_select {
  width: 300px;
  max-width: 300px;
}

.record-detail {
  max-width: 60%;
}

.record-detail__title:hover {
  a {
    text-decoration: underline;
  }
}

tr.title {
  font-size: 1.4rem;
  background-color: #f1f1f1 !important;
}
</style>
