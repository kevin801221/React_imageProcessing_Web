// // 增強版設計工具 JavaScript 文件
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('增強版設計工具JS已加載');
    
//     // 全局變量
//     let canvas = document.createElement('canvas');
//     let ctx = canvas.getContext('2d');
//     let canvasContainer = document.querySelector('.canvas');
//     let productImage = null;
//     let originalImage = null; // 保存原始圖像以便重置
//     let annotations = [];
//     let currentTool = 'pen';
//     let currentColor = '#FF0000';
//     let currentLineWidth = 2;
//     let currentLineStyle = 'solid';
//     let isDrawing = false;
//     let startX, startY;
//     let currentAnnotation = null;
//     let textElements = []; // 保存添加的文字元素
//     let selectedTextElement = null;
//     let currentFilter = 'none';
    
//     // 圖像設置參數
//     let imageSettings = {
//         brightness: 0,
//         contrast: 0,
//         shadow: 0,
//         saturation: 0,
//         clarity: 0,
//         whiteBalance: 0,
//         flipH: false,
//         flipV: false
//     };
    
//     // 初始化畫布
//     function initCanvas() {
//         console.log('正在初始化畫布...');
        
//         // 獲取畫布容器尺寸
//         const containerWidth = canvasContainer.clientWidth;
//         const containerHeight = canvasContainer.clientHeight;
        
//         console.log('畫布容器尺寸:', containerWidth, 'x', containerHeight);
        
//         // 設置畫布尺寸
//         canvas.width = containerWidth;
//         canvas.height = containerHeight;
//         canvas.id = 'design-canvas';
        
//         // 設置畫布樣式
//         canvas.style.position = 'absolute';
//         canvas.style.top = '0';
//         canvas.style.left = '0';
//         canvas.style.zIndex = '10';
        
//         // 添加畫布到容器
//         canvasContainer.appendChild(canvas);
        
//         // 清除畫布
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         console.log('畫布初始化完成，尺寸:', canvas.width, 'x', canvas.height);
//     }
    
//     // 加載產品圖片
//     function loadProductImage(src) {
//         console.log('正在加載圖片:', src);
        
//         // 確保路徑正確（如果是相對路徑，添加基礎URL）
//         if (src && !src.startsWith('http') && !src.startsWith('data:')) {
//             // 使用當前網站的基礎URL
//             const baseUrl = window.location.origin;
//             src = baseUrl + src;
//             console.log('完整圖片URL:', src);
//         }
       
//         return new Promise((resolve, reject) => {
//             const img = new Image();
           
//             img.onload = () => {
//                 console.log('圖片加載成功，尺寸:', img.width, 'x', img.height);
//                 productImage = img;
                
//                 // 保存原始圖像
//                 originalImage = new Image();
//                 originalImage.src = img.src;
                
//                 // 隱藏上傳佔位符
//                 const placeholder = document.getElementById('upload-placeholder');
//                 if (placeholder) placeholder.style.display = 'none';
               
//                 // 重置圖像設置
//                 resetImageSettings();
                
//                 // 重繪畫布以顯示圖片
//                 drawAnnotations();
                
//                 // 初始化濾鏡預覽
//                 initFilterPreviews();
                
//                 resolve(img);
//             };
           
//             img.onerror = (e) => {
//                 console.error('圖片加載失敗:', e);
//                 console.error('嘗試加載的URL:', src);
//                 reject(e);
//             };
           
//             img.src = src;
//         });
//     }
    
//     // 初始化濾鏡預覽
//     function initFilterPreviews() {
//         if (!productImage) return;
        
//         const filters = [
//             { id: 'filter-none', filter: 'none' },
//             { id: 'filter-grayscale', filter: 'grayscale' },
//             { id: 'filter-sepia', filter: 'sepia' },
//             { id: 'filter-vintage', filter: 'vintage' },
//             { id: 'filter-cold', filter: 'cold' },
//             { id: 'filter-warm', filter: 'warm' }
//         ];
        
//         // 創建一個離屏畫布來生成濾鏡預覽
//         const previewCanvas = document.createElement('canvas');
//         const previewCtx = previewCanvas.getContext('2d');
//         previewCanvas.width = 120;
//         previewCanvas.height = 80;
        
//         filters.forEach(item => {
//             const img = document.getElementById(item.id);
//             if (img) {
//                 // 繪製縮略圖並應用濾鏡
//                 drawImageWithFilter(previewCtx, productImage, item.filter, previewCanvas.width, previewCanvas.height);
//                 img.src = previewCanvas.toDataURL();
//             }
//         });
//     }
    
//     // 繪製帶濾鏡的圖像
//     function drawImageWithFilter(context, image, filter, width, height) {
//         // 清除畫布
//         context.clearRect(0, 0, width, height);
        
//         // 計算縮放以適應畫布
//         const scale = Math.min(width / image.width, height / image.height);
//         const w = image.width * scale;
//         const h = image.height * scale;
//         const x = (width - w) / 2;
//         const y = (height - h) / 2;
        
//         // 繪製圖像
//         context.drawImage(image, x, y, w, h);
        
//         // 應用濾鏡
//         applyFilter(context, filter, 0, 0, width, height);
//     }
    
//     // 應用濾鏡效果
//     function applyFilter(context, filter, x, y, width, height) {
//         if (filter === 'none') return;
        
//         const imageData = context.getImageData(x, y, width, height);
//         const data = imageData.data;
        
//         switch (filter) {
//             case 'grayscale':
//                 for (let i = 0; i < data.length; i += 4) {
//                     const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
//                     data[i] = data[i + 1] = data[i + 2] = avg;
//                 }
//                 break;
                
//             case 'sepia':
//                 for (let i = 0; i < data.length; i += 4) {
//                     const r = data[i];
//                     const g = data[i + 1];
//                     const b = data[i + 2];
//                     data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
//                     data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
//                     data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
//                 }
//                 break;
                
//             case 'vintage':
//                 for (let i = 0; i < data.length; i += 4) {
//                     data[i] = Math.min(255, data[i] * 1.2);
//                     data[i + 2] = Math.max(0, data[i + 2] * 0.8);
//                 }
//                 break;
                
//             case 'cold':
//                 for (let i = 0; i < data.length; i += 4) {
//                     data[i] = Math.max(0, data[i] * 0.8);
//                     data[i + 2] = Math.min(255, data[i + 2] * 1.2);
//                 }
//                 break;
                
//             case 'warm':
//                 for (let i = 0; i < data.length; i += 4) {
//                     data[i] = Math.min(255, data[i] * 1.1);
//                     data[i + 1] = Math.min(255, data[i + 1] * 1.05);
//                     data[i + 2] = Math.max(0, data[i + 2] * 0.9);
//                 }
//                 break;
//         }
        
//         context.putImageData(imageData, x, y);
//     }
    
//     // 繪製所有標註
//     function drawAnnotations() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         // 繪製產品圖片（如果有的話）
//         if (productImage) {
//             console.log('開始繪製圖片，原始尺寸:', productImage.width, 'x', productImage.height);
            
//             const maxWidth = canvas.width * 0.8;
//             const maxHeight = canvas.height * 0.8;
            
//             let width = productImage.width;
//             let height = productImage.height;
            
//             if (width > maxWidth) {
//                 const ratio = maxWidth / width;
//                 width = maxWidth;
//                 height = height * ratio;
//             }
            
//             if (height > maxHeight) {
//                 const ratio = maxHeight / height;
//                 height = height * ratio;
//                 width = width * ratio;
//             }
            
//             const x = (canvas.width - width) / 2;
//             const y = (canvas.height - height) / 2;
            
//             console.log('繪製圖片在畫布上，位置:', x, y, '尺寸:', width, 'x', height);
            
//             try {
//                 // 應用翻轉
//                 ctx.save();
//                 ctx.translate(x + width / 2, y + height / 2);
//                 if (imageSettings.flipH) ctx.scale(-1, 1);
//                 if (imageSettings.flipV) ctx.scale(1, -1);
//                 ctx.drawImage(productImage, -width / 2, -height / 2, width, height);
//                 ctx.restore();
                
//                 // 應用濾鏡和其他影像處理
//                 if (currentFilter !== 'none' || 
//                     imageSettings.brightness !== 0 || 
//                     imageSettings.contrast !== 0 || 
//                     imageSettings.saturation !== 0 || 
//                     imageSettings.shadow !== 0 || 
//                     imageSettings.clarity !== 0 || 
//                     imageSettings.whiteBalance !== 0) {
                    
//                     // 提取圖像區域
//                     const imgData = ctx.getImageData(x, y, width, height);
                    
//                     // 應用亮度、對比度等調整
//                     applyImageAdjustments(imgData.data, imgData.width, imgData.height);
                    
//                     // 應用濾鏡
//                     applyFilter(ctx, currentFilter, x, y, width, height);
                    
//                     // 將處理後的圖像放回畫布
//                     ctx.putImageData(imgData, x, y);
//                 }
                
//                 console.log('圖片繪製成功');
//             } catch (error) {
//                 console.error('繪製圖片時出錯:', error);
//             }
//         } else {
//             console.warn('沒有產品圖片可繪製');
//         }
        
//         // 繪製所有標註
//         annotations.forEach(anno => {
//             drawAnnotation(ctx, anno);
//         });
//     }
    
