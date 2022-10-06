<template>
  <div class="layout user-layout">
    <b-navbar>
      <template slot="start">
        <b-navbar-item
            tag="router-link"
            :to="{ name: 'index'}"
        >
          Товары
        </b-navbar-item>

        <b-navbar-item
            tag="router-link"
            :to="{ name: 'integrations'}"
        >
          Интеграции
        </b-navbar-item>

        <b-navbar-item
            tag="router-link"
            :to="{ name: 'categories'}"
        >
          Категории
        </b-navbar-item>

        <b-navbar-item
            tag="router-link"
            :to="{ name: 'user'}"
        >
          Администрирование
        </b-navbar-item>

        <b-navbar-item
            tag="a"
            target="_blank"
            :href="$config.aboutPage"
        >
          О нас
        </b-navbar-item>
        <b-navbar-item
            tag="a"
            target="_blank"
            :href="$config.contactPage"
        >
          Контакты
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item
            tag="router-link"
            :to="{ name: 'user'}"
        >
          {{ viewed_user.name }}
        </b-navbar-item>
        <b-navbar-item>
          <b-button
              :loading="isLogouting"
              @click="logout"
          >
            Выход
          </b-button>
        </b-navbar-item>
      </template>
    </b-navbar>

    <main>
      <nuxt/>
    </main>
  </div>
</template>


<script>
import { unknownServerErrorToast } from '~/utils/errors/ServerError'

export default {
  name: 'UserLayout',
  middleware: ['preload'],
  data () {
    return {
      isLogouting: false,
    }
  },
  computed: {
    user () {
      return { ...this.$store.getters.USER }
    },
    viewed_user () {
      return { ...this.$store.getters.VIEWED_USER }
    },
  },
  methods: {
    logout () {
      this.isLogouting = true
      try {
        this.$axios.post('/logout')
        window.location = this.$config.mainSite
      }
      catch (e) {
        unknownServerErrorToast()
      }
      finally {
        this.isLogouting = false
      }
    },
  },
}
</script>


<style lang="scss" rel="stylesheet/scss" scoped>

.user-layout {
  display: flex;
  flex-direction: column;
}

main {
  overflow: auto;
}

</style>
