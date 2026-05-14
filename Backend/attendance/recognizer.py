import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import os
from django.conf import settings
from .models import Student
from .embedding_utils import (
    get_face_detector,
    get_face_encoder,
    json_to_embedding,
    compare_embeddings,
    FACENET_AVAILABLE
)

# Import FaceNet model
try:
    import torch
except ImportError:
    torch = None

def decode_base64_image(image_data):
    """Decode base64 image string to numpy array"""
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return np.array(image)
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def get_face_embedding(image_array):
    """Extract face embedding from image using FaceNet (single face)"""
    if not FACENET_AVAILABLE or torch is None:
        return None
    
    try:
        mtcnn = get_face_detector(keep_all=False)
        resnet = get_face_encoder()
        
        # Convert numpy array to PIL Image
        if isinstance(image_array, np.ndarray):
            image = Image.fromarray(image_array)
        else:
            image = image_array
        
        # Detect and align face
        face = mtcnn(image)
        
        if face is None:
            print("No face detected in image")
            return None
        
        # Get embedding
        with torch.no_grad():
            embedding = resnet(face.unsqueeze(0))
        
        return embedding.numpy().flatten()
    
    except Exception as e:
        print(f"Error extracting face embedding: {e}")
        return None


def get_multiple_face_embeddings(image_array):
    """Extract embeddings for all faces detected in image using FaceNet"""
    if not FACENET_AVAILABLE or torch is None:
        return []
    
    try:
        mtcnn = get_face_detector(keep_all=True)
        resnet = get_face_encoder()
        
        # Convert numpy array to PIL Image
        if isinstance(image_array, np.ndarray):
            image = Image.fromarray(image_array)
        else:
            image = image_array
        
        # Detect and align all faces - return_prob=True gives us boxes and probabilities
        faces, probs = mtcnn(image, return_prob=True)
        
        if faces is None or len(faces) == 0:
            print("No faces detected in image")
            return []
        
        print(f"Detected {len(faces)} face(s) in image")
        
        # Get embeddings for all detected faces
        embeddings = []
        with torch.no_grad():
            for idx, face in enumerate(faces):
                if face is not None:
                    embedding = resnet(face.unsqueeze(0))
                    embeddings.append({
                        'embedding': embedding.numpy().flatten(),
                        'confidence': float(probs[idx]) if probs is not None else 1.0,
                        'face_index': idx
                    })
                    print(f"  Face {idx + 1}: detection confidence = {probs[idx]:.3f}" if probs is not None else f"  Face {idx + 1}: processed")
        
        return embeddings
    
    except Exception as e:
        print(f"Error extracting multiple face embeddings: {e}")
        return []

def Recognizer(details, face_image_data=None):
    """
    Face recognition using stored embeddings:
      - details dict contains 'branch', 'year', 'section', 'period'
      - face_image_data is base64 encoded image from webcam
      - returns list of registration_id strings that are "recognized"
    
    This version uses pre-stored embeddings for faster recognition.
    """
    branch = details.get('branch')
    year = details.get('year')
    section = details.get('section')
    
    # Get all students in the class
    students = Student.objects.filter(
        branch__iexact=branch,
        year__iexact=year,
        section__iexact=section
    )
    
    # If no face image provided or FaceNet not available, return empty list (all absent)
    if not face_image_data or not FACENET_AVAILABLE:
        print("No face image provided or FaceNet not available")
        return []
    
    # Decode captured image
    captured_image = decode_base64_image(face_image_data)
    if captured_image is None:
        print("Failed to decode captured image")
        return []
    
    # Get embedding for captured face
    captured_embedding = get_face_embedding(captured_image)
    if captured_embedding is None:
        print("Could not extract face from captured image")
        return []
    
    print(f"Processing {students.count()} students...")
    
    # Compare captured face with each student's stored embedding
    recognized = []
    students_with_embeddings = 0
    
    for student in students:
        # Load student's stored embedding
        if not student.face_embedding:
            print(f"[WARN] No embedding stored for {student.registration_id}")
            continue
        
        students_with_embeddings += 1
        student_embedding = json_to_embedding(student.face_embedding)
        
        if student_embedding is None:
            print(f"[WARN] Invalid embedding for {student.registration_id}")
            continue
        
        # Compare embeddings
        if compare_embeddings(captured_embedding, student_embedding):
            recognized.append(student.registration_id)
            print(f"[OK] Recognized: {student.registration_id}")
    
    print(f"Total recognized: {len(recognized)} out of {students_with_embeddings} students with embeddings")
    return recognized