//     // 應用圖像調整（亮度、對比度等）
//     function applyImageAdjustments(data, width, height) {
//         const brightness = imageSettings.brightness / 100;
//         const contrast = imageSettings.contrast / 100;
//         const saturation = imageSettings.saturation / 100 + 1;
//         const shadow = imageSettings.shadow / 100;
//         const clarity = imageSettings.clarity / 100;
//         const whiteBalance = imageSettings.whiteBalance / 100;
        
//         for (let i = 0; i < data.length; i += 4) {
//             // 提取RGB值
//             let r = data[i];
//             let g = data[i + 1];
//             let b = data[i + 2];
            
//             // 亮度調整
//             if (brightness !== 0) {
//                 r += 255 * brightness;
//                 g += 255 * brightness;
//                 b += 255 * brightness;
//             }
            
//             // 對比度調整
//             if (contrast !== 0) {
//                 const factor = (259 * (contrast + 1)) / (255 * (1 - contrast));
//                 r = factor * (r - 128) + 128;
//                 g = factor * (g - 128) + 128;
//                 b = factor * (b - 128) + 128;
//             }
            
//             // 飽和度調整
//             if (saturation !== 1) {
//                 const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
//                 r = gray + saturation * (r - gray);
//                 g = gray + saturation * (g - gray);
//                 b = gray + saturation * (b - gray);
//             }
            
//             // 陰影調整（暗部細節）
//             if (shadow !== 0) {
//                 const luminance = 0.2989 * r + 0.5870 * g + 0.1140 * b;
//                 if (luminance < 128) {
//                     const shadowFactor = 1 + shadow;
//                     r *= shadowFactor;
//                     g *= shadowFactor;
//                     b *= shadowFactor;
//                 }
//             }
            
//             // 白平衡調整（色溫）
//             if (whiteBalance !== 0) {
//                 if (whiteBalance > 0) {
//                     // 偏暖（增加紅色減少藍色）
//                     r += whiteBalance * 30;
//                     b -= whiteBalance * 30;
//                 } else {
//                     // 偏冷（增加藍色減少紅色）
//                     r -= Math.abs(whiteBalance) * 30;
//                     b += Math.abs(whiteBalance) * 30;
//                 }
//             }
            
//             // 清晰度調整（簡單的對鄰近像素的對比度增強）
//             if (clarity !== 0 && i % (width * 4) !== 0 && i % (width * 4) !== (width - 1) * 4) {
//                 const sharpness = 1 + Math.abs(clarity);
//                 const ix = i / 4 % width;
//                 const iy = Math.floor(i / 4 / width);
                
//                 if (ix > 0 && ix < width - 1 && iy > 0 && iy < height - 1) {
//                     const centerR = r;
//                     const centerG = g;
//                     const centerB = b;
                    
//                     if (clarity > 0) {
//                         r = r * sharpness - (data[i - 4] + data[i + 4] + data[i - width * 4] + data[i + width * 4]) / 4 * (sharpness - 1);
//                         g = g * sharpness - (data[i - 3] + data[i + 5] + data[i - width * 4 + 1] + data[i + width * 4 + 1]) / 4 * (sharpness - 1);
//                         b = b * sharpness - (data[i - 2] + data[i + 6] + data[i - width * 4 + 2] + data[i + width * 4 + 2]) / 4 * (sharpness - 1);
//                     }
//                 }
//             }
            
//             // 確保值在0-255範圍內
//             data[i] = Math.max(0, Math.min(255, Math.round(r)));
//             data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
//             data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
//         }
//     }
    
//     // 重置圖像設置
//     function resetImageSettings() {
//         imageSettings = {
//             brightness: 0,
//             contrast: 0,
//             shadow: 0,
//             saturation: 0,
//             clarity: 0,
//             whiteBalance: 0,
//             flipH: false,
//             flipV: false
//         };
        
//         currentFilter = 'none';
        
//         // 重置所有滑塊
//         document.querySelectorAll('.adjustment-slider').forEach(slider => {
//             slider.value = 0;
//             const valueDisplay = slider.nextElementSibling;
//             if (valueDisplay) valueDisplay.textContent = '0';
//         });
        
//         // 重置濾鏡選擇
//         document.querySelectorAll('.filter-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         const noneFilter = document.querySelector('.filter-item[data-filter="none"]');
//         if (noneFilter) noneFilter.classList.add('active');
        
//         // 使用原始圖像重新繪製
//         if (originalImage) {
//             productImage = originalImage;
//             drawAnnotations();
//         }
//     }
    
//     // 繪製虛線
//     function drawDashedLine(ctx, x1, y1, x2, y2, dashLength) {
//         const dx = x2 - x1;
//         const dy = y2 - y1;
//         const dist = Math.sqrt(dx * dx + dy * dy);
//         const nx = dx / dist;
//         const ny = dy / dist;
        
//         let dashCount = Math.floor(dist / dashLength);
//         let dashX = x1;
//         let dashY = y1;
        
//         ctx.beginPath();
//         for (let i = 0; i < dashCount; i += 2) {
//             ctx.moveTo(dashX, dashY);
//             dashX += nx * dashLength;
//             dashY += ny * dashLength;
//             ctx.lineTo(dashX, dashY);
            
//             dashX += nx * dashLength;
//             dashY += ny * dashLength;
//         }
//         ctx.stroke();
//     }
    
//     // 繪製點線
//     function drawDottedLine(ctx, x1, y1, x2, y2, dotSize) {
//         const dx = x2 - x1;
//         const dy = y2 - y1;
//         const dist = Math.sqrt(dx * dx + dy * dy);
//         const nx = dx / dist;
//         const ny = dy / dist;
        
//         const spacing = dotSize * 3;
//         let dotCount = Math.floor(dist / spacing);
//         let dotX = x1;
//         let dotY = y1;
        
//         for (let i = 0; i < dotCount; i++) {
//             ctx.beginPath();
//             ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
//             ctx.fill();
            
//             dotX += nx * spacing;
//             dotY += ny * spacing;
//         }
        
//         // 確保最後一個點
//         ctx.beginPath();
//         ctx.arc(x2, y2, dotSize / 2, 0, Math.PI * 2);
//         ctx.fill();
//     }
    
//     // 繪製箭頭
//     function drawArrow(ctx, x1, y1, x2, y2, color, width) {
//         // 繪製主線
//         ctx.beginPath();
//         ctx.moveTo(x1, y1);
//         ctx.lineTo(x2, y2);
//         ctx.stroke();
        
//         // 計算箭頭方向
//         const dx = x2 - x1;
//         const dy = y2 - y1;
//         const dist = Math.sqrt(dx * dx + dy * dy);
        
//         if (dist === 0) return;
        
//         const nx = dx / dist;
//         const ny = dy / dist;
        
//         // 箭頭大小
//         const arrowSize = width * 5;
        
//         // 計算箭頭的兩個點
//         const p1x = x2 - arrowSize * nx + arrowSize * ny;
//         const p1y = y2 - arrowSize * ny - arrowSize * nx;
//         const p2x = x2 - arrowSize * nx - arrowSize * ny;
//         const p2y = y2 - arrowSize * ny + arrowSize * nx;
        
//         // 繪製箭頭
//         ctx.beginPath();
//         ctx.moveTo(x2, y2);
//         ctx.lineTo(p1x, p1y);
//         ctx.lineTo(p2x, p2y);
//         ctx.closePath();
//         ctx.fillStyle = color;
//         ctx.fill();
//     }
    
//     // 添加文字到畫布
//     function addText(text, x, y, fontFamily, fontSize, color, isBold, isItalic, isUnderline) {
//         // 創建一個文字容器
//         const textDiv = document.createElement('div');
//         textDiv.className = 'draggable-text';
//         textDiv.style.left = x + 'px';
//         textDiv.style.top = y + 'px';
//         textDiv.style.fontFamily = fontFamily;
//         textDiv.style.fontSize = fontSize + 'px';
//         textDiv.style.color = color;
//         textDiv.style.fontWeight = isBold ? 'bold' : 'normal';
//         textDiv.style.fontStyle = isItalic ? 'italic' : 'normal';
//         textDiv.style.textDecoration = isUnderline ? 'underline' : 'none';
//         textDiv.textContent = text;
        
//         // 設置可拖動
//         textDiv.addEventListener('mousedown', startDragText);
        
//         // 添加到畫布容器
//         canvasContainer.appendChild(textDiv);
        
//         // 添加到文字元素列表
//         textElements.push({
//             element: textDiv,
//             text: text,
//             x: x,
//             y: y,
//             fontFamily: fontFamily,
//             fontSize: fontSize,
//             color: color,
//             isBold: isBold,
//             isItalic: isItalic,
//             isUnderline: isUnderline
//         });
        
//         return textDiv;
//     }
    
//     // 開始拖動文字
//     function startDragText(e) {
//         e.preventDefault();
        
//         // 取消之前選中的文字
//         if (selectedTextElement) {
//             selectedTextElement.classList.remove('selected');
//         }
        
//         // 選中當前文字
//         this.classList.add('selected');
//         selectedTextElement = this;
        
//         // 設置拖動初始位置
//         const startPosX = e.clientX;
//         const startPosY = e.clientY;
//         const startLeft = parseInt(this.style.left);
//         const startTop = parseInt(this.style.top);
        
//         // 拖動移動處理函數
//         function dragMove(e) {
//             const newLeft = startLeft + (e.clientX - startPosX);
//             const newTop = startTop + (e.clientY - startPosY);
//             selectedTextElement.style.left = newLeft + 'px';
//             selectedTextElement.style.top = newTop + 'px';
//         }
        
