import os
import base64
from groq import Groq
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def generate_text(image_bytes):
    """
    Generate a text description of an image focusing on a watch.
    Adjusts the response if no watch is found or if multiple objects exist.
    """
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    client = Groq()
    model_name = os.getenv("MODEL")
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Describe the image in detail, focusing only on a watch. "
                            "If the image does not contain a watch, respond with: "
                            "'Unfortunately, I am not able to generate a description for this object.' "
                            "If the image has multiple objects, simply state: "
                            "'I cannot provide a description for images with multiple objects.' "
                            "Use simple language and common vocabulary. Provide the description in either a paragraph or bullet points."
                        ),
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        model=model_name,
    )
    return response.choices[0].message.content
