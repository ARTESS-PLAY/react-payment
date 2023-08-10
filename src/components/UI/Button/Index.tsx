import { FC } from 'react';
import cl from './index.module.scss';

interface ButtonProps {
    color: 'black' | 'gray';
    className?: string;
    children: React.ReactChild;
    onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ children, color, className, onClick }) => {
    return (
        <button
            className={`${className} ${cl['button']} ${
                color === 'black' ? cl['button_black'] : cl['button_gray']
            }`}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
