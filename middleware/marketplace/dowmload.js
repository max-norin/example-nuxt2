import errors from '~/utils/errors/errors'

let isLoadingData = null

export default async function ({ store, error }) {
  if (isLoadingData !== null) {
    return
  }
  isLoadingData = false

  try {
    await Promise.all([
      store.dispatch('GET_MARKETPLACE_PRODUCTS'),
    ])
    if (store.getters.OZON_AUTH) {
      await Promise.all([
        store.dispatch('GET_MARKETPLACE_CATEGORIES'),
      ])
    }
    isLoadingData = true
    return true
  }
  catch (e) {
    return error({ statusCode: 500, message: errors.server })
  }
}
