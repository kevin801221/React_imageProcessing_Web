# from flask import Flask, render_template, request, jsonify, send_from_directory, url_for
# import os
# import json
# import uuid
# import base64
# import io
# from datetime import datetime
# from werkzeug.utils import secure_filename
# import cv2
# import numpy as np
# from PIL import Image

# app = Flask(__name__)

# # 確保目錄存在
# UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
# DESIGN_OUTPUT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'design_output')
# ANNOTATIONS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'annotations')

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(DESIGN_OUTPUT_FOLDER, exist_ok=True)
# os.makedirs(ANNOTATIONS_FOLDER, exist_ok=True)

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['DESIGN_OUTPUT_FOLDER'] = DESIGN_OUTPUT_FOLDER
# app.config['ANNOTATIONS_FOLDER'] = ANNOTATIONS_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 限制上傳文件大小為 16MB

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/')
# def index():
#     return render_template('pen_html.html')

# @app.route('/api/upload', methods=['POST'])
# def upload_file():
#     """上傳圖片檔案"""
#     print("收到上傳請求")
    
#     if 'file' not in request.files:
#         print("沒有找到文件")
#         return jsonify({'success': False, 'message': '沒有找到文件'})
    
#     file = request.files['file']
    
#     if file.filename == '':
#         print("未選擇文件")
#         return jsonify({'success': False, 'message': '未選擇文件'})
    
#     if file and allowed_file(file.filename):
#         try:
#             filename = secure_filename(file.filename)
#             timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
#             new_filename = f"{timestamp}_{filename}"
            
#             # 保存文件
#             file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
#             file.save(file_path)
            
#             # 檢查文件是否成功保存
#             if os.path.exists(file_path):
#                 print(f"文件已保存到: {file_path}")
                
#                 # 返回相對路徑，以便前端訪問
#                 relative_path = f"/static/uploads/{new_filename}"
                
#                 print(f"文件URL路徑: {relative_path}")
                
#                 return jsonify({
#                     'success': True, 
#                     'file_path': relative_path,
#                     'file_name': new_filename
#                 })
#             else:
#                 print("文件保存失敗")
#                 return jsonify({'success': False, 'message': '文件保存失敗'})
                
#         except Exception as e:
#             print(f"上傳過程中發生錯誤: {str(e)}")
#             return jsonify({'success': False, 'message': f'上傳過程中發生錯誤: {str(e)}'})
    
#     print("不允許的文件類型")
#     return jsonify({'success': False, 'message': '不允許的文件類型'})

# @app.route('/api/save_design', methods=['POST'])
# def save_design():
#     try:
#         data = request.json
#         image_data = data.get('image_data')
        
#         if not image_data:
#             return jsonify({'success': False, 'error': '沒有圖像數據'})
        
#         # 從 base64 數據中提取圖像數據
#         image_data = image_data.split(',')[1] if ',' in image_data else image_data
        
#         # 解碼 base64 數據
#         image_bytes = base64.b64decode(image_data)
        
#         # 生成唯一文件名
#         unique_filename = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.png"
#         file_path = os.path.join(app.config['DESIGN_OUTPUT_FOLDER'], unique_filename)
        
#         # 保存圖像
#         with open(file_path, 'wb') as f:
#             f.write(image_bytes)
        
#         file_url = url_for('static', filename=f'design_output/{unique_filename}')
        
#         return jsonify({
#             'success': True,
#             'file_url': file_url,
#             'file_path': file_path
#         })
    
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)})

# @app.route('/api/annotations', methods=['POST'])
# def save_annotations():
#     try:
#         data = request.json
#         annotations = data.get('annotations')
        
#         if not annotations:
#             return jsonify({'success': False, 'error': '沒有標註數據'})
        
#         # 生成唯一文件名
#         unique_filename = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.json"
#         file_path = os.path.join(app.config['ANNOTATIONS_FOLDER'], unique_filename)
        
#         # 保存標註數據
#         with open(file_path, 'w', encoding='utf-8') as f:
#             json.dump(annotations, f, ensure_ascii=False, indent=2)
        
#         return jsonify({
#             'success': True,
#             'file_path': file_path
#         })
    
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)})

# @app.route('/api/placeholder/<int:width>/<int:height>')
# def placeholder_image(width, height):
#     """生成並返回一個佔位符圖像"""
#     # 創建一個白色背景的圖像
#     img = np.ones((height, width, 3), dtype=np.uint8) * 255
    
#     # 添加一些簡單的圖形
#     cv2.rectangle(img, (50, 50), (width - 50, height - 50), (200, 200, 200), 2)
#     cv2.line(img, (50, 50), (width - 50, height - 50), (180, 180, 180), 1)
#     cv2.line(img, (width - 50, 50), (50, height - 50), (180, 180, 180), 1)
    
