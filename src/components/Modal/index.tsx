import {useState, useRef, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';
import ModalStep0 from './ModalStep0';
import cl from './index.module.scss';
import ButtonPagination from '../ButtonPagination';
import Steps from '../Steps';
import ModalStep1 from './ModalStep1';
import PaymentInfo from '../PaymentInfo';
import ModalStep2 from './ModalStep2';
import ModalStep3 from './ModalStep3';
import {processOrder, IResponseOrderDto, payment_methods, processLink, WaitLinkInformer} from "../../helpers/api";

function Modal() {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [step, setStep] = useState<number>(2);
    const [valueDeposit, setValueDeposit] = useState<number>(0);
    const [payment, setPayment] = useState<string|null>(null);
    const [messageVisible, setMessageVisible] = useState<boolean>(true);
    const [order, setOrder] = useState<IResponseOrderDto|null>(null)
    const [orderNumber, setOrderNumber] = useState("")
    const [loading, setLoading] = useState<boolean>(true)
    const [waitLinkInformer, setWaitLinkInformer] = useState<WaitLinkInformer|false>(false)
    const [success, setSuccess] = useState(false)

    const modalRef = useRef(null);

    const handlePrevClick = () => {
        setStep((prev) => Math.max(prev - 1, 2));
    };

    const orderCreated = (ord: IResponseOrderDto) => {
        setOrder(ord)
        if(ord.info.wait_for_link){
            setWaitLinkInformer(processLink(ord))
        }
    }

    const onSuccess = () => {
        if(order?.info.wait_for_link){
            setSuccess(true)
        }
        setStep(3)
    }

    const handleNextClick = () => {
        if(step === 0 && valueDeposit <= 0){
            return
        } else if(step === 1){ // try to create order
            if(!payment){
                return
            }

        }else{
            if(order?.info.wait_for_link){
                setSuccess(true)
            }
            setStep((prev) => Math.max(prev + 1, 2))
        }
    };
    const handleCloseClick = () => {
        setIsVisible(false);
        if (history.back() === undefined) {
            location.replace(document.referrer)
        }
    };

    useEffect(() => {
        if(order){
            return
        }

        const params = new URLSearchParams(window.location.search)
        const order_number = params.get('order_number')
        setOrderNumber(order_number ? order_number : '')

        processOrder({
            order_number: order_number ? order_number : '',
        }).then(dto => {
            if(!dto || (!dto.success && !dto.error)){
                alert("Непредвиденная ошибка")
            }else if(!dto.success){
                alert("Ошибка: " + dto.error)
            }else{
                orderCreated(dto)
            }
            setLoading(false)
        })
    }, [])

    return (
        <CSSTransition
            nodeRef={modalRef}
            in={isVisible}
            timeout={400}
            unmountOnExit
            classNames="fade">
            <div className={cl['modal_wrapper']} ref={modalRef}>
                <div className={`${cl['modal_payment']} ${loading ? cl['modal_wrapper_loading']:''} ${step == 0 && cl['mobile_full']}`}>
                    <div className={cl['modal_payment__content']}>
                        {step === 0 ? (
                            <></>
                            // <ModalStep0
                            //     valueDeposit={valueDeposit}
                            //     setValueDeposit={setValueDeposit}
                            //     handleNextClick={handleNextClick}
                            //     handleCloseClick={handleCloseClick}
                            // />
                        ) : (
                            <div>
                                <div className={cl['modal_payment__up']}>
                                    <div className={cl['modal_payment__up__text']}>
                                        <p className={cl['modal_title']}>Оплата</p>
                                        <p className={cl['payment_id']}>ID транзакции: { orderNumber }</p>
                                    </div>
                                    <ButtonPagination
                                        className="dd"
                                        activeStep={step}
                                        handleCloseClick={handleCloseClick}
                                        handleNextClick={handleNextClick}
                                        handlePrevClick={handlePrevClick}
                                        showFinishButton={!order?.info.wait_for_link || step < 2}
                                        showPreviousButton={step === 3}
                                        position='top'
                                    />
                                </div>
                                <div className={cl['modal_payment__info']}>
                                    <Steps activeStep={step} />
                                    <PaymentInfo value={order?.info.amount} key={orderNumber} activeStep={step} order={order} />
                                </div>
                                <div className="modal_payment__main_content">
                                    {/*{step == 1 ? (*/}
                                    {/*    <ModalStep1*/}
                                    {/*        activePayment={payment}*/}
                                    {/*        setPayment={setPayment}*/}
                                    {/*    />*/}
                                    {/*) : null}*/}
                                    { order ? (
                                        step == 2 ? (
                                            order?.info.wait_for_link ? (
                                                waitLinkInformer && (
                                                    <ModalStep2
                                                        setMessageVisible={setMessageVisible}
                                                        messageVisible={messageVisible}
                                                        mode={"wait_for_link"}
                                                        info={waitLinkInformer}
                                                        onSuccess={onSuccess}
                                                        key={orderNumber}
                                                    />
                                                )
                                            ) : (
                                                <ModalStep2
                                                    setMessageVisible={setMessageVisible}
                                                    messageVisible={messageVisible}
                                                    cardNumber={order?.info.card_number}
                                                    mode={"show_card"}
                                                    key={orderNumber}
                                                />
                                            )

                                        ) : null
                                    ) : null }

                                    {step == 3 ? <ModalStep3 success={success} /> : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {step > 0 && (
                    <ButtonPagination
                        className="dmf"
                        activeStep={step}
                        handleCloseClick={handleCloseClick}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        showFinishButton={!order?.info.wait_for_link || step < 2}
                        showPreviousButton={step === 3}
                        position='bottom'
                    />
                )}
            </div>
        </CSSTransition>
    );
}

export default Modal;
