/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import './styles.scss';

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  labelText: string;
  onChange?: () => void;
}

function Input({ labelText, onChange, ...props }:InputProps) {
  return (
      <input
        {...props}
        id={props.name}
        className="input"
      />

  );
}

Input.defaultProps = {
  onChange: () => {},
};

export default Input;
