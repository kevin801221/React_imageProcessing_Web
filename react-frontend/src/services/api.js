import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Design API
export const designApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  generateDesign: (file, params) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add design parameters
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    
    return api.post('/design', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  saveDesign: (designId, name) => {
    return api.post('/save-design', { designId, name });
  },
};

// Knowledge Base API
export const knowledgeBaseApi = {
  getFiles: () => {
    return api.get('/knowledge-files');
  },
  
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload-knowledge-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteFile: (fileId) => {
    return api.delete(`/knowledge-file/${fileId}`);
  },
  
  queryKnowledge: (query) => {
    return api.post('/query-knowledge', { query });
  },
};

// Product Copy API
export const productCopyApi = {
  generateCopy: async (params) => {
    try {
      // 從本地存儲獲取 Ollama API URL
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{"ollama_url":"http://localhost:11434/api/generate","ollama_model":"gemma3:12b"}');
      const ollamaUrl = settings.ollama_url || 'http://localhost:11434/api/generate';
      const ollamaModel = settings.ollama_model || 'gemma3:12b';
      
      // 確保 URL 是完整的 generate API 端點
      let fullOllamaUrl = ollamaUrl;
      if (!fullOllamaUrl.endsWith('/api/generate')) {
        // 移除可能的尾部斜線
        if (fullOllamaUrl.endsWith('/')) {
          fullOllamaUrl = fullOllamaUrl.slice(0, -1);
        }
        
        // 如果 URL 已經包含 /api 但不是 /api/generate
        if (fullOllamaUrl.endsWith('/api')) {
          fullOllamaUrl = `${fullOllamaUrl}/generate`;
        } 
        // 如果 URL 不包含 /api
        else if (!fullOllamaUrl.includes('/api')) {
          fullOllamaUrl = `${fullOllamaUrl}/api/generate`;
        }
      }
      
      console.log('Using Ollama API URL:', fullOllamaUrl);
      console.log('Using Ollama Model:', ollamaModel);
      
      // 構建提示詞模板
      const prompt = `你是一個專業的商品文案撰寫專家。請根據以下產品信息，生成一個吸引人的商品銷售文案。

產品名稱: ${params.productName}
產品類型: ${params.productType}
目標受眾: ${params.targetAudience || '一般消費者'}
產品特點: ${params.keyFeatures || '高品質、實用、耐用'}
價格定位: ${params.pricePoint || '中等價位'}
獨特賣點: ${params.uniqueSellingPoints || '無'}
競爭優勢: ${params.competitiveAdvantage || '無'}
文案風格: ${getStyleDescription(params.tone)}
文案長度: ${getLengthDescription(params.length)}

請按照以下格式生成文案:
1. 標題：吸引人的主標題
2. 副標題：補充說明標題
3. 開場白：引起讀者興趣的開場
4. 產品特點：列出3-5個產品特點，每個特點包含簡短說明
5. 產品描述：詳細描述產品的優勢和使用場景
6. 社會證明：加入一些虛構的正面評價或使用者見證
7. 行動呼籲：鼓勵讀者立即購買的呼籲語

請使用繁體中文，確保文案具有說服力和吸引力。根據產品特性調整內容，突出產品的獨特賣點。`;
      
      // 直接調用 Ollama API
      const response = await axios.post(fullOllamaUrl, {
        model: ollamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: getToneTemperature(params.tone),
          top_p: 0.9,
          top_k: 40
        }
      });
      
      // 處理 Ollama API 回應
      if (response.data && response.data.response) {
        return {
          data: {
            success: true,
            copy: response.data.response,
            points_used: 0.05
          }
        };
      } else {
        throw new Error('無法從 Ollama API 獲取回應');
      }
    } catch (error) {
      console.error('調用 Ollama API 時出錯:', error);
      
      // 如果 API 調用失敗，使用備用方案
      return api.post('/product-copy', params);
    }
  },
  
  saveCopy: (copyId, name) => {
    return api.post('/save-copy', { copyId, name });
  },
};

// 輔助函數：根據風格獲取溫度參數
function getToneTemperature(tone) {
  const toneMap = {
    professional: 0.5,  // 更保守，更專業
    casual: 0.7,        // 中等創意
    enthusiastic: 0.8,  // 較高創意
    humorous: 0.9,      // 高創意
    luxury: 0.6         // 中等保守，注重品質
  };
  
  return toneMap[tone] || 0.7;
}