def MultiRecognizer(details, face_image_data=None, similarity_threshold=0.7):
    """
    Multi-face recognition using stored embeddings:
      - details dict contains 'branch', 'year', 'section', 'period'
      - face_image_data is base64 encoded image from webcam
      - similarity_threshold: cosine similarity threshold for matching (default: 0.6)
      - returns dict with:
        {
          'recognized_students': [{'registration_id': str, 'name': str, 'confidence': float}, ...],
          'unknown_faces_count': int,
          'total_faces_detected': int
        }
    
    This version detects and recognizes multiple faces simultaneously.
    """
    branch = details.get('branch')
    year = details.get('year')
    section = details.get('section')
    
    # Get all students in the class
    students = Student.objects.filter(
        branch__iexact=branch,
        year__iexact=year,
        section__iexact=section
    )
    
    # If no face image provided or FaceNet not available, return empty result
    if not face_image_data or not FACENET_AVAILABLE:
        print("No face image provided or FaceNet not available")
        return {
            'recognized_students': [],
            'unknown_faces_count': 0,
            'total_faces_detected': 0
        }
    
    # Decode captured image
    captured_image = decode_base64_image(face_image_data)
    if captured_image is None:
        print("Failed to decode captured image")
        return {
            'recognized_students': [],
            'unknown_faces_count': 0,
            'total_faces_detected': 0
        }
    
    # Get embeddings for all detected faces
    detected_faces = get_multiple_face_embeddings(captured_image)
    if not detected_faces:
        print("Could not extract any faces from captured image")
        return {
            'recognized_students': [],
            'unknown_faces_count': 0,
            'total_faces_detected': 0
        }
    
    print(f"Processing {len(detected_faces)} detected face(s) against {students.count()} students...")
    
    # Build student embedding database
    student_embeddings = {}
    students_with_embeddings = 0
    
    for student in students:
        if not student.face_embedding:
            print(f"[WARN] No embedding stored for {student.registration_id}")
            continue
        
        student_embedding = json_to_embedding(student.face_embedding)
        if student_embedding is None:
            print(f"[WARN] Invalid embedding for {student.registration_id}")
            continue
        
        student_embeddings[student.registration_id] = {
            'embedding': student_embedding,
            'student': student
        }
        students_with_embeddings += 1
    
    print(f"Loaded {students_with_embeddings} student embeddings")
    
    # Match each detected face against all student embeddings
    # We use a greedy assignment: best match for each student
    recognized_students = []
    student_to_best_match = {} # student_id -> {'face_idx', 'similarity', 'student_data'}
    
    for face_idx, face_data in enumerate(detected_faces):
        # Skip low confidence detections (MTCNN likely misidentified an object like a door)
        if face_data['confidence'] < 0.9:
            print(f"[FAIL] Face {face_idx + 1} skipped (low detection confidence: {face_data['confidence']:.3f})")
            continue

        captured_embedding = face_data['embedding']
        
        # Find best matching student for THIS detected face
        current_best_id = None
        current_best_sim = 0.0
        
        for reg_id, student_data in student_embeddings.items():
            student_embedding = student_data['embedding']
            
            # Calculate cosine similarity
            similarity = np.dot(captured_embedding, student_embedding) / (
                max(1e-9, np.linalg.norm(captured_embedding)) * max(1e-9, np.linalg.norm(student_embedding))
            )
            
            if similarity > current_best_sim and similarity > similarity_threshold:
                current_best_sim = similarity
                current_best_id = reg_id

        if current_best_id:
            # We found a potential student match for this face.
            # Check if this student already has an even better match from a different face in this photo
            if current_best_id not in student_to_best_match or current_best_sim > student_to_best_match[current_best_id]['similarity']:
                student_to_best_match[current_best_id] = {
                    'face_idx': face_idx,
                    'similarity': float(current_best_sim),
                    'student': student_embeddings[current_best_id]['student']
                }
                print(f"[OK] Face {face_idx + 1} match: {current_best_id} ({current_best_sim:.3f})")
        else:
            print(f"[FAIL] Face {face_idx + 1}: No match found above threshold {similarity_threshold}")

    # Build final recognition list from best matches
    for reg_id, match_data in student_to_best_match.items():
        student = match_data['student']
        recognized_students.append({
            'registration_id': reg_id,
            'name': f"{student.first_name} {student.last_name}",
            'confidence': match_data['similarity']
        })

    # Calculate statistics
    recognized_face_indices = {m['face_idx'] for m in student_to_best_match.values()}
    total_valid_faces = len([f for f in detected_faces if f['confidence'] >= 0.9])
    unknown_faces_count = total_valid_faces - len(recognized_face_indices)
    
    print(f"Summary: {len(recognized_students)} student(s) recognized, {unknown_faces_count} unknown face(s)")
    
    return {
        'recognized_students': recognized_students,
        'unknown_faces_count': unknown_faces_count,
        'total_faces_detected': len(detected_faces)
    }
