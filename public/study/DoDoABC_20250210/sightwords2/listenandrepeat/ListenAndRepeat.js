var refrcg;
var userrcg;
var buffer;
var stt = "";
var userRcg = "";

let sound;
let audioDuration = 0;
let isDurationChange = true;
const wordAdditionSec = 2; // 사운드 길이가 1초이면 녹음 시간은 2초
const sentenceAdditionSec = 1.8;

let quizDataArr;
let maxQuizCount = 0;
let exampleArr = []; // 보기
let quizIndex = 0;
let fileIdx = 0;

let filePath =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/sentence/";
let fileData = [];
let fileMp3 = [];

let avgPronunciation;
let avgIntonation;
let avgTiming;

let isPass = false;
let recordCnt = 0;

const passMark = 40;

let isQuizWord = true;

// 음원
const sndBgmA1A = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a1a.mp3`;
const audLetterEnvelope = `${SIGHT_WORD_EFFECT_ROOT}/aud_envelope.mp3`;
const audDearDodo = `${SIGHT_WORD_EFFECT_ROOT}/aud_deardodo.mp3`;
const audPopEdmond = `${SIGHT_WORD_EFFECT_ROOT}/aud_pop_edmond.mp3`;
const audYourFriendEdmon = `${SIGHT_WORD_EFFECT_ROOT}/aud_yourfriendedmond.mp3`;
const audCastingSpell = `${SIGHT_WORD_EFFECT_ROOT}/aud_casting_spell.mp3`;
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a1a.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a1a.mp3`;

$(document).ready(() => {
  dodomodalStart();
});

document.addEventListener("DOMContentLoaded", async () => {
  // Check for microphone access
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Stop all tracks to release the microphone
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  $(".js-wrapper-start").removeClass("d-none");

  audioElement = $("#audioPlayback")[0];
});

const startStudy = () => {
  if (isSafari()) {
    $(".js-speaker").addClass("safari");
  }

  lockScreen(true);
  hideSpeaker();

  step = 1;
  quizType = "A";
  currentActivity = `A${step}${quizType}`; // 제일 먼저 세팅해야함.

  focusCurrent(currentActivity);

  // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
  $("." + currentActivity).addClass("on");

  $(".js-btn-record").easyPieChart({
    barColor: "#ba00ff",
    trackColor: false,
    scaleColor: false,
    lineCap: "butt",
    lineWidth: 6,
    size: 108, // 차트크기
    animate: {
      duration: audioDuration,
      enabled: true,
    },
    onStop: function (from, to) {
      chart.disableAnimation();
      chart.update(0);

      stopRecord();
    },
  });

  const chart = (window.chart = $(".js-btn-record").data("easyPieChart"));

  const imgArr = [];

  doPreloadImages(imgArr, loadQuiz);
};

const loadQuiz = () => {
  //console.log('loadQuiz');
  loadQuizData(step, quizType, setData);
};

const setData = (data) => {
  //console.log(`setData, data : ${data}`);
  // 비지니스 로직
  // 1. 퀴즈 데이터 담기.
  quizDataArr = data;
  maxQuizCount = quizDataArr.length;

  setLetterEvent();
};

const setLetterEvent = () => {
  setTimeout(openLetter, 1000);

  //playBGM(sndBgmA1A);
  playEffect1(audLetterEnvelope);
  lockScreen(false);
};

const openLetter = () => {
  $(".js-letter-open").on("animationend", () => {
    afterOpenLetter();
  });

  $(".js-wrapper-gif").remove();
  $(".js-letter-open").removeClass("d-none");
};

const afterOpenLetter = () => {
  $(".js-letter-open").off("animationend");

  $(".js-letter-hand").on("animationend", () => {
    afterGribLetter();
  });

  $(".js-wrapper-letter").addClass("open");
  $(".js-letter-hand").removeClass("d-none");
};

const afterGribLetter = () => {
  $(".js-letter-hand").off("animationend");

  //playSound(audPopEdmond, () => {
  //    stopBGM();
  //    playDear();
  //});
  stopBGM();
  playDear();

  //$(".js-character-edmond").removeClass("d-none");
  //$(".js-text-letter").removeClass("d-none");
};

const playDear = () => {
  //playSound(audDearDodo, () => {
  //    $(".js-character-edmond").addClass("d-none");
  //    $(".js-text-letter").html("Your friend, EDMOND.");
  //    $(".js-text-letter").addClass("d-none");
  //    $(".js-letter-hand").addClass("d-none");

  //    setTimeout(() => {
  //        setupQuiz();
  //    }, 1000);
  //});

  setupQuiz();
};

