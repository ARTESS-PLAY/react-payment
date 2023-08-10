import cl from './index.module.scss';

const ModalStep3 = () => {
    return (
        <div className={cl['modal_payment__step3']}>
            <div className={cl['modal_payment__step3__round']}>
                <img src="/img/done.svg" alt="done" />
            </div>
            <p>Транзакция завершена</p>
        </div>
    );
};

export default ModalStep3;
