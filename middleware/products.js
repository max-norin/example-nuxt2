import errors from '~/utils/errors/errors'

let isLoadingData = null

export default async function ({ store, error }) {
  if (isLoadingData !== null) {
    return
  }
  isLoadingData = false

  try {
    await Promise.all([
      store.dispatch('market/GET_PRODUCTS'),
    ])
    isLoadingData = true
    return true
  }
  catch (e) {
    return error({ statusCode: 500, message: errors.server })
  }
}
