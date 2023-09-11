import { useId, useState } from 'react';
import cl from './index.module.scss';
import {api_routes, uploadFile} from "../../../helpers/api";

interface FileInputProps {
    className?: string;
    handleFile?: () => void;
    order_number: string
    setLoading: (loading: boolean) => void
    onSuccess: () => void
}

const FileInput: React.FC<FileInputProps> = ({ className, handleFile, order_number, setLoading, onSuccess }) => {
    const [localFileName, setLocalFileName] = useState<string>();

    const input_id = useId();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = (event.target as HTMLInputElement).files

        if (files) {
            setLocalFileName(files[0].name);
            setLoading(true)
            uploadFile(files[0], order_number)
                .then(success => {
                    setTimeout(() => {
                        setLoading(false)
                        if(success){
                            onSuccess()
                        }
                    }, 500)
                })
        }
    }

    return (
        <div className={`${className} ${cl['cute_input']}`}>
            <label htmlFor={input_id}>
                {localFileName ? (
                    <p>
                        <span>
                            <img src="/img/icons/clip.png" alt="clip" />
                        </span>
                        {localFileName}
                    </p>
                ) : (
                    <p>
                        <span>
                            <img src="/img/icons/download.svg" alt="upload" />
                        </span>
                        {/*Загрузить файл*/}
                        Qəbz yükləmək üçün yer
                    </p>
                )}
            </label>
            <input type="file" accept="image/*" id={input_id} hidden onChange={handleChange} />
        </div>
    );
};

export default FileInput;
