<template>
  <section class="subordinates mh-center">
    <h2>Подчиненные</h2>
    <b-table
        :data="subordinates"
        :loading="isLoadingData"
    >
      <b-table-column label="ID" width="40" numeric v-slot="{ row }">
        {{ row.id }}
      </b-table-column>

      <b-table-column label="Имя" v-slot="{ row }">
        {{ row.name }}
      </b-table-column>

      <b-table-column label="Электронная почта" v-slot="{ row }">
        {{ row.email }}
      </b-table-column>

      <b-table-column label="Доступ до" v-slot="{ row }">
        {{ validUntil(row.valid_until) }}
      </b-table-column>

      <b-table-column label=" " v-slot="{ row }">
        <b-icon
            :icon="row.id === viewed_user.id ? 'cancel' : 'eye'"
            title="Просмотреть деятельность"
            @click.native.stop="row.is_deleted ? null : changeViewedUser(row)"
        />
      </b-table-column>

      <b-table-column label=" " v-slot="{ row }">
        <b-icon
            icon="circle-edit-outline"
            title="редактировать"
            :custom-class="row.is_deleted ? 'is-disable' : null"
            @click.native.stop="row.is_deleted ? null : edit(row)"
        />
      </b-table-column>

      <b-table-column label=" " v-slot="{ row }">
        <b-icon
            v-if="user.is_super_admin"
            :icon="row.is_dictionary_admin ? 'file-check-outline' : 'file-cancel-outline'"
            title="Назначить администрором Справочников"
            :custom-class="row.is_deleted ? 'is-disable' : null"
            @click.native.stop="row.is_deleted ? null : setDictionaryAdmin(row)"
        />
      </b-table-column>

      <b-table-column label=" " v-slot="{ row }">
        <b-icon
            icon="alert-octagon"
            title="сброс пароля"
            :custom-class="row.is_deleted ? 'is-disable' : null"
            @click.native.stop="row.is_deleted ? null : resetPassword(row)"
        />
      </b-table-column>

      <b-table-column label=" " v-slot="{ row }">
        <b-icon
            :icon="row.is_deleted ? 'account-check' : 'account-cancel'"
            :title="row.is_deleted ? 'восстановить доступ' : 'закрыть доступ'"
            @click.native.stop="access(row)"
        />
      </b-table-column>

      <template #footer>
        <th>
          <div class="th-wrap is-numeric">
            {{ editable_idTitle(subordinate) }}
          </div>
        </th>
        <th>
          <form-group
              :validator="$v.subordinate.name"
              :server-errors.sync="serverErrors.subordinate.name"
              v-slot="{ slotInput }"
          >
            <b-input
                type="text"
                v-model.trim="$v.subordinate.name.$model"
                placeholder="Имя"
                @input="slotInput"
                :disabled="isSaving"
                :readonly="subordinate.id"
            />
          </form-group>
        </th>
        <th>
          <form-group
              :validator="$v.subordinate.email"
              :server-errors.sync="serverErrors.subordinate.email"
              v-slot="{ slotInput }"
          >
            <b-input
                type="text"
                v-model.trim="$v.subordinate.email.$model"
                placeholder="Электронная почта"
                @input="slotInput"
                :disabled="isSaving"
                :readonly="subordinate.id"
            />
          </form-group>
        </th>
        <th>
          <form-group
              :validator="$v.subordinate.valid_until"
              :server-errors.sync="serverErrors.subordinate.valid_until"
              v-slot="{ slotInput }"
          >
            <b-input
                type="datetime-local"
                v-model.trim="$v.subordinate.valid_until.$model"
                placeholder="Доступно до"
                @input="slotInput"
                :disabled="isSaving"
            />
          </form-group>
        </th>
        <th/>
        <th/>
        <th/>
        <th colspan="2">
          <b-button
              expanded
              :loading="isSaving"
              @click="save"
          >
            {{ editable_buttonTitle(subordinate) }}
          </b-button>
        </th>
      </template>
    </b-table>
  </section>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { email, maxLength, required } from 'vuelidate/lib/validators'
