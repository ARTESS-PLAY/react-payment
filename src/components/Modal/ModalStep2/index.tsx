import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import cl from './index.module.scss';
import FileInput from '../../UI/FileInput';
import {WaitLinkInformer} from "../../../helpers/api";
import {LinkWaiter} from "./LinkWaiter";

type ModalStep2Props = {
    messageVisible: boolean;
    setMessageVisible: React.Dispatch<React.SetStateAction<boolean>>;
} & (ModalStep2Props_WaitLink | ModalStep2Props_ShowCard)

interface ModalStep2Props_WaitLink {
    mode: "wait_for_link"
    info: WaitLinkInformer
    onSuccess: () => void
}
interface ModalStep2Props_ShowCard {
    mode: "show_card"
    cardNumber: string|undefined
}

const ModalStep2: React.FC<ModalStep2Props> = (props: ModalStep2Props) => {
    const [file, setFile] = useState<string>();
    const [copyMessage, setcopyMessage] = useState<boolean>(false);
    const messageRef = useRef(null);
    const copyRef = useRef(null);

    function handleCopyClick() {
        if(props.mode !== "show_card" || !props.cardNumber){
            return
        }
        setcopyMessage(true);
        setTimeout(() => {
            setcopyMessage(false);
        }, 2400);
        navigator.clipboard.writeText(props.cardNumber);
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFile(event?.target.value);
    }

    function cc_format(value: string) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
        var parts = []
        for (let i=0, len=match.length; i<len; i+=4) {
            parts.push(match.substring(i, i+4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    return (
        <div className={cl['modal_payment__step2']}>
            <div className={cl['modal_payment__step2__up']}>
                { props.mode === "wait_for_link" ? (
                    <LinkWaiter info={props.info} onSuccess={props.onSuccess} />
                ) : (
                    <>
                        <p className={cl['modal_payment__step2__up__title']}>
                            ВСЕГДА ПРОВЕРЯЙТЕ НОМЕР КАРТЫ
                        </p>
                        <div className={cl['modal_payment__step2__up__content']}>
                            <div className={cl['modal_payment__step2__up__content__left']}>
                                <div className={cl['adress']}>
                                    <div className={cl['adress__up']}>
                                        <p>Адрес</p>
                                        <div className={cl['adress__copy']} onClick={handleCopyClick}>
                                            <img src="/img/icons/copy.svg" alt="copy" />
                                        </div>
                                    </div>
                                    <p className={cl['adress__content']}>{props.cardNumber ? cc_format(props.cardNumber) : ''}</p>
                                    <CSSTransition
                                        nodeRef={copyRef}
                                        in={copyMessage}
                                        timeout={400}
                                        unmountOnExit
                                        classNames="fade">
                                        <p className={cl['adress__copy_done']} ref={copyRef}>
                                            Скопировано!
                                        </p>
                                    </CSSTransition>
                                </div>
                            </div>
                            <div className={cl['modal_payment__step2__up__content__right']}>
                                <p>Подтверждение перевода</p>
                                <FileInput
                                    className={cl['modal_payment__step2__up__content__right__input']}
                                />
                            </div>
                        </div>
                    </>
                ) }
            </div>
            <CSSTransition
                nodeRef={messageRef}
                in={props.messageVisible}
                timeout={400}
                unmountOnExit
                classNames="fade">
                <div className={cl['modal_payment__step2__down']} ref={messageRef}>
                    <div className={cl['modal_payment__step2__down__up']}>
                        <p className={cl['modal_payment__step2__down__up__title']}>Правила</p>
                        <div
                            className={cl['modal_payment__step2__down__up__close']}
                            onClick={() => props.setMessageVisible((prev) => !prev)}>
                            <img src="/img/icons/close.svg" alt="close" />
                        </div>
                    </div>
                    <p className={cl['modal_payment__step2__down__content']}>
                        Товарищи! дальнейшее развитие различных форм деятельности играет важную роль
                        в формировании модели развития. Не&nbsp;следует, однако забывать, что
                        дальнейшее развитие различных форм деятельности играет важную роль
                        в&nbsp;формировании направлений прогрессивного развития. Идейные соображения
                        высшего порядка, а также укрепление и&nbsp;развитие структуры требуют
                        определения и&nbsp;уточнения системы обучения кадров, соответствует насущным
                        потребностям.
                    </p>
                </div>
            </CSSTransition>
        </div>
    )
};

export default ModalStep2;
