import { numberWithSpaces } from '../../../helpers/format';
import cl from './index.module.scss';

interface InputProps {
    value: string | number;
    changeValue: React.Dispatch<React.SetStateAction<number>>;
    className?: string;
}

function Input({ value, changeValue, className }: InputProps) {
    const handleInputChange = function (s: string): void {
        s = s.replaceAll(' ', '');
        let value: number = parseInt(s);
        if (value < 5 || Number.isNaN(value)) {
            value = 5;
        } else if (value > 1000 || Number.isNaN(value)) {
            value = 1000;
        }
        changeValue(value);
    };

    return (
        <input
            type="text"
            className={`${cl['cute_input']} ${className}`}
            value={numberWithSpaces(value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
        />
    );
}

export default Input;
