import errors from '~/utils/errors/errors'
import ErrorToast from '~/utils/errors/ErrorToast'

export default class ServerError {
  constructor (errors = {}, msg = null, loading = false) {
    this.name = 'ServerError'
    this.message = msg ? msg : 'Server error'
    this.errors = errors
    this.loading = loading
  }
}

export function unknownServerErrorToast () {
  ErrorToast(errors.server)
}
