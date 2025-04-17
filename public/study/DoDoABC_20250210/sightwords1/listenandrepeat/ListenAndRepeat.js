// 절대경로로 해줘야 인식함
const DOMAINS = "/DoDoABC/include";

var refrcg;
var userrcg;
var buffer;
var stt = "";
var userRcg = "";

let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = []; // 보기
let questionIndex = 0;
let question = "";
let fileIdx = 0;

let filePath =
  "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/sentence/";
let fileData = [];
let fileMp3 = [];

let avgPronunciation;
let avgIntonation;
let avgTiming;

let recordCnt = 0;
let recordingTime = 0;
const additionSec = 2.0; // 사운드 길이가 1초이면 녹음 시간은 2초
const drawCircleRate = 10;
const passMark = 40;

let incorrectCnt = 0;
let quizLoaded = false; // 첫번째 에드몽 액션 구분

let isQuizWord = true;

let recordArr = [
  { isPass: false, binaryRecord: "" },
  { isPass: false, binaryRecord: "" },
  { isPass: false, binaryRecord: "" },
  { isPass: false, binaryRecord: "" },
];

const sndCorrect = effectSightWords + "correct.mp3"; // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect.mp3"; // (08) (800 ~ 1000) 틀렸을 때 나는 소리
const sndFlying = effectSightWords + "flying.mp3"; // (12) (900 ~ 1000) 휘익~ 캐릭터가 날아가는 소리