//         // 拖動結束處理函數
//         function dragEnd(e) {
//             document.removeEventListener('mousemove', dragMove);
//             document.removeEventListener('mouseup', dragEnd);
//         }
        
//         // 添加事件監聽
//         document.addEventListener('mousemove', dragMove);
//         document.addEventListener('mouseup', dragEnd);
//     }
    
//     // 開始繪製
//     function startDrawing(e) {
//         isDrawing = true;
//         const rect = canvas.getBoundingClientRect();
//         startX = e.clientX - rect.left;
//         startY = e.clientY - rect.top;
        
//         // 如果當前工具是文字，則打開文字編輯對話框
//         if (currentTool === 'text') {
//             isDrawing = false;
//             openTextDialog(startX, startY);
//             return;
//         }
        
//         // 創建新註釋
//         currentAnnotation = {
//             type: currentTool,
//             points: [{ x: startX, y: startY }],
//             color: currentColor,
//             width: currentLineWidth,
//             style: currentLineStyle
//         };
        
//         // 添加到註釋列表
//         annotations.push(currentAnnotation);
//     }
    
//     // 繪製
//     function draw(e) {
//         if (!isDrawing) return;
        
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
        
//         // 更新當前註釋
//         if (currentTool === 'pen') {
//             currentAnnotation.points.push({ x, y });
//         } else {
//             // 對於線條、箭頭和尺規，我們只需要起點和終點
//             if (currentAnnotation.points.length > 1) {
//                 currentAnnotation.points.pop();
//             }
//             currentAnnotation.points.push({ x, y });
//         }
        
//         // 重新繪製所有註釋
//         drawAnnotations();
//     }
    
//     // 停止繪製
//     function stopDrawing() {
//         isDrawing = false;
//         currentAnnotation = null;
//     }
    
//     // 打開文字編輯對話框
//     function openTextDialog(x, y) {
//         const dialog = document.getElementById('text-edit-dialog');
//         dialog.dataset.x = x;
//         dialog.dataset.y = y;
//         dialog.style.display = 'flex';
        
//         // 重置表單
//         document.getElementById('text-input').value = '';
//         document.getElementById('font-family').value = 'Arial';
//         document.getElementById('font-size').value = '24';
//         document.getElementById('text-color').value = '#000000';
//         document.getElementById('bold-text').checked = false;
//         document.getElementById('italic-text').checked = false;
//         document.getElementById('underline-text').checked = false;
//     }
    
//     // 添加文字按鈕點擊事件
//     function addTextFromDialog() {
//         const dialog = document.getElementById('text-edit-dialog');
//         const x = parseInt(dialog.dataset.x);
//         const y = parseInt(dialog.dataset.y);
        
//         const text = document.getElementById('text-input').value;
//         if (!text.trim()) {
//             showMessage('請輸入文字內容', 'warning');
//             return;
//         }
        
//         const fontFamily = document.getElementById('font-family').value;
//         const fontSize = parseInt(document.getElementById('font-size').value);
//         const color = document.getElementById('text-color').value;
//         const isBold = document.getElementById('bold-text').checked;
//         const isItalic = document.getElementById('italic-text').checked;
//         const isUnderline = document.getElementById('underline-text').checked;
        
//         // 添加文字到畫布
//         addText(text, x, y, fontFamily, fontSize, color, isBold, isItalic, isUnderline);
        
//         // 關閉對話框
//         dialog.style.display = 'none';
//     }
    
//     // 繪製單個註釋
//     function drawAnnotation(ctx, annotation) {
//         const { type, color, width, style, points } = annotation;
        
//         ctx.strokeStyle = color;
//         ctx.lineWidth = width;
        
//         // 設置線條樣式
//         if (style === 'dashed') {
//             ctx.setLineDash([5, 5]);
//         } else if (style === 'dotted') {
//             ctx.setLineDash([2, 2]);
//         } else {
//             ctx.setLineDash([]);
//         }
        
//         ctx.beginPath();
        
//         if (type === 'pen') {
//             // 繪製自由曲線
//             if (points.length > 0) {
//                 ctx.moveTo(points[0].x, points[0].y);
//                 for (let i = 1; i < points.length; i++) {
//                     ctx.lineTo(points[i].x, points[i].y);
//                 }
//             }
//         } else if (type === 'line' || type === 'arrow' || type === 'ruler') {
//             // 繪製直線
//             if (points.length >= 2) {
//                 ctx.moveTo(points[0].x, points[0].y);
//                 ctx.lineTo(points[1].x, points[1].y);
                
//                 // 如果是箭頭，添加箭頭
//                 if (type === 'arrow') {
//                     drawArrow(ctx, points[0].x, points[0].y, points[1].x, points[1].y, color, width);
//                 }
                
//                 // 如果是尺規，添加測量標記
//                 if (type === 'ruler') {
//                     // 繪製主線
//                     ctx.moveTo(points[0].x, points[0].y);
//                     ctx.lineTo(points[1].x, points[1].y);
//                     ctx.stroke();
                    
//                     // 計算長度
//                     const length = Math.sqrt((points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2);
//                     const lengthText = `${Math.round(length)} cm`;
                    
//                     // 計算文字位置 (線的中點)
//                     const midX = (points[0].x + points[1].x) / 2;
//                     const midY = (points[0].y + points[1].y) / 2;
                    
//                     // 繪製文字背景
//                     ctx.font = '14px Arial';
//                     const textWidth = ctx.measureText(lengthText).width;
//                     ctx.fillStyle = 'white';
//                     ctx.fillRect(midX - textWidth / 2 - 5, midY - 10, textWidth + 10, 20);
                    
//                     // 繪製文字
//                     ctx.fillStyle = color;
//                     ctx.textAlign = 'center';
//                     ctx.textBaseline = 'middle';
//                     ctx.fillText(lengthText, midX, midY);
//                 }
//             }
//         }
        
//         ctx.stroke();
//         ctx.setLineDash([]);
//     }
    
//     // 清除所有標註
//     function clearAnnotations() {
//         annotations = [];
//         // 清除所有文字元素
//         textElements.forEach(item => {
//             if (item.element && item.element.parentNode) {
//                 item.element.parentNode.removeChild(item.element);
//             }
//         });
//         textElements = [];
//         selectedTextElement = null;
        
//         drawAnnotations();
//     }
    
//     // 保存圖像
//     function saveImage() {
//         console.log('嘗試保存圖像...');
//         // 創建一個臨時畫布來合併圖像和標註
//         const tempCanvas = document.createElement('canvas');
//         tempCanvas.width = canvas.width;
//         tempCanvas.height = canvas.height;
//         const tempCtx = tempCanvas.getContext('2d');
        
//         // 繪製白色背景
//         tempCtx.fillStyle = 'white';
//         tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
//         // 複製當前畫布內容（包含圖片和標註）
//         tempCtx.drawImage(canvas, 0, 0);
        
//         // 添加文字元素
//         textElements.forEach(item => {
//             tempCtx.font = (item.isBold ? 'bold ' : '') + 
//                             (item.isItalic ? 'italic ' : '') + 
//                             item.fontSize + 'px ' + item.fontFamily;
//             tempCtx.fillStyle = item.color;
//             tempCtx.textBaseline = 'top';
//             tempCtx.fillText(item.text, parseInt(item.element.style.left), parseInt(item.element.style.top));
            
//             if (item.isUnderline) {
//                 const textWidth = tempCtx.measureText(item.text).width;
//                 tempCtx.beginPath();
//                 tempCtx.moveTo(parseInt(item.element.style.left), parseInt(item.element.style.top) + item.fontSize);
//                 tempCtx.lineTo(parseInt(item.element.style.left) + textWidth, parseInt(item.element.style.top) + item.fontSize);
//                 tempCtx.strokeStyle = item.color;
//                 tempCtx.lineWidth = 1;
//                 tempCtx.stroke();
//             }
//         });
        
//         // 將畫布轉換為 base64 圖像數據
//         const imageData = tempCanvas.toDataURL('image/png');
        
//         // 顯示消息
//         showMessage('正在保存圖像...', 'info');
        
//         // 發送到服務器
//         fetch('/api/save_design', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ image_data: imageData })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 showMessage('圖片已成功保存！', 'success');
//                 console.log('保存的文件 URL:', data.file_url);
//             } else {
//                 showMessage('保存圖片失敗: ' + data.error, 'error');
//             }
//         })
//         .catch(error => {
//             showMessage('保存圖片時發生錯誤: ' + error, 'error');
//         });
        
//         // 同時保存標註數據
//         saveAnnotations();
//     }
    
//     // 保存標註數據
//     function saveAnnotations() {
//         const annotationsData = {
//             annotations: annotations,
//             textElements: textElements.map(item => ({
//                 text: item.text,
//                 x: parseInt(item.element.style.left),
//                 y: parseInt(item.element.style.top),
//                 fontFamily: item.fontFamily,
//                 fontSize: item.fontSize,
//                 color: item.color,
//                 isBold: item.isBold,
//                 isItalic: item.isItalic,
//                 isUnderline: item.isUnderline
//             })),
//             imageSettings: imageSettings,
//             currentFilter: currentFilter
//         };
        
