import cl from './index.module.scss';
import {useEffect, useState} from "react";
import {IResponseOrderDto} from "../../helpers/api";

interface PaymentInfoProps {
    activeStep: number;
    value: number;
    order: IResponseOrderDto|null
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ activeStep, value, order }) => {
    const [timer, setTimer] = useState<string|null>(null)


    useEffect(() => {
        let interval: any = setInterval(() => {
            console.log('interval', order?.order_timestamp)
            if(!order?.order_timestamp){
                setTimer(null)
                return
            }
            const finish = order?.order_timestamp + 600 // + 10min
            const delta = Math.max(0,  finish - Math.round(Date.now() / 1000)) % 3600
            const min = Math.floor(delta / 60)
            const sec = delta % 60

            let val = ""
            val += min > 9 ? min : ('0' + min)
            val += ':'
            val += sec > 9 ? sec : ('0' + sec)

            setTimer(val)
        }, 1000)

        return () => {
            console.log('clear interval')
            clearInterval(interval)
        }
    }, [order])

    return (
        <div className={cl['payment_infos__wrapper']}>
            { (activeStep == 2 && timer) ? (
                <div className={cl['payment_infos']}>
                    <p className={cl['payment_info']}>
                        <span>Время заявки</span>
                        <span className={cl['payment_info__value']}>{timer}</span>
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
