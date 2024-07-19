/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classNames from 'classnames';
import './styles.scss';

interface InputProps {
  className?:string,
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
        className={classNames('input', props.className)}
      />

  );
}

Input.defaultProps = {
  onChange: () => {},
  className: '',
};

export default Input;
