/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classNames from 'classnames';
import './styles.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelText: string;
}
function Input({ labelText, ...props }: InputProps) {
  return (
      <input
        {...props}
        id={props.name}
        className={classNames('input', props.className)}
      />
  );
}

Input.defaultProps = {
  className: '',
};

export default Input;
