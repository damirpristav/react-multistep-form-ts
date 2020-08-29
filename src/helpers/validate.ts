import { iFormData } from '../components/Form';

const validateEmail = (email: string | undefined) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email) {
    return re.test(email);
  }
}

export default (fields: iFormData) => {
  let errors: { [key: string]: string } = {};

  for(let field in fields) {
    const currentField = fields[field];

    if(currentField.required && currentField.value === '') {
      errors[field] = 'This field is required!';
    }

    if(currentField.required && currentField.file && currentField.fileValue && !currentField.fileValue[0].name) {
      errors[field] = 'This field is required!';
    }

    if(!errors[field] && currentField.email && !validateEmail(currentField?.value)) {
      errors[field] = 'Invalid email address';
    }

    if(!errors[field] && currentField.minLength && currentField.value !== undefined && currentField.value.trim().length < currentField.minLength) {
      errors[field] = `This field must have at least ${currentField.minLength} characters`;
    }

    if(!errors[field] && currentField.file && currentField.allowedTypes && currentField.fileValue && currentField.fileValue[0].type !== undefined && !currentField.allowedTypes.includes(currentField.fileValue[0].type.split('/')[1])) {
      console.log('file type validation');
      errors[field] = 'Invalid file type!';
    }

    if(!errors[field] && currentField.file && currentField.maxFileSize && currentField.fileValue && currentField.fileValue[0].size && (currentField.maxFileSize * 1024) < Math.round(currentField.fileValue[0].size)) {
      errors[field] = `File is too large(${Math.round(currentField.fileValue[0].size / 1024)}KB), it cannot be larger than ${currentField.maxFileSize}KB`;
    }
  }

  return errors;
}