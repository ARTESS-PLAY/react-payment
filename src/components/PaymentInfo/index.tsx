import cl from './index.module.scss';

interface PaymentInfoProps {
    activeStep: number;
    value: number;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ activeStep, value }) => {
    const now_time = new Date().toLocaleTimeString().slice(0, -3);
    return (
        <div className={cl['payment_infos__wrapper']}>
            {activeStep == 2 ? (
                <div className={cl['payment_infos']}>
                    <p className={cl['payment_info']}>
                        <span>Время заявки</span>
                        <span className={cl['payment_info__value']}>{now_time}</span>
                    </p>
                </div>
            ) : null}

            <div className={cl['payment_infos']}>
                <p className={cl['payment_info']}>
                    <span>Сумма</span>
                    <span className={cl['payment_info__value']}>{value}&nbsp;₼</span>
                </p>
            </div>
        </div>
    );
};

export default PaymentInfo;
