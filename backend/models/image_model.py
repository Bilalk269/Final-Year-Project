import numpy as np
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
import cv2
import os
import pickle
import base64
from PIL import Image
from config import MODEL_PATH, FEATURES_PATH, IMAGE_PATHS_PATH, THRESHOLD, DEFAULT_TOP_N, DATASET_PATH

model = tf.keras.models.load_model(MODEL_PATH)
features_array = np.array(pickle.load(open(FEATURES_PATH, 'rb')))
image_paths = pickle.load(open(IMAGE_PATHS_PATH, 'rb'))

def extract_features_from_image(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    img = image.resize((224, 224))
    img_data = tf.keras.preprocessing.image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = tf.keras.applications.vgg16.preprocess_input(img_data)
    features = model.predict(img_data)
    return features.flatten()

def find_similar_images(input_features):
    similarities = cosine_similarity([input_features], features_array)[0]
    valid_indices = np.where(similarities > THRESHOLD)[0]
    valid_indices = valid_indices[np.argsort(similarities[valid_indices])[::-1]]
    valid_indices = valid_indices[:DEFAULT_TOP_N]

    if len(valid_indices) == 0:
        return {"message": "No similar image found."}

    similar_images = []
    for idx in valid_indices:
        image_path = os.path.join(DATASET_PATH, image_paths[idx])
        with open(image_path, 'rb') as f:
            encoded_image = base64.b64encode(f.read()).decode('utf-8')
            similar_images.append({
                "image": encoded_image,
                "similarity": float(similarities[idx])
            })
    return {"similar_images": similar_images}

def convert_to_sketch(image):
    gray_image = cv2.cvtColor(np.array(image.convert("RGB")), cv2.COLOR_BGR2GRAY)
    inverted = cv2.bitwise_not(gray_image)
    blurred = cv2.GaussianBlur(inverted, (21, 21), 0)
    sketch = cv2.divide(gray_image, cv2.bitwise_not(blurred), scale=256.0)
    return sketch
