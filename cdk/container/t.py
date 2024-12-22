# Constants
current_scores = {
    "Mini-Projects (Journals)": (114.00, 120.00),
    "Mini-Projects (Performance)": (122.00, 160.00),
    "Exams": (76.00, 110.00),
    "Homework": (11.65, 20.00),
    "Project Milestones (Journals)": (17.00, 20.00),
    "Project Milestones (Performance)": (280.00, 300.00),
    "Final Project (Journal)": (0.00, 0.00),
    "Final Project (Performance)": (0.00, 0.00),
    "Participation": (0.00, 0.00),  # Assume low participation, leave it as is
    "Gaming": (0.00, 0.00),  # Does not affect the score
    "Surveys": (22.12, 28.00)
}

grade_weights = {
    "Mini-Projects (Journals)": 15,
    "Mini-Projects (Performance)": 15,
    "Exams": 15,
    "Homework": 15,
    "Project Milestones (Journals)": 7.5,
    "Project Milestones (Performance)": 7.5,
    "Final Project (Journal)": 7.5,
    "Final Project (Performance)": 7.5,
    "Participation": 9,
    "Gaming": 0,
    "Surveys": 1
}

# Function to calculate weighted score
def calculate_weighted_score(current_scores, grade_weights):
    weighted_score = 0
    total_weights = 0

    for category, (earned, total) in current_scores.items():
        weight = grade_weights.get(category, 0)
        if total > 0:
            weighted_score += (earned / total) * weight
        total_weights += weight

    return weighted_score, total_weights

# Function to calculate needed scores for a target grade
def calculate_needed_scores(current_scores, grade_weights, target_grade):
    current_weighted_score, _ = calculate_weighted_score(current_scores, grade_weights)
    remaining_weights = sum(weight for category, weight in grade_weights.items() if current_scores[category][1] == 0)
    needed_score = target_grade - current_weighted_score

    # Return the needed average for remaining weights
    if remaining_weights > 0:
        return needed_score / remaining_weights * 100
    else:
        return 0  # No remaining weights to adjust

# Calculate current grade
current_grade, total_weights = calculate_weighted_score(current_scores, grade_weights)

# Assume a "B" requires 80%
target_grade = 80

# Calculate needed scores
needed_average = calculate_needed_scores(current_scores, grade_weights, target_grade)
current_grade, needed_average
