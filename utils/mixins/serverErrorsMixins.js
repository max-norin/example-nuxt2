import ServerError from '~/utils/errors/ServerError'

export default {
  data () {
    return {
      serverErrors: {},
    }
  },
  created () {
    const init = (inObj, index = 0) => {
      let outObj = index === 0 ? this.serverErrors : null
      for (let key in inObj) {
        if (inObj.hasOwnProperty(key) && typeof inObj[key] === 'object') {
          const t = init(inObj[key], index + 1)
          if (outObj === null) {
            outObj = {}
          }
          this.$set(outObj, key, (t === null) ? [] : t)
        }
      }

      return outObj
    }

    const validations = typeof this.$options.validations === 'function'
      ? this.$options.validations.call(this)
      : this.$options.validations

    init(validations)
  },
  methods: {
    setServerErrors (errorsObject, serverError) {
      if (!(serverError instanceof ServerError) || typeof errorsObject !== 'object' || typeof serverError.errors !== 'object') {
        return false
      }

      let serverErrors = serverError.errors
      let result = false
      for (let key in serverErrors) {
        if (serverErrors.hasOwnProperty(key) && errorsObject.hasOwnProperty(key) && Array.isArray(serverErrors[key])) {
          result = true
          errorsObject[key] = serverErrors[key]
        }
      }

      return result
    },
    resetServerErrors (errorsObject) {
      for (let key in errorsObject) {
        if (errorsObject.hasOwnProperty(key) && Array.isArray(errorsObject[key])) {
          errorsObject[key].splice(0, errorsObject[key].length)
        }
      }
    },
  },
}
