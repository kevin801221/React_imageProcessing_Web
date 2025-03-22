# Casper 圖像處理應用程序

這是一個結合 Flask 後端和 React 前端的圖像處理應用程序，提供多種圖像處理功能，包括商品圖設計、知識庫管理、產品文案生成和圖片理解等。

## 項目結構

```
Casper_imageProcessing_APP/
├── app.py                # Flask 後端主應用程序
├── image_env/            # Python 虛擬環境
├── react-frontend/       # React 前端應用
│   ├── public/           # 靜態公共文件
│   ├── src/              # React 源代碼
│   └── package.json      # 前端依賴配置
├── static/               # 靜態資源
└── templates/            # Flask 模板
```

## 快速開始

請參閱 [前端安裝指南](./react-frontend/README.md) 獲取詳細的安裝和運行說明。

### 基本步驟

1. 克隆倉庫
2. 設置 Python 虛擬環境並安裝後端依賴
3. 安裝前端 Node.js 依賴
4. 啟動後端 Flask 服務器
5. 啟動前端 React 開發服務器

## 功能特點

- **商品圖設計**: 上傳圖片並應用設計參數生成商品圖
- **批量處理**: 一次處理多張圖片
- **知識庫管理**: 上傳和管理知識庫文件，並進行查詢
- **產品文案生成**: 基於輸入生成產品描述文案
- **圖片理解**: 分析上傳的圖片並生成描述
- **設置管理**: 管理應用程序設置和 API 密鑰

## 技術棧

### 後端
- Flask (Python)
- OpenCV
- NumPy
- Pillow

### 前端
- React
- React Router
- Axios
- Styled Components
- React Icons

## 許可

[MIT](https://choosealicense.com/licenses/mit/)
