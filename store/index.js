import Vue from 'vue'
import Vuex from 'vuex'
import User from '@/entities/User'
import Product from '@/entities/Product'
import Marketplace from '@/entities/Marketplace'
import market from './market'
import getMap from '@/utils/getMap'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: {},
    subordinate: {},

    marketplaces: [],

    marketplace: {
      categories: [],
      products: [],
    },
  },
  namespaced: true,
  modules: {
    market: market,
  },
  getters: {
    USER: state => {
      return state.user
    },

    MARKETPLACES: state => {
      return state.marketplaces
    },
    MARKETPLACE_MAP: state => {
      return getMap(state.marketplaces, 'id')
    },

    MARKETPLACE_AUTH_DATA: state => {
      return state.marketplace.auth.data
    },
    MARKETPLACE_CATEGORIES: state => {
      return state.marketplace.categories
    },
    MARKETPLACE_PRODUCTS: state => {
      return state.marketplace.products
    },
  },
  actions: {
    async GET_USER ({ commit }) {
      const user = await this.$axios.get('/user')
      commit('SET_USER', user)
    },
    async UPDATE_USER ({ commit }, payload) {
      const user = await this.$axios.put('/user', payload)
      commit('SET_USER', user)
    },

    async GET_MARKETPLACES ({ commit }) {
      const records = await this.$axios.get('/marketplaces')
      commit('SET_MARKETPLACES', records)
    },

    async GET_MARKETPLACE_CATEGORIES ({ commit }) {
      const params = {
        method: 'GET',
        url: 'https://suppliers-api.wildberries.ru/content/v1/object/all?top=10000',
      }
      const records = (await this.$axios.post('/marketplaces/1/api', params)).data
      commit('SET_MARKETPLACE_CATEGORIES', records)
    },

    async GET_MARKETPLACE_PRODUCTS ({ commit }) {
      const records = (await this.$axios.get('/marketplaces/1/products'))
      commit('SET_MARKETPLACE_PRODUCTS', records)
    }
    ,
  },
  mutations: {
    SET_USER: function (state, payload) {
      state.user = new User({ data: payload })
    },

    SET_MARKETPLACES: function (state, payload) {
      const store = this
      state.marketplaces = payload.map(i => new Marketplace({ data: i, store }))
    },

    SET_MARKETPLACE_CATEGORIES: function (state, payload) {
      state.marketplaces[0].setOriginalCategories(payload)
    },

    SET_MARKETPLACE_PRODUCTS: function (state, payload) {
      const store = this
      state.marketplace.products = payload.map(i => new Product({ data: i, store }))
    },
    UPDATE_MARKETPLACE_PRODUCT: function (state, payload) {
      const record = state.marketplace.products.find(d => d.id === payload.id)
      record.set(payload)
    },
    PUSH_MARKETPLACE_PRODUCT: function (state, payload) {
      const store = this
      state.marketplace.products.push(new Product({ data: payload, store }))
    },
    REMOVE_MARKETPLACE_PRODUCT: function (state, payload) {
      const index = state.marketplace.products.findIndex(d => d.id === payload.id)
      state.marketplace.products.splice(index, 1)
    },
  },
})

export default store
