import errors from '~/utils/errors/errors'
import AuthError from '~/utils/errors/AuthError'
import AccessError from '~/utils/errors/AccessError'

let isLoadingData = null

export default async function ({ store, error }) {
  if (isLoadingData !== null) {
    return
  }
  isLoadingData = false

  try {
    await Promise.all([
      store.dispatch('market/GET_CATEGORIES'),
    ])
    isLoadingData = true
    return true
  }
  catch (e) {
    return error({ statusCode: 500, message: errors.server })
  }
}
