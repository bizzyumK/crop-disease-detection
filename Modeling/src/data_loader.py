"""
data_loader.py
================
Dataset loading & generator utilities for
Crop Disease Detection & Advisory System

This module is derived directly from:
- Notebook 01: Data Exploration & Understanding (LOCKED)
- Notebook 02: Data Preprocessing & Input Pipeline (LOCKED)

Design goals:
- Single source of truth for data loading
- Keras-compatible ImageDataGenerator pipelines
- Low-memory & CPU-friendly defaults
- Reusable across training, evaluation, and inference
"""

from pathlib import Path
import json
import yaml

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ------------------------------------------------------------------
# Default Paths (Project Structure Aware)
# ------------------------------------------------------------------
PROJECT_ROOT = Path.cwd()
DATASET_ROOT = PROJECT_ROOT / "Modeling" / "Crop Disease Dataset"
CONFIG_DIR = PROJECT_ROOT / "Modeling" / "configs"

TRAIN_DIR = DATASET_ROOT / "train"
VALID_DIR = DATASET_ROOT / "valid"
TEST_DIR = DATASET_ROOT / "test"

# ------------------------------------------------------------------
# Utility: Load Configuration
# ------------------------------------------------------------------

def load_config(config_path: Path = CONFIG_DIR / "config.yaml"):
    """
    Load YAML configuration saved during preprocessing.
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r") as f:
        config = yaml.safe_load(f)

    return config


# ------------------------------------------------------------------
# Utility: Load Class Indices
# ------------------------------------------------------------------

def load_class_indices(classes_path: Path = CONFIG_DIR / "classes.json"):
    """
    Load class-to-index mapping for label decoding.
    """
    if not classes_path.exists():
        raise FileNotFoundError(f"Classes file not found: {classes_path}")

    with open(classes_path, "r") as f:
        class_indices = json.load(f)

    return class_indices


# ------------------------------------------------------------------
# Generator Builders
# ------------------------------------------------------------------

def build_train_generator(config: dict):
    """
    Create training ImageDataGenerator with augmentation.
    """
    image_cfg = config["image"]
    aug_cfg = config["augmentation"]
    batch_size = config["training"]["batch_size"]

    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=aug_cfg.get("rotation_range", 0),
        zoom_range=aug_cfg.get("zoom_range", 0.0),
        horizontal_flip=aug_cfg.get("horizontal_flip", False),
        brightness_range=tuple(aug_cfg.get("brightness_range", (1.0, 1.0))),
        width_shift_range=aug_cfg.get("width_shift_range", 0.0),
        height_shift_range=aug_cfg.get("height_shift_range", 0.0),
        fill_mode="nearest",
    )

    generator = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=tuple(image_cfg["size"]),
        batch_size=batch_size,
        color_mode=image_cfg["color_mode"],
        class_mode="categorical",
        shuffle=True,
    )

    return generator



def build_validation_generator(config: dict):
    """
    Create validation ImageDataGenerator (NO augmentation).
    """
    image_cfg = config["image"]
    batch_size = config["training"]["batch_size"]

    valid_datagen = ImageDataGenerator(rescale=1.0 / 255)

    generator = valid_datagen.flow_from_directory(
        VALID_DIR,
        target_size=tuple(image_cfg["size"]),
        batch_size=batch_size,
        color_mode=image_cfg["color_mode"],
        class_mode="categorical",
        shuffle=False,
    )

    return generator



def build_test_generator(config: dict):
    """
    Create test ImageDataGenerator (NO labels, NO shuffle).
    """
    image_cfg = config["image"]
    batch_size = config["training"]["batch_size"]

    test_datagen = ImageDataGenerator(rescale=1.0 / 255)

    generator = test_datagen.flow_from_directory(
        TEST_DIR,
        target_size=tuple(image_cfg["size"]),
        batch_size=batch_size,
        color_mode=image_cfg["color_mode"],
        class_mode=None,
        shuffle=False,
    )

    return generator


# ------------------------------------------------------------------
# High-Level Convenience Loader
# ------------------------------------------------------------------

def load_data_generators():
    """
    Load config and return train, validation, test generators.

    Returns:
        train_gen, val_gen, test_gen, num_classes
    """
    config = load_config()

    train_gen = build_train_generator(config)
    val_gen = build_validation_generator(config)
    test_gen = build_test_generator(config)

    num_classes = train_gen.num_classes

    return train_gen, val_gen, test_gen, num_classes


# ------------------------------------------------------------------
# Debug / Standalone Test
# ------------------------------------------------------------------

if __name__ == "__main__":
    train_gen, val_gen, test_gen, num_classes = load_data_generators()

    print("Train samples:", train_gen.samples)
    print("Validation samples:", val_gen.samples)
    print("Test samples:", test_gen.samples)
    print("Number of classes:", num_classes)
