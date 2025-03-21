import os
import json
from PIL import Image

def get_folder_structure(base_path):
    folder_structure = {}
    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        if os.path.isdir(folder_path) and folder.isdigit():
            folder_structure[int(folder)] = get_images_recursively(folder_path, int(folder))
    return dict(sorted(folder_structure.items()))  # Sort by folder size

def get_images_recursively(folder_path, size):
    folder_dict = {}
    for root, _, files in os.walk(folder_path):
        relative_root = os.path.relpath(root, folder_path)
        if relative_root == ".":
            relative_root = ""

        images = [file for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

        if images:
            folder_dict.setdefault(relative_root, []).extend([(file, size) for file in images])

    return folder_dict

def resize_and_pad(image, target_size):
    """Resize image while maintaining aspect ratio, padding it to target_size."""
    img = Image.open(image).convert("RGBA")
    img.thumbnail((target_size, target_size), Image.LANCZOS)  # Resize while maintaining aspect ratio

    # Create blank canvas with transparent background
    new_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    paste_x = (target_size - img.width) // 2
    paste_y = (target_size - img.height) // 2
    new_img.paste(img, (paste_x, paste_y))  
    return new_img

def create_spritesheet(folder_structure, output_path="sprites.png", json_path="sprites.json"):
    """Create a sprite sheet and JSON metadata from folder_structure."""
    images = []
    metadata = {}
    
    # Load and process images
    for folder, subfolders in folder_structure.items():
        for subfolder, files in subfolders.items():
            for file_name, size in files:
                file_path = os.path.join(str(folder), subfolder, file_name) if subfolder else os.path.join(str(folder), file_name)
                resized_img = resize_and_pad(file_path, size)
                images.append((resized_img, folder, subfolder, file_name))

    images.sort(key=lambda x: x[1], reverse=True)

    first = images[0]

    w, h = first[1], first[1]
    bx, by = first[1], first[1]
    layout = [[first, 0, 0]]

    reset_bx = 0
    for i in images[1:]:
        size = i[1]
        if bx + size >= w and by + size >= h:
            if w <= h:
                layout.append([i, w, 0])
                reset_bx = w
                by = size
                bx = w
                w += size
            else:
                layout.append([i, 0, h])
                reset_bx = size
                bx = size
                by = h
                h += size
        else:
            if bx + size <= w:
                layout.append([i, bx, by])
                bx += size
                if bx == w:
                    by += size
                    bx = reset_bx
            else:
                bx = reset_bx
                by += size
                layout.append([i, bx, by])
                bx += size  

    spritesheet = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    # # Place images in the spritesheet
    for i, x, y in layout:
        img, folder, subfolder, file_name = i
        spritesheet.paste(img, (x, y))
        name = os.path.splitext(file_name)[0]

        if subfolder:
            metadata.setdefault(subfolder, {})[name] = {"start": [x, y], "size": [img.width, img.height]}
        else:
            metadata[name] = {"start": [x, y], "size": [img.width, img.height]}

    spritesheet.save(output_path)

    # Save metadata
    with open(json_path, "w") as json_file:
        json.dump(metadata, json_file, indent=4)

    print(f"Spritesheet saved as {output_path}")
    print(f"Metadata saved as {json_path}")

script_dir = os.path.dirname(os.path.abspath(__file__))
folder_structure = get_folder_structure(script_dir)
create_spritesheet(folder_structure, "../packages/server/common/sprites.png", "../packages/server/common/sprites.json")
