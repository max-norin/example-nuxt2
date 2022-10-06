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
        <marketplace-categories :category="row"/>
      </template>


      <template #footer v-if="creationIsAvailable">
        <th/>
        <th>
          <div class="th-wrap is-numeric">{{ editable_idTitle(record) }}</div>
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
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import { unknownServerErrorToast } from '@/utils/errors/ServerError'
import FormGroup from '@/components/common/FormGroup'
import Category from '@/entities/Category'
import paginationMixin from '~/utils/mixins/paginationMixin'
import titles from '~/utils/titles/titles'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import MarketplaceCategories from '~/components/categories/MarketplaceCategories'

export default {
  name: 'Categories',
  layout: 'user',
  middleware: ['categories'],
  components: { MarketplaceCategories, FormGroup, Treeselect },
  mixins: [loadDataMixin, paginationMixin, serverErrorsMixins],
  data () {
    return {
      isSaving: false,
      record: new Category({ store: this.$store }),
    }
  },
  computed: {
    records () {
      return this.$store.getters['market/CATEGORIES']
    },
    perPage () {
      return 20
    },
    creationIsAvailable () {
      return !this.$store.getters.HAS_VIEWED_USER
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
          await this.$store.dispatch('market/UPDATE_CATEGORY', this.record)
        }
        else {
          await this.$store.dispatch('market/CREATE_CATEGORY', this.record)
        }

        this.record.resetServerErrors()
        this.reset()
      }
      catch (e) {
        let isCatch = this.record.setServerErrors(this.record.serverErrors, e)
        debugger
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
      debugger
      this.$buefy.dialog.confirm({
        message: titles.confirmDeletion,
        onConfirm: _ => this.remove(record),
        cancelText: 'Отмена',
        confirmText: 'Да',
      })
    },
    async remove (record) {
      {
        this.isSaving = true
        try {
          this.$store.dispatch('market/REMOVE_CATEGORY', record)
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
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
section {
  height: 100%;
  padding: 10px 0;
}
</style>
