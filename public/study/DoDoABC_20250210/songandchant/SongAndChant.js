let currentActivity = ""; // 각 Activity에서 세팅됨
let currentLand = "songandchant";
let effectSightWords =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/effect/";
let letterSightWords =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/letter/";
let letterSound =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/sound/";
let letterWord = "https://wcfresource.a1edu.com/newsystem/sound/words/";
let sndBgmA1A =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a1a.mp3";
let sndBgmA1B =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a1b.mp3";
let sndBgmA2A =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a2a.mp3";
let sndBgmA2B =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a2b.mp3";
let sndBgmA3A =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a3a.mp3";
let sndBgmA3B =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a3b.mp3";
let sndBgmA4A =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a4a.mp3";
let sndBgmA4B =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a4b.mp3";
let sndBgmA5A =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a5a.mp3";
let sndBgmA5B =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a5b.mp3";
let singVideo;
let isSingVideoLoaded = false;
let noAudioVideo;
let isNoAudioVideoLoaded = false;
let recordAudio;
let isPlayError = false;
let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;
let isRecorded = false;
let objScript;
let preMsec = -1;
let crntStatus = "sing"; // "record"
let isRecording = false;
let obj = "";

let rec;
let chunks = [];

const sndCorrect = effectSightWords + "areyouready.mp3"; // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect_boing.mp3"; // (08) (800 ~ 1000) 틀렸을 때 나는 소리
const thumbnail =
  "https://wcfresource.a1edu.com/newsystem/image/dodoabc/songandchant/movie/thumbnail.jpg";

$(document).ready(() => {
  const imgArr = [];
  singVideo = document.getElementById("singVideo");
  noAudioVideo = document.getElementById("noAudioVideo");
  recordAudio = document.getElementById("audioPlayer");

  setSingVideoEvent();
  setNoAudioVideoEvent();
  setButtonEvent();

  doPreloadImages(imgArr, () => {
    $(".js-activity-movie").css("display", "none");
    $(".js-activity-a1a").css("display", "none");
    $(".js-activity-a1b").css("display", "none");
    $(".js-activity-a2a").css("display", "none");
    $(".js-activity-a2b").css("display", "none");
    $(".js-activity-a3a").css("display", "none");
    $(".js-activity-a3b").css("display", "none");
    $(".js-activity-a4a").css("display", "none");
    $(".js-activity-a4b").css("display", "none");
    $(".js-activity-a5a").css("display", "none");
    $(".js-activity-a5b").css("display", "none");

    $(".header-left").html(
      `<div class="ico_exit button" style="width: 57px; height: 57px;" onclick="goDodo();"></div>`
    );

    if ($("#introVideo").length <= 0) {
      $(".js-wrapper-header").css("opacity", "1");
    }
  });

  getStudyInfo(getBookOnSucc); // GetStudyInfo("EXEC [dbo].[sStudySetupInfoEbPreK] @pStudyId = '" + pStudyId + "', @pStudentHistoryId = '" + pStudentHistoryId + "' ");)
});

const getBookOnSucc = (data) => {
  if (!isValidateRound(data.Round)) {
    throw Error("Round Invalid");
  }
  const user = ssStudyInfo.user; // STUDENT ("GUEST", "STAFF")
  if (user === "STUDENT") {
    nextActivity(data.StatusCode == "" ? "025001" : data.StatusCode);
  } else {
    nextActivity("025001");
  }
};

const startSongAndChant = () => {
  step = 1;
  quizType = "A";
  currentActivity = "A1A"; // 제일 먼저 세팅해야함.

  hideSpeaker();

  loadQuiz();
};

const loadQuiz = () => {
  loadQuizData(step, quizType, setData);
};

const setData = (data) => {
  // 비지니스 로직
  // 1. 퀴즈 데이터 담기.
  quizDataArr = data;
  maxCorrectCount = quizDataArr.length;

  setupQuiz();
};

