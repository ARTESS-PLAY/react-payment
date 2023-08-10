import { useId, useState } from 'react';
import cl from './index.module.scss';

interface FileInputProps {
    className?: string;
    handleFile?: () => void;
}

const FileInput: React.FC<FileInputProps> = ({ className, handleFile }) => {
    const [localFileName, setLocalFileName] = useState<string>();

    const input_id = useId();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = (event.target as HTMLInputElement).files;

        if (files) {
            setLocalFileName(files[0].name);
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
                        Загрузить файл
                    </p>
                )}
            </label>
            <input type="file" accept="image/*" id={input_id} hidden onChange={handleChange} />
        </div>
    );
};

export default FileInput;
