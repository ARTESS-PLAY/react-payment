import { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import ModalStep0 from './ModalStep0';
import cl from './index.module.scss';
import ButtonPagination from '../ButtonPagination';
import Steps from '../Steps';
import ModalStep1 from './ModalStep1';
import PaymentInfo from '../PaymentInfo';
import ModalStep2 from './ModalStep2';
import ModalStep3 from './ModalStep3';
import {createOrder, IResponseOrderDto, payment_methods, processLink, WaitLinkInformer} from "../../helpers/api";

function Modal() {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [step, setStep] = useState<number>(0);
    const [valueDeposit, setValueDeposit] = useState<number>(0);
    const [payment, setPayment] = useState<string|null>(null);
    const [messageVisible, setMessageVisible] = useState<boolean>(true);
    const [order, setOrder] = useState<IResponseOrderDto|null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [waitLinkInformer, setWaitLinkInformer] = useState<WaitLinkInformer|false>(false)
    const [success, setSuccess] = useState(false)

    const modalRef = useRef(null);

    const handlePrevClick = () => {
        setStep((prev) => prev - 1);
    };

    const orderCreated = (ord: IResponseOrderDto) => {
        setOrder(ord)
        if(ord?.wait_for_link){
            setWaitLinkInformer(processLink(ord))
        }
    }

    const onSuccess = () => {
        if(order?.wait_for_link){
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
            setLoading(true)
            setOrder(null)
            setSuccess(false)
            setWaitLinkInformer(false)

            const params = new URLSearchParams(window.location.search)
            const public_key = params.get('shop_public_key')
            const payload = params.get('payload')
            createOrder({
                shop_public_key: public_key ? public_key : "",
                amount: valueDeposit,
                payload: payload ? payload : '',
                payment_method: payment,
            }).then(dto => {
                if(!dto || (!dto.success && !dto.error)){
                    alert("Непредвиденная ошибка")
                }else if(!dto.success){
                    alert("Ошибка: " + dto.error)
                }else{
                    orderCreated(dto)
                    setStep((prev) => prev + 1)
                }
                setLoading(false)
            })
        }else{
            if(order?.wait_for_link){
                setSuccess(true)
            }
            setStep((prev) => prev + 1)
        }
    };
    const handleCloseClick = () => {
        setIsVisible(false);
    };

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
                            <ModalStep0
                                valueDeposit={valueDeposit}
                                setValueDeposit={setValueDeposit}
                                handleNextClick={handleNextClick}
                                handleCloseClick={handleCloseClick}
                            />
                        ) : (
                            <div>
                                <div className={cl['modal_payment__up']}>
                                    <div className={cl['modal_payment__up__text']}>
                                        <p className={cl['modal_title']}>Оплата</p>
                                        { order?.order_number && (
                                            <p className={cl['payment_id']}>ID транзакции: { order.order_number }</p>
                                        ) }
                                    </div>
                                    <ButtonPagination
                                        className="dd"
                                        activeStep={step}
                                        handleCloseClick={handleCloseClick}
                                        handleNextClick={handleNextClick}
                                        handlePrevClick={handlePrevClick}
                                        showFinishButton={!order?.wait_for_link || step < 2}
                                        position='top'
                                    />
                                </div>
                                <div className={cl['modal_payment__info']}>
                                    <Steps activeStep={step} />
                                    <PaymentInfo value={valueDeposit} activeStep={step} order_timestamp={order?.order_timestamp} />
                                </div>
                                <div className="modal_payment__main_content">
                                    {step == 1 ? (
                                        <ModalStep1
                                            activePayment={payment}
                                            setPayment={setPayment}
                                        />
                                    ) : null}
                                    {step == 2 ? (
                                        order?.wait_for_link && waitLinkInformer ? (
                                            <ModalStep2
                                                setMessageVisible={setMessageVisible}
                                                messageVisible={messageVisible}
                                                mode={"wait_for_link"}
                                                info={waitLinkInformer}
                                                onSuccess={onSuccess}
                                                key={order?.order_number}
                                            />
                                        ) : (
                                            <ModalStep2
                                                setMessageVisible={setMessageVisible}
                                                messageVisible={messageVisible}
                                                cardNumber={order?.card}
                                                mode={"show_card"}
                                                key={order?.order_number}
                                            />
                                        )

                                    ) : null}
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
                        showFinishButton={!order?.wait_for_link || step < 2}
                        position='bottom'
                    />
                )}
            </div>
        </CSSTransition>
    );
}

export default Modal;
