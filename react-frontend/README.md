# Casper Plus React Frontend

這是 Casper Plus 應用程序的 React 前端實現。該項目將原始的 Flask 應用程序重構為使用 React 的現代前端架構。

## 項目結構

```
src/
├── assets/         # 靜態資源（圖像、字體等）
├── components/     # 可重用的 UI 組件
│   ├── Common/     # 通用組件
│   ├── DesignTool/ # 設計工具相關組件
│   └── Layout/     # 佈局相關組件
├── context/        # React Context 提供者
├── hooks/          # 自定義 React Hooks
├── pages/          # 頁面組件
├── services/       # API 服務和數據處理
└── utils/          # 工具函數和輔助方法
```

## 功能模塊

1. **商品圖設計** - 上傳圖片並應用設計參數生成商品圖
2. **知識庫管理** - 上傳和管理知識庫文件，並進行查詢
3. **產品文案生成** - 基於輸入生成產品描述文案
4. **圖片理解** - 分析上傳的圖片並生成描述
5. **設置管理** - 管理應用程序設置和 API 密鑰

## 完整安裝指南

### 前置需求

- Node.js (推薦 v16.x 或更高版本)
- Python 3.8 或更高版本
- pip (Python 包管理器)

### 安裝步驟

#### 1. 克隆倉庫

```bash
git clone https://github.com/你的用戶名/Casper_imageProcessing_APP.git
cd Casper_imageProcessing_APP
```

#### 2. 設置後端 (Flask)

```bash
# 創建並激活虛擬環境 (Windows)
python -m venv image_env
image_env\Scripts\activate

# 安裝後端依賴
pip install flask flask-cors pillow opencv-python numpy requests
```

#### 3. 設置前端 (React)

```bash
# 進入前端目錄
cd react-frontend

# 安裝前端依賴
npm install
```

### 運行應用

#### 1. 啟動後端服務器

在項目根目錄下:

```bash
# 確保虛擬環境已激活
image_env\Scripts\activate

# 啟動 Flask 服務器
python app.py
```

後端服務器將在 http://localhost:5001 上運行。

#### 2. 啟動前端開發服務器

在另一個終端窗口中，進入 react-frontend 目錄:

```bash
# 啟動 React 開發服務器
npm start
```

前端應用將在 http://localhost:3000 上運行。

### 可能的問題及解決方案

1. **Node.js 版本問題**: 如果遇到 OpenSSL 相關錯誤，可以嘗試使用 `--openssl-legacy-provider` 標誌啟動 (已在 package.json 中配置)。

2. **CORS 問題**: 如果前端無法連接到後端 API，請確保後端已正確配置 CORS。

3. **環境變量**: 前端使用 .env 文件配置某些行為，請確保此文件存在並包含必要的設置。

## 構建生產版本

### 前端構建

```bash
cd react-frontend
npm run build
```

構建後的文件將位於 `react-frontend/build` 目錄中。

### 部署建議

對於簡單部署，可以將前端構建文件複製到後端的 `static` 目錄，並配置 Flask 以提供這些文件。

## 後端 API

該前端應用程序與 Flask 後端 API 通信。主要 API 端點包括:

- `/api/process_image` - 處理和轉換圖像
- `/api/batch_process` - 批量處理多個圖像
- `/api/knowledge` - 知識庫管理
- `/api/generate_copy` - 生成產品文案
- `/api/image_understanding` - 分析和理解圖像內容

## 貢獻指南

歡迎提交問題報告和拉取請求。對於重大更改，請先開啟一個問題進行討論。

## 許可

[MIT](https://choosealicense.com/licenses/mit/)
