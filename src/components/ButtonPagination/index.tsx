import Button from '../UI/Button/Index';
import cl from './index.module.scss';

interface ButtonPaginationProps {
    handleNextClick: () => void;
    handlePrevClick: () => void;
    handleCloseClick: () => void;
    activeStep: number;
    className?: string;
    showFinishButton: boolean
    showPreviousButton: boolean
    position: string
}

const ButtonPagination: React.FC<ButtonPaginationProps> = ({
    handleNextClick,
    handlePrevClick,
    handleCloseClick,
    activeStep,
    className,
    showFinishButton,
    showPreviousButton,
    position
}) => {
    return (
        <>
            {activeStep == 3 ? (
                <div className={`${cl['button_pagination_end']} ${className}`}>
                    <Button color="black" className={cl['btn_next_end']} onClick={handleCloseClick}>
                        Sayta qayıt {/*Вернуться на сайт*/}
                    </Button>
                </div>
            ) : (
                activeStep <= 1 ? (
                    <div className={`${cl['button_pagination']} ${className}`}>
                        { showFinishButton && (
                            <Button color="black" className={cl['btn_next']} onClick={handleNextClick}>
                                {activeStep == 2 ? 'Оплатил' : 'Далее'}
                            </Button>
                        ) }
                    </div>
                ) : (
                    <div className={`${cl['button_pagination']} ${className}`}>
                        { showPreviousButton && (
                            <Button color="gray" className={cl['btn_back']} onClick={handlePrevClick} style={{
                                width: (!showFinishButton && position === 'bottom') ? "100%" : null
                            }}>
                                Назад
                            </Button>
                        ) }
                        { showFinishButton && (
                            <Button color="black" className={cl['btn_next']} onClick={handleNextClick}>
                                {activeStep == 2 ? 'Ödənilmişdir' : 'Далее'}
                                {/*Оплатил | Далее*/}
                            </Button>
                        ) }
                    </div>
                )

            )}
        </>
    );
};

export default ButtonPagination;
