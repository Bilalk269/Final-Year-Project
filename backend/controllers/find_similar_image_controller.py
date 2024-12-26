from flask import request
from models.image_model import extract_features_from_image, find_similar_images
from views.responses import success_response, error_response
from PIL import Image
import logging
import io

logging.basicConfig(level=logging.INFO)

def find_similar():
    try:
       
        if 'image' not in request.files:
            return error_response("No image provided")
        file = request.files['image']

        image = Image.open(io.BytesIO(file.read()))
        input_features = extract_features_from_image(image)

        similar_images = find_similar_images(input_features)
        

        return success_response(similar_images)
    except Exception as e:
        logging.error(f"Error in find_similar: {e}")
        return error_response(str(e))
