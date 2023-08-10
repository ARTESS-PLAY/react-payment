import Button from '../UI/Button/Index';
import cl from './index.module.scss';

interface ButtonPaginationProps {
    handleNextClick: () => void;
    handlePrevClick: () => void;
    handleCloseClick: () => void;
    activeStep: number;
    className?: string;
}

const ButtonPagination: React.FC<ButtonPaginationProps> = ({
    handleNextClick,
    handlePrevClick,
    handleCloseClick,
    activeStep,
    className,
}) => {
    return (
        <>
            {activeStep == 3 ? (
                <div className={`${cl['button_pagination_end']} ${className}`}>
                    <Button color="black" className={cl['btn_next_end']} onClick={handleCloseClick}>
                        Вернуться на сайт
                    </Button>
                </div>
            ) : (
                <div className={`${cl['button_pagination']} ${className}`}>
                    <Button color="gray" className={cl['btn_back']} onClick={handlePrevClick}>
                        Назад
                    </Button>
                    <Button color="black" className={cl['btn_next']} onClick={handleNextClick}>
                        {activeStep == 2 ? 'Оплатил' : 'Далее'}
                    </Button>
                </div>
            )}
        </>
    );
};

export default ButtonPagination;
