from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
import pandas as pd
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)

# Initialize anomaly detection model
model = IsolationForest(
    contamination=0.1,  # 10% of data expected to be anomalies
    random_state=42
)

# Training data (will be updated with real voting patterns)
training_data = []

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/train', methods=['POST'])
def train_model():
    """Train the anomaly detection model with historical data"""
    try:
        data = request.json
        
        if not data or 'patterns' not in data:
            return jsonify({'error': 'No training data provided'}), 400
        
        patterns = data['patterns']
        
        # Convert to DataFrame
        df = pd.DataFrame(patterns)
        
        # Extract features
        features = extract_features(df)
        
        # Train model
        model.fit(features)
        
        return jsonify({
            'success': True,
            'message': f'Model trained with {len(patterns)} patterns',
            'features_count': features.shape[1]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/detect', methods=['POST'])
def detect_anomaly():
    """Detect if a voting pattern is anomalous"""
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract features from single vote
        features = extract_single_vote_features(data)
        
        # Predict
        prediction = model.predict([features])[0]
        score = model.score_samples([features])[0]
        
        is_anomaly = prediction == -1
        confidence = abs(score)
        
        # Determine risk level
        if confidence > 0.5:
            risk_level = 'high'
        elif confidence > 0.3:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return jsonify({
            'is_anomaly': bool(is_anomaly),
            'confidence': float(confidence),
            'risk_level': risk_level,
            'score': float(score),
            'details': analyze_anomaly(data, features) if is_anomaly else None
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch-detect', methods=['POST'])
def batch_detect():
    """Detect anomalies in batch of votes"""
    try:
        data = request.json
        
        if not data or 'votes' not in data:
            return jsonify({'error': 'No votes provided'}), 400
        
        votes = data['votes']
        results = []
        
        for vote in votes:
            features = extract_single_vote_features(vote)
            prediction = model.predict([features])[0]
            score = model.score_samples([features])[0]
            
            results.append({
                'vote_id': vote.get('voteId'),
                'is_anomaly': bool(prediction == -1),
                'confidence': float(abs(score)),
                'score': float(score)
            })
        
        anomaly_count = sum(1 for r in results if r['is_anomaly'])
        
        return jsonify({
            'total_votes': len(votes),
            'anomalies_detected': anomaly_count,
            'anomaly_rate': anomaly_count / len(votes) if votes else 0,
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_features(df):
    """Extract features from voting patterns DataFrame"""
    features = []
    
    for _, row in df.iterrows():
        feature_vector = [
            row.get('hour', 12),  # Hour of day
            row.get('minute', 0),  # Minute
            row.get('votes_per_hour', 0),  # Votes per hour
            row.get('votes_per_minute', 0),  # Votes per minute
            row.get('time_since_last_vote', 60),  # Seconds since last vote
            row.get('same_ip_count', 1),  # Votes from same IP
            row.get('candidate_concentration', 0.5),  # Concentration on one candidate
        ]
        features.append(feature_vector)
    
    return np.array(features)

def extract_single_vote_features(vote):
    """Extract features from a single vote"""
    timestamp = datetime.fromisoformat(vote.get('timestamp', datetime.now().isoformat()))
    
    return [
        timestamp.hour,
        timestamp.minute,
        vote.get('votes_per_hour', 0),
        vote.get('votes_per_minute', 0),
        vote.get('time_since_last_vote', 60),
        vote.get('same_ip_count', 1),
        vote.get('candidate_concentration', 0.5),
    ]

def analyze_anomaly(vote, features):
    """Analyze why a vote was flagged as anomalous"""
    reasons = []
    
    # Check for suspicious timing
    hour = features[0]
    if hour < 6 or hour > 22:
        reasons.append('Unusual voting time (outside 6 AM - 10 PM)')
    
    # Check for rapid voting
    votes_per_minute = features[3]
    if votes_per_minute > 10:
        reasons.append(f'Unusually high voting rate ({votes_per_minute} votes/min)')
    
    # Check for same IP
    same_ip_count = features[5]
    if same_ip_count > 5:
        reasons.append(f'Multiple votes from same IP ({same_ip_count} votes)')
    
    # Check for candidate concentration
    concentration = features[6]
    if concentration > 0.8:
        reasons.append(f'High concentration on single candidate ({concentration:.1%})')
    
    return {
        'reasons': reasons,
        'timestamp': vote.get('timestamp'),
        'ip_address': vote.get('ipAddress'),
        'features': features
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
