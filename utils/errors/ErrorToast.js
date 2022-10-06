import {ToastProgrammatic as Toast} from 'buefy'
export default function ErrorToast(message) {
  Toast.open({
    message: message,
    type: 'is-danger',
    position: 'is-bottom',
    duration: 5000
  })
}
