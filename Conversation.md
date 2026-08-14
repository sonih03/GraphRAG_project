# 🚀 GitHub 원격 저장소 연결 및 푸시 가이드 (Step-by-Step)

이 문서는 현재 작업 중인 **GraphRAG Legal Interactive Presentation** 프로젝트를 깃허브(GitHub) 레포지토리와 연결하고 코드를 안전하게 관리/푸시하는 전체 과정을 상세하게 설명합니다.

---

## 📌 0. 사전 준비 (GitHub 레포지토리 생성)

1. [GitHub(github.com)](https://github.com/)에 로그인합니다.
2. 우측 상단의 **`+`** 버튼 클릭 ➡️ **`New repository`** 선택
3. 저장소 설정:
   - **Repository name**: `GraphRAG_project` (또는 원하는 이름)
   - **Public** 또는 **Private** 선택
   - ⚠️ **주의**: 아래 체크박스들(`Add a README file`, `Add .gitignore`, `Choose a license`)은 **모두 체크 해제(체크하지 않음)** 상태로 둡니다. (이미 로컬에 파일이 있으므로 충돌 방지)
4. 초록색 **`Create repository`** 버튼을 클릭합니다.
5. 생성된 페이지에 표시되는 **저장소 URL**(예: `https://github.com/내아이디/GraphRAG_project.git`)을 복사합니다.

---

## 💻 1. 로컬 터미널에서 Git 초기화 및 연결 (명령어)

터미널(PowerShell 또는 CMD)에서 프로젝트 루트 디렉토리(`c:\Python312\Inho_Projects\GraphRAG_project`)로 이동한 후, 아래 명령어를 차례대로 입력합니다.

### 1단계: Git 저장소 초기화
```bash
git init
```

### 2단계: 파일 스테이징 (Staging)
> `.gitignore`가 이미 설정되어 있어 `node_modules/`, `.next/`, `.env` 등의 불필요한 대용량 파일은 자동으로 제외됩니다.
```bash
git add .
```

### 3단계: 첫 번째 커밋 생성
```bash
git commit -m "feat: GraphRAG interactive 3D web platform initial commit"
```

### 4단계: 기본 브랜치 이름을 `main`으로 설정
```bash
git branch -M main
```

### 5단계: 원격 GitHub 저장소(Remote) 연결
> 복사해둔 본인의 GitHub 저장소 URL로 대체하여 입력하세요.
```bash
git remote add origin https://github.com/내아이디/GraphRAG_project.git
```

### 6단계: 코드를 GitHub에 최초 푸시 (Push)
```bash
git push -u origin main
```

---

## 🔐 2. GitHub 로그인/인증 요구 시 해결 방법

`git push` 실행 시 GitHub 인증 창이나 터미널 비밀번호 입력이 나올 수 있습니다.

### 방법 A: 브라우저 로그인 창 (가장 간편)
- 화면에 뜨는 `Sign in with your browser` 버튼을 클릭하여 웹 브라우저에서 인증을 완료합니다.

### 방법 B: Personal Access Token (토큰) 사용
만약 터미널에서 `Password`를 물어본다면 일반 비밀번호가 아닌 **Personal Access Token**을 입력해야 합니다:
1. GitHub ➡️ 우측 상단 프로필 ➡️ **Settings**
2. 좌측 맨 아래 **Developer settings** ➡️ **Personal access tokens** ➡️ **Tokens (classic)**
3. **Generate new token (classic)** 클릭
4. Note에 `GraphRAG_Token` 입력, Expiration(기간) 설정, **`repo`** 권한 체크 후 생성
5. 발급된 `ghp_...` 토큰 문자열을 복사하여 비밀번호 입력란에 붙여넣기합니다.

---

## 🔄 3. 이후 작업 시 일상적인 깃 사용법 (데일리 워크플로우)

새로운 기능을 개발하거나 코드를 수정한 후 GitHub에 업데이트할 때는 아래 **3줄 명령어**만 실행하시면 됩니다:

```bash
# 1. 변경된 파일 확인 (선택 사항)
git status

# 2. 모든 변경사항 담기
git add .

# 3. 커밋 메시지 작성
git commit -m "작업한 내용 요약 (예: fix: 3D sphere wave animation speed tuning)"

# 4. 깃허브로 업로드
git push
```

---

## 🛡️ 4. 보안 및 유지보수 팁

1. **API 키 보호**:
   - `GROQ_API_KEY`, `GEMINI_API_KEY` 등 비밀 키는 절대 코드에 직접 적지 말고 `.env` 파일에 보관하세요.
   - 루트의 `.gitignore` 파일에 이미 `*.env`가 등록되어 있어 GitHub에 유출되지 않습니다.
2. **원격 저장소 연결 확인 명령어**:
   ```bash
   git remote -v
   ```
   (정상적으로 `origin` 주소가 등록되었는지 확인할 수 있습니다.)
