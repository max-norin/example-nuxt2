<template>
  <section class="user">
    <section class="user-data w-300 mv-20 mh-center">
      <h2>Пользователь</h2>
      <b-field label="Имя пользователя">
        <b-input
            type="text"
            v-model="user.name"
            placeholder="Имя пользователя"
            icon="account"
            readonly
        />
      </b-field>
      <b-field label="Email">
        <b-input
            type="email"
            v-model="user.email"
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
    <manager v-if="!isManager"/>
    <subordinates v-else/>
  </section>
</template>

<script>
import Formator from '~/utils/Formator'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import FormGroup from '~/components/common/FormGroup'
import Manager from '@/components/profile/Manager'
import Subordinates from '@/components/profile/Subordinates'

Vue.use(Vuelidate)

export default {
  name: 'User',
  layout: 'user',
  components: { Subordinates, Manager, FormGroup },
  computed: {
    user () {
      return { ...this.$store.getters.USER }
    },
    isManager () {
      return !!this.user.is_manager
    },
    formattingValidUntil () {
      return Formator.datetime(this.user.valid_until)
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user /deep/ {
  h2 {
    margin-top: 28px;
    margin-bottom: 16px;
    font-weight: bold;
    font-size: 1.2em;
  }

  .icon {
    /deep/ {
      i.is-disable {
        color: #999999;
      }

      i:not(.is-disable) {
        cursor: pointer;
      }
    }
  }
}
</style>
