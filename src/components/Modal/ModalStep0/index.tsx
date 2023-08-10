import PaymentInput from '../../PaymentInput';
import Button from '../../UI/Button/Index';
import cl from './index.module.scss';

interface ModalStep0Props {
    valueDeposit: number;
    setValueDeposit: React.Dispatch<React.SetStateAction<number>>;
    handleNextClick: () => void;
    handleCloseClick: () => void;
}

const ModalStep0: React.FC<ModalStep0Props> = ({
    valueDeposit,
    setValueDeposit,
    handleNextClick,
    handleCloseClick,
}) => {
    return (
        <div className={cl['modal_payment__step0']}>
            <div className={cl['modal_payment__step0__up']}>
                <p>Пополнение</p>
                <div
                    id="modal_payment_colse"
                    className={cl['modal_payment_colse']}
                    onClick={handleCloseClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none">
                        <path
                            d="M4.66885 14.1188L3.88135 13.3313L8.2126 9.00001L3.88135 4.66876L4.66885 3.88126L9.0001 8.21251L13.3313 3.88126L14.1188 4.66876L9.7876 9.00001L14.1188 13.3313L13.3313 14.1188L9.0001 9.78751L4.66885 14.1188Z"
                            fill="#929292"
                        />
                    </svg>
                </div>
            </div>
            <p className={cl['modal_payment__step0__help_text']}>
                Сумма одного депозита <br />5 ₼ - 1 000 ₼
            </p>

            <PaymentInput
                value={valueDeposit}
                changeValue={setValueDeposit}
                className={cl['modal_step0_input']}
            />
            <Button color={'black'} className={cl['button']} onClick={handleNextClick}>
                Пополнить
            </Button>
        </div>
    );
};

export default ModalStep0;
