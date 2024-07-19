import React, { ReactNode } from 'react';
import './styles.scss';
import classnames from 'classnames';

type ButtonType = 'pink' | 'blue'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?:ReactNode|null,
  text:string,
  className?: string,
  onClick?: () => void,
  color:ButtonType
}

function Button(props:ButtonProps) {
  const {
    onClick, className, type, disabled, text, icon, color,
  } = props;

  return (
      <button
        disabled={disabled || false}
        onClick={onClick}
        className={classnames('button', color, className)}
        type={type}
      >
          <p>
              {text}

          </p>
          {icon}
      </button>
  );
}

Button.defaultProps = {
  icon: null,
  className: '',
  onClick: () => {},
};

export default Button;
