# 2주 탄력근무 근태 계산기 (웹앱)

엑셀 계산 로직을 TypeScript 함수로 재구현한 개인용 웹앱입니다.
시간 계산은 내부적으로 모두 분(minute) 정수로 처리하고, 화면에는 `h:mm` 형식으로 표시합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS
- dayjs
- 저장소: localStorage

## 주요 기능
- 2주 시작일 입력 시 14일 자동 생성
- 출근/퇴근 입력: 직접 수정 + 현재시간 자동 입력 버튼
- 공휴일 체크, 실제 야근결재(분) 입력
- 상단 요약 카드 5개 자동 계산
- 구간 생성/선택/복사
- 현재 구간 삭제(확인 모달 포함)
- 전체 데이터 초기화(강한 경고 + 확인 모달 포함)
- CSV 내보내기

## 데이터 모델
```ts
Period {
  id: string;
  label: string;          // 예: 2026_02_2구간
  startDate: string;      // YYYY-MM-DD
  createdAt: string;      // ISO
  records: DayRecord[];
}

DayRecord {
  date: string;           // YYYY-MM-DD
  isHoliday: boolean;
  clockIn: string;        // HH:mm | ""
  clockOut: string;       // HH:mm | ""
  workMinutes: number | null;
  regularMinutes: number | null;
  overtimeMinutes: number | null;
  recommendedOtMinutes: number | null;
  claimedOtMinutes: number; // 분
  earlyLeaveBalanceMinutes: number | null;
}
```

## localStorage 저장 방식
- key: `flex-work-2week-app-v1` (기존 유지)
- 저장 버튼 클릭 시 현재 앱 상태가 key에 저장됩니다.
- 현재 구간 삭제: 앱 상태에서 현재 구간만 제거(저장 버튼으로 영구 반영)
- 전체 데이터 초기화: localStorage key를 즉시 삭제하고 앱 상태를 초기화

## 실행 방법 (로컬)
```bash
npm.cmd install
npm.cmd run dev
```
- 브라우저에서 표시되는 주소(보통 `http://localhost:5173`)로 접속

## 빌드 방법
```bash
npm.cmd run build
npm.cmd run preview
```

## Vercel 배포 방법 (정적 배포)
1. 저장소를 GitHub에 push
2. Vercel에서 `New Project`로 저장소 연결
3. Framework Preset: `Vite` (자동 감지)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy

추가 설정 없이 SPA 진입은 `index.html`로 처리됩니다.

## 계산 로직 위치
- 핵심 계산: `src/utils/calculations.ts`
- 시간 유틸: `src/utils/time.ts`
- 구간 생성/복사: `src/utils/period.ts`
- 저장/초기화: `src/utils/storage.ts`
- 삭제 상태 처리: `src/utils/dataManagement.ts`