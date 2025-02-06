from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins (for development)

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json
    if "input" in data:
        result = data["input"] * 2  # Example logic
        return jsonify({"output": result})
    else:
        return jsonify({"error": "Invalid input"}), 400

if __name__ == '__main__':
    app.run(debug=True)
