import getMap from '@/utils/getMap'
import Product from '@/entities/Product'
import Category from '~/entities/Category'

export default ({
  state: {
    categories: [],
    products: [],
  },
  namespaced: true,
  getters: {
    CATEGORIES: state => {
      return state.categories
    },
    CATEGORY_MAP: state => {
      return getMap(state.categories, 'id')
    },

    PRODUCTS: state => {
      return state.products
    },
    PRODUCT_MAP: state => {
      return getMap(state.products, 'id')
    },
  },
  actions: {
    async GET_CATEGORIES ({ commit }) {
      const records = (await this.$axios.get(Category.URL_PREFIX))
      commit('SET_CATEGORIES', records)
    },
    async CREATE_CATEGORY ({ commit }, payload) {
      const data = payload.toApi()
      const record = await this.$axios.post(payload.getUrl(), data)
      commit('PUSH_CATEGORY', record)
    },
    async UPDATE_CATEGORY ({ commit }, payload) {
      const data = payload.toApi()
      const record = await this.$axios.put(payload.getUrl(), data)
      commit('UPDATE_CATEGORY', record)
    },
    async DELETE_CATEGORY ({ commit }, payload) {
      const result = await this.$axios.delete(payload.getUrl())
      if (result) {
        commit('REMOVE_CATEGORY', payload)
      }
    },

    async GET_PRODUCTS ({ commit }) {
      const records = (await this.$axios.get(Product.URL_PREFIX))
      commit('SET_PRODUCTS', records)
    },
    async CREATE_PRODUCT ({ commit }, payload) {
      const data = payload.toApi()
      const record = await this.$axios.post(payload.getUrl(), data)
      commit('PUSH_PRODUCT', record)
    },
    async UPDATE_PRODUCT ({ commit }, payload) {
      const data = payload.toApi()
      const record = await this.$axios.put(payload.getUrl(), data)
      commit('UPDATE_PRODUCT', record)
    },
    async DELETE_PRODUCT ({ commit }, payload) {
      const result = await this.$axios.delete(payload.getUrl())
      if (result) {
        commit('REMOVE_PRODUCT', payload)
      }
    },
  },
  mutations: {
    SET_CATEGORIES: function (state, payload) {
      const store = this
      state.categories = payload.map(i => new Category({ data: i, store }))
    },
    UPDATE_CATEGORY: function (state, payload) {
      const record = state.categories.find(d => d.id === payload.id)
      record.set(payload)
    },
    PUSH_CATEGORY: function (state, payload) {
      const store = this
      state.categories.push(new Category({ data: payload, store }))
    },
    REMOVE_CATEGORY: function (state, payload) {
      const index = state.categories.findIndex(d => d.id === payload.id)
      state.categories.splice(index, 1)
    },

    SET_PRODUCTS: function (state, payload) {
      const store = this
      state.products = payload.map(i => new Product({ data: i, store }))
    },
    UPDATE_PRODUCT: function (state, payload) {
      const record = state.products.find(d => d.id === payload.id)
      record.set(payload)
    },
    PUSH_PRODUCT: function (state, payload) {
      const store = this
      state.products.push(new Product({ data: payload, store }))
    },
    REMOVE_PRODUCT: function (state, payload) {
      const index = state.products.findIndex(d => d.id === payload.id)
      state.products.splice(index, 1)
    },

  },
})

