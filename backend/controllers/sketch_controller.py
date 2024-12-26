from flask import request
from models.image_model import convert_to_sketch
from views.responses import success_response, error_response
from PIL import Image
import io
import cv2
import base64
import logging

logging.basicConfig(level=logging.INFO)

def sketch():
    try:
        if 'image' not in request.files:
            return error_response("No image provided")
        file = request.files['image']

        image = Image.open(io.BytesIO(file.read()))
        sketch_image = convert_to_sketch(image)

        _, buffer = cv2.imencode('.png', sketch_image)
        encoded_sketch = base64.b64encode(buffer).decode('utf-8')

        return success_response({"message": "Sketch generated successfully.", "sketch": encoded_sketch})
    except Exception as e:
        logging.error(f"Error in sketch: {e}")
        return error_response(str(e))
