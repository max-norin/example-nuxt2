import Vue from 'vue'
import getMap from '../utils/getMap'
import OriginalCategory from './OriginalCategory'

export default class Marketplace extends Vue.extend({
  data () {
    return {
      id: null,
      title: null,
      auth_param_values: null,

      original_categories: [],
    }
  },
  created () {},
  computed: {
    original_category_obj_title () {
      return getMap(this.original_categories, 'title')
    },
  },
  methods: {
    setOriginalCategories (records) {
      this.original_categories = records.map(i => new OriginalCategory({ data: { title: i.objectName }, store: this.$store }))
    },
    getOriginalCategory (marketplaceCategory) {
      return this.original_category_obj_title[marketplaceCategory.title]
    },
  },
}) {}
