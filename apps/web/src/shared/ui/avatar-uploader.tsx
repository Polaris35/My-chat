import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { MdAddAPhoto } from 'react-icons/md';

export type AvatarUploaderProps = {
    className?: string;
    setImage: (image: File | null) => void;
};
export function AvatarUploader({ className, setImage }: AvatarUploaderProps) {
    const [file, setFile] = useState<null | File>(null);
    const [preview, setPreview] = useState<null | string>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            setImage(null);
            return;
        }
        setImage(file);

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(null);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        setFile(e.target.files[0]);
    };
    return (
        <div className={clsx(className, 'indicator')}>
            {file ? (
                <>
                    <label htmlFor="avatar" className="avatar">
                        <div className="w-[88px] rounded-full">
                            <img src={preview!} />
                        </div>
                    </label>
                </>
            ) : (
                <>
                    <span className="indicator-item badge badge-secondary rounded-full top-2 right-2 text-secondary-content w-6 h-6">
                        +
                    </span>
                    <label
                        htmlFor="avatar"
                        className="inline-flex flex-col items-center justify-center gap-2 rounded-full p-4 border-dashed border-base-content border-2"
                    >
                        <MdAddAPhoto size={20} />
                        <p>Upload</p>
                    </label>
                </>
            )}
            <input
                id="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                type="file"
            />
        </div>
    );
}
