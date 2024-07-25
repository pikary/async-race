import React, { ReactNode } from 'react';
import './styles.scss';
import classnames from 'classnames';

type ButtonType = 'pink' | 'blue'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode | null,
  text?: string,
  className?: string,
  onClick?: () => void,
  shortenText?:string,
  color?: ButtonType
}

function Button(props: ButtonProps) {
  const {
    onClick, className, type, disabled, text, icon, color, shortenText,
  } = props;

  return (
      <button
        disabled={disabled || false}
        onClick={onClick}
        className={classnames('button', color, className)}
        type={type}
      >
          {/* {text && (
          <p>
              {text}
          </p>
          )} */}
          {shortenText ? (
              <>
                  <p className="button__mob-view">{shortenText}</p>
                  <p className="button__pc-view">{text}</p>
              </>
          ) : <p>{text}</p> }
          {icon}
      </button>
  );
}

Button.defaultProps = {
  icon: null,
  className: '',
  onClick: () => { },
  color: '',
  text: '',
  shortenText: '',
};

export default Button;
