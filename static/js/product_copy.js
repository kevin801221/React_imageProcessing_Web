// 商品文案生成 JavaScript 文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('商品文案生成JS已加載');
    
    // 初始化元素引用
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const generateButton = document.getElementById('generate-button');
    const copyButton = document.getElementById('copy-btn');
    const saveButton = document.getElementById('save-btn');
    const clearButton = document.getElementById('clear-btn');
    const saveTemplateDialog = document.getElementById('save-template-dialog');
    const closeDialogBtn = saveTemplateDialog.querySelector('.close-dialog');
    const cancelBtn = saveTemplateDialog.querySelector('.cancel-btn');
    const saveTemplateBtn = saveTemplateDialog.querySelector('.save-template-btn');
    
    // 保存聊天記錄
    let chatHistory = [];
    
    // 模擬 API 回應中狀態
    let isWaitingForResponse = false;
    
    // 功能選擇器初始化
    const functionItems = document.querySelectorAll('.function-item');
    functionItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有項目的active類
            functionItems.forEach(i => i.classList.remove('active'));
            // 添加active類到被點擊的項目
            this.classList.add('active');
            
            // 在這裡添加切換不同功能區域的代碼
            // 目前只有商品文案生成功能是實現的
        });
    });
    
    // 發送消息函數
    function sendMessage() {
        if (isWaitingForResponse) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 添加用戶消息到聊天界面
        addMessageToChat('user', message);
        
        // 清空輸入框
        chatInput.value = '';
        
        // 記錄聊天記錄
        chatHistory.push({
            role: 'user',
            content: message
        });
        
        // 顯示 AI 正在輸入提示
        showTypingIndicator();
        
        // 設置等待狀態
        isWaitingForResponse = true;
        
        // 調用 API 獲取回應
        callGptApi(message)
            .then(response => {
                // 移除輸入提示
                removeTypingIndicator();
                
                // 添加 AI 回應到聊天界面
                addMessageToChat('system', response);
                
                // 記錄聊天記錄
                chatHistory.push({
                    role: 'assistant',
                    content: response
                });
                
                // 重置等待狀態
                isWaitingForResponse = false;
            })
            .catch(error => {
                // 移除輸入提示
                removeTypingIndicator();
                
                // 顯示錯誤訊息
                addMessageToChat('system', '抱歉，生成回應時發生錯誤。請稍後再試。');
                console.error('API 調用錯誤:', error);
                
                // 重置等待狀態
                isWaitingForResponse = false;
            });
    }
    
    // 生成文案函數
    function generateCopy() {
        if (isWaitingForResponse) return;
        
        // 獲取表單數據
        const productName = document.getElementById('product-name').value.trim();
        const productCategory = document.getElementById('product-category').value;
        const productFeatures = document.getElementById('product-features').value.trim();
        const targetAudience = document.getElementById('target-audience').value.trim();
        const platform = document.getElementById('platform').value;
        const tone = document.getElementById('tone').value;
        const additionalInfo = document.getElementById('additional-info').value.trim();
        
        // 檢查必填字段
        if (!productName) {
            showMessage('請輸入商品名稱', 'error');
            return;
        }
        
        // 構建提示詞
        const prompt = `我需要為一個商品創建專業的銷售文案。以下是商品的詳細資訊：
商品名稱: ${productName}
商品類別: ${productCategory || '未指定'}
商品特點: ${productFeatures || '未提供'}
目標客群: ${targetAudience || '未指定'}
銷售平台: ${platform || '未指定'}
文案風格: ${tone || '未指定'}
其他資訊: ${additionalInfo || '無'}

請為這個商品創建以下內容：
1. 一個吸引人的標題（不超過30字）
2. 3-5個簡短有力的賣點（每個10-15字）
3. 一段100-150字的產品描述，強調產品的優勢和價值
4. 一個簡短有力的行動呼籲

請確保文案針對指定的目標客群，適合所選平台，並使用要求的風格。`;
        
        // 添加用戶消息到聊天界面
        addMessageToChat('user', `我需要為商品「${productName}」生成一份銷售文案。`);
        
        // 顯示 AI 正在輸入提示
        showTypingIndicator();
        
        // 設置等待狀態
        isWaitingForResponse = true;
        
        // 調用 API 獲取回應
        callGptApi(prompt)
            .then(response => {
                // 移除輸入提示
                removeTypingIndicator();
                
                // 添加 AI 回應到聊天界面
                addMessageToChat('system', response);
                
                // 記錄聊天記錄
                chatHistory = [
                    { role: 'user', content: prompt },
                    { role: 'assistant', content: response }
                ];
                
                // 重置等待狀態
                isWaitingForResponse = false;
                
                // 更新點數消耗估計
                updatePointsEstimate();
            })
            .catch(error => {
                // 移除輸入提示
                removeTypingIndicator();
                
                // 顯示錯誤訊息
                addMessageToChat('system', '抱歉，生成文案時發生錯誤。請稍後再試。');
                console.error('API 調用錯誤:', error);
                
                // 重置等待狀態
                isWaitingForResponse = false;
            });
    }
    
    // 添加消息到聊天界面
    function addMessageToChat(role, message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${role}`;
        
        const messageAvatar = document.createElement('div');
        messageAvatar.className = 'message-avatar';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // 設置頭像
        if (role === 'user') {
            messageAvatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            messageAvatar.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        // 處理消息內容，支持 markdown 格式
        const formattedMessage = formatMessage(message);
        messageContent.innerHTML = formattedMessage;
        
        // 添加時間戳
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        messageContent.appendChild(messageTime);
        
        // 組裝消息元素
        messageContainer.appendChild(messageAvatar);
        messageContainer.appendChild(messageContent);
        
        // 添加到聊天界面
        chatMessages.appendChild(messageContainer);
        
        // 滾動到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 格式化消息內容，支持簡單的 markdown
    function formatMessage(message) {
        // 處理換行
        let formatted = message.replace(/\n/g, '<br>');
        
        // 處理標題
        formatted = formatted.replace(/# (.*?)$/gm, '<h3>$1</h3>');
        
        // 處理粗體
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 處理斜體
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 處理列表
        formatted = formatted.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>').replace(/<li>.*?<\/li>/gs, function(match) {
            return '<ol>' + match + '</ol>';
        });
        
        formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>').replace(/<li>.*?<\/li>/gs, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        return formatted;
    }
    
    // 顯示 AI 正在輸入的提示
    function showTypingIndicator() {
        const typingContainer = document.createElement('div');
        typingContainer.className = 'message-container system typing-container';
        typingContainer.id = 'typing-indicator';
        
        const messageAvatar = document.createElement('div');
        messageAvatar.className = 'message-avatar';
        messageAvatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        
        messageContent.appendChild(typingIndicator);
        typingContainer.appendChild(messageAvatar);
        typingContainer.appendChild(messageContent);
        
        chatMessages.appendChild(typingContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 移除 AI 正在輸入的提示
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // 調用 GPT API 獲取回應
    async function callGptApi(message) {
        // 這裡應該實現實際的 API 調用
        // 目前使用模擬回應進行演示
        console.log('發送到 API 的消息:', message);
        
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 判斷是否是生成文案的請求
        if (message.includes('創建專業的銷售文案')) {
            // 模擬商品文案生成回應
            const productName = message.match(/商品名稱: (.*?)$/m)[1];
            return generateMockCopywriting(productName);
        } else {
            // 模擬一般對話回應
            return generateMockResponse(message);
        }
        
        // 真實的 API 调用示例（需要後端支持）
        /*
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        ...chatHistory,
                        { role: 'user', content: message }
                    ],
                    model: 'gpt-3.5-turbo'  // 或其他模型
                })
            });
            
            if (!response.ok) {
                throw new Error(`API 請求失敗: ${response.status}`);
            }
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('API 調用錯誤:', error);
            throw error;
        }
        */
    }
    
    // 模擬商品文案生成回應
    function generateMockCopywriting(productName) {
        // 這裡只是演示，實際應通過真實的 GPT API 獲取回應
        return `# 為「${productName}」生成的商品文案

## 標題
✨ 革新生活品質，${productName}讓您的每一天都與眾不同！

## 賣點
1. **頂級材質**：精選高品質原料，耐用持久
2. **人體工學設計**：貼合使用習慣，舒適不費力
3. **多功能整合**：一機多用，滿足多樣需求
4. **智能操控**：簡單直覺的操作界面，老少咸宜

## 產品描述
${productName}是您日常生活的完美助手，採用頂級環保材質精心打造，不僅品質卓越，更兼具時尚美感。人體工學設計讓您使用時倍感舒適，大幅減輕疲勞感。多功能整合讓這款產品能夠適應各種場景需求，為您的生活增添便利與樂趣。直覺式操作界面讓任何年齡層的用戶都能輕鬆上手，徹底釋放您的創造力與生產力。

## 行動呼籲
🔥 限時優惠中！立即下單享9折優惠，再送精美禮品乙份，數量有限，手慢無！`;
    }
    
    // 模擬一般對話回應
    function generateMockResponse(message) {
        // 簡單的對話模擬邏輯
        if (message.includes('優化') || message.includes('修改')) {
            return `我很樂意幫您優化文案！根據您的需求，我建議進行以下調整：

1. 將標題改得更加簡潔有力，直接點出產品核心價值
2. 賣點可以更加具體，加入數據或具體效果
3. 產品描述可以添加一些情境描述，讓客戶能夠想像使用場景
4. 行動呼籲可以更加緊迫感，增加限時限量的元素

您希望我針對哪一部分進行具體修改？或者您有其他特定的優化方向嗎？`;
        } else if (message.includes('目標客群') || message.includes('客群')) {
            return `針對不同的目標客群，文案確實需要做出調整。以下是一些建議：

若目標是年輕族群（18-35歲）：
- 使用更活潑、時尚的語言
- 強調產品的創新性和社交分享價值
- 可以加入流行語和表情符號

若目標是中年族群（36-55歲）：
- 重點強調產品的實用性和性價比
- 突出產品如何解決生活痛點
- 使用更理性、數據化的描述

若目標是銀髮族群（56歲以上）：
- 使用更簡單清晰的語言
- 強調產品的安全性和易用性
- 重點描述產品如何提升生活品質

您的目標客群是哪一類型呢？我可以針對性地為您調整文案。`;
        } else {
            return `感謝您的訊息！我是您的 AI 文案助手，我可以幫您：

- 生成各類型的商品文案
- 優化現有文案內容
- 針對不同平台調整文案風格
- 提供文案寫作建議

請告訴我您需要什麼樣的幫助，例如「幫我優化這段描述」、「針對年輕客群調整文案」等，我會立即為您服務！`;
        }
    }
    
    // 複製文案
    function copyAllText() {
        // 獲取所有 AI 回應的內容
        const systemMessages = document.querySelectorAll('.message-container.system .message-content');
        let textToCopy = '';
        
        systemMessages.forEach(message => {
            // 複製文本但排除時間戳
            const messageTime = message.querySelector('.message-time');
            if (messageTime) messageTime.remove();
            
            textToCopy += message.textContent + '\n\n';
            
            // 如果時間戳元素被移除了，需要重新添加回去
            if (messageTime) message.appendChild(messageTime);
        });
        
        // 複製到剪貼板
        navigator.clipboard.writeText(textToCopy.trim())
            .then(() => {
                showMessage('文案已複製到剪貼板', 'success');
            })
            .catch(err => {
                console.error('複製失敗:', err);
                showMessage('複製失敗，請手動選擇文字並複製', 'error');
            });
    }
    
    // 儲存模板
    function openSaveTemplateDialog() {
        saveTemplateDialog.style.display = 'flex';
    }
    
    function closeSaveTemplateDialog() {
        saveTemplateDialog.style.display = 'none';
    }
    
    function saveTemplate() {
        const templateName = document.getElementById('template-name').value.trim();
        const templateDescription = document.getElementById('template-description').value.trim();
        
        if (!templateName) {
            showMessage('請輸入模板名稱', 'error');
            return;
        }
        
        // 從表單獲取當前設置
        const template = {
            name: templateName,
            description: templateDescription,
            productCategory: document.getElementById('product-category').value,
            targetAudience: document.getElementById('target-audience').value.trim(),
            platform: document.getElementById('platform').value,
            tone: document.getElementById('tone').value,
            chatHistory: chatHistory
        };
        
        // 儲存模板到本地儲存（實際應用中應發送到服務器）
        saveTemplateToStorage(template);
        
        // 關閉對話框
        closeSaveTemplateDialog();
        
        // 顯示成功消息
        showMessage('模板儲存成功！', 'success');
    }
    
    // 保存模板到本地儲存
    function saveTemplateToStorage(template) {
        let templates = JSON.parse(localStorage.getItem('copyTemplates') || '[]');
        templates.push(template);
        localStorage.setItem('copyTemplates', JSON.stringify(templates));
    }
    
    // 清空聊天
    function clearChat() {
        // 確認提示
        if (confirm('確定要清空所有對話嗎？此操作不可撤銷。')) {
            // 保留系統的歡迎消息
            const welcomeMessage = chatMessages.firstChild;
            chatMessages.innerHTML = '';
            
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
            
            // 重置聊天記錄
            chatHistory = [];
            
            // 重置點數消耗估計
            document.getElementById('estimated-points').textContent = '0.05';
            
            showMessage('對話已清空', 'info');
        }
    }
    
    // 更新點數消耗估計
    function updatePointsEstimate() {
        // 根據對話長度估算點數消耗
        const messageCount = chatHistory.length;
        const basePoints = 0.05;
        const additionalPoints = messageCount * 0.01;
        const totalPoints = (basePoints + additionalPoints).toFixed(2);
        
        document.getElementById('estimated-points').textContent = totalPoints;
    }
    
    // 顯示消息提示
    function showMessage(message, type = 'info') {
        if (window.showMessage) {
            window.showMessage(message, type);
        } else {
            console.log(`顯示消息: ${message} (類型: ${type})`);
            alert(message);
        }
    }
    
    // 事件監聽
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keydown', function(event) {
            // 按 Enter 發送消息，但 Shift+Enter 換行
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (generateButton) {
        generateButton.addEventListener('click', generateCopy);
    }
    
    if (copyButton) {
        copyButton.addEventListener('click', copyAllText);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', openSaveTemplateDialog);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearChat);
    }
    
    if (closeDialogBtn) {
        closeDialogBtn.addEventListener('click', closeSaveTemplateDialog);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeSaveTemplateDialog);
    }
    
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', saveTemplate);
    }
    
    // 創建圖標
    function createIcons() {
        const iconFolder = '/static/images/';
        const iconNames = ['copywriting_icon.svg', 'headline_icon.svg', 'description_icon.svg', 'history_icon.svg'];
        
        const iconData = {
            'copywriting_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`,
            'headline_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h12"></path></svg>`,
            'description_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
            'history_icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
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
    
    // 調整輸入框高度
    function adjustInputHeight() {
        if (chatInput) {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight > 150 ? 150 : chatInput.scrollHeight) + 'px';
        }
    }
    
    if (chatInput) {
        chatInput.addEventListener('input', adjustInputHeight);
    }
    
    // 初始化
    createIcons();
});