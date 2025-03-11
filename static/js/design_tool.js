// 設計工具 JavaScript 文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('設計工具JS已加載');
    
    // 全局變量
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let canvasContainer = document.querySelector('.canvas');
    let productImage = null;
    let annotations = [];
    let currentTool = 'pen';
    let currentColor = '#FF0000';
    let currentLineWidth = 2;
    let currentLineStyle = 'solid';
    let isDrawing = false;
    let startX, startY;
    let currentAnnotation = null;
    
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
               
               // 隱藏上傳佔位符
               const placeholder = document.getElementById('upload-placeholder');
               if (placeholder) placeholder.style.display = 'none';
               
               // 重繪畫布以顯示圖片
               drawAnnotations();
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
   
   // 繪製所有標註
   function drawAnnotations() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       
       // 繪製產品圖片
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
               ctx.drawImage(productImage, x, y, width, height);
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
   
   // 開始繪製
   function startDrawing(e) {
       isDrawing = true;
       const rect = canvas.getBoundingClientRect();
       startX = e.clientX - rect.left;
       startY = e.clientY - rect.top;
       
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
       
       // 繪製產品圖片
       if (productImage) {
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
           
           tempCtx.drawImage(productImage, x, y, width, height);
       }
       
       // 複製當前畫布內容（標註）
       tempCtx.drawImage(canvas, 0, 0);
       
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
       fetch('/api/annotations', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ annotations: annotations })
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