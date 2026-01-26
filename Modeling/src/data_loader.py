from pathlib import Path
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def get_train_generator(
    train_dir,
    image_size=(224, 224),
    batch_size=32,
    color_mode="rgb",
    class_mode="categorical",
    seed=42
):
    """
    Returns augmented training data generator
    """
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=25,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=(0.8, 1.2),
        width_shift_range=0.1,
        height_shift_range=0.1,
        fill_mode="nearest"
    )

    return train_datagen.flow_from_directory(
        directory=train_dir,
        target_size=image_size,
        batch_size=batch_size,
        color_mode=color_mode,
        class_mode=class_mode,
        shuffle=True,
        seed=seed
    )


def get_valid_generator(
    valid_dir,
    image_size=(224, 224),
    batch_size=32,
    color_mode="rgb",
    class_mode="categorical"
):
    """
    Returns validation data generator (NO augmentation)
    """
    valid_datagen = ImageDataGenerator(
        rescale=1./255
    )

    return valid_datagen.flow_from_directory(
        directory=valid_dir,
        target_size=image_size,
        batch_size=batch_size,
        color_mode=color_mode,
        class_mode=class_mode,
        shuffle=False
    )

