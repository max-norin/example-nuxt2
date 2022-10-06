import Vue from 'vue'
import vuelidateErrorExtractor from 'vuelidate-error-extractor'
import errors from "~/utils/errors/errors";

Vue.use(vuelidateErrorExtractor, {messages: errors});