const playBye = () => {
  $(".js-character-edmond").removeClass("d-none");
  playSound(audPopEdmond, null);

  playSound(audYourFriendEdmon, () => {
    $(".js-character-edmond").addClass("end");
    playSound(audCastingSpell, null);

    setTimeout(() => {
      $(".js-img-wand").removeClass("d-none");

      setTimeout(() => {
        dodomodalFinish();
      }, 1500);
    }, 1100);
  });

  $(".js-wrapper-activity").addClass("d-none");
  $(".js-letter-hand").removeClass("d-none");
  $(".js-text-letter").removeClass("d-none");
};

// 퀴즈 세팅 시작
const setupQuiz = () => {
  // 2. 퀴즈 데이터 세팅
  // 퀴즈 타입이 알파벳인지 아닌지 판별
  try {
    setInit();
  } catch (e) {
    alert("Setup Quiz Error: " + e);

    doLogout();
  }
};

const setInit = () => {
  setWorking(true);
  lockScreen(isWorking);

  //for (let i = 0; i < recordArr.length; i++) {
  //    recordArr[i].binaryRecord = "";
  //}

  showSpeaker();
  setQuestion();
};

const setQuestion = () => {
  //console.log(`setQuestion, quizIndex : ${quizIndex} `);
  //console.log(`quizDataArr[quizIndex].Question : ${quizDataArr[quizIndex].Question} `);
  if (quizIndex < 4) {
    $(".js-text-question").html(quizDataArr[quizIndex].Question);
    isQuizWord = true;
  } else {
    $(".js-wrapper-img").append(
      `<img src="${quizDataArr[quizIndex].Image1}" />`
    );
    $(".js-text-question")
      .html(quizDataArr[quizIndex].Question)
      .addClass("sentence");
    isQuizWord = false;
  }

  currentQuizText = quizDataArr[quizIndex].Question;

  // 녹음 버튼 이벤트 바인딩
  $(".js-btn-record").off("click");
  $(".js-btn-record").on("click", () => {
    if (isWorking) {
      return false;
    }

    startRecord();
  });

  isDurationChange = true;

  // 음원 재생
  //playAudio(quizDataArr[quizIndex].Sound1, function () { afterPlayAudio(); startRecord(); });   // 문제 음원 재생 후 바로 녹음 시작
  playAudio(quizDataArr[quizIndex].Sound1, afterPlayAudio); // 문제 음원만 재생

  $(".js-wrapper-activity").removeClass("d-none");
};

const playQuestion = () => {
  setWorking(true);
  lockScreen(isWorking);

  playAudio(quizDataArr[quizIndex].Sound1, afterPlayAudio);
};

const playAudio = (pSrc, pEndFun, loop = 1) => {
  setWorking(true);

  if (sound != undefined && sound != NaN) {
    sound.Stop();
  }

  if (pEndFun) {
    sound = SoundObj(
      {
        src: pSrc,
        repeat: loop,
      },
      undefined,
      pEndFun
    );
  } else {
    sound = SoundObj(
      {
        src: pSrc,
        repeat: 1,
      },
      undefined,
      () => {
        setWorking(false);
      }
    );
  }

  sound.Play();
};

const afterPlayAudio = () => {
  setWorking(false);

  $(".js-wrapper-btns").removeClass("d-none");
  lockScreen(isWorking);
};

const startRecord = () => {
  if (isWorking) {
    return false;
  } else {
    //console.log("start recording");

    isDurationChange = true;
    setWorking(true);
    lockScreen(isWorking);

    startRecording();

    $(".btns").addClass("d-none");
    //$(".js-btn-record").css("animation-duration", `${audioDuration / 1000}s`);
    $(".js-btn-record").removeClass("d-none").addClass("recording");

    //console.log(audioDuration);
    //console.log(chart);
    recordCnt++;
    chart.options.animate.duration = audioDuration;
    chart.enableAnimation();
    chart.update(100);
  }
};

function stopRecord() {
  $("#divresult").empty();

  stopRecording();
}

