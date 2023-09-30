import { MuiFileInput } from 'mui-file-input';
import React, { useState } from 'react'
import CustomNotification from './CustomNotification';
import { Fade, Slide } from '@mui/material';
/**
 * 
 * @param {Object} file FileObject
 * @param {Function} setFile Function
 * @param {String} accept Accepted file types
 * @param {Number} filesize File size in MB
 * @param {String} label Label for the input 
 * @returns {type} Input file component
 */

export default function InputFileField({ file, setFile, accept, filesize, label }) {
    const [notFlag, setNotFlag] = useState();
    const [error, setError] = useState();
    const handleChangeF = (val) => {
        if (!val) {
            setFile()
        }
        if ((val?.size) / Math.pow(1024, 2) > filesize) {
            setNotFlag({ open: true, Transition: SlideTransition });
            setError(true);
        }
        else {
            setFile(val);
            setError();
        }
    };
    return (
        <>
            <MuiFileInput fullWidth label={label} color={error ? "error" : "primary"} getSizeText={(value) => `${((value?.size) / Math.pow(1024, 2)).toFixed(2)} MB`} inputProps={{ accept }} value={file} onChange={handleChangeF} name='file' />
            <CustomNotification val={notFlag} setFlag={setNotFlag} msg={`File size should be less than ${filesize}MB`} type="error" />
        </>
    )
}

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}