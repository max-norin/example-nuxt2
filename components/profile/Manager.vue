<template>
  <section class="manager w-300 mv-20 mh-center">
    <h2>Менеджер</h2>
    <b-field label="Имя пользователя">
      <b-input
          type="text"
          v-model="manager.name"
          placeholder="Имя пользователя"
          icon="account"
          readonly
      />
    </b-field>
    <b-field label="Email">
      <b-input
          type="email"
          v-model="manager.email"
          placeholder="Email"
          icon="email"
          readonly
      />
    </b-field>
    <b-field label="Доступно до">
      <b-input
          type="text"
          :value="formattingValidUntil"
          icon="calendar-today"
          readonly
      />
    </b-field>
  </section>
</template>

<script>
import Formator from '@/utils/Formator'
import loadDataMixin from '@/utils/mixins/loadDataMixin'

export default {
  name: 'Manager',
  mixins: [loadDataMixin],
  data () {
    return {}
  },
  computed: {
    formattingValidUntil () {
      return Formator.datetime(this.manager.valid_until)
    },
    user () {
      return { ...this.$store.getters.USER }
    },
    manager () {
      return this.user.manager
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
