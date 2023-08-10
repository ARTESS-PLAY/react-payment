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

function Modal() {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [step, setStep] = useState<number>(0);
    const [valueDeposit, setValueDeposit] = useState<number>(0);
    const [payment, setPayment] = useState<null | string>(null);
    const [messageVisible, setMessageVisible] = useState<boolean>(true);

    const modalRef = useRef(null);

    const handlePrevClick = () => {
        setStep((prev) => prev - 1);
    };
    const handleNextClick = () => {
        setStep((prev) => prev + 1);
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
                <div className={`${cl['modal_payment']}  ${step == 0 && cl['mobile_full']}`}>
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
                                        <p className={cl['payment_id']}>ID транзакции: ABDE</p>
                                    </div>
                                    <ButtonPagination
                                        className="dd"
                                        activeStep={step}
                                        handleCloseClick={handleCloseClick}
                                        handleNextClick={handleNextClick}
                                        handlePrevClick={handlePrevClick}
                                    />
                                </div>
                                <div className={cl['modal_payment__info']}>
                                    <Steps activeStep={step} />
                                    <PaymentInfo value={valueDeposit} activeStep={step} />
                                </div>
                                <div className="modal_payment__main_content">
                                    {step == 1 ? (
                                        <ModalStep1
                                            activePayment={payment}
                                            setPayment={setPayment}
                                        />
                                    ) : null}
                                    {step == 2 ? (
                                        <ModalStep2
                                            setMessageVisible={setMessageVisible}
                                            messageVisible={messageVisible}
                                        />
                                    ) : null}
                                    {step == 3 ? <ModalStep3 /> : null}
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
                    />
                )}
            </div>
        </CSSTransition>
    );
}

export default Modal;