// 퀴즈 세팅 시작
const setupQuiz = () => {
  quizData = quizDataArr[correctCount];

  changeVideoSrc();
};

const drawButtons = () => {
  if (crntStatus === "sing") {
    if (singVideo.paused) {
      $(".js-btn-play").attr("src", "./images/btn_play.png");
    } else {
      $(".js-btn-play").attr("src", "./images/btn_pause.png");
    }
  } else {
    if (isRecording) {
      $(".js-btn-record").attr("src", "./images/btn_stop.png");
    } else {
      $(".js-btn-record").attr("src", "./images/btn_record.png");
    }
  }
};

/**
 * 녹음 시작
 */
const startRecording = async () => {
  $(".js-script").empty(); // 자막 비우기
  $(".js-btn-record").attr("src", "./images/btn_stop.png");
  $(".js-btn-play").addClass("d-none");
  $("#fakePlay").removeClass("d-none");

  const constraints = { audio: true, video: false };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  rec = new MediaRecorder(stream);

  const onStartHandler = () => {
    isRecording = true;

    try {
      playNoAudioVideo();
    } catch (e) {
      console.log(e);
    }
  };

  rec.removeEventListener("start", onStartHandler);
  rec.addEventListener("start", onStartHandler);

  const onDataavailableHandler = (e) => {
    chunks.push(e.data);
  };

  rec.removeEventListener("dataavailable", onDataavailableHandler);
  rec.addEventListener("dataavailable", onDataavailableHandler);

  const onStopHandler = () => {
    console.log("stop recording");

    stopNoAudioVideo();
    const blob = new Blob(chunks, { type: "audio/mp3" });
    chunks = [];

    if (isPlayError) {
    } else {
      const audioURL = URL.createObjectURL(blob);
      setRecordAudioSrc(audioURL);
    }

    rec.stream.getAudioTracks().forEach((track) => {
      track.stop();
    });

    isRecording = false;
  };

  rec.removeEventListener("stop", onStopHandler);
  rec.addEventListener("stop", onStopHandler);

  rec.start();
};

const stopRecording = () => {
  rec.stop();

  $(".js-btn-record").attr("src", "./images/btn_record.png");
  $(".js-control-record #fakePlay").addClass("d-none");
  $(".js-control-record .js-btn-play").removeClass("d-none");
  $(".js-btn-play").attr("src", "./images/btn_play.png");
  $(".js-script").empty();
};

const goAgain = (pStart) => {
  $(".js-wrapper-record2").addClass("d-none");
  $(".js-script").empty();

  playSingVideo();
};

const goRecord = () => {
  isNext = true;
  crntStatus = "record";

  $(".js-btn-music").removeClass("d-none");

  changeMuteBtn(false);
  pauseSingVideo();

  $(".js-wrapper-record2").removeClass("d-none");
  $(".js-record-skip").addClass("d-none");
  $(".next-popup2").addClass("d-none");
  $(".pop-sing").removeClass("d-none");

  playEffect1(sndCorrect); //문제음원 Let's sing

  setTimeout(() => {
    $(".js-test-record").addClass("d-none"); // 개발용. 레코드 화면으로 넘어가기
    $(".js-wrapper-record2").addClass("d-none");
    $(".js-control-play").addClass("d-none");
    $(".js-control-record").removeClass("d-none");
    $(".js-script").empty();

    changeVideoView(crntStatus);
  }, 2000);
};

const studyEnd = () => {
  const jsonStr = {
    step: step,
    study_end_yn: "Y",
    isMobile: "N",
  };
  isMobile ? (jsonStr.isMobile = "Y") : (jsonStr.isMobile = "N");

  saveStatus();
};

const nextActivity = (pStatusCode) => {
  if (pStatusCode != "025001") {
    popReward();
  } else {
    startSongAndChant();
  }
};

/**
 * 버튼 이벤트 부여 함수
 */
