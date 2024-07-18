import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type ArrowType = 'pink' | 'blue'

interface ArrowProps{
    color?: ArrowType
}

function Arrow(props:ArrowProps) {
  const { color } = props;
  return (
      <div className={classNames('arrow', color)} />
  );
}

Arrow.defaultProps = {
  color: '',
};
export default Arrow;
