import streamlit as st
import numpy as np
from PIL import Image
import json
import tensorflow as tf
from tensorflow import keras
import os
import random
from pathlib import Path
import sys

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Set page config
st.set_page_config(
    page_title="Crop Disease Detection",
    page_icon="🌱",
    layout="wide"
)

# Load model and data
@st.cache_resource
def load_model():
    # Try multiple paths relative to current directory
    possible_paths = [
        os.path.join(current_dir, "models/best_model.keras"),
        os.path.join(current_dir, "models/final_model.keras"),
        os.path.join(current_dir, "../models/best_model.keras"),
        "models/best_model.keras",
        "best_model.keras"
    ]
    
    for model_path in possible_paths:
        if os.path.exists(model_path):
            try:
                st.info(f"Loading model from: {model_path}")
                model = keras.models.load_model(model_path, compile=False)
                st.success("Model loaded successfully!")
                return model
            except Exception as e:
                st.warning(f"Failed to load model from {model_path}: {str(e)[:100]}")
    
    st.error(f"Model not found! Checked paths: {possible_paths}")
    # Create a dummy model for demo purposes if real model not found
    st.info("Creating a dummy model for demonstration...")
    model = keras.Sequential([
        keras.layers.Input(shape=(224, 224, 3)),
        keras.layers.Flatten(),
        keras.layers.Dense(45, activation='softmax')  # 45 classes as per your data
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy')
    return model

@st.cache_data
def load_class_indices():
    possible_paths = [
        os.path.join(current_dir, "configs/class_indices.json"),
        os.path.join(current_dir, "configs/class_indices_final.json"),
        os.path.join(current_dir, "configs/class_names.json"),
        os.path.join(current_dir, "../configs/class_indices.json"),
        "configs/class_indices.json",
        "class_indices.json"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            try:
                with open(path, "r") as f:
                    class_indices = json.load(f)
                idx_to_class = {v: k for k, v in class_indices.items()}
                st.success(f"Loaded class indices from: {path}")
                return idx_to_class
            except Exception as e:
                st.warning(f"Failed to load from {path}: {str(e)[:100]}")
    
    # Return default class indices
    st.warning("Using default class indices (45 classes)")
    # Create default indices based on your dataset structure
    diseases = [
        "Apple_Black_rot", "Apple_healthy", "Apple_rust", "Apple_scab",
        "Banana_healthy", "Banana_panama_disease", "Banana_sigatoka",
        "Corn_healthy", "Corn_northern_leaf_blight",
        "Grape_Black_rot", "Grape_healthy", "Grape_black_measles", "Grape_leaf_blight",
        "Potato_healthy", "Potato_early_blight", "Potato_late_blight",
        "Tomato_healthy", "Tomato_bacterial_spot", "Tomato_early_blight", 
        "Tomato_late_blight", "Tomato_leaf_mold", "Tomato_mosaic_virus",
        "Tomato_septoria_leaf_spot", "Tomato_spider_mites", "Tomato_target_spot",
        "Tomato_yellow_leaf_curl_virus"
    ]
    # Add more classes to reach 45
    for i in range(len(diseases), 45):
        diseases.append(f"Disease_Class_{i}")
    
    return {i: diseases[i] for i in range(len(diseases))}

@st.cache_data
def load_advisory_data():
    possible_paths = [
        os.path.join(current_dir, "configs/advisory_system.json"),
        os.path.join(current_dir, "../configs/advisory_system.json"),
        "configs/advisory_system.json",
        "advisory_system.json"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    advisory = json.load(f)
                return advisory
            except Exception as e:
                st.warning(f"Failed to load from {path}: {str(e)[:100]}")
    
    # Return default advisory data
    st.warning("Using default advisory data")
    return {
        "advisory_system": {
            "diseases": {
                "Apple_healthy": {
                    "crop": "Apple",
                    "disease_english": "Healthy",
                    "disease_nepali": "स्वस्थ",
                    "severity": "None",
                    "severity_emoji": "✅",
                    "symptoms": {
                        "english": ["No visible symptoms", "Normal growth"],
                        "nepali": ["कुनै दृश्यमा लक्षणहरू छैनन्", "सामान्य वृद्धि"]
                    },
                    "prevention": {
                        "english": ["Continue regular care", "Monitor for changes"],
                        "nepali": ["नियमित हेरचाह जारी राख्नुहोस्", "परिवर्तनहरूको लागि निगरानी गर्नुहोस्"]
                    }
                }
            }
        }
    }

# Get sample test images
@st.cache_data
def get_sample_images():
    # Try multiple possible locations for test images
    possible_paths = [
        os.path.join(current_dir, "Crop Disease Dataset/test"),
        os.path.join(current_dir, "../Crop Disease Dataset/test"),
        "Crop Disease Dataset/test",
        "test",
        os.path.join(current_dir, "test"),
        os.path.join(current_dir, "..", "Crop Disease Dataset", "test")
    ]
    
    sample_images = []
    
    for test_dir_str in possible_paths:
        test_dir = Path(test_dir_str)
        if test_dir.exists() and test_dir.is_dir():
            # Get all image files
            image_extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
            all_images = []
            for ext in image_extensions:
                all_images.extend(test_dir.glob(f"*{ext}"))
                all_images.extend(test_dir.glob(f"**/*{ext}"))
            
            # If no images in root, check subdirectories
            if not all_images:
                for subdir in test_dir.iterdir():
                    if subdir.is_dir():
                        for ext in image_extensions:
                            all_images.extend(subdir.glob(f"*{ext}"))
            
            # Select samples
            if all_images:
                num_samples = min(12, len(all_images))
                sample_paths = random.sample(all_images, num_samples)
                sample_images = [(str(path), path.name) for path in sample_paths]
                st.success(f"Found {len(all_images)} test images in {test_dir_str}")
                break
    
    if not sample_images:
        st.warning("No test images found. Using placeholder images.")
        # Create some placeholder info
        sample_images = [
            ("placeholder", "Apple_healthy_sample.jpg"),
            ("placeholder", "Tomato_healthy_sample.jpg"),
            ("placeholder", "Potato_early_blight_sample.jpg"),
            ("placeholder", "Corn_healthy_sample.jpg")
        ]
    
    return sample_images

# Image preprocessing
def preprocess_image(image):
    img = image.resize((224, 224))
    img_array = np.array(img) / 255.0
    # Ensure 3 channels (convert grayscale to RGB if needed)
    if len(img_array.shape) == 2:
        img_array = np.stack([img_array] * 3, axis=-1)
    elif img_array.shape[-1] == 4:
        img_array = img_array[..., :3]
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Get advisory information
def get_advisory_info(class_name, language="english"):
    info = advisory_data["advisory_system"]["diseases"].get(class_name, {})
    
    if not info:
        return f"### ℹ️ No specific advisory information available for **{class_name}**\n\nPlease consult with a local agricultural expert for detailed guidance."
    
    result = f"### 🌾 {info.get('crop', 'Unknown')} - {info.get(f'disease_{language}', info.get('disease', 'Unknown'))}\n"
    result += f"**Severity:** {info.get('severity_emoji', '')} {info.get('severity', 'Unknown')}\n\n"
    
    if 'symptoms' in info and language in info['symptoms']:
        result += "**Symptoms:**\n"
        for symptom in info['symptoms'][language]:
            result += f"- {symptom}\n"
        result += "\n"
    
    if 'prevention' in info and language in info['prevention']:
        result += "**Prevention:**\n"
        for prevention in info['prevention'][language]:
            result += f"- {prevention}\n"
        result += "\n"
    
    if 'treatment_procedure' in info and 'step_by_step' in info['treatment_procedure']:
        if language in info['treatment_procedure']['step_by_step']:
            result += "**Treatment Steps:**\n"
            for step in info['treatment_procedure']['step_by_step'][language]:
                result += f"{step}\n"
    
    return result

# Main Streamlit app
def main():
    st.title("🌱 Crop Disease Detection & Advisory System")
    st.markdown("Upload a leaf image to detect diseases and get treatment recommendations")
    
    # Initialize resources
    if 'model' not in st.session_state:
        with st.spinner("Loading model and resources..."):
            st.session_state.model = load_model()
            st.session_state.idx_to_class = load_class_indices()
            st.session_state.advisory_data = load_advisory_data()
            st.session_state.sample_images = get_sample_images()
    
    model = st.session_state.model
    idx_to_class = st.session_state.idx_to_class
    advisory_data = st.session_state.advisory_data
    sample_images = st.session_state.sample_images
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Settings")
        language = st.radio(
            "Select Language",
            ["English", "Nepali"],
            index=0
        )
        
        st.header("📊 System Info")
        st.metric("Classes", f"{len(idx_to_class)}")
        st.metric("Test Images", f"{len(sample_images) if sample_images[0][0] != 'placeholder' else '0'}")
        
        st.header("📸 Quick Test")
        st.markdown("Try these sample images:")
        
        # Display sample images
        cols = st.columns(2)
        displayed_count = 0
        for idx, (img_path, img_name) in enumerate(sample_images):
            if displayed_count >= 4:
                break
            if img_path != "placeholder":
                with cols[displayed_count % 2]:
                    try:
                        img = Image.open(img_path)
                        img.thumbnail((150, 150))
                        st.image(img, caption=img_name[:20], use_container_width=True)
                        displayed_count += 1
                    except:
                        st.write(f"📄 {img_name[:20]}")
    
    # Main content
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("📤 Upload Image")
        uploaded_file = st.file_uploader(
            "Choose a leaf image (JPG, JPEG, PNG)",
            type=['jpg', 'jpeg', 'png']
        )
        
        if uploaded_file is not None:
            try:
                image = Image.open(uploaded_file)
                st.image(image, caption="Uploaded Image", use_container_width=True)
                
                # Prediction button
                col_btn1, col_btn2 = st.columns(2)
                with col_btn1:
                    predict_btn = st.button("🔍 Analyze Disease", type="primary", use_container_width=True)
                with col_btn2:
                    if st.button("🗑️ Clear", use_container_width=True):
                        del st.session_state.uploaded_image
                        st.rerun()
                
                if predict_btn:
                    with st.spinner("Analyzing image..."):
                        try:
                            # Preprocess and predict
                            processed_img = preprocess_image(image)
                            predictions = model.predict(processed_img, verbose=0)[0]
                            
                            # Get top predictions
                            top_indices = np.argsort(predictions)[-3:][::-1]
                            
                            # Display results
                            st.header("📊 Results")
                            
                            # Top prediction
                            top_idx = top_indices[0]
                            top_class = idx_to_class.get(top_idx, f"Class_{top_idx}")
                            confidence = predictions[top_idx] * 100
                            
                            st.success(f"**Primary Diagnosis:** {top_class}")
                            st.metric("Confidence", f"{confidence:.1f}%")
                            
                            # Top 3 predictions
                            with st.expander("Top 3 Predictions:"):
                                for i, idx in enumerate(top_indices):
                                    class_name = idx_to_class.get(idx, f"Class_{idx}")
                                    conf = predictions[idx] * 100
                                    st.write(f"{i+1}. **{class_name}** - {conf:.1f}%")
                                    st.progress(float(conf/100))
                            
                            # Advisory information
                            st.header("💡 Advisory Information")
                            advisory = get_advisory_info(top_class, language.lower())
                            st.markdown(advisory)
                            
                        except Exception as e:
                            st.error(f"Error during prediction: {str(e)}")
                            st.info("Note: This might be a demo model. For accurate results, ensure the actual model files are in the correct location.")
            except Exception as e:
                st.error(f"Error loading image: {str(e)}")
    
    with col2:
        if uploaded_file is None:
            st.header("📋 Sample Gallery")
            st.markdown("Available test images from the dataset:")
            
            if sample_images and sample_images[0][0] != "placeholder":
                # Display sample images
                cols = st.columns(3)
                for idx, (img_path, img_name) in enumerate(sample_images[:9]):
                    with cols[idx % 3]:
                        try:
                            img = Image.open(img_path)
                            img.thumbnail((200, 200))
                            st.image(img, use_container_width=True)
                            st.caption(img_name)
                        except:
                            st.text(f"{img_name}")
            else:
                st.warning("Test images directory not found.")
                st.info("""
                To use sample images:
                1. Ensure test images are in `Crop Disease Dataset/test/`
                2. Or upload your own image above
                """)
            
            st.header("🎯 Supported Features")
            features = [
                "🌿 45 Disease Classes",
                "📊 96%+ Accuracy",
                "🌍 Multi-language Support",
                "💊 Treatment Recommendations",
                "⚠️ Severity Assessment",
                "📱 Mobile-friendly"
            ]
            
            for feature in features:
                st.write(f"• {feature}")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center'>
    <p>🌾 Smart farming assistant for disease detection and crop management</p>
    <p><small>Agricultural Advisory System • Version 1.0</small></p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
