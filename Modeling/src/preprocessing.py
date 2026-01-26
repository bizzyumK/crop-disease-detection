"""
preprocessing.py
=================
Image preprocessing & augmentation utilities for
Crop Disease Detection & Advisory System

This module is aligned with:
- Notebook 01: Data Exploration & Understanding (LOCKED)
- Notebook 02: Data Preprocessing & Input Pipeline Preparation (LOCKED)

Design goals:
- Centralize all image preprocessing logic
- Keep training / validation behavior consistent
- Low-memory, CPU-friendly defaults
- Reusable across training, evaluation, and inference

NOTE:
- ImageDataGenerator is intentionally used instead of tf.data
  to support low-resource systems.
"""

from pathlib import Path
import yaml

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ------------------------------------------------------------------
# Default Paths (Project Structure Aware)
# ------------------------------------------------------------------
PROJECT_ROOT = Path.cwd()
CONFIG_DIR = PROJECT_ROOT / "Modeling" / "configs"

# ------------------------------------------------------------------
# Utility: Load YAML Config
# ------------------------------------------------------------------

def load_config(config_path: Path = CONFIG_DIR / "config.yaml"):
    """
    Load preprocessing & training configuration from YAML.
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r") as f:
        config = yaml.safe_load(f)

    return config


# ------------------------------------------------------------------
# Preprocessing Functions (Stateless)
# ------------------------------------------------------------------

def get_rescale_factor():
    """
    Return rescaling factor for image normalization.
    """
    return 1.0 / 255.0


# ------------------------------------------------------------------
# ImageDataGenerator Builders
# ------------------------------------------------------------------

def build_train_datagen(config: dict):
    """
    Build ImageDataGenerator for TRAINING with augmentation.
    """
    aug_cfg = config.get("augmentation", {})

    train_datagen = ImageDataGenerator(
        rescale=get_rescale_factor(),
        rotation_range=aug_cfg.get("rotation_range", 0),
        zoom_range=aug_cfg.get("zoom_range", 0.0),
        horizontal_flip=aug_cfg.get("horizontal_flip", False),
        brightness_range=tuple(aug_cfg.get("brightness_range", (1.0, 1.0))),
        width_shift_range=aug_cfg.get("width_shift_range", 0.0),
        height_shift_range=aug_cfg.get("height_shift_range", 0.0),
        fill_mode="nearest",
    )

    return train_datagen



def build_validation_datagen():
    """
    Build ImageDataGenerator for VALIDATION (no augmentation).
    """
    return ImageDataGenerator(rescale=get_rescale_factor())



def build_test_datagen():
    """
    Build ImageDataGenerator for TESTING / INFERENCE (no augmentation).
    """
    return ImageDataGenerator(rescale=get_rescale_factor())


# ------------------------------------------------------------------
# Flow Builder (Directory-Based)
# ------------------------------------------------------------------

def flow_from_directory(
    datagen: ImageDataGenerator,
    directory: Path,
    config: dict,
    shuffle: bool = True,
    class_mode: str = "categorical",
):
    """
    Wrapper around flow_from_directory for consistency.
    """
    image_cfg = config["image"]
    batch_size = config["training"]["batch_size"]

    return datagen.flow_from_directory(
        directory,
        target_size=tuple(image_cfg["size"]),
        batch_size=batch_size,
        color_mode=image_cfg["color_mode"],
        class_mode=class_mode,
        shuffle=shuffle,
    )


# ------------------------------------------------------------------
# Tensor-Level Preprocessing (Optional Future Use)
# ------------------------------------------------------------------

def preprocess_image_tensor(image):
    """
    Tensor-level preprocessing (kept for future tf.data upgrade).
    Currently performs only normalization.
    """
    image = tf.cast(image, tf.float32)
    image = image / 255.0
    return image


# ------------------------------------------------------------------
# Debug / Standalone Test
# ------------------------------------------------------------------

if __name__ == "__main__":
    config = load_config()

    train_datagen = build_train_datagen(config)
    val_datagen = build_validation_datagen()

    print("Preprocessing module loaded successfully")
    print("Image size:", config["image"]["size"])
    print("Batch size:", config["training"]["batch_size"])