//         fetch('/api/annotations', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(annotationsData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 console.log('標註數據已保存:', data.file_path);
//             } else {
//                 console.error('保存標註數據失敗:', data.error);
//             }
//         })
//         .catch(error => {
//             console.error('保存標註數據時發生錯誤:', error);
//         });
//     }
    
//     // 上傳圖片
//     function uploadImage(file) {
//         console.log('開始上傳圖片:', file.name);
        
//         // 顯示上傳中消息
//         showMessage('圖片上傳中...', 'info');
        
//         const formData = new FormData();
//         formData.append('file', file);
        
//         console.log('準備發送上傳請求');
        
//         // 發送上傳請求
//         fetch('/api/upload', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => {
//             console.log('上傳響應狀態:', response.status);
//             if (!response.ok) {
//                 throw new Error('上傳請求失敗');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('上傳響應數據:', data);
//             if (data.success) {
//                 // 加載上傳的圖片
//                 loadProductImage(data.file_path)
//                     .then(() => {
//                         console.log('圖片加載成功');
//                         // 清除標註
//                         annotations = [];
//                         // 清除文字元素
//                         textElements.forEach(item => {
//                             if (item.element && item.element.parentNode) {
//                                 item.element.parentNode.removeChild(item.element);
//                             }
//                         });
//                         textElements = [];
//                         selectedTextElement = null;
                        
//                         // 重置圖像設置
//                         resetImageSettings();
                        
//                         // 重繪畫布
//                         drawAnnotations();
                        
//                         // 顯示成功消息
//                         showMessage('圖片上傳成功', 'success');
//                     })
//                     .catch(error => {
//                         console.error('加載上傳圖片失敗:', error);
//                         showMessage('圖片上傳成功，但加載失敗', 'error');
//                     });
//             } else {
//                 console.error('上傳失敗:', data.message);
//                 showMessage('上傳失敗: ' + (data.message || '未知錯誤'), 'error');
//             }
//         })
//         .catch(error => {
//             console.error('上傳錯誤:', error);
//             showMessage('上傳過程中發生錯誤', 'error');
//         });
//     }
    
//     // 顯示消息提示
//     function showMessage(message, type = 'info') {
//         console.log(`顯示消息: ${message} (類型: ${type})`);
        
//         // 獲取或創建消息容器
//         let messageContainer = document.getElementById('message-container');
//         if (!messageContainer) {
//             messageContainer = document.createElement('div');
//             messageContainer.id = 'message-container';
//             messageContainer.className = 'message-container';
//             document.body.appendChild(messageContainer);
//             console.log('創建了新的消息容器');
//         }
        
//         // 創建消息元素
//         const messageElement = document.createElement('div');
//         messageElement.className = `message ${type}`;
//         messageElement.textContent = message;
        
//         // 添加到容器
//         messageContainer.appendChild(messageElement);
//         console.log('消息已添加到容器');
        
//         // 自動移除消息
//         setTimeout(() => {
//             messageElement.classList.add('fade-out');
//             setTimeout(() => {
//                 if (messageContainer.contains(messageElement)) {
//                     messageContainer.removeChild(messageElement);
//                     console.log('消息已移除');
//                 }
//             }, 500);
//         }, 5000);
//     }
    
//     // 水平翻轉圖片
//     function flipHorizontal() {
//         if (!productImage) return;
        
//         imageSettings.flipH = !imageSettings.flipH;
//         drawAnnotations();
        
//         showMessage('已水平翻轉圖片', 'info');
//     }
    
//     // 垂直翻轉圖片
//     function flipVertical() {
//         if (!productImage) return;
        
//         imageSettings.flipV = !imageSettings.flipV;
//         drawAnnotations();
        
//         showMessage('已垂直翻轉圖片', 'info');
//     }
    
//     // 應用濾鏡
//     function applySelectedFilter(filterName) {
//         if (!productImage) return;
        
//         currentFilter = filterName;
//         drawAnnotations();
        
//         // 更新UI
//         document.querySelectorAll('.filter-item').forEach(item => {
//             item.classList.remove('active');
//         });
//         const filterItem = document.querySelector(`.filter-item[data-filter="${filterName}"]`);
//         if (filterItem) filterItem.classList.add('active');
        
//         showMessage(`已應用${filterName === 'none' ? '無' : filterName}濾鏡`, 'info');
//     }
    
//     // 初始化事件監聽器
//     function initEventListeners() {
//         console.log('初始化事件監聽器...');
        
//         // 畫布鼠標事件
//         canvas.addEventListener('mousedown', startDrawing);
//         canvas.addEventListener('mousemove', draw);
//         canvas.addEventListener('mouseup', stopDrawing);
//         canvas.addEventListener('mouseout', stopDrawing);
        
//         // 工具選擇
//         const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');
//         toolButtons.forEach(button => {
//             button.addEventListener('click', function() {
//                 // 移除所有工具按鈕的活動狀態
//                 toolButtons.forEach(btn => btn.classList.remove('active'));
//                 // 添加當前按鈕的活動狀態
//                 this.classList.add('active');
//                 // 設置當前工具
//                 currentTool = this.getAttribute('data-tool');
//                 console.log('選擇了工具:', currentTool);
//             });
//         });
        
//         // 顏色選擇器
//         const colorPicker = document.querySelector('.color-picker');
//         if (colorPicker) {
//             colorPicker.addEventListener('input', function() {
//                 currentColor = this.value;
//                 console.log('選擇了顏色:', currentColor);
//             });
//         }
        
//         // 清除按鈕
//         const clearBtn = document.querySelector('.clear-btn');
//         if (clearBtn) {
//             clearBtn.addEventListener('click', function() {
//                 console.log('清除所有標註');
//                 clearAnnotations();
//             });
//         } else {
//             console.warn('未找到清除按鈕');
//         }
        
//         // 保存按鈕
//         const saveBtn = document.querySelector('.save-btn');
//         if (saveBtn) {
//             saveBtn.addEventListener('click', function() {
//                 console.log('保存設計');
//                 saveImage();
//             });
//         } else {
//             console.warn('未找到保存按鈕');
//         }
        
//         // 上傳按鈕
//         const uploadBtn = document.getElementById('upload-button');
//         if (uploadBtn) {
//             console.log('找到上傳按鈕，添加事件監聽');
//             uploadBtn.addEventListener('click', function(e) {
//                 console.log('上傳按鈕被點擊');
//                 // 創建文件輸入元素
//                 const fileInput = document.createElement('input');
//                 fileInput.type = 'file';
//                 fileInput.accept = 'image/*';
                
//                 // 添加變更監聽器
//                 fileInput.addEventListener('change', function() {
//                     if (this.files && this.files[0]) {
//                         console.log('選擇了文件:', this.files[0].name);
//                         uploadImage(this.files[0]);
//                     }
//                 });
                
//                 // 模擬點擊打開文件選擇器
//                 fileInput.click();
//             });
//         } else {
//             console.error('未找到上傳按鈕 (ID: upload-button)');
//         }
        
//         // 水平翻轉按鈕
//         const flipHBtn = document.getElementById('flip-horizontal');
//         if (flipHBtn) {
//             flipHBtn.addEventListener('click', flipHorizontal);
//         }
        
//         // 垂直翻轉按鈕
//         const flipVBtn = document.getElementById('flip-vertical');
//         if (flipVBtn) {
//             flipVBtn.addEventListener('click', flipVertical);
//         }
        
//         // 重置按鈕
//         const resetBtn = document.getElementById('reset-image');
//         if (resetBtn) {
//             resetBtn.addEventListener('click', resetImageSettings);
//         }
        
//         // 圖像調整滑塊
//         const adjustmentSliders = document.querySelectorAll('.adjustment-slider');
//         adjustmentSliders.forEach(slider => {
//             slider.addEventListener('input', function() {
//                 // 獲取滑塊ID並更新相應的設置
//                 const sliderId = this.id;
//                 const value = parseInt(this.value);
                
//                 // 更新滑塊值顯示
//                 const valueDisplay = this.nextElementSibling;
//                 if (valueDisplay) valueDisplay.textContent = value;
                
//                 switch (sliderId) {
//                     case 'brightness-slider':
//                         imageSettings.brightness = value;
//                         break;
//                     case 'contrast-slider':
//                         imageSettings.contrast = value;
//                         break;
//                     case 'shadow-slider':
//                         imageSettings.shadow = value;
//                         break;
//                     case 'saturation-slider':
//                         imageSettings.saturation = value;
//                         break;
//                     case 'clarity-slider':
//                         imageSettings.clarity = value;
//                         break;
//                     case 'whitebalance-slider':
//                         imageSettings.whiteBalance = value;
//                         break;
//                 }
                
//                 // 重繪畫布
//                 drawAnnotations();
//             });
//         });
        
//         // 濾鏡選擇
//         const filterItems = document.querySelectorAll('.filter-item');
//         filterItems.forEach(item => {
//             item.addEventListener('click', function() {
//                 const filterName = this.getAttribute('data-filter');
//                 applySelectedFilter(filterName);
//             });
//         });
        
//         // 文字對話框
//         const addTextBtn = document.querySelector('.add-text-btn');
//         if (addTextBtn) {
//             addTextBtn.addEventListener('click', addTextFromDialog);
//         }
        
//         const closeTextDialogBtn = document.querySelector('#text-edit-dialog .close-dialog');
//         const cancelTextBtn = document.querySelector('#text-edit-dialog .cancel-btn');
        
