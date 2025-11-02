from flask import Flask, request, jsonify
import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score

# File paths
symptoms_file = "C:/Users/Chetan Darade/Downloads/Disease prediction new/Disease prediction/symptoms_df.csv"
description_file = "C:/Users/Chetan Darade/Downloads/Disease prediction new/Disease prediction/description.csv"
precautions_file = "C:/Users/Chetan Darade/Downloads/Disease prediction new/Disease prediction/precautions_df.csv"
medications_file = "C:/Users/Chetan Darade/Downloads/Disease prediction new/Disease prediction/medications.csv"
workout_file = "C:/Users/Chetan Darade/Downloads/Disease prediction new/Disease prediction/workout_df.csv"
diets_file = "C:/Users/Chetan Darade/Downloads/Disease prediction new/Disease prediction/diets.csv"

# Initialize Flask app
app = Flask(__name__)

# Check if the files exist
required_files = [symptoms_file, description_file, precautions_file, medications_file, workout_file, diets_file]
for file in required_files:
    if not os.path.exists(file):
        raise FileNotFoundError(f"Required file not found: {file}")

# Load the symptoms dataset
try:
    symptoms_df = pd.read_csv(symptoms_file)
    if 'symptom' not in symptoms_df.columns or 'disease' not in symptoms_df.columns:
        raise ValueError("The symptoms dataset must contain 'symptom' and 'disease' columns.")
except Exception as e:
    raise Exception(f"Error loading symptoms dataset: {e}")

# Prepare the features and labels for training
X = symptoms_df['symptom'].str.strip().str.lower()
y = symptoms_df['disease']

# Create a pipeline that vectorizes the symptoms and applies an SVM model
model = make_pipeline(
    CountVectorizer(),  # Convert symptoms into a bag of words
    SVC(kernel='linear')  # Support Vector Machine classifier
)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Save the model and the datasets into a pickle file
save_data = {
    'model': model,
    'description': pd.read_csv(description_file),
    'precautions': pd.read_csv(precautions_file),
    'medications': pd.read_csv(medications_file),
    'workout': pd.read_csv(workout_file),
    'diets': pd.read_csv(diets_file)
}

with open('disease_prediction_model_and_data.pkl', 'wb') as f:
    pickle.dump(save_data, f)

# Function to predict disease
def predict_disease(symptoms):
    input_data = ' '.join(symptoms).lower().strip()

    # Load the model and data from the pickle file
    with open('disease_prediction_model_and_data.pkl', 'rb') as f:
        data = pickle.load(f)
    
    model = data['model']

    # Predict disease using the trained model
    predicted_disease = model.predict([input_data])[0]
    return predicted_disease

# Function to fetch detailed information
def get_disease_details(disease):
    # Load the datasets from the pickle file
    try:
        with open('disease_prediction_model_and_data.pkl', 'rb') as f:
            data = pickle.load(f)

        description_df = data['description']
        precautions_df = data['precautions']
        medications_df = data['medications']
        workout_df = data['workout']
        diets_df = data['diets']

        # Check if disease exists in the dataset
        description = description_df.loc[description_df['disease'] == disease, 'description'].values
        precautions = precautions_df.loc[precautions_df['disease'] == disease].iloc[0, 1:].dropna().tolist()
        medications = medications_df.loc[medications_df['disease'] == disease].iloc[0, 1:].dropna().tolist()
        workout = workout_df.loc[workout_df['disease'] == disease].iloc[0, 1:].dropna().tolist()
        diets = diets_df.loc[diets_df['disease'] == disease].iloc[0, 1:].dropna().tolist()

        # If disease is not found, return default message
        if len(description) == 0:
            description = ["Description not available"]

        if not precautions:
            precautions = ["Precautions not available"]

        if not medications:
            medications = ["Medications not available"]

        if not workout:
            workout = ["Workout details not available"]

        if not diets:
            diets = ["Diet information not available"]

        return description[0], precautions, medications, workout, diets
    except Exception as e:
        print(f"Error loading disease details: {e}")
        return None, None, None, None, None

# Flask route for disease prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get symptoms from user input
    user_input = request.json.get('symptoms', '')
    symptoms = [symptom.strip() for symptom in user_input.split(',')]

    try:
        predicted_disease = predict_disease(symptoms)

        description, precautions, medications, workout, diets = get_disease_details(predicted_disease)

        response = {
            'predicted_disease': predicted_disease,
            'description': description,
            'precautions': precautions,
            'medications': medications,
            'workout': workout,
            'diets': diets
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
