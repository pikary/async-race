import React from 'react';
import './styles.scss';
import classnames from 'classnames';

type ButtonType = 'pink' | 'blue'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: ButtonType,
  onClick?: () => void,
}

function Button(props:ButtonProps) {
  const {
    onClick, className, type, children, disabled,
  } = props;

  return (
      <button
        disabled={disabled || false}
        onClick={onClick}
        className={classnames('button', className)}
        type={type}
      >
          {children}
      </button>
  );
}

Button.defaultProps = {
  className: '',
  onClick: () => {},
};

export default Button;
