from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)  # Allow requests from your React frontend

# ──────────────────────────────────────────────
# 1. Class names — YOUR MODEL HAS 4 CLASSES
#    Change these to match your actual training labels!
# ──────────────────────────────────────────────
CLASS_NAMES = [
    "Normal",
    "Pneumonia",
    "Unknoun",
    "Tuberculosis",
]

# ──────────────────────────────────────────────
# 2. Load model
# ──────────────────────────────────────────────
def load_model(model_path: str):
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, len(CLASS_NAMES))
    state_dict = torch.load(model_path, map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()
    return model

MODEL_PATH = "model.pt"   # Put model.pt in the same folder as app.py
model = load_model(MODEL_PATH)

# ──────────────────────────────────────────────
# 3. Image preprocessing (standard ImageNet)
# ──────────────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.Grayscale(num_output_channels=3),   # X-rays are grayscale
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# ──────────────────────────────────────────────
# 4. Predict endpoint
# ──────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        # Decode base64 image sent from frontend
        image_data = data["image"]
        if "," in image_data:
            image_data = image_data.split(",")[1]   # strip "data:image/png;base64,"

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Run inference
        tensor = transform(image).unsqueeze(0)   # shape: [1, 3, 224, 224]
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]

        # Build predictions list
        predictions = [
            {
                "class": CLASS_NAMES[i],
                "confidence": round(probabilities[i].item() * 100, 1),
            }
            for i in range(len(CLASS_NAMES))
        ]
        predictions.sort(key=lambda x: x["confidence"], reverse=True)

        top = predictions[0]

        return jsonify({
            "diagnosis": top["class"],
            "confidence": top["confidence"],
            "allPredictions": predictions,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "classes": CLASS_NAMES})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)