//const pron_v2_url = 'https://api.elasolution.com/pron_v2/phoneme';
//const api_key = '06f66373ae6a477d829361d7dbe12f46';

const pron_v2_url = 'https://api.readinggate.elasolution.com/pron_v2/phoneme';  // Phonics
const pron_stt_url = 'https://api.readinggate.elasolution.com/v1/stt';          // STT

const api_key = 'e874641aac784ff6b9d62c3483f7aaaa';
let student_audio;

// pron_v2 api 통신을 위한 객체 및 구성 메서드
let PRON_V2 = {
    pron_v2_by_axios: function (fileAudio) {
        let text = currentQuizText;
        let formData = new FormData();

        formData.append('audio', fileAudio);
        formData.append('text', text);
        formData.append('phoneme_format', 'alphabet');

            axios.post(pron_v2_url, formData, {
                headers: {
                    "X-API-Key": api_key,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response != null && response != undefined) {
                    switch (response.status) {
                        case 200:
                            // 정상적으로 완료된 경우
                            console.log(`${JSON.stringify(response.data, null, 2)}`);
                            checkScore(response.data);
                            break;

                        case 401:
                            // 인증키가 잘못된 경우
                            alert('인증키가 잘못되었습니다. 리딩게이트로 전화주세요. 1599-0533');
                            break;

                        case 403:
                            // Forbidden
                            alert('접근이 금지되었습니다.');
                            break;

                        case 422:
                            // Validation Error
                            alert('입력 값에 오류가 있습니다.');
                            break;

                        default:
                            alert('알 수 없는 오류가 발생했습니다. response.status : ' + response.status);
                            break;
                    }
                } else {
                    failTest();
                }
            })
            .catch((error) => {
                failTest();
                console.log(error);
            });
    },

    pron_stt_by_axios: function (fileAudio) {
        let formData = new FormData();

        formData.append('audio', fileAudio);
        formData.append('use_improved_model', false);    // 한국인 아이 인식율 향상 버전 모델을 사용할지 결정합니다.
        formData.append('use_model_timestamp', false);  // 모델 고유의 timestamp를 사용할지 결정합니다.
        formData.append('use_insensitive_model', true); // 민감도가 낮은 모델을 사용할지 결정합니다.
        
        axios.post(pron_stt_url, formData, {
            headers: {
                "X-API-Key": api_key,
                "accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            
                switch (response.status) {
                    case 200:
                        // 정상적으로 완료된 경우
                        //console.log(`${JSON.stringify(response.data, null, 2)}`);
                        //console.log(`STT : ${response.data.text}`);
                        if (response.data.text != currentQuizText) {
                            failTest(response.data.text);
                        } else {
                            PRON_V2.pron_v2_by_axios(student_audio);
                        }
                        break;

                    case 401:
                        // 인증키가 잘못된 경우
                        alert('인증키가 잘못되었습니다. 리딩게이트로 전화주세요. 1599-0533');
                        break;

                    case 403:
                        // Forbidden
                        alert('접근이 금지되었습니다.');
                        break;

                    case 422:
                        // Validation Error
                        alert('입력 값에 오류가 있습니다.');
                        break;

                    default:
                        alert('알 수 없는 오류가 발생했습니다. response.status : ' + response.status);
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
};
// 미디어 레코더 객체, 사용자의 오디오 입력을 녹음하는 데 사용
let mediaRecorder = null;

// 녹음 후 생성된 오디오 데이터 청크(chunks)를 저장할 배열
let chunks = [];

// 청크 데이터를 사용하여 생성한 블롭(blob) 객체를 저장할 변수, 녹음된 오디오 데이터를 나타냄
let audioBlob;

let record_audio = new Audio();
// 녹음 기능을 담당할 객체 및 구성 메서드
let RECORDER = {
    // 오디오 컨텍스트 객체, 웹 오디오 API를 통해 오디오 처리를 관리
    audioCtx: null,
    // 오디오 컨텍스트의 애널라이저(analyser) 노드, 오디오 데이터를 시각화하거나 분석하는 데 사용
    analyser: null,
    // 오디오 컨텍스트의 게인(gain) 노드, 오디오 신호의 볼륨을 조절하는 데 사용
    gainNode: null,
    // 오디오 컨텍스트의 미디어 스트림 소스를 저장할 변수, 오디오 데이터 소스를 관리
    source: null,
    // 오디오 컨텍스트와 관련 노드들을 생성
    createAudioCtx: function () {
        this.audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.minDecibels = -90; // 애널라이저의 최소 데시벨 값
        this.analyser.maxDecibels = -10; // 애널라이저의 최대 데시벨 값
        this.gainNode = this.audioCtx.createGain();
    },
    // 오디오 컨텍스트를 미디어 스트림에 연결
    connectAudioCtx: function (stream) {
        this.source = this.audioCtx.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    },
    // 미디어 레코더 API 지원 여부를 확인하고 사용자의 마이크 접근 권한을 요청
    checkMediaRecorder: function () {
        if (navigator.mediaDevices.getUserMedia) {
            const constraints = {
                audio: true,
            };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(RECORDER.mediaRecorderSuccess, RECORDER.mediaRecorderError);
        } else {
            alert(
                "Record api not supported on your browser! Please use Chrome."
            );
        }
    },

    // 미디어 레코더 초기화 성공 시 호출되는 콜백 함수
    mediaRecorderSuccess: function (stream) {
        //// IOS 기기 녹음 불가 문제 관련 추가 코드 부분
        let options = null;
        if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
            options = { mimeType: 'video/webm; codecs=vp9' };
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
            options = { mimeType: 'video/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
            options = { mimeType: 'audio/webm; codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
            options = { mimeType: 'video/mp4', videoBitsPerSecond: 100000 };
        } else {
            alert("현재 기기에서 지원하는 코덱이 없습니다. 다른 기기로 접속 부탁드립니다.");
            return;
        }

        // mediaRecorder = new MediaRecorder(stream);  <- 기존 생성 코드에서 코덱관련 옵션을 추가해서 생성
        mediaRecorder = new MediaRecorder(stream, options);
        RECORDER.connectAudioCtx(stream);
        
        mediaRecorder.addEventListener("stop", RECORDER.mediaRecorderStop);
        mediaRecorder.addEventListener("dataavailable", RECORDER.mediaRecorderAvailable);
        RECORDER.recording();
    },

    // 녹음 종료 시 이벤트 핸들러 (사파리에서는 mp3로 해야 녹음 음원 재생됨)
    mediaRecorderStop: function () {
        //console.log("녹음 정상 종료 이벤트");
        audioBlob = new Blob(chunks, { type: "audio/mp3" });
        student_audio = new File(
            [audioBlob],
            "studentRecord" + Math.floor(Math.random() * 10) + ".mp3"
        );
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(student_audio);
        //document.querySelector("#student_audio").files = dataTransfer.files;
        //console.log("녹음된파일명", student_audio.name);
        //alert("녹음 완료 , 녹음 파일이 등록되었습니다");
        chunks = [];

        //if (currentQuizText.indexOf(' ') == -1) {
        //    //단어는 STT 검사 통과 후 체크
        //    PRON_V2.pron_stt_by_axios(student_audio); // STT
        //} else {
        //    PRON_V2.pron_v2_by_axios(student_audio);
        //}

        PRON_V2.pron_v2_by_axios(student_audio);
        //RECORDER.playRecording();
    },

    // 녹음 중 데이터 이용 가능 시 이벤트 핸들러
    mediaRecorderAvailable: function (e) {
        //console.log("chunk 데이터 처리 가능한 상태");
        chunks.push(e.data);
    },
    // 미디어 레코더 초기화 중 에러 발생 시 호출되는 콜백 함수
    mediaRecorderError: function (err) {
        if (err.name === "NotFoundError") {
            alert("연결된 마이크가 없습니다.");
        } else if (err.name === "NotAllowedError") {
            alert("마이크 사용이 허용되지 않았습니다.");
        }
    },
    // 녹음 시작 함수
    recording: function () {
        if (!RECORDER.audioCtx) {
            RECORDER.createAudioCtx();
        }

        if (!mediaRecorder) {
            return RECORDER.checkMediaRecorder();
        }

        //console.log('recording');

        mediaRecorder.start();
    },
    // 녹음 중지 함수
    stopRecording: function () {
        //console.log('stopRecording');
        mediaRecorder.stop();
    },

    playRecording: function () {
        let recordedAudio = document.querySelector('#audioPlayback');
        recordedAudio.src = URL.createObjectURL(audioBlob); // Set the blob as the source

        // Optionally, you can add an event listener to handle when playback ends
        recordedAudio.addEventListener('ended', function () {
            //console.log('Playback ended');
        });

        // Play the audio
        recordedAudio.play()
            .then(() => {
                //console.log('Playback started');
            })
            .catch((error) => {
                console.log('Playback error', error);
            });
    },
};

function getColorClass(score) {
    if (score >= 50 && score <= 100) {
        return 'green';
    } else if (score >= 20 && score < 50) {
        return 'orange';
    } else if (score >= 0 && score < 20) {
        return 'red';
    } else {
        return '';
    }
}

function startRecording() {
    RECORDER.recording();
}

function stopRecording() {
    RECORDER.stopRecording();
}

function playRecording() {
    RECORDER.playRecording();
}