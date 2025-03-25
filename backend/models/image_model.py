import os
import pickle
import base64
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
from config import MODEL_PATH, FEATURES_PATH, IMAGE_PATHS_PATH, DATASET_PATH, THRESHOLD, DEFAULT_TOP_N

# Load model and precomputed data
model = tf.keras.models.load_model(MODEL_PATH)
with open(FEATURES_PATH, 'rb') as f:
    features_array = np.array(pickle.load(f))
with open(IMAGE_PATHS_PATH, 'rb') as f:
    image_paths = pickle.load(f)

def extract_features_from_image(image: Image.Image):
    """Extract features from the input image using a pre-trained model."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    img = image.resize((224, 224))
    img_data = tf.keras.preprocessing.image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = tf.keras.applications.vgg16.preprocess_input(img_data)
    features = model.predict(img_data)
    return features.flatten()

def find_similar_images(input_features,THRESHOLD): 
    """Return similar images based on cosine similarity."""
    similarities = cosine_similarity([input_features], features_array)[0]
    valid_indices = np.where(similarities > THRESHOLD)[0]
    valid_indices = valid_indices[np.argsort(similarities[valid_indices])[::-1]]
    valid_indices = valid_indices[:DEFAULT_TOP_N]

    if len(valid_indices) == 0:
        return {"message": "No similar image found."}

    similar_images = []
    for idx in valid_indices:
        image_file_path = os.path.join(DATASET_PATH, image_paths[idx])
        with open(image_file_path, 'rb') as f:
            encoded_image = base64.b64encode(f.read()).decode('utf-8')
        similar_images.append({
            "image": encoded_image,
            "similarity": float(similarities[idx])
        })
    return {"similar_images": similar_images}

def convert_to_sketch(image: Image.Image):
    """Convert the input image into a sketch using OpenCV."""
    gray_image = cv2.cvtColor(np.array(image.convert("RGB")), cv2.COLOR_BGR2GRAY)
    inverted = cv2.bitwise_not(gray_image)
    blurred = cv2.GaussianBlur(inverted, (21, 21), 0)
    sketch = cv2.divide(gray_image, cv2.bitwise_not(blurred), scale=256.0)
    return sketch
