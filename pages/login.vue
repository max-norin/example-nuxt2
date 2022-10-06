<template>
  <section class="login">
    <form class="mv-center mh-center">
      <form-group
        :validator="$v.user.is"
        :addons="false"
        :server-errors.sync="serverErrors.user.is"
        v-slot="{ slotInput: userInput }"
      >
        <form-group
          label="Эл.почта"
          :validator="$v.user.email"
          :server-errors.sync="serverErrors.user.email"
          v-slot="{ slotInput }"
        >
          <b-input
            type="text"
            v-model="$v.user.email.$model"
            :disabled="isLoading"
            @input="_ => { userInput(); slotInput(); }"
          />
        </form-group>
        <form-group
          label="Пароль"
          :validator="$v.user.password"
          :server-errors.sync="serverErrors.user.password"
          v-slot="{ slotInput }"
        >
          <b-input
            type="password"
            v-model="$v.user.password.$model"
            :disabled="isLoading"
            @input="_ => { userInput(); slotInput(); }"
          />
        </form-group>
      </form-group>
      <div class="buttons is-right">
        <b-button
          tag="a"
          icon-left="account"
          :disabled="isLoading"
          :href="authUrl"
        >
          Авторизоваться
        </b-button>
        <b-button
          icon-left="login-variant"
          :loading="isLoading"
          @click="login"
        >
          Войти
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
  import FormGroup from '~/components/common/FormGroup'
  import serverErrorsMixins from '~/utils/mixins/serverErrorsMixins'
  import { unknownServerErrorToast } from '~/utils/errors/ServerError'
  import Vue from 'vue'
  import Vuelidate from 'vuelidate'
  import { email, maxLength, required } from 'vuelidate/lib/validators'

  Vue.use(Vuelidate)

  export default {
    components: { FormGroup },
    mixins: [serverErrorsMixins],
    middleware: 'login',
    data () {
      return {
        isLoading: false,
        user: {
          is: null,
          email: null,
          password: null,
        },
      }
    },
    validations: {
      user: {
        is: {},
        email: { required, email, maxLength: maxLength(255) },
        password: { required, maxLength: maxLength(255) },
      },
    },
    computed: {
      authUrl () {
        return this.$config.api.url + '/auth'
      },
    },
    methods: {
      async login () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return false
        }

        this.isLoading = true
        try {
          const user = { ...this.user }
          delete user.is
          const result = await this.$axios.post('/login', user)
          await this.$router.replace('/')
        }
        catch (e) {
          let isCatch = this.setServerErrors(this.serverErrors.user, e)
          if (!isCatch) {
            unknownServerErrorToast()
          }
        }
        finally {
          this.isLoading = false
        }
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .login {
    height: 100%;
    width: 100%;
    display: flex;

    > form {
      width: 400px;
    }
  }
</style>
