from flask import Flask, request, jsonify
import pickle
import os
import random
from flask_cors import CORS  # Add this import for CORS support

app = Flask(__name__)
CORS(app, resources={r"/chatbot": {"origins": "*"}})

# Load the processed data from the .pkl file
try:
    file_path = os.path.join(os.path.dirname(__file__), 'chatbot_DD.pkl')
    with open(file_path, 'rb') as file:
     data = pickle.load(file)
    with open('chatbot_DD.pkl', 'rb') as file:
        data = pickle.load(file)
        print("Data loaded successfully!")
except FileNotFoundError:
    print("Error: 'chatbot_DD.pkl' file not found. Please ensure the file exists in the directory.")
    exit()

# Predefined responses for common inputs
manual_responses = {
    "Hii": "Hello! How can I assist you today?",
    "Hello": "Hi there! How may I help you?",
    "How are you": "I'm just a bot, but I'm here to help you. How can I assist you?",
    "Good morning": "Good morning! What can I do for you today?",
    "Good evening": "Good evening! How can I be of service?",
    "Thank you": "You're welcome! Let me know if you need further assistance.",
    "Bye": "Goodbye! Take care and stay healthy!"
}

# Function to generate chatbot responses
def chatbot_response(user_input):
    user_input = user_input.lower().strip()  # Normalize input to lowercase and remove extra spaces

    # Check for manual responses
    if user_input in manual_responses:
        return manual_responses[user_input]

    # Search for an exact disease match in the dataset
    disease_row = data[(data['Source'] == 'DesDie') & 
                       (data['Processed_Disease'] == user_input)]

    if not disease_row.empty:
        # Disease-related response
        disease_name = disease_row['Disease'].values[0]
        description = disease_row['Description'].values[0] if 'Description' in disease_row else "No description available."
        diet = disease_row['Diet'].values[0] if 'Diet' in disease_row else "No diet information available."
        return f"Disease: {disease_name}\nDescription: {description}\nDiet: {diet}"

    # Search for a matching general question in the dataset
    question_row = data[(data['Source'] == 'ExpandedHealth') & 
                        (data['Processed_Question'].str.contains(user_input, case=False, na=False))]

    if not question_row.empty:
        # General question response
        question = question_row['Question'].values[0]
        answer = question_row['Answer'].values[0] if 'Answer' in question_row else "No answer available."
        return f"Question: {question}\nAnswer: {answer}"

    # Fallback response if no matches are found
    generic_responses = [
        "I'm here to help! Could you provide more details?",
        "I'm sorry, I couldn't find information on that. Could you try rephrasing?",
        "How can I assist you further?",
        "I'm not sure I understand. Could you elaborate?"
    ]
    return random.choice(generic_responses)

# API route to handle chatbot messages
@app.route('/chatbot', methods=['POST'])
def chatbot_api():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"reply": "Please provide a message."})

    reply = chatbot_response(user_input)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True, port=5012)
