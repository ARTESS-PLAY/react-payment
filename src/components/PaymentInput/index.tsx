import Input from '../UI/Input';
import cl from './index.module.scss';

interface PaymentInputProps {
    value: number;
    changeValue: React.Dispatch<React.SetStateAction<number>>;
    className?: string;
}

const payment_values = [5, 100, 250, 1000, 5000];

function PaymentInput({ value, changeValue, className }: PaymentInputProps) {
    const handleValueClick = function (num: number): void {
        changeValue(num);
    };

    return (
        <div className={`${cl['payment_input']} ${className}`}>
            <div className={cl['input_wrapp']}>
                <Input
                    value={value}
                    changeValue={changeValue}
                    className={cl['payment_input__input']}
                />
            </div>

            <div className={cl['payment_values']}>
                {payment_values.map((num) => (
                    <span className={cl['payment_value']} onClick={() => handleValueClick(num)}>
                        {num.toLocaleString()}&nbsp;₼
                    </span>
                ))}
            </div>
        </div>
    );
}

export default PaymentInput;
