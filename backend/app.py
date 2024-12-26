from flask import Flask
from flask_cors import CORS
from controllers.find_similar_image_controller import find_similar
from controllers.sketch_controller import sketch

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return {"message": "Welcome to the Sketch-Based Image Retrieval API"}, 200

@app.route('/find_similar', methods=['POST'])
def find_similar_endpoint():
    return find_similar()

@app.route('/sketch', methods=['POST'])
def sketch_endpoint():
    return sketch()

if __name__ == '__main__':
    app.run(debug=True,port=5000,host='0.0.0.0')