$(document).ready(() => {
  playEffect1(sndFlying);
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

  hideSpeaker();
  dodomodalHide();

  step = 1;
  quizType = "A";
  currentActivity = "A1A"; // 제일 먼저 세팅해야함.

  focusCurrent(currentActivity);

  isWorking = false;
  lockScreen(false);
  //playBGM(sndBgmA1A);

  // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
  $("." + currentActivity).addClass("on");

  $(".js-speaker").attr("onclick", "playSentence();");

  const imgArr = [];

  doPreloadImages(imgArr, loadQuiz);
};

const loadQuiz = () => {
  //console.log('loadQuiz');
  loadQuizData(step, quizType, setData);
};

const edmondAppeared = () => {
  dodomodalStart();
};

const setData = (data) => {
  // 비지니스 로직
  // 1. 퀴즈 데이터 담기.
  quizDataArr = data;
  maxCorrectCount = quizDataArr.length;

  setupQuiz();
};

const nextQuestion = () => {
  motionEdmondWaiting();
  incorrectCnt = 0;
  recordCnt = 0;
  correctCount++;

  if (correctCount >= maxCorrectCount) {
    dodomodalFinish();
  } else {
    setupQuiz();
  }
};

// 퀴즈 세팅 시작
const setupQuiz = () => {
  // 2. 퀴즈 데이터 세팅
  // 퀴즈 타입이 알파벳인지 아닌지 판별
  try {
    setInit();

    setExample();

    //$('.carousel').carousel();

    isWorking = false;
    isClick = false;

    //SelvySTT_Edu_ENG_Destroy();
  } catch (e) {
    alert("Setup Quiz Error: " + e);
    doLogout();
  }
};

// 문제 세팅
const setExample = () => {
  question = quizDataArr[correctCount].Question;

  motionEdmondWaiting();

  if (
    quizDataArr[correctCount].Image1 == undefined ||
    quizDataArr[correctCount].Image1 == NaN ||
    quizDataArr[correctCount].Image1 == ""
  ) {
    $(".js-text-question").html(quizDataArr[correctCount].Question);
    isQuizWord = true;

    //console.log(`isQuizWord: ${isQuizWord}`);
  } else {
    $(".js-wrapper-img").append(
      `<img src="${quizDataArr[correctCount].Image1}" />`
    );
    $(".js-text-question")
      .html(quizDataArr[correctCount].Question)
      .addClass("sentence");
    isQuizWord = false;
  }

  currentQuizText = quizDataArr[correctCount].Question;

  $(".js-btns").removeClass("d-none");

  // 문제 음원 재생
  setTimeout(() => {
    playSentence();
  }, 1000);
};

const playSentence = () => {
  playSound(quizDataArr[correctCount].Sound1, function () {
    recordingTime = soundDuration * additionSec;

    isWorking = false;
    isClick = false;
    lockScreen(isWorking);
  });
};

const startRecord = () => {
  if (isWorking || isClick) {
    return false;
  } else {
    //console.log(`startRecord`);

    isWorking = true;
    isClick = true;
    lockScreen(isWorking);

    $("#divresult").empty();

    motionEdmondRecording();

    //console.log(quizDataArr[correctCount].Question);
    startRecording(quizDataArr[correctCount].Question);

    recordCnt++;
  }
};

function stopRecord() {
  $("#divresult").empty();

  stopRecording();
}

// 에듀템 평가 후 호출되는 함수, result에 응답 데이터 전달됨
const checkScore = (result) => {
  isWorking = false;
  lockScreen(false);

  jsonData = result;

  // 단어를 스코어에 맞는 색으로 변경
  displayWord(jsonData);

  if (jsonData.average_phoneme_score >= passMark) {
    isCorrect = true;
    correctAction();
  } else {
    isCorrect = false;
    incorrectCnt++;

    if (incorrectCnt >= 3) {
      isWorking = false;
      isClick = false;
      lockScreen(isWorking);

      nextQuestion();
    } else {
      incorrectAction();
    }
  }
};

// 정답 체크 후
const correctAction = () => {
  //console.log('correctAction');
  if ((audioUrl = "")) {
    return false;
  } else {
    isWorking = false;
    isClick = false;
    lockScreen(isWorking);
    playEffect1(sndCorrect);
    motionEdmondCorrect();
  }
};

const incorrectAction = () => {
  motionEdmondIncorrect();

  playSound(sndIncorrectBoing, function () {
    playSentence();
  });
};

const failTest = (pData) => {
  //alert(pData);
  //$(".js-text-question").html(pData);
  incorrectAction();
};

const playRecord = () => {
  playRecording();
  //playBuffer(recordArr[questionIndex].binaryRecord);
};

const setInit = () => {
  isClick = true;
  isWorking = true;
  lockScreen(isWorking);
  stopAllSound();

  for (let i = 0; i < recordArr.length; i++) {
    recordArr[i].binaryRecord = "";
  }

  $(".js-speaker").removeClass("d-none");
  $(".js-btn_next").addClass("d-none");
  $(".js-edmon_d").removeClass("correct incorrect recording");
  $(".js-wrapper-img").html("");
  $(".js-text-question").html("").removeClass("sentence");
};

const resetAll = (pStart) => {
  correctCount = 0;
  quizData = [];
  exampleArr = [];

  setInit();

  setupQuiz();
  hideNext();
};

const motionEdmondRecording = () => {
  recordingOn();
  $(".btn01_record").addClass("active");
  $(".btn02_play").addClass("d-none");
  $(".btn03_next").addClass("d-none");
  //$("#path").css("animation", `dash ${recordingTime * additionSec / 1000}s linear`);
  //$("#path").addClass('svg1');
  $(".js-edmond")
    .removeClass("edmond_d")
    .removeClass("edmond_w")
    .removeClass("edmond_correct")
    .removeClass("edmond_incorrect")
    .addClass("edmond_record");
};

const motionEdmondWaiting = () => {
  $(".btn01_record").removeClass("active");
  $(".btn02_play").addClass("d-none");
  $(".btn03_next").addClass("d-none");
  //$("#path").css("animation", `none`);
  //$("#path").removeClass('svg1');
  $(".js-edmond")
    .removeClass("edmond_record")
    .removeClass("edmond_correct")
    .removeClass("edmond_d")
    .removeClass("edmond_incorrect")
    .addClass("edmond_w");
};

const motionEdmondCorrect = () => {
  $(".btn01_record").removeClass("active");
  $(".btn02_play").removeClass("d-none");
  $(".btn03_next").removeClass("d-none");
  //$("#path").css("animation", `none`);
  //$("#path").removeClass('svg1');
  $(".js-edmond")
    .removeClass("edmond_record")
    .removeClass("edmond_w")
    .removeClass("edmond_d")
    .removeClass("edmond_incorrect")
    .addClass("edmond_correct");
};

const motionEdmondIncorrect = () => {
  $(".btn01_record").removeClass("active");
  $(".btn02_play").addClass("d-none");
  $(".btn03_next").addClass("d-none");
  //$("#path").css("animation", `none`);
  //$("#path").removeClass('svg1');
  $(".js-edmond")
    .removeClass("edmond_record")
    .removeClass("edmond_w")
    .removeClass("edmond_d")
    .removeClass("edmond_correct")
    .addClass("edmond_incorrect");
};

const recordingOn = () => {
  const outline = document.querySelector("#c2");
  const outlineLength = outline.getTotalLength();
  outline.style.strokeDasharray = outlineLength;
  //console.log(`recordingOn`);
  outline.style.strokeDashoffset = -90;

  // duration : 초 * 100
  let duration = recordingTime / drawCircleRate;
  let elapsed = 0;
  animate(elapsed);

  function animate(offset) {
    setTimeout(() => {
      elapsed++;
      if (elapsed > duration) {
        stopRecord();
        elapsed = 0;
        $(".btn01_record").removeClass("active");
        outline.style.strokeDashoffset = 0;
        return;
      }

      animate((elapsed / duration) * outlineLength);
      //console.log(`elapsed : duration = ${elapsed} : ${duration}`);
    }, drawCircleRate);
    outline.style.strokeDashoffset = offset * -1;
  }
};

//function displayWord(data) {
//    var strWord = "";
//    data.words.forEach((word, idx)=> {
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

//    const referenceText = quizDataArr[correctCount].Question;

//    const lastCh = referenceText.charAt(referenceText.length - 1);
//    //console.log(`lastCh: ${lastCh}`);
//    if (!isQuizWord && (lastCh == '.' || lastCh == '?' || lastCh == '!' || lastCh == ',')) {
//        strWord += `<span style="color:white; font-size:3.5rem;">${lastCh}</span>`;
//    }

//    $(".js-text-question").html(strWord);

//    let spans = $('.resultWord');
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

//        if (newSpanText === "'") {
//            $(this).before(`<span class="resultWord">'</span>`);
//        };

//        if (newSpanText === ",") {
//            $(this).before(`<span class="resultWord">,</span>`);
//        };

//        if (newSpanText === ".") {
//            $(this).before(`<span class="resultWord">.</span>`);
//        };

//        if (newSpanText === "-") {
//            $(this).before(`<span class="resultWord">-</span>`);
//        };
//    });

//    spans = $('.resultWord');
//    referenceIndex = 0;
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
//            $(this).after('<span class="space"></span>');
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

  const referenceText = quizDataArr[correctCount].Question;

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

      //console.log(`i[${i}], ${newSpan}`);

      //$('.resultWord').each(function (index, element) {
      //    console.log(index, element); // index는 요소의 순서, element는 실제 DOM 요소
      //});
    }
  }

  // 요구시 풀어줌
  //$('.resultWord').click(function () {
  //    displayPhoneme(data);
  //});
};

