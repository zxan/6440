import random
import boto3
from datetime import datetime, timedelta

# Configuration
TABLE_NAME = "CdkStack-HealthDataTableFEE82AF8-ITZQGY9HM8R"  # Replace with your DynamoDB table name
REGION = "us-east-1"  # Replace with your AWS region

# List of User IDs
USER_IDS = ["user123", "user456", "user789"]

# Initialize the DynamoDB client
dynamodb = boto3.client("dynamodb", region_name=REGION)

# Generate random health data
def generate_random_health_data():
    systolic = random.randint(110, 140)
    diastolic = random.randint(70, 90)
    blood_pressure = f"{systolic}/{diastolic}"
    bmi = round(random.uniform(18.0, 30.0), 1)
    diabetes_risk = random.choice(["Low", "Moderate", "High"])
    return blood_pressure, bmi, diabetes_risk

# Insert health data into DynamoDB
def insert_health_data_record(user_id, timestamp):
    blood_pressure, bmi, diabetes_risk = generate_random_health_data()
    
    try:
        dynamodb.put_item(
            TableName=TABLE_NAME,
            Item={
                "userId": {"S": user_id},
                "timestamp": {"S": timestamp},
                "bloodPressure": {"S": blood_pressure},
                "bmi": {"N": str(bmi)},
                "diabetesRisk": {"S": diabetes_risk}
            }
        )
        print(f"Inserted data for {user_id} at timestamp: {timestamp} with bloodPressure: {blood_pressure}, BMI: {bmi}, DiabetesRisk: {diabetes_risk}")
    except Exception as e:
        print(f"Error inserting data for {user_id} at timestamp {timestamp}: {e}")

# Populate data over the past 6 months, every 3 days, for each user
def populate_data_for_users():
    start_date = datetime.utcnow() - timedelta(days=180)  # Start date 6 months ago

    for user_id in USER_IDS:
        print(f"Populating data for user: {user_id}")

        for i in range(0, 150, 3):  # Every 3 days for 150 days (~6 months)
            timestamp = (start_date + timedelta(days=i)).isoformat() + "Z"
            insert_health_data_record(user_id, timestamp)

        print(f"Data population complete for user: {user_id}")

# Run data population for all users
if __name__ == "__main__":
    populate_data_for_users()
    print("Dummy data population complete for all users.")
