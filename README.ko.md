<p align="center">
  <img src="docs/images/logo.png" alt="EasyShell Logo" width="200" />
</p>

# EasyShell

**AI 네이티브 서버 운영 플랫폼**

AI가 스크립트를 작성하고, 여러 호스트의 작업을 조율하며, 인프라를 분석하는 동안 당신은 중요한 일에만 집중하세요.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/Docs-docs.easyshell.ai-green.svg)](https://docs.easyshell.ai)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289da?logo=discord&logoColor=white)](https://discord.gg/WqFD9VQe)

**언어**: [English](./README.md) | [简体中文](./README.zh-CN.md) | [繁體中文](./README.zh-TW.md) | 한국어 | [Русский](./README.ru.md) | [日本語](./README.ja.md)

---

## 왜 EasyShell인가?

기존의 서버 관리 도구들은 사용자가 직접 모든 스크립트를 작성하고, 모든 서버에 SSH로 접속하며, 모든 출력을 스스로 해석하기를 요구합니다. EasyShell은 이 모델을 뒤집습니다: **AI가 운영자가 되고, 당신은 의사 결정자가 됩니다.**

- **필요한 내용을 일상 언어로 설명** → AI가 차이점 리뷰(diff review)와 함께 운영 환경에 즉시 적용 가능한 쉘 스크립트를 작성합니다.
- **여러 호스트를 아우르는 목표 설정** → AI가 실행 단계를 계획하고, 실행하며, 결과를 종합하여 보고합니다.
- **웹 SSH를 통한 접속** → 파일 관리자, 멀티 탭, 검색 기능을 갖춘 풀 터미널을 로컬 클라이언트 없이 사용하세요.

---

## 핵심 기능

### 1. AI 스크립트 어시스턴트

> 원하는 내용을 설명하세요. AI가 스크립트를 작성합니다. 차이점을 검토하고 클릭 한 번으로 적용하세요.

AI 스크립트 워크벤치는 일상 언어로 요구사항을 설명하면 AI가 대상 OS에 맞는 쉘 스크립트를 생성하거나 수정해 주는 분할 패널 에디터입니다. 실시간 스트리밍으로 스크립트가 작성되는 과정을 볼 수 있으며, 내장된 diff 뷰가 변경 사항을 정확히 하이라이트합니다. 요약 탭에서는 수정된 내용을 한국어로 설명해 줍니다.

<p align="center">
  <img src="docs/images/AI%20Script%20helper.png" alt="AI 스크립트 어시스턴트 — diff 리뷰와 함께 실시간 코드 생성" width="90%" />
</p>

### 2. AI 작업 오케스트레이션

> "모든 호스트의 디스크와 메모리를 점검하고, 80%가 넘는 항목을 표시한 뒤 해결 방법을 제안해 줘." — 완료.

AI 채팅 인터페이스를 통해 높은 수준의 운영 목표를 전달할 수 있습니다. AI는 이를 다단계 실행 계획(탐색 → 분석 → 보고)으로 분해하고, 대상 호스트에 스크립트를 배포하고, 결과를 수집하며, 위험 평가와 실행 가능한 권장 사항이 포함된 구조화된 분석을 단 한 번의 대화로 제공합니다.

<p align="center">
  <img src="docs/images/AI%20task%20orchestration.png" alt="AI 작업 오케스트레이션 — 분석을 포함한 다단계 실행 계획" width="90%" />
</p>

### 3. 기능이 완비된 웹 SSH

> 실제 터미널. 실제 파일 관리자. SSH 클라이언트가 필요 없습니다.

멀티 탭 세션, 통합 파일 관리자(업로드, 다운로드, 생성, 삭제, 탐색), 터미널 버퍼 내 전체 텍스트 검색, WebSocket을 통한 영구 연결을 지원하는 기업급 웹 터미널입니다. 파일 관리와 명령 실행을 나란히 수행하세요.

<p align="center">
  <img src="docs/images/Fully%20functional%20web%20SSH.png" alt="웹 SSH — 파일 관리자와 멀티 탭을 갖춘 터미널" width="90%" />
</p>

---

## AI 기반 자동 점검

> **Cron → 스크립트 → AI 분석 → 봇 알림** — 사람의 개입이 전혀 없는 완전 자동화.

cron 표현식으로 점검 작업을 예약하세요. EasyShell은 에이전트에 스크립트를 배포하고, 출력 결과(디스크, 메모리, 서비스, 로그)를 수집하여 지능형 분석을 위해 AI 모델로 전송한 뒤, 팀의 봇 채널로 보고서를 푸시합니다.

**작동 방식:**
1. **구성** — cron 표현식 + 쉘 스크립트 + AI 분석 프롬프트
2. **실행** — EasyShell이 일정에 따라 대상 에이전트에 배포
3. **분석** — 출력이 AI 모델(OpenAI / Gemini / GitHub Copilot / Custom)로 전송됨
4. **알림** — 보고서가 봇 채널(Telegram, Discord, Slack, DingTalk, Feishu, WeCom)로 푸시됨

**지원 봇 채널** ([구성 가이드](https://docs.easyshell.ai/configuration/bot-channels/)):

| 봇 | 상태 |
|-----|--------|
| [Telegram](https://docs.easyshell.ai/configuration/bot-channels/) | ✅ 지원됨 |
| [Discord](https://docs.easyshell.ai/configuration/bot-channels/) | ✅ 지원됨 |
| [Slack](https://docs.easyshell.ai/configuration/bot-channels/) | ✅ 지원됨 |
| [DingTalk (钉钉)](https://docs.easyshell.ai/configuration/bot-channels/) | ✅ 지원됨 |
| [Feishu (飞书)](https://docs.easyshell.ai/configuration/bot-channels/) | ✅ 지원됨 |
| [WeCom (企业微信)](https://docs.easyshell.ai/configuration/bot-channels/) | ✅ 지원됨 |

---

## 빠른 시작

```bash
git clone https://github.com/easyshell-ai/easyshell.git
cd easyshell
cp .env.example .env      # 필요시 .env 수정
docker compose up -d
```

로컬 빌드가 필요 없습니다 — 사전 빌드된 이미지가 [Docker Hub](https://hub.docker.com/u/laolupaojiao)에서 자동으로 풀링됩니다.

`http://localhost:18880` 접속 → `easyshell` / `easyshell@changeme`로 로그인하세요.

> **GHCR을 대신 사용하고 싶으신가요?** `.env`에서 설정하세요:
> ```
> EASYSHELL_SERVER_IMAGE=ghcr.io/easyshell-ai/easyshell/easyshell-server:latest
> EASYSHELL_WEB_IMAGE=ghcr.io/easyshell-ai/easyshell/easyshell-web:latest
> ```

> **개발자이신가요? 소스에서 빌드하기:**
> ```bash
> docker compose -f docker-compose.build.yml up -d
> ```

---

## 전체 기능 세트

| 카테고리 | 기능 |
|----------|----------|
| **AI 지능** | AI 스크립트 어시스턴트(생성 / 수정 / diff / 요약), AI 작업 오케스트레이션(다단계 계획, 병렬 실행, 분석), AI 채팅, AI 분석 및 봇 푸시를 포함한 예약 점검, 점검 보고서, 운영 승인 |
| **운영** | 스크립트 라이브러리, 일괄 실행, 실시간 스트리밍 로그, 파일 관리자가 포함된 웹 SSH 터미널 |
| **인프라** | 호스트 관리, 실시간 모니터링, 클러스터 그룹화, 에이전트 자동 배포 |
| **관리** | 사용자 관리, 시스템 구성, AI 모델 설정(OpenAI / Gemini / Copilot / Custom), 위험 제어 |
| **플랫폼** | 다국어 지원(EN / ZH), 다크/라이트 테마, 반응형 디자인, 감사 로깅 |

---

## 아키텍처

```
┌──────────────┐       HTTP/WS        ┌──────────────────┐
│  EasyShell   │◄─────────────────────►│   EasyShell      │
│    Agent     │  register / heartbeat │     Server       │
│  (Go 1.24)  │  script exec / logs   │ (Spring Boot 3.5)│
└──────────────┘                       └────────┬─────────┘
                                                │
                                       ┌────────┴─────────┐
                                       │   EasyShell Web   │
                                       │ (React + Ant Design)│
                                       └──────────────────┘
```

## 기술 스택

| 구성 요소 | 기술 |
|-----------|-----------|
| 서버 | Java 17, Spring Boot 3.5, Gradle, JPA/Hibernate, Spring AI, Spring Security |
| 에이전트 | Go 1.24, 단일 바이너리, 런타임 의존성 없음 |
| 웹 | React 19, TypeScript, Vite 7, Ant Design 6 |
| 데이터베이스 | MySQL 8.0 |
| 캐시 | Redis 7 |

## 프로젝트 구조

```
easyshell/
├── easyshell-server/           # 중앙 관리 서버 (Java / Spring Boot)
├── easyshell-agent/            # 에이전트 클라이언트 (Go, 단일 바이너리)
├── easyshell-web/              # 웹 프론트엔드 (React + Ant Design)
├── docker-compose.yml          # 프로덕션 배포 (사전 빌드 이미지 풀링)
├── docker-compose.build.yml    # 개발 환경 (소스에서 로컬 빌드)
├── Dockerfile.server           # 서버 + 에이전트 멀티 스테이지 빌드
├── Dockerfile.web              # 웹 프론트엔드 멀티 스테이지 빌드
├── .github/workflows/          # CI/CD: Docker 이미지 빌드 및 게시
└── .env.example                # 환경 설정 템플릿
```

## 문서

**[docs.easyshell.ai](https://docs.easyshell.ai)**를 방문하여 다음 내용을 확인하세요:

- 설치 및 배포 가이드
- 시작하기 워크스루
- 구성 레퍼런스
- 개발 가이드

## 커뮤니티

[![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289da?logo=discord&logoColor=white)](https://discord.gg/WqFD9VQe)

지식 공유, 토론 및 업데이트를 위해 Discord 커뮤니티에 참여하세요:
**[https://discord.gg/WqFD9VQe](https://discord.gg/WqFD9VQe)**

## 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)에 따라 라이선스가 부여됩니다.
