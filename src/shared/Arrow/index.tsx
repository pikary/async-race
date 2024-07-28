import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type ArrowType = 'pink' | 'blue';
type ArrowSize = 'small' | 'normal';

interface ArrowProps {
    color?: ArrowType;
    size: ArrowSize;
}

function Arrow(props: ArrowProps) {
    const { color, size } = props;
    return <div className={classNames('arrow', color, size)} />;
}

Arrow.defaultProps = {
    color: '',
};
export default Arrow;
