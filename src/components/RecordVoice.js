import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { render } from '@testing-library/react';
const RecordVoice = () => {
    const [recordPermission, setRecordPermission] = useState(false);
    // const [media, setMedia] = useState(null);
    const [stream, setStream] = useState(null);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [audios, setAudios] = useState([]);
    const [recording, setRecording] = useState(false);
    const mimetype = "audio/mpeg";
    useEffect(() => {
        const getRecordPermission = async () => {
            if ("MediaRecorder" in window) {
                try {
                    const streamData = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false,
                    });
                    setRecordPermission(true);
                    setStream(streamData);
                } catch (err) {
                    alert(err.message);
                }
            }
            else {
                alert("Voice recording is not available");
            }
        }
        getRecordPermission();
    }, []);

    const Recording = async () => {

        console.log("again starting")
        const localAudioChunks = [];
        const media = new MediaRecorder(stream);
        mediaRecorder.current = media;

        mediaRecorder.current.ondataavailable = (e) => {
            localAudioChunks.push(e.data);
        }

        mediaRecorder.current.onstop = async () => {
            console.log(localAudioChunks);
            const blob = new Blob(localAudioChunks, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onloadend = async () => {
                console.log(reader.result);
                console.log(typeof reader.result);
                const base64Data = reader.result;
                const res = await axios.post('http://localhost:8800/api/user/alert', { "data": base64Data }, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set the appropriate content type
                    }
                });
            };
            reader.readAsBinaryString(blob);





            // setAudio(audioUrl);
        }
        setTimeout(() => mediaRecorder.current.stop(), 10000);
        console.log("starting");
        mediaRecorder.current.start();
    }

    const startRecording = () => {
        setInterval(Recording, 15000);

    }

    return (
        <>
            <button onClick={startRecording}>Record</button>
            <a download={true} href={audio}>download</a>

        </>
    )
}

export default RecordVoice




// const audioFile = new File([blob], 'recorded-audio.wav');
// console.log(audioFile);
// console.log(blob);
// const audioUrl = URL.createObjectURL(blob);
// const a = new Audio(audioUrl);
// console.log(a);
// const formData = new FormData();
// formData.append('audio', blob);
// for (const pair of formData.entries()) {
//     console.log(` ${pair[1]}`);
// }