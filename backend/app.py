from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from utils.file_handler import load_file
from utils.chat_handler import generate_response

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
df = None

load_dotenv()

@app.route('/upload', methods=['POST'])
def upload():
    global df
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(file_path)
        df = load_file(file_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify({'message': 'File uploaded successfully'})

@app.route('/chat', methods=['POST'])
def chat():
    global df
    if not request.is_json or 'message' not in request.json:
        return jsonify({'error': 'No message provided'}), 400
    user_message = request.json['message']
    try:
        result = generate_response(user_message, df)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify(result)

@app.route('/', methods=['GET'])
def index():
    return 'Welcome to the ChartBot API!'

if __name__ == '__main__':
    app.run(debug=True, port=8000)
