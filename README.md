![](https://img.shields.io/github/stars/Taichyng-team-4/tickTock-backend.svg)
｜![](https://img.shields.io/github/forks/Taichyng-team-4/tickTock-backend.svg)
｜![](https://img.shields.io/github/issues-pr/Taichyng-team-4/tickTock-backend.svg)
｜![](https://img.shields.io/github/issues/Taichyng-team-4/tickTock-backend.svg)


# Ticktock backend

## 環境要求

node >= 12

### 分支規則

1. 主分支命名 **`master`**。
2. 開發分支基於主分支，命名是 **`dev`**。
3. 個別功能開發分支，命名是 **`xxx`**。

### Commit

1. 新增功能：**`feat: add xxx feature`**
2. 修復錯誤：**`fix: fix xxx issue`**
3. 重構代碼：**`refactor: refactor xxx code`**
4. 優化代碼：**`optimize: optimize xxx code`**
5. 更新文檔：**`docs: update xxx doc`**
6. 增加測試：**`test: add xxx test`**
7. 增加依賴庫：**`deps: add xxx dependency`**
8. 格式化代碼：**`style: format xxx code`**
9. 提交注釋：**`chore: add xxx comment`**
10. 回滾代碼：**`revert: revert xxx commit`**

## 開發流程

- 分支個別功能開發
- 測試個別功能開發
- 發 PR，merge到dev主分支
- 發 PR，將dev分支merge到main分支

### 開發（API 撰寫）

1. 在 **`/controllers` `models` `routes`** 檔案夾新增對應功能
2. branch 命名方式 **`feature/xxxxx`**，xxxxx 為功能敘述，請記得用英文
3. commit 訊息為 **`feat: #number xxxxx`**，number 填 issue 號碼會自動 link 到單上，xxxxx 為補充資訊
4. 進入測試，有問題測試人員會開 bug ticket
5. 發 Pull Request


## Setup

```
npm i
```

## 專案運行

### dev
```
npm run start:dev
```

### prod
```
npm run start:prod
```

## Test

### Test Dev

```
npm run start test:dev
```

### Test Prod
```
npm test
```

## 環境變數設定

```env
APP_ENV = app執行模式
PORT = app 監聽port
SESSION_SECRECT = session密碼
SERVER_URL = 伺服器url

DB = db位置
DB_USER = db使用者名稱
DB_PASSWORD = db密碼

JWT_SECRECT = jwt密碼
JWT_EXPIRED_IN = jwt到期時間

// 產品模式 Email
EMAIL_HOST = host server url
EMAIL_PORT = host server port
EMAIL_USERNAME = Email provider 帳號
EMAIL_PASSWORD = Email provider 密碼
EMAIL_PROVIDER_ADDRESS = 寄件人

// 開發模式 Email
DEV_EMAIL_HOST = host server url
DEV_EMAIL_POST = host server port
DEV_EMAIL_USERNAME = mail provider 帳號
DEV_EMAIL_PASSWORD = Email provider 密碼
DEV_EMAIL_PROVIDER_ADDRESS = 寄件人

GOOGLE_CLIENT_ID = gcp 帳號
GOOGLE_CLIENT_SECRET = gcp 密碼
```

## 套件使用

Node.js v18.15.0
express.js V4.18.2
mongoose v7.0.5
vitest v0.30.1
pug v3.0.2