function displayPhoneme(data) {
  $(".js-text-question").html("");
  const resultsDiv = $(".js-text-question");

  if (!data.speech_detected) {
    resultsDiv.html("<p>No speech detected.</p>");
    return;
  }

  //resultsDiv.append(`<div class="phoneme1 white">Average Phoneme Score: ${jsonData.average_phoneme_score}</div>`);
  //resultsDiv.html(`<p>Average Phoneme Score: ${data.average_phoneme_score}</p>`);

  $.each(data.words, function (index, word) {
    const wordDiv = $("<div>").addClass("phonics-container");
    const phonicsSets = $("<div>").addClass("phonics-sets");

    $.each(word.phonemes, function (i, phoneme) {
      let phonicsSet;
      const pScore = Math.round(phoneme.score);

      if (isQuizWord) {
        phonicsSet = $("<div>").addClass("phonics-set");
      } else {
        phonicsSet = $("<div>").addClass("phonics-set2");
      }

      phonicsSet.addClass(getColorClass(pScore));

      const alphabetDiv = $("<div>")
        .addClass("alphabet")
        .text(phoneme.alphabet);
      const phonemeDiv = $("<div>").text(phoneme.phonemes.join(", "));
      const scoreDiv = $("<div>").text(pScore);

      phonicsSet.append(alphabetDiv, phonemeDiv, scoreDiv);
      phonicsSets.append(phonicsSet);
    });

    wordDiv.append(phonicsSets);
    resultsDiv.append(wordDiv);
  });

  $(".phonics-sets").click(function () {
    displayWord(data);
  });
}
