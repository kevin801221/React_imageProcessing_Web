// 圖片理解 JavaScript 文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('圖片理解JS已加載');
    
    // 初始化元素引用
    const uploadArea = document.getElementById('upload-area');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const previewImage = document.getElementById('preview-image');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    const analysisPlaceholder = document.getElementById('analysis-placeholder');
    const analysisContent = document.getElementById('analysis-content');
    const analysisLoading = document.getElementById('analysis-loading');
    const analysisResult = document.getElementById('analysis-result');
    
    const copyPlaceholder = document.getElementById('copy-placeholder');
    const copyContent = document.getElementById('copy-content');
    const copyActions = document.getElementById('copy-actions');
    
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const saveBtn = document.getElementById('save-btn');
    
    const saveTemplateDialog = document.getElementById('save-template-dialog');
    const closeDialogBtn = saveTemplateDialog.querySelector('.close-dialog');
    const cancelBtn = saveTemplateDialog.querySelector('.cancel-btn');
    const saveTemplateBtn = saveTemplateDialog.querySelector('.save-template-btn');
    
    // 當前上傳的圖片
    let currentImage = null;
    
    // 當前生成的文案
    let currentCopy = null;
    
    // 上傳區域點擊事件
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 拖放功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // 文件選擇事件
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });
    
    // 上傳按鈕點擊事件
    uploadBtn.addEventListener('click', function() {
        if (currentImage) {
            uploadImage(currentImage);
        } else {
            fileInput.click();
        }
    });
    
    // 清除按鈕點擊事件
    clearBtn.addEventListener('click', function() {
        resetImageUpload();
    });
    
    // 複製按鈕點擊事件
    copyBtn.addEventListener('click', function() {
        if (currentCopy) {
            copyToClipboard(currentCopy);
            showMessage('已複製到剪貼簿', 'success');
        }
    });
    
    // 重新生成按鈕點擊事件
    regenerateBtn.addEventListener('click', function() {
        if (currentImage) {
            uploadImage(currentImage);
        }
    });
    
    // 儲存按鈕點擊事件
    saveBtn.addEventListener('click', function() {
        if (currentCopy) {
            openSaveTemplateDialog();
        }
    });
    
    // 關閉對話框按鈕點擊事件
    closeDialogBtn.addEventListener('click', closeSaveTemplateDialog);
    cancelBtn.addEventListener('click', closeSaveTemplateDialog);
    
    // 儲存模板按鈕點擊事件
    saveTemplateBtn.addEventListener('click', saveTemplate);
    
    // 處理文件
    function handleFile(file) {
        // 檢查文件類型
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            showMessage('請上傳 JPG 或 PNG 格式的圖片', 'error');
            return;
        }
        
        // 檢查文件大小
        if (file.size > 5 * 1024 * 1024) {
            showMessage('圖片大小不能超過 5MB', 'error');
            return;
        }
        
        currentImage = file;
        
        // 顯示預覽
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
            clearBtn.style.display = 'block';
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> 開始分析';
        };
        reader.readAsDataURL(file);
    }
    
    // 上傳圖片並分析
    function uploadImage(file) {
        // 顯示加載狀態
        analysisPlaceholder.style.display = 'none';
        analysisContent.style.display = 'block';
        analysisLoading.style.display = 'flex';
        analysisResult.style.display = 'none';
        
        copyPlaceholder.style.display = 'flex';
        copyContent.style.display = 'none';
        copyActions.style.display = 'none';
        
        // 創建 FormData 對象
        const formData = new FormData();
        formData.append('file', file);
        
        // 發送請求
        fetch('/api/image_understanding', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 顯示分析結果
                analysisLoading.style.display = 'none';
                analysisResult.style.display = 'block';
                analysisResult.innerHTML = formatAnalysisResult(data.analysis);
                
                // 顯示生成的文案
                copyPlaceholder.style.display = 'none';
                copyContent.style.display = 'block';
                copyContent.innerHTML = formatCopy(data.copy);
                copyActions.style.display = 'flex';
                
                // 保存當前文案
                currentCopy = data.copy;
            } else {
                showMessage(data.message || '分析失敗，請重試', 'error');
                analysisLoading.style.display = 'none';
                analysisPlaceholder.style.display = 'flex';
                analysisContent.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('發生錯誤，請重試', 'error');
            analysisLoading.style.display = 'none';
            analysisPlaceholder.style.display = 'flex';
            analysisContent.style.display = 'none';
        });
    }
    
    // 格式化分析結果
    function formatAnalysisResult(analysis) {
        if (!analysis) return '';
        
        // 這裡可以根據實際的分析結果格式進行自定義
        let html = '<div class="analysis-item">';
        html += '<h3>圖片內容分析</h3>';
        html += '<p>' + analysis.description + '</p>';
        
        if (analysis.features && analysis.features.length) {
            html += '<h3>識別到的特點</h3>';
            html += '<ul>';
            analysis.features.forEach(feature => {
                html += '<li>' + feature + '</li>';
            });
            html += '</ul>';
        }
        
        if (analysis.categories && analysis.categories.length) {
            html += '<h3>商品類別</h3>';
            html += '<div class="tag-container">';
            analysis.categories.forEach(category => {
                html += '<span class="tag">' + category + '</span>';
            });
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    // 格式化文案
    function formatCopy(copy) {
        if (!copy) return '';
        
        // 將換行符轉換為 <br>
        return copy.replace(/\n/g, '<br>');
    }
    
    // 重置圖片上傳
    function resetImageUpload() {
        currentImage = null;
        fileInput.value = '';
        previewImage.src = '';
        previewImage.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        clearBtn.style.display = 'none';
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> 上傳圖片';
        
        // 重置分析結果
        analysisPlaceholder.style.display = 'flex';
        analysisContent.style.display = 'none';
        
        // 重置文案
        copyPlaceholder.style.display = 'flex';
        copyContent.style.display = 'none';
        copyActions.style.display = 'none';
        currentCopy = null;
    }
    
    // 複製到剪貼簿
    function copyToClipboard(text) {
        // 創建臨時文本區域
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // 打開儲存模板對話框
    function openSaveTemplateDialog() {
        saveTemplateDialog.style.display = 'flex';
    }
    
    // 關閉儲存模板對話框
    function closeSaveTemplateDialog() {
        saveTemplateDialog.style.display = 'none';
        document.getElementById('template-name').value = '';
        document.getElementById('template-description').value = '';
    }
    
    // 儲存模板
    function saveTemplate() {
        const templateName = document.getElementById('template-name').value.trim();
        const templateDescription = document.getElementById('template-description').value.trim();
        
        if (!templateName) {
            showMessage('請輸入模板名稱', 'error');
            return;
        }
        
        // 創建模板對象
        const template = {
            name: templateName,
            description: templateDescription,
            content: currentCopy,
            createdAt: new Date().toISOString()
        };
        
        // 保存模板
        saveTemplateToStorage(template);
        
        // 關閉對話框
        closeSaveTemplateDialog();
        
        // 顯示成功消息
        showMessage('模板已成功儲存', 'success');
    }
    
    // 保存模板到本地儲存
    function saveTemplateToStorage(template) {
        // 獲取現有模板
        let templates = JSON.parse(localStorage.getItem('copyTemplates') || '[]');
        
        // 添加新模板
        templates.push(template);
        
        // 保存到本地儲存
        localStorage.setItem('copyTemplates', JSON.stringify(templates));
    }
    
    // 顯示消息提示
    function showMessage(message, type = 'info') {
        // 創建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // 添加到文檔
        document.body.appendChild(messageElement);
        
        // 顯示動畫
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // 自動移除
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }
    
    // 創建必要的圖標
    function createIcons() {
        // 創建圖片理解圖標
        if (!document.querySelector('img[src="/static/images/image_understanding_icon.svg"]')) {
            const iconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
                <line x1="14" y1="7" x2="20" y2="13"></line>
            </svg>`;
            
            // 創建 Blob 對象
            const blob = new Blob([iconSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            // 更新圖標
            const iconImg = document.querySelector('.function-item[data-section="image_understanding"] .function-icon img');
            if (iconImg) {
                iconImg.src = url;
            }
        }
    }
    
    // 初始化
    createIcons();
});
