<template>
  <b-field
      :label="label"
      :addons="addons"
      :type="type"
      :message="customFirstErrorMessage"
  >
    <slot :slot-input="slotInput"/>
  </b-field>
</template>

<script>
import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'

export default {
  name: 'FormGroup',
  mixins: [singleErrorExtractorMixin],
  props: {
    label: { required: false, default: null },
    addons: { type: Boolean, default: true },
    serverErrors: { required: false, type: Array, default: () => [] },
  },
  computed: {
    type () {
      return this.customHasErrors ? 'is-danger' : null
    },
    customHasErrors () {
      return this.serverErrors.length ? true : this.hasErrors
    },
    customFirstErrorMessage () {
      return this.serverErrors.length ? this.serverErrors[0] : this.firstErrorMessage
    },
  },
  methods: {
    slotInput () {
      if (this.validator.$reset) {
        this.validator.$reset()
      }
      this.serverErrors.splice(0, this.serverErrors.length)
    },
  },
}
</script>