import moment from 'moment'
import { unknownServerErrorToast } from '@/utils/errors/ServerError'
import Formator from '@/utils/Formator'
import serverErrorsMixins from '@/utils/mixins/serverErrorsMixins'
import FormGroup from '@/components/common/FormGroup'
import paginationMixin from '@/utils/mixins/paginationMixin'
import loadDataMixin from '@/utils/mixins/loadDataMixin'

Vue.use(Vuelidate)

export default {
  name: 'Subordinates',
  components: { FormGroup },
  mixins: [loadDataMixin, serverErrorsMixins, paginationMixin],
  data () {
    return {
      isSaving: false,
      subordinate: {
        id: null,
        name: null,
        email: null,
        valid_until: null,
      },
    }
  },
  validations: {
    subordinate: {
      name: { required, maxLength: maxLength(255) },
      email: { required, maxLength: maxLength(255), email },
      valid_until: {},
    },
  },
  computed: {
    url () {
      return '/subordinates'
    },
    user () {
      return { ...this.$store.getters.USER }
    },
    subordinates () {
      return this.user.subordinates
    },
    viewed_user () {
      return { ...this.$store.getters.VIEWED_USER }
    },
  },
  methods: {
    formattingDatetime (datetime) {
      return Formator.datetime(datetime)
    },
    validUntil (validUntil) {
      return validUntil
          ? this.formattingDatetime(validUntil)
          : 'согласно менеджеру'
    },
    edit (subordinate) {
      this.subordinate.id = subordinate.id ? subordinate.id : null
      this.subordinate.name = subordinate.name ? subordinate.name : null
      this.subordinate.email = subordinate.email ? subordinate.email : null
      this.subordinate.valid_until = subordinate.valid_until ? moment(subordinate.valid_until).format('YYYY-MM-DD\THH:mm:ss').toString() : null
    },
    changeViewedUser (subordinate) {
      if (subordinate.id === this.viewed_user.id) {
        this.$store.commit('RESET_VIEWED_USER')
      }
      else {
        this.$store.commit('SET_VIEWED_USER', subordinate.id)
      }
      window.location.reload()
    },
    async save () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }

      this.isSaving = true
      try {
        const data = { ...this.subordinate }
        if (data.id) {
          const subordinate = await this.$axios.put(this.editable_editUrl(this.url, data), data)
          this.pagination_editList(this.subordinates, subordinate)
        }
        else {
          const subordinate = await this.$axios.post(this.url, data)
          this.subordinates.push(subordinate)
        }

        this.resetServerErrors(this.serverErrors.subordinate)
        this.resetForm()
      }
      catch (e) {
        let isCatch = this.setServerErrors(this.serverErrors.subordinate, e)
        if (!isCatch) {
          unknownServerErrorToast()
        }
      }
      finally {
        this.isSaving = false
      }
    },
    resetForm () {
      this.edit({})
      this.$v.$reset()
    },
    async resetPassword (subordinate) {
      this.isLoadingData = true
      try {
        await this.$axios.put(this.editable_editUrl(this.url, subordinate) + '/reset-password')
      }
      catch (e) {
        unknownServerErrorToast()
      }
      finally {
        this.isLoadingData = false
      }
    },
    async setDictionaryAdmin (subordinate) {
      this.isLoadingData = true
      try {
        const result = await this.$axios.put(this.editable_editUrl(this.url, subordinate) + '/set-dictionary-admin', { is: !subordinate.is_dictionary_admin })
        if (result) {
          subordinate.is_dictionary_admin = !subordinate.is_dictionary_admin
        }
      }
      catch (e) {
        unknownServerErrorToast()
      }
      finally {
        this.isLoadingData = false
      }
    },
    async access (subordinate) {
      this.isLoadingData = true
      try {
        const result = await this.$axios.delete(this.editable_editUrl(this.url, subordinate), { params: { is: !subordinate.is_deleted } })
        if (result) {
          subordinate.is_deleted = !subordinate.is_deleted
        }
      }
      catch (e) {
        unknownServerErrorToast()
      }
      finally {
        this.isLoadingData = false
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
