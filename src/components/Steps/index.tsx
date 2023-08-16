import cl from './index.module.scss';

const steps = ['Способ оплаты', 'Перевод', 'Подтверждение'];

interface StepsProps {
    activeStep: number;
}

const Steps = ({ activeStep }: StepsProps) => {
    return (
        <div className={cl['steps']}>
            {/*{steps.map((el, i) => (*/}
            {/*    <div*/}
            {/*        key={i}*/}
            {/*        className={`${cl['step']} ${activeStep == i + 1 ? cl['step_active'] : null}`}>*/}
            {/*        <div className={cl['step__number']}>{i + 1}</div>*/}
            {/*        <div className={cl['step__title']}>{el}</div>*/}
            {/*    </div>*/}
            {/*))}*/}
        </div>
    );
};

export default Steps;
