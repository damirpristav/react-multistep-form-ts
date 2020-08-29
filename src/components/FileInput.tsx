import React, { FC, useRef, FormEvent } from 'react';

interface FileInputProps {
  onChange: (name: string, stepKey: string, file?: FileList ) => void;
  name: string;
  error: string;
  stepKey: string;
  fileName: string;
}

const FileInput: FC<FileInputProps> = ({ onChange, name, error, stepKey, fileName }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInput.current?.click();
  }

  const fileChangeHandler = (e: FormEvent<HTMLInputElement>) => {
    if(e.currentTarget.files && e.currentTarget.files[0]) {
      onChange(name, stepKey, e.currentTarget.files);
    }else {
      onChange(name, stepKey);
    }
  }

  return(
    <div className="mb-5">
      <input type="file" name={name} ref={fileInput} onChange={fileChangeHandler} className="is-hidden" />
      <div className="is-flex" style={{alignItems: 'center'}}>
        <button type="button" className="button is-info mr-3" onClick={openFilePicker}>Choose file</button>
        <p className="is-flex" style={{alignItems: 'center'}}>
          {fileName}
          {fileName !== 'No file chosen' &&
            <button type="button" className="delete is-small ml-2" onClick={() => onChange(name, stepKey)}></button>
          }
        </p>
      </div>
      {error && <div className="has-text-danger-dark">{error}</div>}
    </div>
  );
}

export default FileInput;