//         if (closeTextDialogBtn) {
//             closeTextDialogBtn.addEventListener('click', function() {
//                 document.getElementById('text-edit-dialog').style.display = 'none';
//             });
//         }
        
//         if (cancelTextBtn) {
//             cancelTextBtn.addEventListener('click', function() {
//                 document.getElementById('text-edit-dialog').style.display = 'none';
//             });
//         }
        
//         // 大上傳按鈕（在佔位符中）
//         const uploadBtnLarge = document.getElementById('upload-button-large');
//         if (uploadBtnLarge) {
//             console.log('找到大上傳按鈕，添加事件監聽');
//             uploadBtnLarge.addEventListener('click', function(e) {
//                 console.log('大上傳按鈕被點擊');
//                 // 創建文件輸入元素
//                 const fileInput = document.createElement('input');
//                 fileInput.type = 'file';
//                 fileInput.accept = 'image/*';
                
//                 // 添加變更監聽器
//                 fileInput.addEventListener('change', function() {
//                     if (this.files && this.files[0]) {
//                         console.log('選擇了文件:', this.files[0].name);
//                         uploadImage(this.files[0]);
//                     }
//                 });
                
//                 // 模擬點擊打開文件選擇器
//                 fileInput.click();
//             });
//         } else {
//             console.log('未找到大上傳按鈕 (ID: upload-button-large)');
//         }
        
//         // 直接文件輸入元素
//         const directFileInput = document.getElementById('direct-file-input');
//         if (directFileInput) {
//             console.log('找到直接文件輸入元素，添加事件監聽');
//             directFileInput.addEventListener('change', function() {
//                 if (this.files && this.files[0]) {
//                     console.log('通過直接輸入選擇了文件:', this.files[0].name);
//                     uploadImage(this.files[0]);
//                 }
//             });
//         } else {
//             console.log('未找到直接文件輸入元素 (ID: direct-file-input)');
//         }
        
//         console.log('事件監聽器初始化完成');
//     }
    
//     // 啟動應用
//     function init() {
//         console.log('初始化應用...');
        
//         // 初始化畫布
//         initCanvas();
        
//         // 加載示例圖片
//         loadProductImage('/api/placeholder/400/320')
//             .then(() => {
//                 drawAnnotations();
//             })
//             .catch(error => {
//                 console.error('加載示例圖片失敗:', error);
//                 showMessage('無法加載示例圖片', 'error');
//             });
        
//         // 初始化事件監聽器
//         initEventListeners();
        
//         console.log('應用初始化完成');
//     }
    
//     // 公開全局函數
//     window.showMessage = showMessage;
//     window.uploadImage = uploadImage;
    
//     // 啟動應用
//     init();
// });

