import cl from './index.module.scss';

const payments = [
    {
        method: 'card',
        title: 'Перевод на карту',
    },
    {
        method: 'visa',
        title: 'Kapital Bank Visa',
        img: '/img/visa.png',
    },
    {
        method: 'Mastercard',
        title: 'Kapital Bank Mastercard',
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
