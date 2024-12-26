import os
import hashlib

def calculate_file_hash(file_path):
    """Calculate the hash of a file."""
    hasher = hashlib.md5()  # Use MD5 to generate hash
    with open(file_path, 'rb') as f:
        while chunk := f.read(8192):  # Read the file in chunks
            hasher.update(chunk)
    return hasher.hexdigest()

# Path to the folder containing images
folder_path = 'water bottles'

# Dictionary to store hashes of files
hashes = {}

# Loop through all files in the folder
for file_name in os.listdir(folder_path):
    file_path = os.path.join(folder_path, file_name)
    
    # Skip if it's not a file
    if not os.path.isfile(file_path):
        continue
    
    # Calculate the file's hash
    file_hash = calculate_file_hash(file_path)
    
    # Check if the hash is already in the dictionary
    if file_hash in hashes:
        # If duplicate, delete the file
        os.remove(file_path)
        print(f"Deleted duplicate: {file_path}")
    else:
        # Otherwise, add the hash to the dictionary
        hashes[file_hash] = file_name

print("Duplicate removal completed!")