const setButtonEvent = () => {
  $(".js-btn-music").off("click");
  $(".js-btn-music").on("click", () => {
    if (noAudioVideo.muted) {
      changeMuteBtn(false);
    } else {
      changeMuteBtn(true);
    }
  });

  $(".js-btn-play").off("click");
  $(".js-btn-play").on("click", () => {
    try {
      if (crntStatus === "sing") {
        if (isSingVideoLoaded) {
          if (singVideo.paused) {
            $(".js-btn-play").attr("src", "./images/btn_pause_hover.png");

            playSingVideo();
          } else {
            $(".js-btn-play").attr("src", "./images/btn_play_hover.png");

            pauseSingVideo();
          }
        } else {
          alert("동영상 로딩중입니다. 잠시만 기다려주세요.");
        }
      } else if (crntStatus === "record") {
        if (isNoAudioVideoLoaded) {
          if (noAudioVideo.paused) {
            $(".js-btn-play").attr("src", "./images/btn_pause_hover.png");

            playNoAudioVideo();

            // 녹음한 노래와 영상을 동시에 플레이해준다
            if (recordAudio.src !== "") {
              playRecordAudio();
            }
          } else {
            $(".js-btn-play").attr("src", "./images/btn_play_hover.png");

            pauseNoAudioVideo();

            // 녹음한 노래와 영상을 동시에 정지한다
            if (recordAudio.src !== "") {
              pauseRecordAudio();
            }
          }
        } else {
          alert("동영상 로딩중입니다. 잠시만 기다려주세요.");
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  $(".js-btn-play")
    .mouseover(function () {
      if (crntStatus === "sing") {
        if (singVideo.paused) {
          $(".js-btn-play").attr("src", "./images/btn_play_hover.png");
        } else {
          $(".js-btn-play").attr("src", "./images/btn_pause_hover.png");
        }
      } else if (crntStatus === "record") {
        if (noAudioVideo.paused) {
          $(".js-btn-play").attr("src", "./images/btn_play_hover.png");
        } else {
          $(".js-btn-play").attr("src", "./images/btn_pause_hover.png");
        }
      }
    })
    .mouseout(function () {
      if (crntStatus === "sing") {
        if (singVideo.paused) {
          $(".js-btn-play").attr("src", "./images/btn_play.png");
        } else {
          $(".js-btn-play").attr("src", "./images/btn_pause.png");
        }
      } else if (crntStatus === "record") {
        if (noAudioVideo.paused) {
          $(".js-btn-play").attr("src", "./images/btn_play.png");
        } else {
          $(".js-btn-play").attr("src", "./images/btn_pause.png");
        }
      }
    });

  $(".js-btn-record").off("click");
  $(".js-btn-record").on("click", () => {
    if (isRecording) {
      stopRecording();
    } else {
      stopNoAudioVideo();
      startRecording();
    }
  });

  $(".js-btn-record")
    .mouseover(function () {
      if (isRecording) {
        $(".js-btn-record").attr("src", "./images/btn_stop_hover.png");
      } else {
        $(".js-btn-record").attr("src", "./images/btn_record_hover.png");
      }
    })
    .mouseout(function () {
      if (isRecording) {
        $(".js-btn-record").attr("src", "./images/btn_stop.png");
      } else {
        $(".js-btn-record").attr("src", "./images/btn_record.png");
      }
    });

  drawButtons();
};

/**
 * 비디오 이벤트 부여 함수 - Sing
 */
const setSingVideoEvent = () => {
  const onCanplaythroughHandler = () => {
    console.log("sing video loaded");
    isSingVideoLoaded = true;

    if (crntStatus === "sing") {
      drawButtons();
    }
  };

  singVideo.removeEventListener("canplaythrough", onCanplaythroughHandler);
  singVideo.addEventListener("canplaythrough", onCanplaythroughHandler);

  const onEndedHandler = () => {
    if (REF.Mode !== "preview") {
      $(".js-wrapper-record2").removeClass("d-none");
    } else {
      alert("수업일 전에 예습하는 경우, 녹음 기능이 제한됩니다.");
    }
  };

  singVideo.removeEventListener("ended", onEndedHandler);
  singVideo.addEventListener("ended", onEndedHandler);
};

/**
 * 비디오 이벤트 부여 함수 - No Audio
 */
const setNoAudioVideoEvent = () => {
  const onCanplaythroughHandler = () => {
    console.log("no audio video loaded");

    if (!isNoAudioVideoLoaded) {
      if (REF.Mode !== "preview") {
        $(".js-record-skip").removeClass("d-none");
      }

      isNoAudioVideoLoaded = true;
    }
  };

  noAudioVideo.removeEventListener("canplaythrough", onCanplaythroughHandler);
  noAudioVideo.addEventListener("canplaythrough", onCanplaythroughHandler);

  const onEndedHandler = () => {
    console.log("stop no audio video");

    stopRecordAudio();

    $(".js-btn-next").removeClass("d-none");
    stopRecording();
  };

  noAudioVideo.removeEventListener("ended", onEndedHandler);
  noAudioVideo.addEventListener("ended", onEndedHandler);

  $(".js-btn-next").off("click");
  $(".js-btn-next").on("click", () => {
    pauseNoAudioVideo();
    pauseRecordAudio();

    studyEnd();
  });
};

/**
 * 비디오 소스 변경 함수
 * @param state sing / record
 */
const changeVideoSrc = () => {
  console.log("change video src");
  singVideo.volume = 1.0;
  singVideo.poster = thumbnail;
  noAudioVideo.volume = 1.0;
  noAudioVideo.poster = thumbnail;

  singVideo.src = quizData.Sound1;
  noAudioVideo.src = quizData.Sound2;

  singVideo.load();
  noAudioVideo.load();

  changeVideoView(crntStatus);
};

const changeVideoView = (state) => {
  if (state === "sing") {
    $("#singVideo").removeClass("d-none");
    $("#noAudioVideo").addClass("d-none");
  } else if (state === "record") {
    $("#singVideo").addClass("d-none");
    $("#noAudioVideo").removeClass("d-none");
  }
};

const playSingVideo = () => {
  if (singVideo.muted) {
    singVideo.muted = false;
  }

  singVideo.play();
};

const pauseSingVideo = () => {
  singVideo.pause();
};

const stopSingVideo = () => {
  pauseSingVideo();
  singVideo.currentTime = 0;
};

const playNoAudioVideo = () => {
  try {
    isPlayError = false;

    noAudioVideo
      .play()
      .then((e) => {
        console.log("play no audio video");
      })
      .catch((e) => {
        console.log("pnav", e);
        isPlayError = true;
        stopRecording();
      });
  } catch (e) {
    alert("error");
  }
};

const pauseNoAudioVideo = () => {
  noAudioVideo.pause();
};

const stopNoAudioVideo = () => {
  pauseNoAudioVideo();
  noAudioVideo.currentTime = 0;
};

// 오디오 이벤트
const setRecordAudioSrc = (src) => {
  recordAudio.src = src;
  recordAudio.load();
};

const playRecordAudio = () => {
  recordAudio
    .play()
    .then(() => {
      console.log("play record audio");
    })
    .catch((e) => {
      console.log("pra", e);
    });
};

const pauseRecordAudio = () => {
  recordAudio.pause();
};

const stopRecordAudio = () => {
  pauseRecordAudio();
  recordAudio.currentTime = 0;
};

const changeMuteBtn = (isMute) => {
  if (isMute) {
    noAudioVideo.muted = true;
    $(".js-btn-music").addClass("mute");
  } else {
    noAudioVideo.muted = false;
    $(".js-btn-music").removeClass("mute");
  }
};
