import sinon from 'sinon' 
import { default as Form, defaultMessages, defaultValidate } from './../src/Form'
import { createMockXHR } from './../__mocks__/mockXhr'
import { createMockForm } from './../__mocks__/mockForm'

describe('When creating a Form ', function() {
  it('it should take a URL in the constructor', function() {
    const url = 'http://localhost'
    const instance = new Form(url)
    expect(instance.url).toEqual(url)
  })
  
  it('it should apply defaults for messages and validate function', function() {
    const form = new Form('http://localhost')
    expect(form.messages).toEqual(defaultMessages)
    expect(form.validate).toEqual(defaultValidate)
  })

  it('it should accept parameters for messages and validate function', function() {
    const messages = {
      success: 'TEST SUCCESS',
      error: 'TEST ERROR'
    }

    const validate = (form) => {
      return true
    }

    const form = new Form('http://localhost', messages, validate)
    expect(form.messages).toEqual(messages)
    expect(form.validate).toEqual(validate)
  })

  it('it should throw an exception if no URL is passed', function() {
    expect(() => {
      new Form()
    }).toThrow(TypeError)
  })

  it('it should throw an exception if no function passed to then listener', function() {
    expect(() => {
      const form = new Form('http://localhost').then()
    }).toThrow(TypeError)
  })

  it('it should add listener to thenListeners when passed a function', function() {
      const callback = () => {
        return true
      }

      const form = new Form('http://localhost').then(callback)
      expect(form.thenListeners[0]).toEqual(callback)
  })

  it('it should throw an exception if no function passed to catch listener', function() {
    expect(() => {
      const form = new Form('http://localhost').catch()
    }).toThrow(TypeError)
  })
  
  it('it should add listener to catchListeners when passed a function', function() {
    const callback = () => {
      return true
    }

    const form = new Form('http://localhost').catch(callback)
    expect(form.catchListeners[0]).toEqual(callback)
  })

  it('it should reject promise if form is not valid when submitted', function(done) {
    const messages = {
      error: 'ERR'
    }

    const form = new Form('http://localhost', messages, () => (false))
    const spy1 = sinon.spy()
    form.catch(spy1)

    const mockForm = createMockForm()
    form.submit(mockForm, () => {}, (event) => {
      expect(event.target).toEqual(mockForm)
      expect(event.error).toEqual(messages.error)
      expect(spy1.called).toEqual(true)
      done()
    })
  })

  it('it should POST data and handle errors with error from data', function(done) {
    // Keep reference to request
    const oldXMLHttpRequest = window.XMLHttpRequest
    const mockData = {error: 'ERROR', data: {test: 'test123'}}
    let mockXHR = createMockXHR(mockData)
    window.XMLHttpRequest = jest.fn(() => mockXHR)

    const form = new Form('http://localhost', {}, () => (true))    
    const spy1 = sinon.spy()
    form.catch(spy1)
    
    const mockForm = createMockForm()
    form.submit(mockForm, () => {}, (event) => {
      expect(event.target).toEqual(mockForm)
      expect(event.data).toEqual(mockData.data)
      expect(event.error).toEqual(mockData.error)
      expect(spy1.called).toEqual(true)
      done()
    })

    mockXHR.onload()

    // Restore reference to request
    window.XMLHttpRequest = oldXMLHttpRequest
  })

  it('it should POST data and use error from constructor if passed', function(done) {
    // Keep reference to request
    const oldXMLHttpRequest = window.XMLHttpRequest
    const mockData = {error: 'ERROR', data: {test: 'test123'}}
    let mockXHR = createMockXHR(mockData)
    window.XMLHttpRequest = jest.fn(() => mockXHR)

    const messages = {
      error: 'ERR'
    }
    
    const form = new Form('http://localhost', messages, () => (true))    
    const mockForm = createMockForm()
    form.submit(mockForm, () => {}, (event) => {
      expect(event.error).toEqual(messages.error)
      done()
    })

    mockXHR.onload()

    // Restore reference to request
    window.XMLHttpRequest = oldXMLHttpRequest
  })

  it('it should POST data and handle success with message', function(done) {
    // Keep reference to request
    const oldXMLHttpRequest = window.XMLHttpRequest
    const mockData = {message: 'SUCCESS'}
    let mockXHR = createMockXHR(mockData)
    window.XMLHttpRequest = jest.fn(() => mockXHR)

    const form = new Form('http://localhost', {}, () => (true))    
    const spy1 = sinon.spy()
    form.then(spy1)
    
    const mockForm = createMockForm()
    form.submit(mockForm, (event) => {
      expect(event.target).toEqual(mockForm)
      expect(event.message).toEqual(mockData.message)
      expect(spy1.called).toEqual(true)
      done()
    })

    mockXHR.onload()

    // Restore reference to request
    window.XMLHttpRequest = oldXMLHttpRequest
  })

  it('it should POST data and use success from constructor if passed', function(done) {
    // Keep reference to request
    const oldXMLHttpRequest = window.XMLHttpRequest
    const mockData = {message: 'SUCCESS'}
    let mockXHR = createMockXHR(mockData)
    window.XMLHttpRequest = jest.fn(() => mockXHR)

    const messages = {
      success: 'SUC'
    }
    
    const form = new Form('http://localhost', messages, () => (true))    
    const mockForm = createMockForm()
    form.submit(mockForm, (event) => {
      expect(event.message).toEqual(messages.success)
      done()
    })

    mockXHR.onload()

    // Restore reference to request
    window.XMLHttpRequest = oldXMLHttpRequest
  })
})
