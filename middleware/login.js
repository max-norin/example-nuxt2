import errors from '~/utils/errors/errors'
import AuthError from '~/utils/errors/AuthError'

export default async function ({ store, error, redirect }) {
  try {
    await store.dispatch('GET_USER')
    return redirect('/')
  }
  catch (e) {
    if (!(e instanceof AuthError)) {
      return error({ statusCode: 500, message: errors.server })
    }
  }
}
