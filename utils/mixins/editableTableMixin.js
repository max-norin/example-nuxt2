export default {
  methods: {
    editable_editUrl (url, element) {
      return url + '/' + element.id
    },
    editable_idTitle (element) {
      return element.id ? element.id : '#'
    },
    editable_buttonTitle (element) {
      return element.id ? 'Сохранить' : 'Добавить'
    },
    editable_editList (list, element) {
      const index = list.findIndex(item => item.id === element.id)
      list.splice(index, 1, element)
    },
    editable_removeList (list, element) {
      const index = list.findIndex(item => item.id === element.id)
      list.splice(index, 1)
    },
  },
}
