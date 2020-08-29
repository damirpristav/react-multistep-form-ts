import React, { Fragment, FC, FormEvent, MouseEvent } from 'react';

import Input from './Input';
import Select from './Select';
import FileInput from './FileInput';
import { iFormData } from './Form';

interface StepProps {
  data: iFormData;
  onChange: (stepKey: string, e: FormEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (name: string, step: string, file?: FileList ) => void;
  onStepChange: (values: iFormData, e: MouseEvent) => void;
  errors: {
    [key: string]: string;
  };
  stepKey: string;
  step: number;
  onPrevStep: (step: number) => void
}

const Step: FC<StepProps> = ({ data, onChange, onFileChange, onStepChange, errors, stepKey, step, onPrevStep }) => {
  let output = [];

  for(const [key, val] of Object.entries(data)) {
    if(val && val.type && val.type.split(':')[0] === 'input') {
      output.push(<Input 
        key={key}
        placeholder={val.placeholder ? val.placeholder : ''}
        name={key}
        value={val.value ? val.value : ''}
        onChange={(e) => onChange(stepKey, e)}
        error={errors[key]}
        type={val.type.split(':')[1]}
      />);
    }else if(val.type === 'select') {
      output.push(<Select 
        key={key}
        name={key}
        value={val.value ? val.value : ''}
        onChange={(e) => onChange(stepKey, e)}
        error={errors[key]}
        choices={val.choices ? val.choices : []}
      />);
    }else if(val.type === 'file') {
      output.push(<FileInput 
        key={key}
        onChange={onFileChange}
        error={errors[key]}
        name={key}
        stepKey={stepKey}
        fileName={val.fileName ? val.fileName : ''}
      />);
    }
  }
  
  return(
    <Fragment>
      {output}
      {step > 1 && <button type="button" className="button is-warning mr-2" onClick={() => onPrevStep(step - 1)}>Go back</button>}
      <button type="button" className="button is-link" onClick={(e) => onStepChange(data, e)}>Next</button>
    </Fragment>
  );
}

export default Step;