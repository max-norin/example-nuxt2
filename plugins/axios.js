import ServerError from '~/utils/errors/ServerError'
import AuthError from '~/utils/errors/AuthError'
import AccessError from '~/utils/errors/AccessError'
import NullResponseError from '~/utils/errors/NullResponseError'

export default function ({ $axios, $config, route, redirect, store }) {
  $axios.defaults.responseType = 'json'
  let isAuth = true
  let hasLicense = true

  $axios.onRequest(config => {
    const viewed_user_id = store.getters.VIEWED_USER_ID
    if (viewed_user_id) {
      if (!config.params) {
        config.params = {}
      }
      config.params.viewed_user_id = viewed_user_id
    }
  })

  $axios.onResponse(({ data }) => {
    if (data.result === true) {
      if (data.data === null) {
        throw new NullResponseError()
      }
      return data.data ? data.data : null
    }
    else if (data.errors) {
      throw new ServerError(data.errors)
    }
    else {
      throw new Error('server')
    }
  })

  $axios.onResponseError(error => {
    if (error instanceof ServerError) {
      const errors = error.errors
      if (typeof errors === 'object') {
        if (errors.auth === false) {
          const loginPath = '/login'
          if (isAuth && route.path !== loginPath) {
            isAuth = false
            redirect(loginPath)
          }
          throw new AuthError()
        }
        else if (errors.license === false) {
          if (hasLicense) {
            hasLicense = false
            window.location = $config.mainSite
          }
          throw new AccessError()
        }
      }
    }
  })
}
