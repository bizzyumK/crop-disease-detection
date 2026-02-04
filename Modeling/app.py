# app.py
import streamlit as st
import numpy as np
from PIL import Image
import json
import tensorflow as tf
from tensorflow import keras
import os
import random
from pathlib import Path

# Set page config
st.set_page_config(
    page_title="Crop Disease Detection",
    page_icon="🌱",
    layout="wide"
)

# Load model and data
@st.cache_resource
def load_model():
    model_path = "models/best_model.keras"
    if not os.path.exists(model_path):
        st.error(f"Model not found at {model_path}")
        return None
    model = keras.models.load_model(model_path, compile=False)
    return model

@st.cache_data
def load_class_indices():
    with open("configs/class_indices.json", "r") as f:
        class_indices = json.load(f)
    idx_to_class = {v: k for k, v in class_indices.items()}
    return idx_to_class

@st.cache_data
def load_advisory_data():
    with open("configs/advisory_system.json", "r", encoding="utf-8") as f:
        advisory = json.load(f)
    return advisory

# Load resources
model = load_model()
idx_to_class = load_class_indices()
advisory_data = load_advisory_data()

# Get sample test images
@st.cache_data
def get_sample_images():
    test_dir = Path("Crop Disease Dataset/test")
    sample_images = []
    
    if test_dir.exists():
        # Get all image files
        image_extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
        all_images = []
        for ext in image_extensions:
            all_images.extend(test_dir.glob(f"*{ext}"))
        
        # Select random samples (max 12)
        if all_images:
            num_samples = min(12, len(all_images))
            sample_paths = random.sample(all_images, num_samples)
            sample_images = [(str(path), path.name) for path in sample_paths]
    
    return sample_images

# Image preprocessing
def preprocess_image(image):
    img = image.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Get advisory information
