import cl from './index.module.scss';
import {__, Translate} from "../../../helpers/language";

interface ModalStep3Props {
    success: boolean
}

const ModalStep3 = ({success}: ModalStep3Props) => {
    return (
        <div className={cl['modal_payment__step3']}>
            { success ? (
                <>
                    <div className={cl['modal_payment__step3__round']}>
                        <img src="/img/done.svg" alt="done" />
                    </div>
                    <p>Транзакция завершена</p>
                </>
            ) : (
                <>
                    <div className={cl['modal_payment__step3__round']}>
                        <img src="/img/clock.png" alt="processing" />
                    </div>
                    <p>{Translate.transaction_is_processing}</p>
                    <p style={{
                        fontSize: '16px',
                        marginTop: '10px',
                        color: '#acaaaa',
                        fontWeight: '400',
                    }}>{Translate.balance_will_increase_after_transaction}</p>
                </>
            ) }
        </div>
    );
};

export default ModalStep3;