// 設計工具 JavaScript 文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('設計工具JS已加載');
    
    // 全局變量
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let canvasContainer = document.querySelector('.canvas');
    let productImage = null;
    let originalImage = null; // 保存原始圖像以便重置
    let annotations = [];
    let currentTool = 'pen';
    let currentColor = '#FF0000';
    let currentLineWidth = 2;
    let currentLineStyle = 'solid';
    let isDrawing = false;
    let startX, startY;
    let currentAnnotation = null;
    let textElements = []; // 保存添加的文字元素
    let selectedTextElement = null;
    let currentFilter = 'none';
    
    // 圖像設置參數
    let imageSettings = {
        brightness: 0,
        contrast: 0,
        shadow: 0,
        saturation: 0,
        clarity: 0,
        whiteBalance: 0,
        flipH: false,
        flipV: false
    };
    
    // 初始化畫布
    function initCanvas() {
        console.log('正在初始化畫布...');
        
        // 獲取畫布容器尺寸
        const containerWidth = canvasContainer.clientWidth;
        const containerHeight = canvasContainer.clientHeight;
        
        console.log('畫布容器尺寸:', containerWidth, 'x', containerHeight);
        
        // 設置畫布尺寸
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        canvas.id = 'design-canvas';
        
        // 設置畫布樣式
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '10';
        
        // 添加畫布到容器
        canvasContainer.appendChild(canvas);
        
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        console.log('畫布初始化完成，尺寸:', canvas.width, 'x', canvas.height);
    }
    
    // 加載產品圖片
    function loadProductImage(src) {
        console.log('正在加載圖片:', src);
        
        // 確保路徑正確（如果是相對路徑，添加基礎URL）
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            // 使用當前網站的基礎URL
            const baseUrl = window.location.origin;
            src = baseUrl + src;
            console.log('完整圖片URL:', src);
        }
       
        return new Promise((resolve, reject) => {
            const img = new Image();
           
            img.onload = () => {
                console.log('圖片加載成功，尺寸:', img.width, 'x', img.height);
                productImage = img;
                
                // 保存原始圖像
                originalImage = new Image();
                originalImage.src = img.src;
                
                // 隱藏上傳佔位符
                const placeholder = document.getElementById('upload-placeholder');
                if (placeholder) placeholder.style.display = 'none';
               
                // 重置圖像設置
                resetImageSettings();
                
                // 重繪畫布以顯示圖片
                drawAnnotations();
                
                // 初始化濾鏡預覽
                initFilterPreviews();
                
                resolve(img);
            };
           
            img.onerror = (e) => {
                console.error('圖片加載失敗:', e);
                console.error('嘗試加載的URL:', src);
                reject(e);
            };
           
            img.src = src;
        });
    }
    
    // 初始化濾鏡預覽
    function initFilterPreviews() {
        console.log('初始化濾鏡預覽');
        if (!productImage) {
            console.log('沒有產品圖像，使用預設圖像');
            // 如果還沒有產品圖像，先加載一個預設圖像來生成濾鏡預覽
            const defaultImg = new Image();
            defaultImg.onload = function() {
                generateFilterPreviews(this);
            };
            defaultImg.onerror = function() {
                console.error('無法加載預設圖像');
            };
            defaultImg.src = '/api/placeholder/120/80';
        } else {
            console.log('使用已加載的產品圖像');
            generateFilterPreviews(productImage);
        }
    }
    
    // 生成濾鏡預覽圖像
    function generateFilterPreviews(image) {
        console.log('生成濾鏡預覽');
        const filters = [
            { id: 'filter-none', filter: 'none' },
            { id: 'filter-grayscale', filter: 'grayscale' },
            { id: 'filter-sepia', filter: 'sepia' },
            { id: 'filter-vintage', filter: 'vintage' },
            { id: 'filter-cold', filter: 'cold' },
            { id: 'filter-warm', filter: 'warm' }
        ];
        
        // 創建一個離屏畫布來生成濾鏡預覽
        const previewCanvas = document.createElement('canvas');
        const previewCtx = previewCanvas.getContext('2d');
        previewCanvas.width = 120;
        previewCanvas.height = 80;
        
        filters.forEach(item => {
            const img = document.getElementById(item.id);
            if (img) {
                console.log(`生成 ${item.filter} 濾鏡預覽`);
                // 清除畫布
                previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
                
                // 繪製圖像
                const scale = Math.min(previewCanvas.width / image.width, previewCanvas.height / image.height);
                const w = image.width * scale;
                const h = image.height * scale;
                const x = (previewCanvas.width - w) / 2;
                const y = (previewCanvas.height - h) / 2;
                
                previewCtx.drawImage(image, x, y, w, h);
                
                // 應用濾鏡
                applyFilterToPreview(previewCtx, item.filter, previewCanvas.width, previewCanvas.height);
                
                // 設置預覽圖像
                img.src = previewCanvas.toDataURL();
            } else {
                console.warn(`找不到ID為 ${item.id} 的元素`);
            }
        });
    }
    
    // 為預覽應用濾鏡效果
    function applyFilterToPreview(context, filter, width, height) {
        if (filter === 'none') return;
        
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        switch (filter) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;
                
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                }
                break;
                
            case 'vintage':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);
                    data[i + 2] = Math.max(0, data[i + 2] * 0.8);
                }
                break;
                
            case 'cold':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.max(0, data[i] * 0.8);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.2);
                }
                break;
                
            case 'warm':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.1);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.05);
                    data[i + 2] = Math.max(0, data[i + 2] * 0.9);
                }
                break;
        }
        
        context.putImageData(imageData, 0, 0);
    }
    
    // 繪製帶濾鏡的圖像
    function drawImageWithFilter(context, image, filter, width, height) {
        // 清除畫布
        context.clearRect(0, 0, width, height);
        
        // 計算縮放以適應畫布
        const scale = Math.min(width / image.width, height / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        
        // 繪製圖像
        context.drawImage(image, x, y, w, h);
        
        // 應用濾鏡
        applyFilter(context, filter, 0, 0, width, height);
    }
    
    // 繪製所有標註
    function drawAnnotations() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 繪製產品圖片（如果有的話）
        if (productImage) {
            console.log('開始繪製圖片，原始尺寸:', productImage.width, 'x', productImage.height);
            
            const maxWidth = canvas.width * 0.8;
            const maxHeight = canvas.height * 0.8;
            
            let width = productImage.width;
            let height = productImage.height;
            
            if (width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = height * ratio;
            }
            
            if (height > maxHeight) {
                const ratio = maxHeight / height;
                height = height * ratio;
                width = width * ratio;
            }
            
            const x = (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;
            
            console.log('繪製圖片在畫布上，位置:', x, y, '尺寸:', width, 'x', height);
            
            try {
                // 應用翻轉
                ctx.save();
                ctx.translate(x + width / 2, y + height / 2);
                if (imageSettings.flipH) ctx.scale(-1, 1);
                if (imageSettings.flipV) ctx.scale(1, -1);
                ctx.drawImage(productImage, -width / 2, -height / 2, width, height);
                ctx.restore();
                
                // 應用濾鏡和其他影像處理
                if (currentFilter !== 'none' || 
                    imageSettings.brightness !== 0 || 
                    imageSettings.contrast !== 0 || 
                    imageSettings.saturation !== 0 || 
                    imageSettings.shadow !== 0 || 
                    imageSettings.clarity !== 0 || 
                    imageSettings.whiteBalance !== 0) {
                    
                    // 提取圖像區域
                    const imgData = ctx.getImageData(x, y, width, height);
                    
                    // 應用亮度、對比度等調整
                    applyImageAdjustments(imgData.data, imgData.width, imgData.height);
                    
                    // 應用濾鏡
                    applyFilter(ctx, currentFilter, x, y, width, height);
                    
                    // 將處理後的圖像放回畫布
                    ctx.putImageData(imgData, x, y);
                }
                
                console.log('圖片繪製成功');
            } catch (error) {
                console.error('繪製圖片時出錯:', error);
            }
        } else {
            console.warn('沒有產品圖片可繪製');
        }
        
        // 繪製所有標註
        annotations.forEach(anno => {
            drawAnnotation(ctx, anno);
        });
    }
    
    // 應用濾鏡效果
    function applyFilter(ctx, filter, x, y, width, height) {
        if (filter === 'none') return;
        
        try {
            const imageData = ctx.getImageData(x, y, width, height);
            const data = imageData.data;
            
            switch (filter) {
                case 'grayscale':
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = data[i + 1] = data[i + 2] = avg;
                    }
                    break;
                    
                case 'sepia':
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                    }
                    break;
                    
                case 'vintage':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = Math.min(255, data[i] * 1.2);
                        data[i + 2] = Math.max(0, data[i + 2] * 0.8);
                    }
                    break;
                    
                case 'cold':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = Math.max(0, data[i] * 0.8);
                        data[i + 2] = Math.min(255, data[i + 2] * 1.2);
                    }
                    break;
                    
                case 'warm':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = Math.min(255, data[i] * 1.1);
                        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
                        data[i + 2] = Math.max(0, data[i + 2] * 0.9);
                    }
                    break;
            }
            
            ctx.putImageData(imageData, x, y);
        } catch (error) {
            console.error('應用濾鏡時出錯:', error);
        }
    }
    
    // 應用圖像調整（亮度、對比度等）
    function applyImageAdjustments(data, width, height) {
        const brightness = imageSettings.brightness / 100;
        const contrast = imageSettings.contrast / 100;
        const saturation = imageSettings.saturation / 100 + 1;
        const shadow = imageSettings.shadow / 100;
        const clarity = imageSettings.clarity / 100;
        const whiteBalance = imageSettings.whiteBalance / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            // 提取RGB值
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // 亮度調整
            if (brightness !== 0) {
                r += 255 * brightness;
                g += 255 * brightness;
                b += 255 * brightness;
            }
            
            // 對比度調整
            if (contrast !== 0) {
                const factor = (259 * (contrast + 1)) / (255 * (1 - contrast));
                r = factor * (r - 128) + 128;
                g = factor * (g - 128) + 128;
                b = factor * (b - 128) + 128;
            }
            
            // 飽和度調整
            if (saturation !== 1) {
                const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
                r = gray + saturation * (r - gray);
                g = gray + saturation * (g - gray);
                b = gray + saturation * (b - gray);
            }
            
            // 陰影調整（暗部細節）
            if (shadow !== 0) {
                const luminance = 0.2989 * r + 0.5870 * g + 0.1140 * b;
                if (luminance < 128) {
                    const shadowFactor = 1 + shadow;
                    r *= shadowFactor;
                    g *= shadowFactor;
                    b *= shadowFactor;
                }
            }
            
            // 白平衡調整（色溫）
            if (whiteBalance !== 0) {
                if (whiteBalance > 0) {
                    // 偏暖（增加紅色減少藍色）
                    r += whiteBalance * 30;
                    b -= whiteBalance * 30;
                } else {
                    // 偏冷（增加藍色減少紅色）
                    r -= Math.abs(whiteBalance) * 30;
                    b += Math.abs(whiteBalance) * 30;
                }
            }
            
            // 清晰度調整（簡單的對鄰近像素的對比度增強）
            if (clarity !== 0 && i % (width * 4) !== 0 && i % (width * 4) !== (width - 1) * 4) {
                const sharpness = 1 + Math.abs(clarity);
                const ix = i / 4 % width;
                const iy = Math.floor(i / 4 / width);
                
                if (ix > 0 && ix < width - 1 && iy > 0 && iy < height - 1) {
                    const centerR = r;
                    const centerG = g;
                    const centerB = b;
                    
                    if (clarity > 0) {
                        r = r * sharpness - (data[i - 4] + data[i + 4] + data[i - width * 4] + data[i + width * 4]) / 4 * (sharpness - 1);
                        g = g * sharpness - (data[i - 3] + data[i + 5] + data[i - width * 4 + 1] + data[i + width * 4 + 1]) / 4 * (sharpness - 1);
                        b = b * sharpness - (data[i - 2] + data[i + 6] + data[i - width * 4 + 2] + data[i + width * 4 + 2]) / 4 * (sharpness - 1);
                    }
                }
            }
            
            // 確保值在0-255範圍內
            data[i] = Math.max(0, Math.min(255, Math.round(r)));
            data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
            data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
        }
    }
    
    // 重置圖像設置
    function resetImageSettings() {
        imageSettings = {
            brightness: 0,
            contrast: 0,
            shadow: 0,
            saturation: 0,
            clarity: 0,
            whiteBalance: 0,
            flipH: false,
            flipV: false
        };
        
        currentFilter = 'none';
        
        // 重置所有滑塊
        document.querySelectorAll('.adjustment-slider').forEach(slider => {
            slider.value = 0;
            const valueDisplay = slider.nextElementSibling;
            if (valueDisplay) valueDisplay.textContent = '0';
        });
        
        // 重置濾鏡選擇
        document.querySelectorAll('.filter-item').forEach(item => {
            item.classList.remove('active');
        });
        const noneFilter = document.querySelector('.filter-item[data-filter="none"]');
        if (noneFilter) noneFilter.classList.add('active');
        
        // 使用原始圖像重新繪製
        if (originalImage) {
            productImage = new Image();
            productImage.src = originalImage.src;
            productImage.onload = function() {
                drawAnnotations();
            };
        }
        
        showMessage('已重置圖像設置', 'info');
    }
    
    // 繪製虛線
    function drawDashedLine(ctx, x1, y1, x2, y2, dashLength) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / dist;
        const ny = dy / dist;
        
        let dashCount = Math.floor(dist / dashLength);
        let dashX = x1;
        let dashY = y1;
        
        ctx.beginPath();
        for (let i = 0; i < dashCount; i += 2) {
            ctx.moveTo(dashX, dashY);
            dashX += nx * dashLength;
            dashY += ny * dashLength;
            ctx.lineTo(dashX, dashY);
            
            dashX += nx * dashLength;
            dashY += ny * dashLength;
        }
        ctx.stroke();
    }
    
    // 繪製點線
    function drawDottedLine(ctx, x1, y1, x2, y2, dotSize) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / dist;
        const ny = dy / dist;
        
        const spacing = dotSize * 3;
        let dotCount = Math.floor(dist / spacing);
        let dotX = x1;
        let dotY = y1;
        
        for (let i = 0; i < dotCount; i++) {
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            dotX += nx * spacing;
            dotY += ny * spacing;
        }
        
        // 確保最後一個點
        ctx.beginPath();
        ctx.arc(x2, y2, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 繪製箭頭
    function drawArrow(ctx, x1, y1, x2, y2, color, width) {
        // 繪製主線
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // 計算箭頭方向
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) return;
        
        const nx = dx / dist;
        const ny = dy / dist;
        
        // 箭頭大小
        const arrowSize = width * 5;
        
        // 計算箭頭的兩個點
        const p1x = x2 - arrowSize * nx + arrowSize * ny;
        const p1y = y2 - arrowSize * ny - arrowSize * nx;
        const p2x = x2 - arrowSize * nx - arrowSize * ny;
        const p2y = y2 - arrowSize * ny + arrowSize * nx;
        
        // 繪製箭頭
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // 添加文字到畫布
    function addText(text, x, y, fontFamily, fontSize, color, isBold, isItalic, isUnderline) {
        // 創建一個文字容器
        const textDiv = document.createElement('div');
        textDiv.className = 'draggable-text';
        textDiv.style.left = x + 'px';
        textDiv.style.top = y + 'px';
        textDiv.style.fontFamily = fontFamily;
        textDiv.style.fontSize = fontSize + 'px';
        textDiv.style.color = color;
        textDiv.style.fontWeight = isBold ? 'bold' : 'normal';
        textDiv.style.fontStyle = isItalic ? 'italic' : 'normal';
        textDiv.style.textDecoration = isUnderline ? 'underline' : 'none';
        textDiv.textContent = text;
        
        // 設置可拖動
        textDiv.addEventListener('mousedown', startDragText);
        
        // 添加到畫布容器
        canvasContainer.appendChild(textDiv);
        
        // 添加到文字元素列表
        textElements.push({
            element: textDiv,
            text: text,
            x: x,
            y: y,
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: color,
            isBold: isBold,
            isItalic: isItalic,
            isUnderline: isUnderline
        });
        
        return textDiv;
    }
    
    // 開始拖動文字
    function startDragText(e) {
        e.preventDefault();
        
        // 取消之前選中的文字
        if (selectedTextElement) {
            selectedTextElement.classList.remove('selected');
        }
        
        // 選中當前文字
        this.classList.add('selected');
        selectedTextElement = this;
        
        // 設置拖動初始位置
        const startPosX = e.clientX;
        const startPosY = e.clientY;
        const startLeft = parseInt(this.style.left) || 0;
        const startTop = parseInt(this.style.top) || 0;
        
        // 拖動移動處理函數
        function dragMove(e) {
            const newLeft = startLeft + (e.clientX - startPosX);
            const newTop = startTop + (e.clientY - startPosY);
            selectedTextElement.style.left = newLeft + 'px';
            selectedTextElement.style.top = newTop + 'px';
        }
        
        // 拖動結束處理函數
        function dragEnd(e) {
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        }
        
        // 添加事件監聽
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    }
    
    // 開始繪製
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        // 如果當前工具是文字，則打開文字編輯對話框
        if (currentTool === 'text') {
            isDrawing = false;
            openTextDialog(startX, startY);
            return;
        }
        
        // 創建新註釋
        currentAnnotation = {
            type: currentTool,
            points: [{ x: startX, y: startY }],
            color: currentColor,
            width: currentLineWidth,
            style: currentLineStyle
        };
        
        // 添加到註釋列表
        annotations.push(currentAnnotation);
    }
    
    // 繪製
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 更新當前註釋
        if (currentTool === 'pen') {
            currentAnnotation.points.push({ x, y });
        } else {
            // 對於線條、箭頭和尺規，我們只需要起點和終點
            if (currentAnnotation.points.length > 1) {
                currentAnnotation.points.pop();
            }
            currentAnnotation.points.push({ x, y });
        }
        
        // 重新繪製所有註釋
        drawAnnotations();
    }
    
    // 停止繪製
    function stopDrawing() {
        isDrawing = false;
        currentAnnotation = null;
    }
    
    // 打開文字編輯對話框
    function openTextDialog(x, y) {
        const dialog = document.getElementById('text-edit-dialog');
        if (!dialog) {
            console.error('找不到文字編輯對話框元素');
            return;
        }
        
        dialog.dataset.x = x;
        dialog.dataset.y = y;
        dialog.style.display = 'flex';
        
        // 重置表單
        const textInput = document.getElementById('text-input');
        if (textInput) textInput.value = '';
        
        const fontFamily = document.getElementById('font-family');
        if (fontFamily) fontFamily.value = 'Arial';
        
        const fontSize = document.getElementById('font-size');
        if (fontSize) fontSize.value = '24';
        
        const textColor = document.getElementById('text-color');
        if (textColor) textColor.value = '#000000';
        
        const boldText = document.getElementById('bold-text');
        if (boldText) boldText.checked = false;
        
        const italicText = document.getElementById('italic-text');
        if (italicText) italicText.checked = false;
        
        const underlineText = document.getElementById('underline-text');
        if (underlineText) underlineText.checked = false;
    }
    
    // 添加文字按鈕點擊事件
    function addTextFromDialog() {
        const dialog = document.getElementById('text-edit-dialog');
        const x = parseInt(dialog.dataset.x) || 0;
        const y = parseInt(dialog.dataset.y) || 0;
        
        const textInput = document.getElementById('text-input');
        const text = textInput ? textInput.value : '';
        
        if (!text.trim()) {
            showMessage('請輸入文字內容', 'warning');
            return;
        }
        
        const fontFamily = document.getElementById('font-family');
        const fontSize = document.getElementById('font-size');
        const textColor = document.getElementById('text-color');
        const boldText = document.getElementById('bold-text');
        const italicText = document.getElementById('italic-text');
        const underlineText = document.getElementById('underline-text');
        
        // 添加文字到畫布
        addText(
            text, 
            x, 
            y, 
            fontFamily ? fontFamily.value : 'Arial', 
            fontSize ? parseInt(fontSize.value) : 24, 
            textColor ? textColor.value : '#000000', 
            boldText ? boldText.checked : false, 
            italicText ? italicText.checked : false, 
            underlineText ? underlineText.checked : false
        );
        
        // 關閉對話框
        dialog.style.display = 'none';
    }
    
    // 繪製單個註釋
    function drawAnnotation(ctx, annotation) {
        const { type, color, width, style, points } = annotation;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        
        // 設置線條樣式
        if (style === 'dashed') {
            ctx.setLineDash([5, 5]);
        } else if (style === 'dotted') {
            ctx.setLineDash([2, 2]);
        } else {
            ctx.setLineDash([]);
        }
        
        ctx.beginPath();
        
        if (type === 'pen') {
            // 繪製自由曲線
            if (points.length > 0) {
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
            }
        } else if (type === 'line' || type === 'arrow' || type === 'ruler') {
            // 繪製直線
            if (points.length >= 2) {
                ctx.moveTo(points[0].x, points[0].y);
                ctx.lineTo(points[1].x, points[1].y);
                
                // 如果是箭頭，添加箭頭
                if (type === 'arrow') {
                    drawArrow(ctx, points[0].x, points[0].y, points[1].x, points[1].y, color, width);
                }
                
                // 如果是尺規，添加測量標記
                if (type === 'ruler') {
                    // 繪製主線
                    ctx.moveTo(points[0].x, points[0].y);
                    ctx.lineTo(points[1].x, points[1].y);
                    ctx.stroke();
                    
                    // 計算長度
                    const length = Math.sqrt((points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2);
                    const lengthText = `${Math.round(length)} cm`;
                    
                    // 計算文字位置 (線的中點)
                    const midX = (points[0].x + points[1].x) / 2;
                    const midY = (points[0].y + points[1].y) / 2;
                    
                    // 繪製文字背景
                    ctx.font = '14px Arial';
                    const textWidth = ctx.measureText(lengthText).width;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(midX - textWidth / 2 - 5, midY - 10, textWidth + 10, 20);
                    
                    // 繪製文字
                    ctx.fillStyle = color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(lengthText, midX, midY);
                }
            }
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // 清除所有標註
    function clearAnnotations() {
        annotations = [];
        // 清除所有文字元素
        textElements.forEach(item => {
            if (item.element && item.element.parentNode) {
                item.element.parentNode.removeChild(item.element);
            }
        });
        textElements = [];
        selectedTextElement = null;
        
        drawAnnotations();
    }
    
    // 保存圖像
    function saveImage() {
        console.log('嘗試保存圖像...');
        // 創建一個臨時畫布來合併圖像和標註
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // 繪製白色背景
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // 複製當前畫布內容（包含圖片和標註）
        tempCtx.drawImage(canvas, 0, 0);
        
        // 添加文字元素
        textElements.forEach(item => {
            tempCtx.font = (item.isBold ? 'bold ' : '') + 
                            (item.isItalic ? 'italic ' : '') + 
                            item.fontSize + 'px ' + item.fontFamily;
            tempCtx.fillStyle = item.color;
            tempCtx.textBaseline = 'top';
            tempCtx.fillText(item.text, parseInt(item.element.style.left), parseInt(item.element.style.top));
            
            if (item.isUnderline) {
                const textWidth = tempCtx.measureText(item.text).width;
                tempCtx.beginPath();
                tempCtx.moveTo(parseInt(item.element.style.left), parseInt(item.element.style.top) + item.fontSize);
                tempCtx.lineTo(parseInt(item.element.style.left) + textWidth, parseInt(item.element.style.top) + item.fontSize);
                tempCtx.strokeStyle = item.color;
                tempCtx.lineWidth = 1;
                tempCtx.stroke();
            }
        });
        
        // 將畫布轉換為 base64 圖像數據
        const imageData = tempCanvas.toDataURL('image/png');
        
        // 顯示消息
        showMessage('正在保存圖像...', 'info');
        
        // 發送到服務器
        fetch('/api/save_design', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_data: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('圖片已成功保存！', 'success');
                console.log('保存的文件 URL:', data.file_url);
            } else {
                showMessage('保存圖片失敗: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showMessage('保存圖片時發生錯誤: ' + error, 'error');
        });
        
        // 同時保存標註數據
        saveAnnotations();
    }
    
    // 保存標註數據
    function saveAnnotations() {
        const annotationsData = {
            annotations: annotations,
            textElements: textElements.map(item => ({
                text: item.text,
                x: parseInt(item.element.style.left),
                y: parseInt(item.element.style.top),
                fontFamily: item.fontFamily,
                fontSize: item.fontSize,
                color: item.color,
                isBold: item.isBold,
                isItalic: item.isItalic,
                isUnderline: item.isUnderline
            })),
            imageSettings: imageSettings,
            currentFilter: currentFilter
        };
        
        fetch('/api/annotations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(annotationsData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('標註數據已保存:', data.file_path);
            } else {
                console.error('保存標註數據失敗:', data.error);
            }
        })
        .catch(error => {
            console.error('保存標註數據時發生錯誤:', error);
        });
    }
    
    // 上傳圖片
    function uploadImage(file) {
        console.log('開始上傳圖片:', file.name);
        
        // 顯示上傳中消息
        showMessage('圖片上傳中...', 'info');
        
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('準備發送上傳請求');
        
        // 發送上傳請求
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('上傳響應狀態:', response.status);
            if (!response.ok) {
                throw new Error('上傳請求失敗');
            }
            return response.json();
        })
        .then(data => {
            console.log('上傳響應數據:', data);
            if (data.success) {
                // 加載上傳的圖片
                loadProductImage(data.file_path)
                    .then(() => {
                        console.log('圖片加載成功');
                        // 清除標註
                        annotations = [];
                        // 清除文字元素
                        textElements.forEach(item => {
                            if (item.element && item.element.parentNode) {
                                item.element.parentNode.removeChild(item.element);
                            }
                        });
                        textElements = [];
                        selectedTextElement = null;
                        
                        // 重置圖像設置
                        resetImageSettings();
                        
                        // 重繪畫布
                        drawAnnotations();
                        
                        // 顯示成功消息
                        showMessage('圖片上傳成功', 'success');
                    })
                    .catch(error => {
                        console.error('加載上傳圖片失敗:', error);
                        showMessage('圖片上傳成功，但加載失敗', 'error');
                    });
            } else {
                console.error('上傳失敗:', data.message);
                showMessage('上傳失敗: ' + (data.message || '未知錯誤'), 'error');
            }
        })
        .catch(error => {
            console.error('上傳錯誤:', error);
            showMessage('上傳過程中發生錯誤', 'error');
        });
    }
    
    // 顯示消息提示
    function showMessage(message, type = 'info') {
        console.log(`顯示消息: ${message} (類型: ${type})`);
        
        // 獲取或創建消息容器
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.className = 'message-container';
            document.body.appendChild(messageContainer);
            console.log('創建了新的消息容器');
        }
        
        // 創建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // 添加到容器
        messageContainer.appendChild(messageElement);
        console.log('消息已添加到容器');
        
        // 自動移除消息
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                if (messageContainer.contains(messageElement)) {
                    messageContainer.removeChild(messageElement);
                    console.log('消息已移除');
                }
            }, 500);
        }, 5000);
    }
    
    // 水平翻轉圖片
    function flipHorizontal() {
        if (!productImage) return;
        
        imageSettings.flipH = !imageSettings.flipH;
        drawAnnotations();
        
        showMessage('已水平翻轉圖片', 'info');
    }
    
    // 垂直翻轉圖片
    function flipVertical() {
        if (!productImage) return;
        
        imageSettings.flipV = !imageSettings.flipV;
        drawAnnotations();
        
        showMessage('已垂直翻轉圖片', 'info');
    }
    
    // 設置濾鏡監聽器
    function setupFilterListeners() {
        console.log('設置濾鏡監聽器');
        document.querySelectorAll('.filter-item').forEach(item => {
            item.addEventListener('click', function() {
                const filterName = this.getAttribute('data-filter');
                console.log('選擇濾鏡:', filterName);
                
                // 更新選擇狀態
                document.querySelectorAll('.filter-item').forEach(el => {
                    el.classList.remove('active');
                });
                this.classList.add('active');
                
                // 應用濾鏡
                currentFilter = filterName;
                drawAnnotations(); // 重繪畫布
                
                showMessage(`已應用${filterName === 'none' ? '無' : filterName}濾鏡`, 'info');
            });
        });
    }
    
    // 初始化事件監聽器
    function initEventListeners() {
        console.log('初始化事件監聽器...');
        
        // 畫布鼠標事件
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // 工具選擇
        const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 移除所有工具按鈕的活動狀態
                toolButtons.forEach(btn => btn.classList.remove('active'));
                // 添加當前按鈕的活動狀態
                this.classList.add('active');
                // 設置當前工具
                currentTool = this.getAttribute('data-tool');
                console.log('選擇了工具:', currentTool);
            });
        });
        
        // 顏色選擇器
        const colorPicker = document.querySelector('.color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('input', function() {
                currentColor = this.value;
                console.log('選擇了顏色:', currentColor);
            });
        }
        
        // 清除按鈕
        const clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                console.log('清除所有標註');
                clearAnnotations();
            });
        } else {
            console.warn('未找到清除按鈕');
        }
        
        // 保存按鈕
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                console.log('保存設計');
                saveImage();
            });
        } else {
            console.warn('未找到保存按鈕');
        }
        
        // 上傳按鈕
        const uploadBtn = document.getElementById('upload-button');
        if (uploadBtn) {
            console.log('找到上傳按鈕，添加事件監聽');
            uploadBtn.addEventListener('click', function(e) {
                console.log('上傳按鈕被點擊');
                // 創建文件輸入元素
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                
                // 添加變更監聽器
                fileInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
                        console.log('選擇了文件:', this.files[0].name);
                        uploadImage(this.files[0]);
                    }
                });
                
                // 模擬點擊打開文件選擇器
                fileInput.click();
            });
        } else {
            console.error('未找到上傳按鈕 (ID: upload-button)');
        }
        
        // 水平翻轉按鈕
        const flipHBtn = document.getElementById('flip-horizontal');
        if (flipHBtn) {
            flipHBtn.addEventListener('click', flipHorizontal);
        }
        
        // 垂直翻轉按鈕
        const flipVBtn = document.getElementById('flip-vertical');
        if (flipVBtn) {
            flipVBtn.addEventListener('click', flipVertical);
        }
        
        // 重置按鈕
        const resetBtn = document.getElementById('reset-image');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetImageSettings);
        }
        
        // 圖像調整滑塊
        const adjustmentSliders = document.querySelectorAll('.adjustment-slider');
        adjustmentSliders.forEach(slider => {
            slider.addEventListener('input', function() {
                // 獲取滑塊ID並更新相應的設置
                const sliderId = this.id;
                const value = parseInt(this.value);
                
                // 更新滑塊值顯示
                const valueDisplay = this.nextElementSibling;
                if (valueDisplay) valueDisplay.textContent = value;
                
                switch (sliderId) {
                    case 'brightness-slider':
                        imageSettings.brightness = value;
                        break;
                    case 'contrast-slider':
                        imageSettings.contrast = value;
                        break;
                    case 'shadow-slider':
                        imageSettings.shadow = value;
                        break;
                    case 'saturation-slider':
                        imageSettings.saturation = value;
                        break;
                    case 'clarity-slider':
                        imageSettings.clarity = value;
                        break;
                    case 'whitebalance-slider':
                        imageSettings.whiteBalance = value;
                        break;
                }
                
                // 重繪畫布
                drawAnnotations();
            });
        });
        
        // 設置濾鏡監聽器
        setupFilterListeners();
        
        // 文字對話框
        const addTextBtn = document.querySelector('.add-text-btn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', addTextFromDialog);
        } else {
            console.warn('未找到添加文字按鈕');
        }
        
        const closeTextDialogBtn = document.querySelector('#text-edit-dialog .close-dialog');
        if (closeTextDialogBtn) {
            closeTextDialogBtn.addEventListener('click', function() {
                document.getElementById('text-edit-dialog').style.display = 'none';
            });
        } else {
            console.warn('未找到關閉文字對話框按鈕');
        }
        
        const cancelTextBtn = document.querySelector('#text-edit-dialog .cancel-btn');
        if (cancelTextBtn) {
            cancelTextBtn.addEventListener('click', function() {
                document.getElementById('text-edit-dialog').style.display = 'none';
            });
        } else {
            console.warn('未找到取消文字按鈕');
        }
        
        // 大上傳按鈕（在佔位符中）
        const uploadBtnLarge = document.getElementById('upload-button-large');
        if (uploadBtnLarge) {
            console.log('找到大上傳按鈕，添加事件監聽');
            uploadBtnLarge.addEventListener('click', function(e) {
                console.log('大上傳按鈕被點擊');
                // 創建文件輸入元素
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                
                // 添加變更監聽器
                fileInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
                        console.log('選擇了文件:', this.files[0].name);
                        uploadImage(this.files[0]);
                    }
                });
                
                // 模擬點擊打開文件選擇器
                fileInput.click();
            });
        } else {
            console.log('未找到大上傳按鈕 (ID: upload-button-large)');
        }
        
        // 直接文件輸入元素
        const directFileInput = document.getElementById('direct-file-input');
        if (directFileInput) {
            console.log('找到直接文件輸入元素，添加事件監聽');
            directFileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    console.log('通過直接輸入選擇了文件:', this.files[0].name);
                    uploadImage(this.files[0]);
                }
            });
        } else {
            console.log('未找到直接文件輸入元素 (ID: direct-file-input)');
        }
        
        console.log('事件監聽器初始化完成');
    }
    
    // 啟動應用
    function init() {
        console.log('初始化應用...');
        
        // 初始化畫布
        initCanvas();
        
        // 初始化濾鏡預覽（即使沒有圖像）
        initFilterPreviews();
        
        // 加載示例圖片
        loadProductImage('/api/placeholder/400/320')
            .then(() => {
                drawAnnotations();
            })
            .catch(error => {
                console.error('加載示例圖片失敗:', error);
                showMessage('無法加載示例圖片', 'error');
            });
        
        // 初始化事件監聽器
        initEventListeners();
        
        console.log('應用初始化完成');
    }
    
    // 公開全局函數
    window.showMessage = showMessage;
    window.uploadImage = uploadImage;
    
    // 啟動應用
    init();
});