// 에듀템 평가 후 호출되는 함수, result에 응답 데이터 전달됨
const checkScore = (result) => {
  //score = $.parseJSON(result);
  //console.log(`checkScore: ${JSON.stringify(result)}`);
  //jsonData = result;
  //txtResult = '';
  //txtResult += `<div class="phoneme1 white">Average Phoneme Score: ${jsonData.average_phoneme_score}</div>`;
  //console.log("Speech Detected:", jsonData.speech_detected);
  //console.log("Average Phoneme Score:", jsonData.average_phoneme_score);

  //var strResult = "";
  //jsonData.words.forEach(word => {
  //    word.phonemes.forEach(phoneme => {
  //        const colorClass = getColorClass(phoneme.score);
  //        const html = `<span class="phoneme1 ${colorClass}">${phoneme.alphabet}</span> <span class="phoneme2 ${colorClass}">[${phoneme.phonemes}] (${phoneme.score}) &nbsp</span>`;
  //        strResult += html;
  //    });
  //});
  //$(".js-text-question").html('<div class="phonemeframe">' + txtResult + '<div>' + strResult + '</div></div >');

  displayWord(result);

  if (result.average_phoneme_score >= passMark) {
    isCorrect = true;
    correctAction();
  } else {
    isCorrect = false;

    if (checkRecordCnt()) {
      if (!isPass) {
        setWorking(false);
        lockScreen(isWorking);
        goNext();
      } else {
        incorrectAction();
      }
    } else {
      incorrectAction();
    }
  }
};

function getColorClass(score) {
  if (score > 50 && score <= 100) {
    return "green";
  } else if (score > 15 && score <= 50) {
    return "orange";
  } else if (score >= 0 && score <= 15) {
    return "red";
  } else {
    return "";
  }
}

// 정답 체크 후
const correctAction = () => {
  isDurationChange = false;
  isPass = true;
  $(".js-btn-record").removeClass("recording");
  $(".btns").removeClass("d-none");

  $(".js-btn-play").on("click", () => {
    playRecord();
  });

  $(".js-btn-next").on("click", () => {
    $(".wrapper-letter").removeClass("correct");
    goNext();
  });

  $(".wrapper-letter").addClass("correct");

  isWorking = false;
  lockScreen(false);

  playSound(audCorrect, () => {
    $(".wrapper-letter").removeClass("correct");
  });
};

const incorrectAction = () => {
  isDurationChange = false;
  $(".js-btn-play").off("click");
  $(".js-btn-record").removeClass("recording");
  $(".js-btn-play").addClass("d-none");
  $(".wrapper-letter").addClass("incorrect");
  playSound(audIncorrect, null);

  setTimeout(() => {
    $(".js-btn-record").removeClass("d-none");

    if (isPass || checkRecordCnt()) {
      $(".js-btn-next").off("click");
      $(".js-btn-next").on("click", () => {
        $(".wrapper-letter").removeClass("correct");
        goNext();
      });

      $(".js-btn-next").removeClass("d-none");
    }

    $(".wrapper-letter").removeClass("incorrect");

    setWorking(false);
    lockScreen(isWorking);
  }, 1500);
};

const failTest = (pData) => {
  //alert(pData);
  //$(".js-text-question").html(pData);
  incorrectAction();
};

const playRecord = () => {
  if (isWorking) {
    return false;
  }

  //$(".js-btn-play").addClass("active");

  playRecording();
};

const goNext = () => {
  if (isWorking) {
    return false;
  }

  setWorking(true);
  lockScreen(isWorking);

  isPass = false;
  $(".js-btn-play").off("click");
  $(".js-btn-next").off("click");

  $(".btns").addClass("d-none");
  $(".js-btn-record").removeClass("d-none");

  quizIndex++;
  recordCnt = 0;

  if (quizIndex >= maxQuizCount) {
    playBye();
  } else {
    setQuestion();
  }
};

const checkRecordCnt = () => {
  return recordCnt > 2 ? true : false;
};

// 상태값 변경
const setWorking = (state) => {
  isWorking = state;
};

const SoundObj = (pObj, pFunStartPlay, pFunEndPlay) => {
  this.isplay = false;
  this.infinity = false;

  try {
    if (pObj != undefined) {
      this.audAtt = pObj;
      this.StartFun = pFunStartPlay;
      this.EndFun = pFunStartPlay;
      this.repeat = audAtt.repeat;
      this.audio = new Audio(audAtt.src);

      if (repeat < 0) {
        alert("repeat must be bigger than 0");

        return undefined;
      } else if (this.repeat == 0) {
        this.infinity = true;
      }

      this.Play = function () {
        audio.addEventListener("ended", function () {
          repeat -= 1;

          if (repeat > 0 || infinity) {
            audio.play();
          } else {
            // Stop Sound
            isplay = false;

            if (pFunEndPlay != undefined) {
              pFunEndPlay();
            }
          }
        });

        audio.addEventListener("timeupdate", function () {
          if (isDurationChange)
            audioDuration = Math.ceil(
              audio.duration *
                1000 *
                (quizIndex < 4 ? wordAdditionSec : sentenceAdditionSec)
            );

          //console.log(audioDuration);
          if (isplay == false) {
            // Play Sound
            isplay = true;

            if (pFunStartPlay != undefined) {
              pFunStartPlay();
            }
          }
        });

        audio.volume = 1;
        audio.load();
        audio.play();
      };

      this.Stop = function () {
        audio.setAttribute("src", "");
        audio.addEventListener("timeupdate", null);
        audio.pause();

        if (audio.duration) {
          audio.currentTime = 0;
        }

        isplay = false;
      };

      this.Pause = function () {
        alert("Pause");
      };
    }
  } catch (e) {
    alert(e);
  }

  return this;
};

