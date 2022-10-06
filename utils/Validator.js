export default class Validator {

  static isEmpty (obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }

  static isFile (file) {
    return file instanceof File
  }

  static checkFileType (file, types) {
    if (!Validator.isFile(file)) {
      return false
    }
    const type = file.type.toLowerCase()
    return types.find(t => t === type) !== undefined
  }

  static checkFileSize (file, size) {
    if (!Validator.isFile(file)) {
      return false
    }
    return size * 1024 * 1024 >= file.size
  }

  static checkImageType (file) {
    return Validator.checkFileType(file, Validator.AVAILABLE_IMAGE_MIME_TYPES)
  }

  static checkImageSize (file) {
    return Validator.checkFileSize(file, Validator.AVAILABLE_IMAGE_SIZE_MB)
  }

  static checkImportFileType (file) {
    return Validator.checkFileType(file, Validator.AVAILABLE_IMPORT_FILE_MIME_TYPES)
  }

  static checkImportFileSize (file) {
    return Validator.checkFileSize(file, Validator.AVAILABLE_IMPORT_FILE_SIZE_MB)
  }

  static checkMaxFileSize (file) {
    return Validator.checkFileSize(file, Validator.MAX_FILE_SIZE_MB)
  }
}

Object.defineProperty(Validator, 'MAX_FILE_SIZE_MB', {
  value: 10,
  writable: false,
  configurable: false,
})

Object.defineProperty(Validator, 'AVAILABLE_IMPORT_FILE_TYPES', {
  value: ['csv'],
  writable: false,
  configurable: false,
})
Object.defineProperty(Validator, 'AVAILABLE_IMPORT_FILE_MIME_TYPES', {
  value: [
    'text/csv',
    'application/vnd.ms-excel',
  ],
  writable: false,
  configurable: false,
})
Object.defineProperty(Validator, 'AVAILABLE_IMPORT_FILE_SIZE_MB', {
  value: 10,
  writable: false,
  configurable: false,
})

Object.defineProperty(Validator, 'AVAILABLE_IMAGE_TYPES', {
  value: ['png', 'jpeg', 'jpg'],
  writable: false,
  configurable: false,
})
Object.defineProperty(Validator, 'AVAILABLE_IMAGE_MIME_TYPES', {
  value: [
    'image/png',
    'image/jpeg',
  ],
  writable: false,
  configurable: false,
})
Object.defineProperty(Validator, 'AVAILABLE_IMAGE_SIZE_MB', {
  value: 2,
  writable: false,
  configurable: false,
})
