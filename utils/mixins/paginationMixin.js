import editableTableMixin from '@/utils/mixins/editableTableMixin'

export default {
  mixins: [editableTableMixin],
  data () {
    return {
      page: 1,
      total: 0,
    }
  },
  computed: {
    pagination_params () {
      return {
        page: this.page,
        per_page: this.perPage,
      }
    },
  },
  methods: {
    pagination_addList (list, element) {
      this.total++
      let page = Math.ceil(this.total / this.perPage)
      list.push(element)
      if (page !== this.page) {
        this.pagination_onPageChange(page)
      }
    },
    pagination_editList (list, element) {
      this.editable_editList(list, element)
    },
    pagination_onPageChange (page) {
      this.page = page
    },
    pagination_goToEnd (total) {
      let page = Math.ceil(total / this.perPage)
      this.pagination_onPageChange(page)
    },
  },
}
