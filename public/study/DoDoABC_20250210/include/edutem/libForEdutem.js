/**
 * 녹음 시작
 * @param {string} text - The text to process.
 * @param {number} recordTime - The recording time in milliseconds.
 * @param {function} changeSentenceScore - Function to handle the score data.
 */
let rec;
let audioChunks = [];
let stream;
let audioElement;

//let studentAudio;

const TEST_API_URL = 'https://api.elasolution.com'
const TEST_API_KEY = '06f66373ae6a477d829361d7dbe12f46'

async function getUserMedia(constraints) {
    if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    let legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (legacyApi) {
        return new Promise(function (resolve, reject) {
            legacyApi.bind(navigator)(constraints, resolve, reject);
        });
    } else {
        alert("User media API not supported");
    }
}

function handlerFunction(mediaStream) {
    rec = new MediaRecorder(mediaStream);
    rec.start();
    rec.ondataavailable = (e) => {
        audioChunks.push(e.data);
    };
}

function startRecording() {
    audioChunks = [];
    getUserMedia({ audio: true }).then((mediaStream) => {
        stream = mediaStream;
        handlerFunction(stream);
    });
}

function stopRecording() {
    rec.stop();

    rec.onstop = () => {
        let blob = new Blob(audioChunks, { type: "audio/mp3" });
        const studentAudio = new File(
            [blob],
            "studentRecord" + Math.floor(Math.random() * 10) + ".mp3"
        );

        const url = URL.createObjectURL(blob);
        audioElement.src = url;

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
            //console.log("Stream has been reset");
        }

        pron_v2(currentQuizText, studentAudio, checkScore);
    };
}

function playRecording() {
    audioElement.play();

    // Cleanup after playback ends
    audioElement.addEventListener("ended", () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
            //console.log("Stream has been reset");
        }
    });
}


/**
* 에듀템 테스트
* @param audioBlob
* @param text
*/
const pron_v2 = async (text, file, callbackFunction) => {
    //console.log(`pron_v2, text: ${text}`);
    //console.log(`pron_v2, studentAudio: ${file}`);
    
    const pronUrl = `${TEST_API_URL}/pron_v2/phoneme`; // Replace with your API URL
    const formData = new FormData();
    
    formData.append('audio', file);
    formData.append('text', text);
    formData.append('phoneme_format', 'alphabet');

    try{
        const response = await fetch(pronUrl, {
            method: 'post',
            body: formData,
            headers: {
                'X-API-Key': API_KEY,
            },
        })
        console.log(response)
        isWorking = false;
        lockScreen(false);
        switch (response.status) {
            case 200:
                // 정상적으로 완료된 경우
                //console.log(`response.data: ${response.data}`);
                const data = await response.json()
                callbackFunction(data);
                console.log(data)
                break;

            case 401:
                // 인증키가 잘못된 경우
                swal('인증키가 잘못되었습니다. 리딩게이트로 전화주세요. 1599-0533')
                break;

            case 403:
                // Forbidden
                swal('접근이 금지되었습니다.')
                break;

            case 422:
                // Validation Error
                swal('입력 값에 오류가 있습니다.')
                break;      

            default:
                swal('알 수 없는 오류가 발생했습니다. response.status : ' + response.status)
                break;
        }
    }catch(error){
        swal("콜센터에 문의해주세요.", error.message)
    }
};

function getColorClass(score) {
    if (score > 50 && score <= 100) {
        return 'green';
    } else if (score > 15 && score <= 50) {
        return 'orange';
    } else if (score >= 0 && score <= 15) {
        return 'red';
    } else {
        return '';
    }
}
