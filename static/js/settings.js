$(document).ready(function() {
    // 加載設置
    loadSettings();
    
    // 保存設置按鈕點擊事件
    $('#save-settings').on('click', function() {
        saveSettings();
    });
    
    // 重置按鈕點擊事件
    $('#reset-settings').on('click', function() {
        loadSettings();
    });
    
    // 顯示/隱藏密碼按鈕點擊事件
    $('.toggle-visibility').on('click', function() {
        const targetId = $(this).data('target');
        const inputField = $(`#${targetId}`);
        
        if (inputField.attr('type') === 'password') {
            inputField.attr('type', 'text');
            $(this).find('img').css('opacity', '1');
        } else {
            inputField.attr('type', 'password');
            $(this).find('img').css('opacity', '0.6');
        }
    });
});

// 加載設置
function loadSettings() {
    $.ajax({
        url: '/api/settings',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                const settings = response.settings;
                
                // 設置 API 密鑰
                $('#openai-api-key').val(settings.api_keys.openai);
                $('#gpt4o-api-key').val(settings.api_keys.gpt4o);
                
                // 設置偏好
                $('#default-model').val(settings.preferences.default_model);
                $('#auto-save').prop('checked', settings.preferences.auto_save);
            } else {
                showNotification(response.message, true);
            }
        },
        error: function(xhr, status, error) {
            showNotification('加載設置時發生錯誤', true);
        }
    });
}

// 保存設置
function saveSettings() {
    const settings = {
        api_keys: {
            openai: $('#openai-api-key').val(),
            gpt4o: $('#gpt4o-api-key').val()
        },
        preferences: {
            default_model: $('#default-model').val(),
            auto_save: $('#auto-save').is(':checked')
        }
    };
    
    $.ajax({
        url: '/api/settings',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(settings),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                showNotification('設置已成功保存');
                // 重新加載設置以獲取掩碼的 API 密鑰
                loadSettings();
            } else {
                showNotification(response.message, true);
            }
        },
        error: function(xhr, status, error) {
            showNotification('保存設置時發生錯誤', true);
        }
    });
}

// 顯示通知
function showNotification(message, isError = false) {
    const notification = $('#notification');
    $('#notification-message').text(message);
    
    if (isError) {
        notification.addClass('error');
    } else {
        notification.removeClass('error');
    }
    
    notification.addClass('show');
    
    // 3秒後自動隱藏通知
    setTimeout(function() {
        notification.removeClass('show');
    }, 3000);
}
