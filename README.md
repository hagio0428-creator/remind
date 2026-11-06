# RE:MIND

동의받은 기록으로 만드는 AI 대화 웹앱. Windows / Next.js 16 / TypeScript / Tailwind CSS 4.

## 실행

Node.js 20.9 이상을 설치한 뒤:

```sh
npm ci
```

`.env.example`을 `.env.local`로 복사하고 `OPENAI_API_KEY`를 설정하세요. 키는 서버 전용입니다.

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 3102
```

브라우저에서 http://127.0.0.1:3102 를 여세요. Windows에서는 START.cmd로도 실행할 수 있습니다.

## 기능

- 이름·사진·당사자 동의 기반 프로필
- IndexedDB에 프로필별 음성·스크린샷·로그 원본·확정 메시지·AI 대화 저장
- TXT/CSV/JSON 로그 미리보기·수정·확정 저장
- 대상 말풍선 방향·색상 기반 OpenAI 이미지 분석
- 저장한 말투 메모·확정 메시지·대화 이력을 사용하는 실제 OpenAI 채팅
- 프로필·전체 백업과 기존 데이터를 덮어쓰지 않는 복원
- 동의 철회·삭제 확인·API 오류 처리

음성은 저장·재생용입니다. 복제율은 데이터 완성도 추정치이며 실제 인물 복제 정확도를 검증한 지표가 아닙니다. AI는 실제 당사자가 아닙니다.

## 개인정보와 기존 자료

자료는 현재 브라우저에 저장됩니다. API 사용 시 선택한 이미지 또는 이름·확정 메시지·말투·최근 대화가 OpenAI로 전송됩니다. 키·개인 자료·테스트 백업은 저장소에 포함하지 않습니다. 로컬 사용을 전제로 하며 외부 공개 서비스용 인증·사용자 분리는 제공하지 않습니다.

기존 앱과 같은 브라우저·주소·포트에서 홈의 이전 자료 가져오기를 누르면 localStorage의 remind-profiles와 remind-confirmed-messages-{id}, IndexedDB의 remind-screenshots/screenshots 및 remind-audio/audio를 새 DB로 복사합니다. 이전 저장소는 삭제하지 않습니다. 가져온 자료의 동의는 다시 확인해야 합니다.

## 검증

프로덕션 빌드·TypeScript 검사 통과. 브라우저에서 프로필, 음성 재생, TXT/CSV/JSON, 실제 이미지 분석·AI 대화·말투 반영·대화 이력, 새로고침 영속 저장, 백업·복원, 동의 철회 및 잘못된 JSON 처리를 검증했습니다.