def get_advisory_info(class_name, language="english"):
    info = advisory_data["advisory_system"]["diseases"].get(class_name, {})
    
    if not info:
        return "No advisory information available for this disease."
    
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
    
    # Get sample images
    sample_images = get_sample_images()
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Settings")
        language = st.radio(
            "Select Language",
            ["English", "Nepali"],
            index=0
        )
        
        st.header("📊 Model Info")
        st.metric("Accuracy", "96.18%")
        st.metric("Disease Classes", "45")
        st.metric("Crop Types", "14")
        
        st.header("📸 Sample Images")
        st.markdown("Try these test images:")
        
        # Create 2x2 grid for sample images
        cols = st.columns(2)
        for idx, (img_path, img_name) in enumerate(sample_images[:4]):
            with cols[idx % 2]:
                try:
                    img = Image.open(img_path)
                    # Resize for thumbnail
                    img.thumbnail((150, 150))
                    # FIXED: Changed use_column_width to use_container_width
                    st.image(img, caption=img_name[:20], use_container_width=True)
                except:
                    st.write(f"📄 {img_name[:20]}")
    
    # Main content
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("📤 Upload Image")
        uploaded_file = st.file_uploader(
            "Choose a leaf image",
            type=['jpg', 'jpeg', 'png']
        )
        
        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            # FIXED: Changed use_container_width=True
            st.image(image, caption="Uploaded Image", use_container_width=True)
            
            # Prediction button
            col_btn1, col_btn2 = st.columns(2)
            with col_btn1:
                predict_btn = st.button("🔍 Analyze Disease", type="primary", use_container_width=True)
            with col_btn2:
                clear_btn = st.button("🗑️ Clear", use_container_width=True)
            
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
                        top_class = idx_to_class[top_idx]
                        confidence = predictions[top_idx] * 100
                        
                        st.success(f"**Primary Diagnosis:** {top_class}")
                        st.metric("Confidence", f"{confidence:.1f}%")
                        
                        # Top 3 predictions
                        st.subheader("Top 3 Predictions:")
                        for i, idx in enumerate(top_indices):
                            class_name = idx_to_class[idx]
                            conf = predictions[idx] * 100
                            with st.expander(f"{i+1}. {class_name} - {conf:.1f}%"):
                                st.progress(float(conf/100))
                        
                        # Advisory information
                        st.header("💡 Advisory Information")
                        advisory = get_advisory_info(top_class, language.lower())
                        st.markdown(advisory)
                        
                        # Emergency warning for critical diseases
                        disease_info = advisory_data["advisory_system"]["diseases"].get(top_class, {})
                        if disease_info.get("severity") in ["Critical", "High"]:
                            st.error("⚠️ **URGENT ACTION REQUIRED** - This disease requires immediate attention!")
                            if "immediate_actions" in disease_info and language.lower() in disease_info["immediate_actions"]:
                                st.warning("**Immediate Actions:**")
                                for action in disease_info["immediate_actions"][language.lower()]:
                                    st.write(f"• {action}")
                        
                    except Exception as e:
                        st.error(f"Error during prediction: {str(e)}")
            
            if clear_btn:
                st.rerun()
    
    with col2:
        if uploaded_file is None:
            st.header("📋 Try Sample Images")
            st.markdown("Click on any sample image below to test the system:")
            
            # Display sample images in a grid
            if sample_images:
                # Create 3 columns for the grid
                cols = st.columns(3)
                for idx, (img_path, img_name) in enumerate(sample_images):
                    with cols[idx % 3]:
                        try:
                            img = Image.open(img_path)
                            # Display as clickable card
                            with st.container(border=True):
                                # FIXED: Changed use_column_width to use_container_width
                                st.image(img, use_container_width=True)
                                st.caption(img_name)
                                
                                # Button to load this image
                                if st.button(f"Use this image", key=f"sample_{idx}", use_container_width=True):
                                    # Store in session state
                                    st.session_state.selected_sample = img_path
                                    st.rerun()
                        except Exception as e:
                            st.write(f"📄 {img_name}")
                            st.caption("Click to load")
            
            # Handle selected sample image from session state
            if 'selected_sample' in st.session_state:
                try:
                    img = Image.open(st.session_state.selected_sample)
                    # FIXED: Changed use_column_width to use_container_width
                    st.image(img, caption="Selected Sample", use_container_width=True)
                    
                    # Auto-predict for sample image
                    with st.spinner("Analyzing sample image..."):
                        processed_img = preprocess_image(img)
                        predictions = model.predict(processed_img, verbose=0)[0]
                        
                        top_idx = np.argmax(predictions)
                        top_class = idx_to_class[top_idx]
                        confidence = predictions[top_idx] * 100
                        
                        st.success(f"**Result:** {top_class}")
                        st.metric("Confidence", f"{confidence:.1f}%")
                        
                        # Show advisory
                        st.markdown("**Advisory:**")
                        advisory = get_advisory_info(top_class, language.lower())
                        st.markdown(advisory)
                except:
                    st.error("Could not process selected image")
            
            st.header("🎯 Supported Crops")
            crops = ["Apple", "Banana", "Corn", "Coffee", "Grape", "Mango", 
                    "Orange", "Peach", "Potato", "Strawberry", "Sugarcane", "Tomato"]
            
            cols = st.columns(3)
            for idx, crop in enumerate(crops):
                with cols[idx % 3]:
                    st.info(f"🌿 {crop}")
    
    # Sample images section below upload
    st.markdown("---")
    st.header("📸 Test Set Samples")
    st.markdown("Available test images from the dataset:")
    
    if sample_images:
        # Display all sample images
        cols = st.columns(4)
        for idx, (img_path, img_name) in enumerate(sample_images):
            with cols[idx % 4]:
                try:
                    img = Image.open(img_path)
                    img.thumbnail((200, 200))
                    # FIXED: Changed use_column_width to use_container_width
                    st.image(img, caption=img_name, use_container_width=True)
                except:
                    st.text(f"{img_name}")
    else:
        st.warning("No test images found. Please add images to `Crop Disease Dataset/test/` directory.")
        st.info("Supported formats: JPG, JPEG, PNG")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center'>
    <p>🌾 Ready to help farmers make better crop management decisions!</p>
    <p><small>Model trained with 74,880 images • 45 disease classes • 96.18% accuracy</small></p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
