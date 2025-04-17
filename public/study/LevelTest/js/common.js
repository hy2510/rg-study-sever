$(document).ready(function () {
	//페이지 작동 정보 변수
	let isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

	// 접속 디바이스 구별 함수 (https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.4.5/mobile-detect.min.js)
	const md = new MobileDetect(window.navigator.userAgent);

	// 화면 사이즈를 변경하기 위한 변수
	let screenWidth = screen.width;
	let screenHeight = screen.height;
	let isPortrait = screenHeight > screenWidth;
	let wrapperScalePortrait =  screenWidth / 1200;
	let wrapperScaleLandscape = screenHeight / 850;
	let wrapperScalePortraitToLandscape = screenHeight / 1200; // onload 세로 -> 가로 - 모바일
	let wrapperScaleLandscapeToPortrait = screenWidth / 850; // onload 가로 -> 세로 - 모바일
	let wrapperScalePortraitToLandscapeByTab = screenWidth / 1200; // onload 세로 -> 가로 - 태블릿
	let wrapperScaleLandscapeToPortraitByTab = screenHeight / 1200; // onload 가로 -> 세로 - 태블릿
	let targetLayout = "#outline";
	let targetLayoutPopStart = "#popStart";
	let targetLayoutPopLevel = "#popLevel";
	let targetLayoutPopResult = "#popResult";

	// 화면 사이즈 조정 (학습 실행시)
	function reScale() {
		if (isMobile) {
			// 태블릿일 때
			if (md.tablet()) {
				if (isPortrait) {
					$(targetLayout).css('transform', `scale(${wrapperScalePortrait})`);
					$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
					$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
					$(targetLayoutPopResult).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
				} else {
					$(targetLayout).css('transform', `scale(${wrapperScalePortrait})`);
					$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
					$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
					$(targetLayoutPopResult).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
				}
			}
		
			// 모바일일 때
			else {
				if (isPortrait) {
					$(targetLayout).css('transform', `scale(${wrapperScalePortrait})`);
					$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
					$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
					$(targetLayoutPopResult).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
				} else {
					$(targetLayout).css('transform', `scale(${wrapperScaleLandscape})`);
					$(targetLayoutPopStart).css('transform', `scale(${wrapperScaleLandscape}) translate(-50%, -50%)`);
					$(targetLayoutPopLevel).css('transform', `scale(${wrapperScaleLandscape}) translate(-50%, -50%)`);
					$(targetLayoutPopResult).css('transform', `scale(${wrapperScaleLandscape}) translate(-50%, -50%)`);
				}
			}
		} else {
			if (screenWidth < 1440) {
				$(targetLayout).css('transform', `scale(${wrapperScalePortrait})`);
			}
		}
	}

	// 화면 사이즈 조정 (디바이스 회전시)
	function orientationchangeReScale() {
		if (isMobile) {
			// 태블릿일 때
			if (md.tablet()) {
				switch(window.orientation) {
					// onload 세로 -> 가로
					case 0:
						if (isPortrait) {
							$(targetLayout).css('transform', `scale(${wrapperScalePortraitToLandscapeByTab})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortraitToLandscapeByTab}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortraitToLandscapeByTab}) translate(-50%, -50%)`);
						} else {
							$(targetLayout).css('transform', `scale(${wrapperScaleLandscapeToPortraitByTab})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScaleLandscapeToPortraitByTab}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScaleLandscapeToPortraitByTab}) translate(-50%, -50%)`);
						}
						break;
					// onload 가로 -> 세로
					case 90:
					case -90:
						if (isPortrait) {
							$(targetLayout).css('transform', `scale(${wrapperScaleLandscapeToPortraitByTab})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScaleLandscapeToPortraitByTab}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScaleLandscapeToPortraitByTab}) translate(-50%, -50%)`);
						} else {
							$(targetLayout).css('transform', `scale(${wrapperScalePortrait})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
						}
						break;
				}
			}
			// 모바일일 때
			else {
				switch(window.orientation) {
					// onload 세로 -> 가로
					case 0:
						if (isPortrait) {
							$(targetLayout).css('transform', `scale(${wrapperScalePortrait})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortrait}) translate(-50%, -50%)`);
						} else {
							$(targetLayout).css('transform', `scale(${wrapperScalePortraitToLandscape})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScalePortraitToLandscape}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScalePortraitToLandscape}) translate(-50%, -50%)`);
						}
						break;
					// onload 가로 -> 세로
					case 90:
					case -90:
						if (isPortrait) {
							$(targetLayout).css('transform', `scale(${wrapperScaleLandscapeToPortrait})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScaleLandscapeToPortrait}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScaleLandscapeToPortrait}) translate(-50%, -50%)`);
						} else {
							$(targetLayout).css('transform', `scale(${wrapperScaleLandscape})`);
							$(targetLayoutPopStart).css('transform', `scale(${wrapperScaleLandscape}) translate(-50%, -50%)`);
							$(targetLayoutPopLevel).css('transform', `scale(${wrapperScaleLandscape}) translate(-50%, -50%)`);
						}
						break;
				}
			}
		}
	}

	// 화면 실행
	$(window).on("orientationchange", function(){
		orientationchangeReScale();
	});

	doStart();

	reScale();
});