const defaultSuccess = 'Thank you for your interest.'
const defaultError = 'There was an error process your form submission.'

export const defaultMessages = {
  success: '',
  error: ''
}

export const defaultValidate = (form) => {
  if (!form) {
    return false
  }

  return form.checkValidity()
}

class Form {
  constructor (url, messages = defaultMessages, validate = defaultValidate) {
    this.thenListeners = []
    this.catchListeners = []
    this.promise = undefined
    this.messages = messages
    this.validate = validate

    if (!url) {
      throw new TypeError('Form::constructor - You must pass a URL.')
    }

    this.url = url
  }

  then(callback) {
    if (!(callback instanceof Function)) {
      throw new TypeError('Form::then - You must a function callback to then.')
    } else {
      this.thenListeners.push(callback)
    }
    
    return this
  }

  catch(callback) {
    if (!(callback instanceof Function)) {
      throw new TypeError('Form::catch - You must a function callback to catch.')
    } else {
      this.catchListeners.push(callback)
    }
    
    return this
  }

  submit (form, resolve, reject) {
    var submit = new Promise((resolve, reject) => {
      if (!this.validate(form)) {
        reject({error: defaultError})
      } else {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', this.url)
        xhr.onload = () => {
          const response = JSON.parse(xhr.responseText)
          if (response.error) {
            reject(response)
          } else {
            resolve(response)
          }
        }
        xhr.onerror = () => reject({error: defaultError})
        xhr.send(new FormData(form))
      }
    }).then((response) => {
      const event = {target: form, message: (this.messages.success ? this.messages.success : response.message)}

      if (response.data) {
        event.data = response.data
      }

      this.thenListeners.map((emit) => {
        emit(event)
      })

      if (resolve) {
        resolve(event)
      }
    }).catch((response) => {
      const event = {target: form, error: (this.messages.error ? this.messages.error : response.error)}

      if (response.data) {
        event.data = response.data
      }

      this.catchListeners.map((emit) => {
        emit(event)
      })

      if (reject) {
        reject(event)
      }
    })

    return false
  }
}

export default Form
