// 機器人知識庫專用 JavaScript 文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('機器人知識庫JS已加載');
    
    // 示例數據 - 實際應用中應從服務器獲取
    const knowledgeFiles = [
        {
            id: 1,
            filename: 'import AIBOT.xlsx example.xlsx',
            status: 'imported', // 已匯入
            uploadTime: '2025-02-06 13:35',
            wordCount: 200
        },
        {
            id: 2,
            filename: 'import AIBOT.xlsx example.xlsx',
            status: 'importing', // 匯入中
            uploadTime: '2025-02-06 13:35',
            wordCount: 350
        },
        {
            id: 3,
            filename: 'import AIBOT.xlsx example.xlsx',
            status: 'failed', // 失敗
            uploadTime: '2025-02-06 13:35',
            wordCount: 1000
        }
    ];
    
    // 初始化函數
    function init() {
        // 設置功能選擇器
        setupFunctionSelector();
        
        // 加載知識庫文件列表
        loadKnowledgeFiles();
        
        // 設置上傳對話框
        setupUploadDialog();
        
        // 設置刪除對話框
        setupDeleteDialog();
        
        // 設置搜索和篩選
        setupSearchAndFilter();
    }
    
    // 設置功能選擇器
    function setupFunctionSelector() {
        const functionItems = document.querySelectorAll('.function-item');
        
        functionItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有項目的active類
                functionItems.forEach(i => i.classList.remove('active'));
                // 添加active類到被點擊的項目
                this.classList.add('active');
                
                // 在這裡添加切換不同功能區域的代碼
                // 目前只有建立知識庫區域是實現的
            });
        });
    }
    
    // 加載知識庫文件列表
    function loadKnowledgeFiles() {
        const tableBody = document.getElementById('knowledge-files-list');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        knowledgeFiles.forEach(file => {
            const row = document.createElement('tr');
            
            // 設置狀態圖標和文字
            let statusText = '';
            let statusDotClass = '';
            
            switch(file.status) {
                case 'imported':
                    statusText = '已匯入';
                    statusDotClass = 'success';
                    break;
                case 'importing':
                    statusText = '匯入中';
                    statusDotClass = 'pending';
                    break;
                case 'failed':
                    statusText = '失敗';
                    statusDotClass = 'failed';
                    break;
            }
            
            row.innerHTML = `
                <td>${file.id}</td>
                <td>${file.filename} <i class="fas fa-download download-icon"></i></td>
                <td><span class="status-dot ${statusDotClass}"></span>${statusText}</td>
                <td>${file.uploadTime}</td>
                <td>${file.wordCount.toLocaleString()}</td>
                <td><button class="delete-btn" data-id="${file.id}"><i class="fas fa-trash-alt"></i></button></td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // 添加刪除按鈕事件
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const fileId = this.getAttribute('data-id');
                showDeleteDialog(fileId);
            });
        });
    }
    
    // 設置上傳對話框
    function setupUploadDialog() {
        const uploadBtn = document.querySelector('.upload-btn');
        const uploadDialog = document.getElementById('upload-dialog');
        const closeDialogBtn = uploadDialog.querySelector('.close-dialog');
        const cancelBtn = uploadDialog.querySelector('.cancel-btn');
        const fileInput = document.getElementById('file-input');
        const selectFileBtn = uploadDialog.querySelector('.select-file-btn');
        const uploadSubmitBtn = uploadDialog.querySelector('.upload-submit-btn');
        const selectedFileDiv = uploadDialog.querySelector('.selected-file');
        const fileNameSpan = document.getElementById('file-name');
        const dropArea = document.getElementById('drop-area');
        
        // 打開對話框
        uploadBtn.addEventListener('click', function() {
            uploadDialog.style.display = 'flex';
        });
        
        // 關閉對話框
        function closeUploadDialog() {
            uploadDialog.style.display = 'none';
            fileInput.value = '';
            selectedFileDiv.style.display = 'none';
            uploadSubmitBtn.disabled = true;
        }
        
        closeDialogBtn.addEventListener('click', closeUploadDialog);
        cancelBtn.addEventListener('click', closeUploadDialog);
        
        // 點擊選擇文件按鈕
        selectFileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // 文件選擇變更
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                fileNameSpan.textContent = file.name;
                selectedFileDiv.style.display = 'block';
                uploadSubmitBtn.disabled = false;
            }
        });
        
        // 拖放功能
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('dragover');
        }
        
        function unhighlight() {
            dropArea.classList.remove('dragover');
        }
        
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files[0]) {
                fileInput.files = files;
                fileNameSpan.textContent = files[0].name;
                selectedFileDiv.style.display = 'block';
                uploadSubmitBtn.disabled = false;
            }
        }
        
        // 上傳文件
        uploadSubmitBtn.addEventListener('click', function() {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                uploadFile(file);
                closeUploadDialog();
            }
        });
    }
    
    // 上傳文件函數
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        showMessage('正在上傳檔案...', 'info');
        
        // 這裡應當發送AJAX請求到服務器
        // 以下為模擬上傳過程
        setTimeout(() => {
            // 模擬成功
            showMessage('檔案上傳成功，正在處理...', 'success');
            
            // 添加新文件到列表（模擬）
            const newFile = {
                id: knowledgeFiles.length + 1,
                filename: file.name,
                status: 'importing',
                uploadTime: new Date().toLocaleString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace(/\//g, '-'),
                wordCount: Math.floor(Math.random() * 500) + 100
            };
            
            knowledgeFiles.push(newFile);
            loadKnowledgeFiles();
            
            // 模擬處理完成
            setTimeout(() => {
                // 更新狀態
                newFile.status = Math.random() > 0.2 ? 'imported' : 'failed';
                loadKnowledgeFiles();
                
                showMessage(
                    newFile.status === 'imported' 
                        ? '檔案處理成功，已加入知識庫' 
                        : '檔案處理失敗，請檢查檔案格式',
                    newFile.status === 'imported' ? 'success' : 'error'
                );
            }, 3000);
            
        }, 1500);
    }
    
    // 設置刪除對話框
    function setupDeleteDialog() {
        const deleteDialog = document.getElementById('delete-dialog');
        const closeDialogBtn = deleteDialog.querySelector('.close-dialog');
        const cancelBtn = deleteDialog.querySelector('.cancel-btn');
        const confirmDeleteBtn = deleteDialog.querySelector('.confirm-delete-btn');
        
        // 關閉對話框
        function closeDeleteDialog() {
            deleteDialog.style.display = 'none';
            delete deleteDialog.dataset.fileId;
        }
        
        closeDialogBtn.addEventListener('click', closeDeleteDialog);
        cancelBtn.addEventListener('click', closeDeleteDialog);
        
        // 確認刪除
        confirmDeleteBtn.addEventListener('click', function() {
            const fileId = deleteDialog.dataset.fileId;
            if (fileId) {
                deleteFile(fileId);
                closeDeleteDialog();
            }
        });
    }
    
    // 顯示刪除對話框
    function showDeleteDialog(fileId) {
        const deleteDialog = document.getElementById('delete-dialog');
        deleteDialog.dataset.fileId = fileId;
        deleteDialog.style.display = 'flex';
    }
    
    // 刪除文件函數
    function deleteFile(fileId) {
        // 這裡應當發送AJAX請求到服務器
        // 模擬刪除過程
        const index = knowledgeFiles.findIndex(file => file.id == fileId);
        if (index !== -1) {
            const fileName = knowledgeFiles[index].filename;
            knowledgeFiles.splice(index, 1);
            loadKnowledgeFiles();
            showMessage(`已刪除文件: ${fileName}`, 'success');
        }
    }
    
    // 設置搜索和篩選
    function setupSearchAndFilter() {
        const searchInput = document.querySelector('.search-input');
        const filterSelect = document.querySelector('.filter-select select');
        
        if (!searchInput || !filterSelect) return;
        
        // 搜索框事件
        searchInput.addEventListener('input', function() {
            filterFiles();
        });
        
        // 狀態篩選事件
        filterSelect.addEventListener('change', function() {
            filterFiles();
        });
        
        function filterFiles() {
            const searchText = searchInput.value.toLowerCase();
            const filterStatus = filterSelect.value;
            
            // 這裡可以將篩選條件發送到服務器進行查詢
            // 目前僅在前端進行簡單篩選演示
            
            let filteredFiles = [...knowledgeFiles];
            
            // 按檔案名稱搜索
            if (searchText) {
                filteredFiles = filteredFiles.filter(file => 
                    file.filename.toLowerCase().includes(searchText)
                );
            }
            
            // 按狀態篩選
            if (filterStatus && filterStatus !== '所有狀態') {
                let statusCode = '';
                switch (filterStatus) {
                    case '已匯入': statusCode = 'imported'; break;
                    case '匯入中': statusCode = 'importing'; break;
                    case '失敗': statusCode = 'failed'; break;
                }
                
                if (statusCode) {
                    filteredFiles = filteredFiles.filter(file => file.status === statusCode);
                }
            }
            
            // 更新顯示
            displayFilteredFiles(filteredFiles);
        }
        
        function displayFilteredFiles(files) {
            const tableBody = document.getElementById('knowledge-files-list');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            
            if (files.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="6" style="text-align: center;">沒有找到符合條件的檔案</td>';
                tableBody.appendChild(row);
                return;
            }
            
            files.forEach(file => {
                const row = document.createElement('tr');
                
                // 設置狀態圖標和文字
                let statusText = '';
                let statusDotClass = '';
                
                switch(file.status) {
                    case 'imported':
                        statusText = '已匯入';
                        statusDotClass = 'success';
                        break;
                    case 'importing':
                        statusText = '匯入中';
                        statusDotClass = 'pending';
                        break;
                    case 'failed':
                        statusText = '失敗';
                        statusDotClass = 'failed';
                        break;
                }
                
                row.innerHTML = `
                    <td>${file.id}</td>
                    <td>${file.filename} <i class="fas fa-download download-icon"></i></td>
                    <td><span class="status-dot ${statusDotClass}"></span>${statusText}</td>
                    <td>${file.uploadTime}</td>
                    <td>${file.wordCount.toLocaleString()}</td>
                    <td><button class="delete-btn" data-id="${file.id}"><i class="fas fa-trash-alt"></i></button></td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // 重新添加刪除按鈕事件
            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const fileId = this.getAttribute('data-id');
                    showDeleteDialog(fileId);
                });
            });
        }
    }
    
    // 創建必要的圖標
    function createIcons() {
        const iconFolder = '/static/images/';
        const iconNames = ['upload_icon.svg', 'import_icon.svg', 'query_icon.svg', 'deploy_icon.svg'];
        
        const iconData = {
            'upload_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
            'import_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
            'query_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
            'deploy_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>`
        };
        
        // 檢查目錄是否存在，如果不存在則創建
        fetch('/api/check_icon_folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ folder: iconFolder })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 目錄存在或已創建，上傳圖標
                iconNames.forEach(iconName => {
                    fetch('/api/save_icon', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            path: iconFolder + iconName,
                            content: iconData[iconName]
                        })
                    });
                });
            }
        })
        .catch(error => {
            console.error('檢查圖標目錄失敗:', error);
        });
    }
    
    // 初始化應用
    init();
    createIcons();
});