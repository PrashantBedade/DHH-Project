from flask import Flask, request, jsonify
import pandas as pd
import pickle
import os
from sklearn.metrics import accuracy_score

app = Flask(__name__)

# File paths
symptoms_file = "C:/Users/dell/OneDrive/Desktop/DHH FINAL/Disease prediction/symptoms_data.csv"
disease_file = "C:/Users/dell/OneDrive/Desktop/DHH FINAL/Disease prediction/disease_dataset.csv"
model_filename = "disease_prediction_model.pkl"

# Load datasets
if not os.path.exists(symptoms_file) or not os.path.exists(disease_file):
    raise FileNotFoundError("Required datasets not found.")

symptoms_df = pd.read_csv(symptoms_file, encoding="ISO-8859-1")
disease_df = pd.read_csv(disease_file, encoding="ISO-8859-1")

disease_df.columns = disease_df.columns.str.lower().str.strip()

# Ensure necessary columns exist
required_columns = {'symptom1', 'symptom2', 'symptom3', 'symptom4', 'disease'}
if not required_columns.issubset(symptoms_df.columns):
    raise KeyError(f"Missing columns: {required_columns - set(symptoms_df.columns)}")

# Create 'combined_symptoms' column
symptoms_df['combined_symptoms'] = symptoms_df[['symptom1', 'symptom2', 'symptom3', 'symptom4']].astype(str).agg(' '.join, axis=1)

# Load trained model
if not os.path.exists(model_filename):
    raise FileNotFoundError("Trained model not found. Please train the model first.")

with open(model_filename, 'rb') as f:
    model = pickle.load(f)

# Calculate model accuracy
X_test = symptoms_df['combined_symptoms']
y_test = symptoms_df['disease']
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# Prediction function
def predict_disease(symptoms):
    if not symptoms:
        return {"error": "No symptoms provided."}
    
    input_data = ' '.join(symptoms).lower().strip()
    
    try:
        predicted_disease = model.predict([input_data])[0]
        disease_info = disease_df[disease_df['disease'].str.lower() == predicted_disease.lower()]
        
        if not disease_info.empty:
            response = {
                "disease": predicted_disease,
                "description": disease_info['description'].values[0],
                "precaution": disease_info['precaution'].values[0],
                "medication": disease_info['medication'].values[0],
                "diet": disease_info['diet'].values[0],
                "accuracy": f"{accuracy * 100:.2f}%"
            }
        else:
            response = {"disease": predicted_disease, "info": "Details not available.", "accuracy": f"{accuracy * 100:.2f}%"}
        
        return response
    except Exception as e:
        return {"error": str(e)}

# API Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symptoms = data.get("symptoms", [])
        
        if not isinstance(symptoms, list) or not symptoms:
            return jsonify({"error": "Invalid input. Please provide a list of symptoms."}), 400
        
        result = predict_disease(symptoms)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)