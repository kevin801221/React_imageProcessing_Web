// 共用 JavaScript 文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('共用JS已加載');
    
    // 顯示消息提示的函數
    window.showMessage = function(message, type = 'info') {
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
    };
    
    // 處理側邊欄項目的點擊事件
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // 如果這個項目已經有一個onclick處理程序，我們不需要額外的操作
            if (!this.hasAttribute('onclick')) {
                // 移除所有項目的active類
                sidebarItems.forEach(i => i.classList.remove('active'));
                // 添加active類到被點擊的項目
                this.classList.add('active');
            }
        });
    });

    // 創建一個通用的功能切換器
    window.createFunctionSwitcher = function(containerSelector, itemSelector, contentSelector) {
        const items = document.querySelectorAll(itemSelector);
        const contents = document.querySelectorAll(contentSelector);
        
        if (items.length === 0 || contents.length === 0) return;
        
        items.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有項的active類
                items.forEach(i => i.classList.remove('active'));
                // 添加active類到被點擊的項
                this.classList.add('active');
                
                // 獲取內容區塊ID
                const contentId = this.getAttribute('data-section');
                
                // 隱藏所有內容
                contents.forEach(c => c.style.display = 'none');
                
                // 顯示相應內容
                const targetContent = document.getElementById(contentId + '-content');
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
        
        // 默認顯示第一個內容
        if (items.length > 0 && contents.length > 0) {
            items[0].click();
        }
    };
});