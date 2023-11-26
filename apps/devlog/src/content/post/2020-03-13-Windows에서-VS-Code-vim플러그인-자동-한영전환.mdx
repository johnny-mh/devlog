---
title: Windows에서 VS Code vim플러그인 자동 한영전환
categories: [development]
tags: [vscode, autohotkey]
---

## CapsLock과 Control키 바꾸기

처음에는 게임과 영화를 보기 위한 용도로 데스크탑을 조립했는데 이제는 개발도구로 사용하고 있다. Window는 터미널을 사용할 때의 제약이 많아 개발할때는 꺼렸는데 wsl의 등장으로 지금은 현업에서도 큰 불편 없이 사용할 수 있는 정도가 되었다.

특히 vscode의 wsl 플러그인을 사용하면 wsl의 리눅스 파일시스템에 있는 프로젝트들을 마치 호스트의 파일시스템에 있는 것 처럼 사용할 수 있어서 집에서는 이제 맥북으로 개발하지 않을 것 같다. 다만 몇 가지 불편한 부분이 있었다.

첫번째는 `Capslock`키와 `Control`키의 위치였다. 해피해킹 키보드에 익숙해져 `Control`대신 `Capslock`을 마구 눌러댔다. 윈도우에서 이를 해결할 수 있는 방법은 두가지가 있다. 첫번째로 레지스트리를 수정하는 방법인데. 대부분의 프로그램에서는 잘 동작하지만 특정 게임들 (몬스터 헌터, 토탈워 삼국)에서는 `Control`키를 아예 누를 수 없는 상태가 되어 버린다.

두 번째는 [AutoHotKey](https://www.autohotkey.com/)를 사용하는 것이다. 이 방법으로 지금까지 만족스럽게 사용하고 있다. 사이트에서 프로그램을 설치하고 바탕화면에 우클릭 후 **'새로 만들기'** > **'AutoHotkey Script'**를 선택한 후 생성된 파일에 아래 내용을 붙여 넣고 저장한다.

```text
; CapsLock, Control 전환
CapsLock::Ctrl
Ctrl::CapsLock
```

다음 해당 파일을 우클릭하여 **'Run Script'**로 실행한다. 시스템 트레이 아이콘에 'H'아이콘이 나타나면 된 것이다. 그럼 이제 `Capslock`과 `Control`이 바뀌었을 것이다. 이 동작은 언제까지나 스크립트가 실행되어 있는 상태만 유효하다.

## 수정모드를 빠져나갈 때 영문으로 전환하기

이전에 Spacemacs를 사용할 땐 에디터 내장 언어 입력기가 존재하여 수정모드를 빠져나갈 때 자동으로 영문으로 바꿔 주었는데. 이 기능이 정말 편리했다. VSCODE를 사용한 뒤로는 그 기능을 쓸 수 없어 `Esc`로 수정모드를 빠져나온 후 항상 언어 전환 키를 눌러줘야만 했다.

이 문제를 해결하기 위한 [설정](https://github.com/daipeihust/im-select)이 있긴 하지만 이게 IME입력기를 쓰는 환경에서는 잘 동작하지 않는다. 이 문제도 AutoHotKey를 이용해 해결할 수 있었다. 위에서 했던 방법과 마찬가지로 아래 스크립트를 쓰면 된다.

```text
; vscode에서 vim insert 모드 종료시 한글이면 영문으로 전환
#IfWinActive, ahk_exe Code.exe
Escape::
	if (ImeCheck("A") = 1)
		Send {vk15sc138}
	Send {Escape}
Return
#IfWinActive

; 키보드 언어 상태 확인 1이면 한글 0이면 영문
ImeCheck(WinTitle) {
	WinGet,hWnd,ID,%WinTitle%
	Return SendImeControl(ImmGetDefaultIMEWnd(hWnd),0x005,"")
}
SendImeControl(DefaultIMEWnd, wParam, lParam) {
	DetectSave := A_DetectHiddenWindows
	DetectHiddenWindows,ON
	SendMessage 0x283, wParam,lParam,,ahk_id %DefaultIMEWnd%
	if (DetectSave <> A_DetectHiddenWindows)
		DetectHiddenWindows,%DetectSave%
	return ErrorLevel
}
ImmGetDefaultIMEWnd(hWnd) {
	return DllCall("imm32\ImmGetDefaultIMEWnd", Uint,hWnd, Uint)
}
```

그럼 이제 매 부팅시마다 위의 스크립트들이 자동실행만 되면 된다. 방법은 스크립트 파일 우클릭 후 **'Compile Script'**를 선택한다. 그럼 같은 경로에 exe파일이 생겼을 것이다. 이제 Window의 시작 버튼에 우클릭 후 **'실행'** 을 열고 거기에 `shell:startup`을 입력하고 **'열기'** 를 누른다.

그럼 폴더가 하나 뜨는데 여기에 exe파일들을 넣으면 된다. 참고로 위의 두 스크립트를 하나의 파일에 넣어도 된다.
