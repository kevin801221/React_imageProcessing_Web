# Casper 圖像處理應用

這是一個基於 React 的圖像處理 Web 應用程序，提供多種圖像編輯功能，包括背景移除、濾鏡應用、圖像調整等。本應用程序旨在提供高效、直觀的圖像編輯體驗。

## 功能特點

- **背景移除**：一鍵去除圖像背景
- **濾鏡應用**：多種預設濾鏡效果
- **圖像調整**：調整亮度、對比度、飽和度等參數
- **圓角處理**：為圖像添加圓角效果
- **透明度調整**：調整圖像透明度
- **即時預覽**：所有編輯操作都可即時預覽
- **高性能渲染**：使用優化的 Canvas 渲染技術

## 技術棧

- **前端**：React.js、HTML5 Canvas
- **狀態管理**：React Hooks
- **性能優化**：React.memo、useCallback、requestAnimationFrame
- **樣式**：CSS3、Flexbox

## 安裝與啟動

### 前提條件

- Node.js (v14.0.0 或更高版本)
- npm (v6.0.0 或更高版本)

### 安裝步驟

1. 克隆倉庫到本地：

```bash
git clone https://github.com/kevin801221/Casper_imageProcessing_APP.git
cd Casper_imageProcessing_APP
```

2. 安裝依賴：

```bash
cd react-frontend
npm install
```

### 啟動應用

1. 啟動開發服務器：

```bash
npm start
```

2. 打開瀏覽器並訪問：

```
http://localhost:3000
```

## 使用指南

1. **上傳圖像**：點擊上傳按鈕或拖放圖像到指定區域
2. **選擇編輯功能**：從側邊欄選擇所需的編輯功能
3. **調整參數**：使用滑塊或輸入框調整參數
4. **背景移除**：點擊「移除背景」按鈕處理圖像
5. **下載結果**：編輯完成後，點擊下載按鈕保存結果

## 性能優化

本應用程序進行了多項性能優化：

- 使用 `React.memo` 和 `useCallback` 防止不必要的重新渲染
- 在 `ImageCanvas` 中實現了 `requestAnimationFrame` 以獲得更平滑的渲染
- 使用臨時畫布來提高圖像處理性能
- 優化了組件的加載和渲染邏輯

## 項目結構

```
react-frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── ImageEditor/
│   │   │   ├── BackgroundRemover.js
│   │   │   ├── BackgroundRemover.css
│   │   │   ├── ImageCanvas.js
│   │   │   └── ...
│   ├── pages/
│   │   ├── ImageEditorPage.js
│   │   ├── ImageEditorPage.css
│   │   └── ...
│   ├── App.js
│   └── index.js
└── package.json
```

## 開發者指南

### 添加新濾鏡

1. 在 `ImageCanvas.js` 文件中的 `applyFilter` 函數中添加新的濾鏡邏輯
2. 在 `ImageEditorPage.js` 中更新濾鏡選項列表

### 貢獻指南

1. Fork 倉庫
2. 創建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個 Pull Request

## 許可證

MIT

## 聯繫方式

如有任何問題或建議，請聯繫：kevin801221@gmail.com