// 輔助函數：獲取風格描述
function getStyleDescription(tone) {
  const styleMap = {
    professional: '專業正式，使用專業術語和清晰的結構',
    casual: '輕鬆隨意，使用日常用語和親切的語調',
    enthusiastic: '熱情洋溢，使用積極正面的語言和感嘆句',
    humorous: '幽默風趣，適當加入一些輕鬆的笑點',
    luxury: '高端奢華，強調品質、獨特性和尊貴感'
  };
  
  return styleMap[tone] || '專業正式';
}

// 輔助函數：獲取長度描述
function getLengthDescription(length) {
  const lengthMap = {
    short: '簡短精煉，約200-300字',
    medium: '中等長度，約400-600字',
    long: '詳盡全面，約700-1000字'
  };
  
  return lengthMap[length] || '中等長度，約400-600字';
}

// Image Understanding API
export const imageUnderstandingApi = {
  analyzeImage: async (file) => {
    try {
      // 從本地存儲獲取 Ollama API URL
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{"ollama_url":"http://localhost:11434/api/generate","ollama_model":"gemma3:12b"}');
      const ollamaUrl = settings.ollama_url || 'http://localhost:11434/api/generate';
      const ollamaModel = settings.ollama_model || 'gemma3:12b';
      
      // 確保 URL 是完整的 generate API 端點
      let fullOllamaUrl = ollamaUrl;
      if (!fullOllamaUrl.endsWith('/api/generate')) {
        // 移除可能的尾部斜線
        if (fullOllamaUrl.endsWith('/')) {
          fullOllamaUrl = fullOllamaUrl.slice(0, -1);
        }
        
        // 如果 URL 已經包含 /api 但不是 /api/generate
        if (fullOllamaUrl.endsWith('/api')) {
          fullOllamaUrl = `${fullOllamaUrl}/generate`;
        } 
        // 如果 URL 不包含 /api
        else if (!fullOllamaUrl.includes('/api')) {
          fullOllamaUrl = `${fullOllamaUrl}/api/generate`;
        }
      }
      
      console.log('Image Analysis - Using Ollama API URL:', fullOllamaUrl);
      console.log('Image Analysis - Using Ollama Model:', ollamaModel);
      
      // 將圖像轉換為 base64
      const base64Image = await convertFileToBase64(file);
      
      // 構建提示詞模板
      const prompt = `你是一個專業的圖像分析專家，請分析以下圖像並生成詳細的商品文案。

請按照以下格式提供分析結果：

1. 圖像內容概述：簡要描述圖像中顯示的內容
2. 產品識別：識別圖像中的產品類型、品牌（如果可見）和主要特點
3. 產品特點分析：列出產品的主要特點和功能
4. 目標受眾：分析這個產品適合哪些消費者群體
5. 商品文案建議：
   - 標題：吸引人的主標題
   - 副標題：補充說明標題
   - 產品描述：詳細描述產品的優勢和使用場景
   - 賣點列表：3-5個產品賣點
   - 行動呼籲：鼓勵讀者購買的呼籲語

請使用繁體中文，確保文案具有說服力和吸引力。`;
      
      // 直接調用 Ollama API，使用 Gemma 3 12B 模型
      const response = await axios.post(fullOllamaUrl, {
        model: ollamaModel,
        prompt: prompt,
        images: [base64Image],
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40
        }
      });
      
      // 處理 Ollama API 回應
      if (response.data && response.data.response) {
        return {
          data: {
            success: true,
            analysis: response.data.response,
            points_used: 0.1
          }
        };
      } else {
        throw new Error('無法從 Ollama API 獲取回應');
      }
    } catch (error) {
      console.error('調用 Ollama API 時出錯:', error);
      
      // 如果 API 調用失敗，使用備用方案
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/image-understanding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },
};

// 輔助函數：將文件轉換為 base64
async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // 移除 data:image/jpeg;base64, 前綴
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Settings API
export const settingsApi = {
  getSettings: () => {
    return api.get('/settings');
  },
  
  updateSettings: (settings) => {
    return api.post('/settings', settings);
  },
};

// Auth API
export const authApi = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  logout: () => {
    return api.post('/auth/logout');
  },
  
  getCurrentUser: () => {
    return api.get('/auth/user');
  },
  
  getPointsBalance: () => {
    return api.get('/auth/points');
  },
  
  getPointsHistory: () => {
    return api.get('/auth/points/history');
  },
  
  addPoints: (amount) => {
    return api.post('/auth/points/add', { amount });
  },
};

// Export all APIs
export default {
  design: designApi,
  knowledgeBase: knowledgeBaseApi,
  productCopy: productCopyApi,
  imageUnderstanding: imageUnderstandingApi,
  settings: settingsApi,
  auth: authApi,
};
