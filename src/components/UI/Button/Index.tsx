import { FC } from 'react';
import cl from './index.module.scss';

interface ButtonProps {
    color: 'black' | 'gray';
    className?: string;
    children: React.ReactChild;
    onClick?: () => void;
    style?: object
}

const Button: FC<ButtonProps> = ({ children, color, className, onClick, style }) => {
    return (
        <button
            className={`${className} ${cl['button']} ${
                color === 'black' ? cl['button_black'] : cl['button_gray']
            }`}
            onClick={onClick} style={style}>
            {children}
        </button>
    );
};

export default Button;
