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

## 開發

### 安裝依賴

```bash
npm install
```

### 啟動開發服務器

```bash
npm start
```

### 構建生產版本

```bash
npm run build
```

## 後端 API

該前端應用程序與原始的 Flask 後端 API 通信。API 端點包括：

- `/api/upload` - 上傳圖片
- `/api/design` - 生成設計
- `/api/knowledge-files` - 獲取知識庫文件
- `/api/upload-knowledge-file` - 上傳知識庫文件
- `/api/knowledge-file/:id` - 刪除知識庫文件
- `/api/chat` - 聊天 API
- `/api/image-understanding` - 圖片理解 API
- `/api/settings` - 獲取/更新設置

## 技術棧

- React
- React Router
- Axios
- CSS Modules
- React Icons
- Styled Components
