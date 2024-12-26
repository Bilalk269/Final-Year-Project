import os

MODEL_PATH = 'static/SBIR_model.keras'
FEATURES_PATH = 'static/features_list.pkl'
IMAGE_PATHS_PATH = 'static/image_paths.pkl'
DATASET_PATH = 'static/Dataset/'

THRESHOLD = 0.45
DEFAULT_TOP_N = 10
ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
MAX_IMAGE_SIZE = (1024, 1024)

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
if not os.path.exists(FEATURES_PATH) or not os.path.exists(IMAGE_PATHS_PATH):
    raise FileNotFoundError("Features or image paths file not found.")
