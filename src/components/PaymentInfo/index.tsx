import cl from './index.module.scss';

interface PaymentInfoProps {
    activeStep: number;
    value: number;
    order_timestamp: number|undefined
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ activeStep, value, order_timestamp }) => {
    const now_time = order_timestamp ? (new Date(order_timestamp * 1000).toLocaleTimeString().slice(0, -3)) : null;
    return (
        <div className={cl['payment_infos__wrapper']}>
            { (activeStep == 2 && now_time) ? (
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
