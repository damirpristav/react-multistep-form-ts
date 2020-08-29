import React, { useState, FC, FormEvent, MouseEvent } from 'react';

import Step from './Step';
import Preview from './Preview';
import validate from '../helpers/validate';
import { guard, isString } from '../helpers/guards';

export interface iFormData {
  [key: string]: {
    value?: string;
    required?: boolean;
    type?: string;
    placeholder?: string;
    email?: boolean;
    minLength?: number;
    fileValue?: FileList;
    choices?: { label: string; value: string; }[];
    file?: boolean;
    fileName?: string;
    allowedTypes?: string[];
    maxFileSize?: number;
  }
}

export type MyFormData = {
  [key: string]: iFormData
}

const Form: FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MyFormData>({
    stepOne: {
      firstName: {
        value: '',
        required: true,
        type: 'input',
        placeholder: 'First name'
      },
      lastName: {
        value: '',
        required: true,
        type: 'input',
        placeholder: 'Last name'
      }
    },
    stepTwo: {
      email: {
        value: '',
        email: true,
        type: 'input',
        placeholder: 'Email'
      },
      password: {
        value: '',
        minLength: 6,
        type: 'input:password',
        placeholder: 'Password'
      }
    },
    stepThree: {
      gender: {
        value: '',
        required: true,
        type: 'select',
        choices: [
          { value: '', label: 'Choose gender' },
          { value: 'female', label: 'Female' },
          { value: 'male', label: 'Male' }
        ]
      },
      image: {
        required: true,
        file: true,
        fileName: 'No file chosen',
        type: 'file',
        allowedTypes: ['png', 'jpg', 'jpeg'],
        maxFileSize: 1024
      }
    }
  });
  const [errors, setErrors] = useState({});

  const changeHandler = (step: string, e: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.persist();
    const { name, value } = e.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [name]: {
          ...prev[step][name],
          value: value
        }
      }
    }));
  }

  const fileChangeHandler = (name: string, step: string, file?: FileList) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [name]: {
          ...prev[step][name],
          fileValue: file,
          fileName: file && file[0].name ? file[0].name : 'No file chosen'
        }
      }
    }));
  }

  const stepChangeHandler = (values: iFormData, e: MouseEvent) => {
    e.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);
    if(Object.keys(newErrors).length === 0) {
      setStep(step + 1);
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let file  = formData.stepThree.image.fileValue ? formData.stepThree.image.fileValue[0] : '';

    const data = new FormData();
    data.append('firstName', isString(formData.stepOne.firstName.value));
    data.append('lastName', isString(formData.stepOne.lastName.value));
    data.append('email', isString(formData.stepTwo.email.value));
    data.append('password', isString(formData.stepTwo.password.value));
    data.append('gender', isString(formData.stepThree.gender.value));
    data.append('image', file);

    for (let pair of data.values()) {
      console.log(pair); 
    }

    // In here you can send data to some api 
    // For example if you have some redux action: sendData(data)
  }

  return(
    <form onSubmit={submitHandler}>
      <h1 className="is-size-2 has-text-centered mb-4">Create an account</h1>
      {step === 1 && <Step 
        data={formData.stepOne}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        errors={errors}
        stepKey="stepOne"
        step={1}
        onFileChange={() => {}}
        onPrevStep={() => {}}
      />}
      {step === 2 && <Step 
        data={formData.stepTwo}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        errors={errors}
        stepKey="stepTwo"
        onPrevStep={(step) => setStep(step)}
        step={2}
        onFileChange={() => {}}
      />}
      {step === 3 && <Step 
        data={formData.stepThree}
        onChange={changeHandler}
        onStepChange={stepChangeHandler}
        onFileChange={fileChangeHandler}
        errors={errors}
        stepKey="stepThree"
        onPrevStep={(step) => setStep(step)}
        step={3}
      />}
      {step === 4 && <Preview 
        onPrevStep={() => setStep(step - 1)}
        data={[
          { label: 'First name', value: guard(formData.stepOne.firstName.value) },
          { label: 'Last name', value: guard(formData.stepOne.lastName.value) },
          { label: 'Email', value: guard(formData.stepTwo.email.value) },
          { label: 'Password', value: guard(formData.stepTwo.password.value) },
          { label: 'Gender', value: guard(formData.stepThree.gender.value) },
          { label: 'Image', value: formData.stepThree.image.fileValue && URL.createObjectURL(formData.stepThree.image.fileValue[0]), image: true },
        ]}
      />}
    </form>
  );
}

export default Form;