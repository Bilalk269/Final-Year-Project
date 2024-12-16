import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
from PIL import Image
import io
import base64
import cv2
import os
import logging

app = Flask(__name__)
CORS(app)



MODEL_PATH = 'model/SBIR_model.keras'
FEATURES_PATH = 'model/features_list.pkl'
IMAGE_PATHS_PATH = 'model/image_paths.pkl'
THRESHOLD = 0.45

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
if not os.path.exists(FEATURES_PATH) or not os.path.exists(IMAGE_PATHS_PATH):
    raise FileNotFoundError("Features or image paths file not found.")

model = load_model(MODEL_PATH)
with open(FEATURES_PATH, 'rb') as f:
    features_array = np.array(pickle.load(f))
with open(IMAGE_PATHS_PATH, 'rb') as f:
    image_paths = pickle.load(f)

def extract_features_from_memory(image, model):
    img = image.resize((224, 224))
    img_data = tf.keras.preprocessing.image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = tf.keras.applications.vgg16.preprocess_input(img_data)
    features = model.predict(img_data)
    return features.flatten()

def find_similar_images(input_features, features_array, image_paths, top_n=10):
    similarities = cosine_similarity([input_features], features_array)[0]
    top_indices = np.argsort(similarities)[::-1][:top_n]
    top_similarities = similarities[top_indices]
    
    if top_similarities[0] < THRESHOLD:
        return {"message": "No similar item found."}, []

    similar_images = [(image_paths[i], similarities[i]) for i in top_indices]
    return {"message": "Similar items found."}, similar_images

def convert_to_sketch(image):
    img = np.array(image.convert("RGB"))
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    invert = cv2.bitwise_not(gray_image)
    blur = cv2.GaussianBlur(invert, (21, 21), 0)
    inverted_blur = cv2.bitwise_not(blur)
    sketch = cv2.divide(gray_image, inverted_blur, scale=256.0)
    return sketch

@app.route('/', methods=['GET'])
def home():
    return {"message": "Welcome to the Sketch-Based Image Retrieval API!"}, 200

@app.route('/find_similar', methods=['POST'])
def find_similar():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']

        allowed_types = {'image/jpeg', 'image/png', 'image/webp'}
        if file.content_type not in allowed_types:
            return jsonify({"error": "Invalid image type. Accepted formats: JPG, JPEG, PNG, WEBP"}), 400

        try:
            top_n = max(1, int(request.form.get('top_n', 10)))
        except ValueError:
            return jsonify({"error": "Invalid 'top_n' parameter"}), 400

        image = Image.open(io.BytesIO(file.read()))
        image.thumbnail((1024, 1024))
        input_features = extract_features_from_memory(image, model)
        response_message, similar_images = find_similar_images(input_features, features_array, image_paths, top_n=top_n)

        if response_message["message"] == "No similar item found.":
            return jsonify(response_message), 200

        similar_images_data = []
        for image_info in similar_images:
            image_path, similarity = image_info
            try:
                image_path_relative = os.path.join("model", "Dataset", image_path.replace("\\", "/"))
                with open(image_path_relative, "rb") as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                    similar_images_data.append({
                        "image": encoded_image,
                        "similarity": float(similarity)
                    })
            except Exception as e:
                logging.error(f"Error encoding image {image_path}: {e}")
                continue

        response_data = {
            "message": response_message["message"],
            "similar_images": similar_images_data
        }
        return jsonify(response_data), 200
    except Exception as e:
        logging.error(f"Error in find_similar endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/sketch', methods=['POST'])
def sketch():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']

        allowed_types = {'image/jpeg', 'image/png', 'image/webp'}
        if file.content_type not in allowed_types:
            return jsonify({"error": "Invalid image type. Accepted formats: JPG, JPEG, PNG, WEBP"}), 400

        image = Image.open(io.BytesIO(file.read()))
        image.thumbnail((1024, 1024))
        sketch_image = convert_to_sketch(image)

        _, buffer = cv2.imencode('.png', sketch_image)
        encoded_sketch = base64.b64encode(buffer).decode('utf-8')

        response_data = {
            "message": "Sketch generated successfully.",
            "sketch": encoded_sketch
        }
        return jsonify(response_data), 200
    except Exception as e:
        logging.error(f"Error in sketch endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
