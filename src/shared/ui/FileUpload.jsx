import {useState} from "react";

export const FileUpload = ({setSongFile, songFile}) => {

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            console.log(event.target.files)
            setSongFile(event.target.files);
        }
    };

    return (
        <div className="file-upload-container">
            <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="file-upload" className="file-upload-label">
                <span role="img" aria-label="paperclip">📎</span> {(songFile && songFile[0].name) || 'Выберите файл...'}
            </label>
        </div>
    );
};

