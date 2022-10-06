import errors from '~/utils/errors/errors'
import AuthError from '~/utils/errors/AuthError'
import AccessError from '~/utils/errors/AccessError'

let isLoadingData = null

export default async function ({ store, error, redirect }) {
  if (isLoadingData !== null) {
    return
  }
  isLoadingData = false

  try {
    await Promise.all([
      store.dispatch('GET_USER'),
      store.dispatch('GET_MARKETPLACES'),
    ])
    isLoadingData = true
    return true
  }
  catch (e) {
    if (e instanceof AuthError || e instanceof AccessError) {
      return redirect('/')
    }
    else {
      return error({ statusCode: 500, message: errors.server })
    }
  }
}
