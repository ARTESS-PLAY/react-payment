import {WaitLinkInformer, WaitLinkStatus} from "../../../helpers/api";
import {useEffect, useState} from "react";
import Button from "../../UI/Button/Index";
import {Status} from "../../UI/Status/Status";
import {getRandomString} from "../../../helpers/format";

interface LinkWaiterProps {
    info: WaitLinkInformer
    onSuccess: () => void
}

export const LinkWaiter = ({info, onSuccess}: LinkWaiterProps) => {

    const [linkStatus, setLinkStatus] = useState<WaitLinkStatus>(WaitLinkStatus.Pending)
    const [paymentStatus, setPaymentStatus] = useState<WaitLinkStatus>(WaitLinkStatus.Disabled)
    const [linkMessage, setLinkMessage] = useState<string>("")
    const [paymentMessage, setPaymentMessage] = useState<string>("")
    const [paymentLink, setPaymentLink] = useState("")
    const [button, setButton] = useState(false)

    useEffect(() => {
        info.onUpdate(() => {
            const link = info.link()
            const payment = info.payment()
            const pl = info.getPaymentLink()

            const isTest = false//link.status !== WaitLinkStatus.Pending && payment.status !== WaitLinkStatus.Pending

            setTimeout(() => {
                setLinkStatus(link.status)
                setLinkMessage(link.message ? link.message : '')
                setPaymentStatus(payment.status)
                setPaymentMessage(payment.message ? payment.message : '')

                const isPaymentFinished = payment.status === WaitLinkStatus.Error || payment.status === WaitLinkStatus.Success
                setButton(!!pl && !isPaymentFinished)

                if(payment.status === WaitLinkStatus.Success){
                    onSuccess()
                }

                if(pl){
                    setPaymentLink(pl)
                }
            },  isTest ? 3000 : 0)
        })
    }, [])

    const handlePayClick = () => {
        window.open(paymentLink, '_blank')?.focus()
        info.onStartPayment()
    }

    return (
        <div style={{
            paddingTop: "15px"
        }}>
            <Status status={linkStatus} title={"link"} message={linkMessage} showFakeLink={linkStatus <= WaitLinkStatus.Pending } />
            <Status status={paymentStatus} title={"payment"} message={paymentMessage} showFakeLink={false} />
            { button && (
                <Button color="black" className="button-pay" onClick={handlePayClick}>Оплатить</Button>
            ) }
        </div>
    );
};