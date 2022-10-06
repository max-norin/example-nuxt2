import moment from 'moment'

export default class Formator {
  static datetime (datetime) {
    return moment(datetime).format('DD.MM.YYYY hh:mm')
  }

  static date (date) {
    return moment(date).format('DD.MM.YYYY')
  }
}
