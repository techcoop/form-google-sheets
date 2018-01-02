export const createMockForm = (name = 'test', value = 'test123', required = true) => {
  let form = document.createElement('form')
  
  let input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('name', name)
  input.setAttribute('value', value)
  if (required) { 
    input.setAttribute('required', 1)
  }
  
  form.appendChild(input)

  return form
}