//function displayWord(data) {
//    var strWord = "";
//    data.words.forEach((word, idx) => {
//        word.phonemes.forEach(phoneme => {
//            const colorClass = getColorClass(phoneme.score);
//            if (isQuizWord) {
//                strWord += `<span class="${colorClass} resultWord" style="font-size:6.5rem;">${phoneme.alphabet}</span>`;
//            } else {
//                strWord += `<span class="${colorClass} resultWord" style="font-size:3.5rem;">${phoneme.alphabet}</span>`;
//            }
//        });

//        if (idx < word.length - 1) {
//            strWord += ' ';
//        }
//    });

//    const referenceText = quizDataArr[quizIndex].Question;

//    $(".js-text-question").html(strWord);

//    const spans = $('.resultWord');
//    let referenceIndex = 0;

//    spans.each(function () {
//        let spanText = $(this).text();
//        let newSpanText = '';

//        for (let i = 0; i < spanText.length; i++) {
//            if (referenceIndex < referenceText.length) {
//                newSpanText += referenceText[referenceIndex];
//                referenceIndex++;
//            }
//        }

//        if (spanText !== newSpanText) {
//            $(this).text(newSpanText);
//        }

//        // Check if the next character in the referenceText is a space
//        if (referenceIndex < referenceText.length && referenceText[referenceIndex] === ' ') {
//            $(this).after('<span class="space"> </span>');
//            referenceIndex++;
//        }

//        if (referenceIndex < referenceText.length &&
//            (referenceText[referenceIndex] === '.' || referenceText[referenceIndex] === '-' ||
//             referenceText[referenceIndex] === ',' || referenceText[referenceIndex] === '\'' ||
//             referenceText[referenceIndex] === '!' || referenceText[referenceIndex] === '?')) {
//            $(this).after(`<span class="resultWord" style="font-size:3.5rem;">${referenceText[referenceIndex]}</span>`);
//            referenceIndex++;
//        }
//    });

//    // 요구시 풀어줌
//    //$('.resultWord').click(function () {
//    //    displayPhoneme(data);
//    //});
//}

const displayWord = (data) => {
  var strWord = "";
  data.words.forEach((word, idx) => {
    word.phonemes.forEach((phoneme) => {
      const colorClass = getColorClass(phoneme.score);
      if (isQuizWord) {
        for (let i = 0; i < phoneme.alphabet.length; i++) {
          strWord += `<span class="${colorClass} resultWord" style="font-size:6.5rem;">${phoneme.alphabet}</span>`;
        }
      } else {
        for (let i = 0; i < phoneme.alphabet.length; i++) {
          strWord += `<span class="${colorClass} resultWord" style="font-size:3.5rem;">${phoneme.alphabet[i]}</span>`;
        }
      }
    });

    if (idx < word.length - 1) {
      strWord += " ";
    }
  });

  const referenceText = quizDataArr[quizIndex].Question;

  $(".js-text-question").html(strWord);

  for (let i = 0; i < referenceText.length; i++) {
    let spans = $(".resultWord");

    if (
      referenceText[i] !== spans.eq(i).text() &&
      /^[a-zA-Z0-9]$/.test(referenceText[i])
    ) {
      spans.eq(i).text(referenceText[i]);
    }

    if (
      referenceText[i] === "." ||
      referenceText[i] === "-" ||
      referenceText[i] === " " ||
      referenceText[i] === "," ||
      referenceText[i] === "'" ||
      referenceText[i] === "!" ||
      referenceText[i] === "?"
    ) {
      let newSpan = `<span class="resultWord" style="font-size:3.5rem;">${referenceText[i]}</span>`;
      spans.eq(i - 1).after(newSpan);
    }
  }
};

const resetAll = (pStart) => {
  quizIndex = 0;

  $(".js-wrapper-img").empty();
  $(".js-text-question").removeClass("sentence");

  $(".js-text-letter").addClass("d-none");
  $(".js-letter-hand").addClass("d-none");
  $(".js-img-wand").addClass("d-none");
  $(".js-character-edmond").addClass("d-none").removeClass("end");

  $(".js-wrapper-activity").removeClass("d-none");

  setQuestion();
  //playBGM(sndBgmA1A);

  hideNext();
};
