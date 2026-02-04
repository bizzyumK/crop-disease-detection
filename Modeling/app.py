# app.py - Streamlit Deployment for Crop Disease Detection

import streamlit as st
import numpy as np
from PIL import Image
import json
import tensorflow as tf
from tensorflow import keras

# Set page config
st.set_page_config(
    page_title="Crop Disease Detection",
    page_icon="🌱",
    layout="wide"
)

# Load model and data
@st.cache_resource
def load_model():
    model = keras.models.load_model("Modeling/models/best_model.keras", compile=False)
    return model

@st.cache_data
def load_class_indices():
    with open("Modeling/configs/class_indices.json", "r") as f:
        class_indices = json.load(f)
    idx_to_class = {v: k for k, v in class_indices.items()}
    return idx_to_class

@st.cache_data
def load_advisory_data():
    with open("Modeling/configs/advisory_system.json", "r", encoding="utf-8") as f:
        advisory = json.load(f)
    return advisory

# Load resources
model = load_model()
idx_to_class = load_class_indices()
advisory_data = load_advisory_data()

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
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Settings")
        language = st.radio(
            "Select Language",
            ["English", "Nepali"],
            index=0
        )
        
        st.header("ℹ️ About")
        st.markdown("""
        This system detects **45 different crop diseases** across **14 crops**:
        - Apple, Banana, Corn, Coffee
        - Grape, Mango, Orange, Peach
        - Potato, Strawberry, Sugarcane, Tomato, Cherry
        """)
        
        st.markdown("**Model Accuracy:** 96.18%")
        st.markdown("**F1-Score:** 95.16%")
    
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
            st.image(image, caption="Uploaded Image", use_container_width=True)
            
            if st.button("🔍 Analyze Disease", type="primary"):
                with st.spinner("Analyzing image..."):
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
                        st.progress(float(conf/100), text=f"{i+1}. {class_name} - {conf:.1f}%")
                    
                    # Advisory information
                    st.header("💡 Advisory Information")
                    advisory = get_advisory_info(top_class, language.lower())
                    st.markdown(advisory)
                    
                    # Emergency warning for critical diseases
                    if 'severity' in advisory_data["advisory_system"]["diseases"].get(top_class, {}) and \
                       advisory_data["advisory_system"]["diseases"][top_class]["severity"] in ["Critical", "High"]:
                        st.warning("⚠️ **URGENT ACTION REQUIRED** - This disease requires immediate attention!")
    
    with col2:
        if uploaded_file is None:
            st.header("📋 Supported Diseases")
            
            # Show disease categories
            diseases_by_crop = {}
            for class_name in idx_to_class.values():
                crop = class_name.split('__')[0] if '__' in class_name else 'Other'
                disease = class_name.split('__')[1] if '__' in class_name else class_name
                
                if crop not in diseases_by_crop:
                    diseases_by_crop[crop] = []
                diseases_by_crop[crop].append(disease)
            
            # Display in expanders
            for crop, diseases in diseases_by_crop.items():
                with st.expander(f"🌿 {crop}"):
                    for disease in diseases[:5]:  # Show first 5
                        st.write(f"- {disease}")
                    if len(diseases) > 5:
                        st.write(f"... and {len(diseases)-5} more")
            
            st.header("📸 Sample Images")
            st.markdown("""
            **Tips for best results:**
            1. Use clear, well-lit images
            2. Focus on the leaf surface
            3. Include only one leaf per image
            4. Avoid blurry or dark photos
            
            **Supported formats:** JPG, JPEG, PNG
            """)
    
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