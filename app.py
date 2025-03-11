from flask import Flask, render_template, request, jsonify, send_from_directory, url_for
import os
import json
import uuid
import base64
import io
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

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DESIGN_OUTPUT_FOLDER, exist_ok=True)
os.makedirs(ANNOTATIONS_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DESIGN_OUTPUT_FOLDER'] = DESIGN_OUTPUT_FOLDER
app.config['ANNOTATIONS_FOLDER'] = ANNOTATIONS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 限制上傳文件大小為 16MB

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('pen_html.html')

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
    
    if file and allowed_file(file.filename):
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

if __name__ == '__main__':
    app.run(debug=True, port=5001)