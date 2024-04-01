from flask import Flask, request, jsonify, send_from_directory, url_for
from mongoengine import (
    connect,
    Document,
    StringField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    DateTimeField,
    NotUniqueError,
    IntField,
)
from datetime import datetime
import os
from dotenv import load_dotenv
import requests
import base64
import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask_cors import CORS
from bson import json_util
import json
import stripe

load_dotenv()

connect(
    db="dall-e",
    host=os.getenv("MONGODB_URL"),
    alias="default",
)

engine_id = "stable-diffusion-v1-6"
api_host = "https://api.stability.ai"
config = cloudinary.config(secure=True)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


class Image(EmbeddedDocument):
    image_url = StringField(required=True)
    prompt = StringField()
    timestamp = DateTimeField()

    def to_dict(self):
        return {
            "image_url": self.image_url,
            "prompt": self.prompt,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }


class User(Document):
    email = StringField(required=True, unique=True)
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    plan = StringField(default="free")
    images = ListField(EmbeddedDocumentField(Image))
    generations = IntField(default=0)


class All_Images(Document):
    image_url = StringField(required=True)
    prompt = StringField(required=True)
    timestamp = DateTimeField()
    author = StringField(required=True)


app = Flask(__name__)
CORS(app)


@app.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()
    try:
        user = User(
            email=data["email"],
            username=data["username"],
            password=data["password"],
            plan=data.get("plan", "free"),
            images=data.get("images", []),
        )
        user.save()
        return "User created successfully", 201
    except NotUniqueError:
        return jsonify(error="User with this email or username already exists"), 400
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.objects(email=data["email"], password=data["password"]).first()
    if user:
        user_dict = user.to_mongo().to_dict()
        user_dict["_id"] = str(user_dict["_id"])
        return jsonify(user_dict), 200
    return jsonify(error="Invalid credentials"), 401


@app.route("/images/<user_id>", methods=["GET"])
def get_images(user_id):
    user = User.objects(id=user_id).first()
    if user:
        images = [image.to_dict() for image in user.images]
        return jsonify(images), 200
    return jsonify(error="User not found"), 404, {"Content-Type": "application/json"}


@app.route("/all_images", methods=["GET"])
def get_all_images():
    all_images = All_Images.objects()
    images = [json.loads(json_util.dumps(image.to_mongo())) for image in all_images]
    return jsonify(images), 200


@app.route("/generate/<user_id>", methods=["POST"])
def generate_image(user_id):
    dataPayload = request.get_json()
    user = User.objects(id=user_id).first()
    if user:
        if user.plan == "free" and user.generations >= 10:
            return (
                jsonify(
                    error="Generation limit reached. Upgrade to premium for unlimited generations."
                ),
                403,
            )
        try:
            api_key = os.getenv("IMAGE_KEY")
            response = requests.post(
                f"https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
                json={
                    "text_prompts": [{"text": dataPayload["prompt"]}],
                    "cfg_scale": 35,
                    "height": 1024,
                    "width": 1024,
                    "samples": 1,
                    "steps": 30,
                },
            )
            response.raise_for_status()

            data = response.json()

            image_urls = []
            for i, image in enumerate(data["artifacts"]):

                image_filename = f"v1_txt2img_{i}.png"
                image_path = os.path.join("static", image_filename)
                with open(image_path, "wb") as f:
                    f.write(base64.b64decode(image["base64"]))

                upload_result = cloudinary.uploader.upload(image_path)

                cloudinary_url = upload_result["secure_url"]

                image_urls.append(cloudinary_url)

                uploadedImageURL = jsonify(image_urls=image_urls)
                image = Image(
                    image_url=uploadedImageURL.json["image_urls"][0],
                    prompt=dataPayload["prompt"],
                    timestamp=datetime.now(),
                )
                user.images.append(image)
                user.generations += 1
                user.save()
                all_images = All_Images(
                    image_url=uploadedImageURL.json["image_urls"][0],
                    prompt=dataPayload["prompt"],
                    timestamp=datetime.now(),
                    author=user.username,
                )
                all_images.save()

                return jsonify(image.to_dict()), 200

        except Exception as e:
            return jsonify(error=str(e)), 500

    return jsonify(error="User not found"), 404


@app.route("/payment/<user_id>", methods=["POST"])
def pay(user_id):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {
                        'name': 'Premium plan',
                    },
                    'unit_amount': 1000000,  
                },
                'quantity': 1,
            }],
            mode="payment",
            success_url="http://localhost:5173/",
            cancel_url="http://localhost:5173/",
        )
        user = User.objects(id=user_id).first()
        user.plan = "premium"
        user.save()
        return jsonify(session), 200
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route("/")
def hello_world():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(debug=True)