#     # 添加文字
#     font = cv2.FONT_HERSHEY_SIMPLEX
#     text = f"{width}x{height}"
#     text_size = cv2.getTextSize(text, font, 0.7, 2)[0]
#     text_x = (width - text_size[0]) // 2
#     text_y = (height + text_size[1]) // 2
#     cv2.putText(img, text, (text_x, text_y), font, 0.7, (100, 100, 100), 2)
    
#     # 將 OpenCV 圖像轉換為 PNG 格式的二進制數據
#     _, img_encoded = cv2.imencode('.png', img)
    
#     # 創建臨時文件路徑
#     placeholder_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'images')
#     os.makedirs(placeholder_dir, exist_ok=True)
#     placeholder_path = os.path.join(placeholder_dir, f'placeholder_{width}x{height}.png')
    
#     # 保存圖像
#     with open(placeholder_path, 'wb') as f:
#         f.write(img_encoded)
    
#     return send_from_directory(os.path.dirname(placeholder_path), os.path.basename(placeholder_path))

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)

from flask import Flask, render_template, request, jsonify, send_from_directory, url_for
import os
import json
import uuid
import base64
import io
import time
from datetime import datetime
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from PIL import Image

app = Flask(__name__)

# 確保目錄存在
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
DESIGN_OUTPUT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'design_output')
ANNOTATIONS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'annotations')
KNOWLEDGE_FILES_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'knowledge_files')
IMAGES_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'images')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DESIGN_OUTPUT_FOLDER, exist_ok=True)
os.makedirs(ANNOTATIONS_FOLDER, exist_ok=True)
os.makedirs(KNOWLEDGE_FILES_FOLDER, exist_ok=True)
os.makedirs(IMAGES_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DESIGN_OUTPUT_FOLDER'] = DESIGN_OUTPUT_FOLDER
app.config['ANNOTATIONS_FOLDER'] = ANNOTATIONS_FOLDER
app.config['KNOWLEDGE_FILES_FOLDER'] = KNOWLEDGE_FILES_FOLDER
app.config['IMAGES_FOLDER'] = IMAGES_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 限制上傳文件大小為 16MB

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
ALLOWED_KNOWLEDGE_EXTENSIONS = {'xlsx', 'xls', 'csv', 'txt', 'pdf', 'doc', 'docx'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/')
def index():
    return render_template('pen_html.html')

@app.route('/knowledge_base')
def knowledge_base():
    return render_template('knowledge_base.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """上傳圖片檔案"""
    print("收到上傳請求")
    
    if 'file' not in request.files:
        print("沒有找到文件")
        return jsonify({'success': False, 'message': '沒有找到文件'})
    
    file = request.files['file']
    
    if file.filename == '':
        print("未選擇文件")
        return jsonify({'success': False, 'message': '未選擇文件'})
    
    if file and allowed_file(file.filename, ALLOWED_EXTENSIONS):
        try:
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            new_filename = f"{timestamp}_{filename}"
            
            # 保存文件
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            file.save(file_path)
            
            # 檢查文件是否成功保存
            if os.path.exists(file_path):
                print(f"文件已保存到: {file_path}")
                
                # 返回相對路徑，以便前端訪問
                relative_path = f"/static/uploads/{new_filename}"
                
                print(f"文件URL路徑: {relative_path}")
                
                return jsonify({
                    'success': True, 
                    'file_path': relative_path,
                    'file_name': new_filename
                })
            else:
                print("文件保存失敗")
                return jsonify({'success': False, 'message': '文件保存失敗'})
                
        except Exception as e:
            print(f"上傳過程中發生錯誤: {str(e)}")
            return jsonify({'success': False, 'message': f'上傳過程中發生錯誤: {str(e)}'})
    
    print("不允許的文件類型")
    return jsonify({'success': False, 'message': '不允許的文件類型'})

@app.route('/api/upload_knowledge', methods=['POST'])
def upload_knowledge_file():
    """上傳知識庫檔案"""
    print("收到知識庫上傳請求")
    
    if 'file' not in request.files:
        print("沒有找到文件")
        return jsonify({'success': False, 'message': '沒有找到文件'})
    
    file = request.files['file']
    
    if file.filename == '':
        print("未選擇文件")
        return jsonify({'success': False, 'message': '未選擇文件'})
    
    if file and allowed_file(file.filename, ALLOWED_KNOWLEDGE_EXTENSIONS):
        try:
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            new_filename = f"{timestamp}_{filename}"
            
            # 保存文件
            file_path = os.path.join(app.config['KNOWLEDGE_FILES_FOLDER'], new_filename)
            file.save(file_path)
            
            # 檢查文件是否成功保存
            if os.path.exists(file_path):
                print(f"知識庫文件已保存到: {file_path}")
                
                # 模擬處理時間
                time.sleep(1)
                
                # 獲取文件大小（這裡用大小代替字數，實際應用要計算字數）
                file_size = os.path.getsize(file_path)
                word_count = file_size // 10  # 簡單估算字數
                
                # 返回相關信息
                return jsonify({
                    'success': True, 
                    'file_path': f"/static/knowledge_files/{new_filename}",
                    'file_name': filename,
                    'word_count': word_count,
                    'upload_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })
            else:
                print("知識庫文件保存失敗")
                return jsonify({'success': False, 'message': '知識庫文件保存失敗'})
                
        except Exception as e:
            print(f"知識庫上傳過程中發生錯誤: {str(e)}")
            return jsonify({'success': False, 'message': f'知識庫上傳過程中發生錯誤: {str(e)}'})
    
    print("不允許的知識庫文件類型")
    return jsonify({'success': False, 'message': '不允許的知識庫文件類型'})

@app.route('/api/knowledge_files', methods=['GET'])
def get_knowledge_files():
    """獲取知識庫文件列表"""
    try:
        files = []
        for filename in os.listdir(app.config['KNOWLEDGE_FILES_FOLDER']):
            file_path = os.path.join(app.config['KNOWLEDGE_FILES_FOLDER'], filename)
            if os.path.isfile(file_path):
                # 獲取文件信息
                file_stats = os.stat(file_path)
                created_time = datetime.fromtimestamp(file_stats.st_ctime)
                file_size = file_stats.st_size
                
                # 模擬狀態（實際應用中應從數據庫獲取）
                status = 'imported'  # 默認狀態
                if 'tmp' in filename:
                    status = 'importing'
                if 'error' in filename:
                    status = 'failed'
                
                # 簡單估算字數
                word_count = file_size // 10
                
                files.append({
                    'id': len(files) + 1,
                    'filename': filename,
                    'original_filename': filename.split('_', 1)[1] if '_' in filename else filename,
                    'status': status,
                    'upload_time': created_time.strftime('%Y-%m-%d %H:%M:%S'),
                    'word_count': word_count
                })
        
        # 按上傳時間排序
        files.sort(key=lambda x: x['upload_time'], reverse=True)
        
        return jsonify({
            'success': True,
            'files': files
        })
    except Exception as e:
        print(f"獲取知識庫文件列表時發生錯誤: {str(e)}")
        return jsonify({'success': False, 'message': f'獲取知識庫文件列表時發生錯誤: {str(e)}'})

@app.route('/api/delete_knowledge_file', methods=['POST'])
def delete_knowledge_file():
    """刪除知識庫文件"""
    try:
        data = request.json
        filename = data.get('filename')
        
        if not filename:
            return jsonify({'success': False, 'message': '缺少文件名'})
        
        file_path = os.path.join(app.config['KNOWLEDGE_FILES_FOLDER'], filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': '文件不存在'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'刪除文件時發生錯誤: {str(e)}'})

@app.route('/api/check_icon_folder', methods=['POST'])
def check_icon_folder():
    """檢查圖標目錄是否存在，如果不存在則創建"""
    try:
        data = request.json
        folder = data.get('folder')
        
        if not folder:
            return jsonify({'success': False, 'message': '缺少目錄路徑'})
        
        # 移除開頭的斜杠，確保路徑正確
        folder = folder.lstrip('/')
        
        # 將相對路徑轉換為絕對路徑
        absolute_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), folder)
        
        # 確保目錄存在
        os.makedirs(absolute_folder, exist_ok=True)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': f'檢查圖標目錄時發生錯誤: {str(e)}'})

@app.route('/api/save_icon', methods=['POST'])
def save_icon():
    """保存SVG圖標"""
    try:
        data = request.json
        path = data.get('path')
        content = data.get('content')
        
        if not path or not content:
            return jsonify({'success': False, 'message': '缺少路徑或內容'})
        
        # 移除開頭的斜杠，確保路徑正確
        path = path.lstrip('/')
        
        # 將相對路徑轉換為絕對路徑
        absolute_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), path)
        
        # 確保目錄存在
        os.makedirs(os.path.dirname(absolute_path), exist_ok=True)
        
        # 保存圖標
        with open(absolute_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': f'保存圖標時發生錯誤: {str(e)}'})

@app.route('/api/save_design', methods=['POST'])
def save_design():
    try:
        data = request.json
        image_data = data.get('image_data')
        
        if not image_data:
            return jsonify({'success': False, 'error': '沒有圖像數據'})
        
        # 從 base64 數據中提取圖像數據
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        
        # 解碼 base64 數據
        image_bytes = base64.b64decode(image_data)
        
        # 生成唯一文件名
        unique_filename = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.png"
        file_path = os.path.join(app.config['DESIGN_OUTPUT_FOLDER'], unique_filename)
        
        # 保存圖像
        with open(file_path, 'wb') as f:
            f.write(image_bytes)
        
        file_url = url_for('static', filename=f'design_output/{unique_filename}')
        
        return jsonify({
            'success': True,
            'file_url': file_url,
            'file_path': file_path
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/annotations', methods=['POST'])
def save_annotations():
    try:
        data = request.json
        annotations = data.get('annotations')
        
        if not annotations:
            return jsonify({'success': False, 'error': '沒有標註數據'})
        
        # 生成唯一文件名
        unique_filename = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.json"
        file_path = os.path.join(app.config['ANNOTATIONS_FOLDER'], unique_filename)
        
        # 保存標註數據
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(annotations, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            'success': True,
            'file_path': file_path
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/placeholder/<int:width>/<int:height>')
def placeholder_image(width, height):
    """生成並返回一個佔位符圖像"""
    # 創建一個白色背景的圖像
    img = np.ones((height, width, 3), dtype=np.uint8) * 255
    
    # 添加一些簡單的圖形
    cv2.rectangle(img, (50, 50), (width - 50, height - 50), (200, 200, 200), 2)
    cv2.line(img, (50, 50), (width - 50, height - 50), (180, 180, 180), 1)
    cv2.line(img, (width - 50, 50), (50, height - 50), (180, 180, 180), 1)
    
    # 添加文字
    font = cv2.FONT_HERSHEY_SIMPLEX
    text = f"{width}x{height}"
    text_size = cv2.getTextSize(text, font, 0.7, 2)[0]
    text_x = (width - text_size[0]) // 2
    text_y = (height + text_size[1]) // 2
    cv2.putText(img, text, (text_x, text_y), font, 0.7, (100, 100, 100), 2)
    
    # 將 OpenCV 圖像轉換為 PNG 格式的二進制數據
    _, img_encoded = cv2.imencode('.png', img)
    
    # 創建臨時文件路徑
    placeholder_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'images')
    os.makedirs(placeholder_dir, exist_ok=True)
    placeholder_path = os.path.join(placeholder_dir, f'placeholder_{width}x{height}.png')
    
    # 保存圖像
    with open(placeholder_path, 'wb') as f:
        f.write(img_encoded)
    
    return send_from_directory(os.path.dirname(placeholder_path), os.path.basename(placeholder_path))

# Add this to your app.py file

@app.route('/product_copy')
def product_copy():
    """商品文案生成頁面"""
    return render_template('product_copy.html')

@app.route('/api/chat', methods=['POST'])
def chat_api():
    """GPT API 聊天接口"""
    try:
        data = request.json
        messages = data.get('messages', [])
        model = data.get('model', 'gpt-3.5-turbo')
        
        if not messages:
            return jsonify({'success': False, 'message': '缺少消息內容'})
        
        # 這裡需要調用 OpenAI API 或其他 LLM API
        # 以下代碼僅為示例，需要替換為實際的 API 調用
        
        # import openai
        # openai.api_key = 'your-api-key'  # 請替換為您的 API 密鑰
        # 
        # response = openai.ChatCompletion.create(
        #     model=model,
        #     messages=messages,
        #     temperature=0.7,
        #     max_tokens=1500
        # )
        # 
        # ai_response = response.choices[0].message.content
        
        # 目前使用模擬回應進行測試
        last_message = messages[-1]['content']
        
        # 簡單的回應邏輯
        if '商品文案' in last_message:
            ai_response = """# 為您的商品生成的銷售文案

## 標題
✨ 革新生活品質，讓您的每一天都與眾不同！

## 賣點
1. **頂級材質**：精選高品質原料，耐用持久
2. **人體工學設計**：貼合使用習慣，舒適不費力
3. **多功能整合**：一機多用，滿足多樣需求
4. **智能操控**：簡單直覺的操作界面，老少咸宜

## 產品描述
這款產品是您日常生活的完美助手，採用頂級環保材質精心打造，不僅品質卓越，更兼具時尚美感。人體工學設計讓您使用時倍感舒適，大幅減輕疲勞感。多功能整合讓這款產品能夠適應各種場景需求，為您的生活增添便利與樂趣。直覺式操作界面讓任何年齡層的用戶都能輕鬆上手，徹底釋放您的創造力與生產力。

## 行動呼籲
🔥 限時優惠中！立即下單享9折優惠，再送精美禮品乙份，數量有限，手慢無！"""
        else:
            ai_response = "您好！我是您的 AI 文案助手，請告訴我您需要什麼樣的幫助，我會盡力為您服務。"
        
        # 計算點數消耗（示例）
        points_used = 0.05
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'points_used': points_used
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'處理請求時發生錯誤: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)