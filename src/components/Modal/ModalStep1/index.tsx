import cl from './index.module.scss';
import {payment_methods} from "../../../helpers/api";

const payments = [
    {
        method: 'bank_transfer',
        title: payment_methods.bank_transfer,
    },
    {
        method: 'visa',
        title: payment_methods.visa,
        img: '/img/visa.png',
    },
    {
        method: 'mastercard',
        title: payment_methods.mastercard,
        img: '/img/mastercard.png',
    },
];

interface ModalStep1Props {
    activePayment: string | null;
    setPayment: React.Dispatch<React.SetStateAction<string | null>>;
}

const ModalStep1: React.FC<ModalStep1Props> = ({ activePayment, setPayment }) => {
    return (
        <div className={cl['modal_payment__step1']}>
            {payments.map((el) => (
                <div
                    key={el.title}
                    className={`${cl['payment']} ${
                        activePayment == el.method ? cl['payment__active'] : null
                    }`}
                    onClick={() => setPayment(el.method)}>
                    {el.img && (
                        <div className={cl['payment_imgs']}>
                            <img src="/img/before_payment.png" alt="before_payment" />
                            <img src={el.img} alt="payment" />
                        </div>
                    )}
                    <p>{el.title}</p>
                </div>
            ))}
        </div>
    );
};

export default ModalStep1;
