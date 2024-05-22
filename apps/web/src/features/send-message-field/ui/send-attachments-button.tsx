import { SetStateAction, useEffect, useState } from 'react';
import { SendAttachmentsDialog } from './dialog/send-attachments-dialog';
import { FiPaperclip } from 'react-icons/fi';

export function SendAttachmentsButton() {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
            if (e.target.files.length !== 0) {
                setOpen(true);
            }
            console.log('selected files: ', files);
            return;
        }
        setFiles([]);
    };
    return (
        <div>
            <label
                htmlFor="file-input"
                className="btn btn-ghost rounded-full p-2"
            >
                <FiPaperclip size={32} />
                <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                />
            </label>
            <SendAttachmentsDialog
                open={open}
                setOpen={setOpen}
                files={files}
                setFiles={setFiles}
            />
        </div>
    );
}
