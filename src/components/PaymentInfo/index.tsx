import cl from './index.module.scss';
import {useEffect, useState} from "react";
import {IResponseOrderDto} from "../../helpers/api";

interface PaymentInfoProps {
    activeStep: number;
    value: number|undefined
    order: IResponseOrderDto|null
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ activeStep, value, order }) => {
    const [timer, setTimer] = useState<string|null>(null)


    useEffect(() => {
        let interval: any = setInterval(() => {
            if(!order?.info.order_timestamp){
                setTimer(null)
                return
            }
            const finish = order?.info.order_timestamp + 600 // + 10min
            const delta = Math.max(0,  finish - Math.round(Date.now() / 1000)) % 3600
            const min = Math.floor(delta / 60)
            const sec = delta % 60

            let val = ""
            val += min > 9 ? min : ('0' + min)
            val += ':'
            val += sec > 9 ? sec : ('0' + sec)

            setTimer(val)
        }, 500)

        return () => {
            clearInterval(interval)
        }
    }, [order])

    return (
        <div className={cl['payment_infos__wrapper']}>
            { (activeStep == 2 && timer) ? (
                <div className={cl['payment_infos']}>
                    <p className={cl['payment_info']}>
                        {/*Время заявки*/}
                        <span>Sorğu müddəti</span>
                        <span className={cl['payment_info__value']}>{timer}</span>
                    </p>
                </div>
            ) : null}

            {value && (
                <div className={cl['payment_infos']}>
                    <p className={cl['payment_info']}>
                        {/*Сумма*/}
                        <span>məbləğ</span>
                        <span className={cl['payment_info__value']}>{value}&nbsp;₼</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentInfo;
