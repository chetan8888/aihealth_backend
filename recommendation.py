import pulp as pl
import numpy as np
import json
import sys
import pandas as pd

# TO IGNORE THE PANDAS WARNING SETTING WITH COPY WARNING
pd.options.mode.chained_assignment = None

# Get the JSON input from the command line argument
input_json = sys.argv[1]
# # Load the JSON input as a dictionary
input_data = json.loads(input_json)

# Access the parameters from the JSON input
calories = input_data['dailyCalories']
protein = input_data['protein']
fat = input_data['fat']
carbs = input_data['carbs']
maintenanceFat = input_data['maintenanceFat']
maintenanceCalories = input_data['maintenanceCalories']
maintenanceProtein = input_data['maintenanceProtein']
maintenanceCalories = input_data['maintenanceCalories']

# TODO: Change it to dynamic
gender = "male"
activity_level = "sedentary"

# Defining the number of dishes and meals recommended to the user
no_of_dishes = 5
no_of_meals = 5

# Reading the recipe datASET
data = pd.read_csv(
    "data/data.csv")


def create_recommendation_response(recommended_list):
    recipie_dict = {}

    for recipe in recommended_list:

        title = recipe.strip().lower()
        matching_rows = data[data['title'].str.strip().str.lower() == title]

        # Access the 'Breakfast' and 'Lunch' and 'Dinner' values for the matching row(s)
        for index, row in matching_rows.iterrows():
            bf_lunch_dinner_flag = []
            recommended_breakfast = int(row['breakfast'])

            bf_lunch_dinner_flag.append(recommended_breakfast)

            recommended_lunch = int(row['lunch'])

            bf_lunch_dinner_flag.append(recommended_lunch)

            recommended_dinner = int(row['dinner'])
            bf_lunch_dinner_flag.append(recommended_dinner)

            recipie_dict[title] = bf_lunch_dinner_flag
    return recipie_dict


def recommender(data, number_of_dishes, total_recommendations):
    data_copy = data.copy()
    recommended_dishes = []

    # create recommend-list {total_recommendations} times
    for i in range(0, total_recommendations):
        opt_prob = pl.LpProblem(sense=pl.LpMaximize)
        data_copy.loc[:, 'v'] = [pl.LpVariable(
            'x%d' % i, cat=pl.LpBinary) for i in range(len(data_copy))]

        # maximize rating
        opt_prob += pl.lpDot(data_copy["rating"], data_copy["v"])

        # limit the number of recipes
        opt_prob += pl.lpSum(data_copy["v"]) <= number_of_dishes

        # limit the calories
        if maintenanceCalories < calories:
            opt_prob += pl.lpDot(data_copy["calories"],
                                 data_copy["v"]) >= maintenanceCalories
            opt_prob += pl.lpDot(data_copy["calories"],
                                 data_copy["v"]) <= calories
        else:
            opt_prob += pl.lpDot(data_copy["calories"],
                                 data_copy["v"]) >= calories
            opt_prob += pl.lpDot(data_copy["calories"],
                                 data_copy["v"]) <= maintenanceCalories

        # limit the protein
        if maintenanceProtein < protein:
            opt_prob += pl.lpDot(data_copy["protein"],
                                 data_copy["v"]) >= maintenanceProtein
            opt_prob += pl.lpDot(data_copy["protein"],
                                 data_copy["v"]) <= protein
        else:
            opt_prob += pl.lpDot(data_copy["protein"],
                                 data_copy["v"]) >= protein
            opt_prob += pl.lpDot(data_copy["protein"],
                                 data_copy["v"]) <= maintenanceProtein

        if maintenanceFat < fat:
            opt_prob += pl.lpDot(data_copy["fat"],
                                 data_copy["v"]) >= maintenanceFat
            opt_prob += pl.lpDot(data_copy["fat"], data_copy["v"]) <= fat
        else:
            opt_prob += pl.lpDot(data_copy["fat"], data_copy["v"]) >= fat
            opt_prob += pl.lpDot(data_copy["fat"],
                                 data_copy["v"]) <= maintenanceFat

        opt_prob.solve(pl.PULP_CBC_CMD(msg=0, options=['maxsol 1']))

        if opt_prob.status == 1:
            data_copy.loc[:, 'val'] = data_copy["v"].apply(
                lambda x: pl.value(x))
            ret = data_copy.query('val==1')["title"].values
            recommended_dishes.append(ret)
            # update dataframe (remove recommended title )
            data_copy = data_copy.query('val==0')

    return recommended_dishes


# calorie_dict = {
#     'male': {
#         'sedentary': {
#             "cal_up": 3000,
#             "cal_lo": 2800,
#             "pro_up": 50,
#             "pro_lo": 40,
#             "fat_up": 22,
#             "fat_lo": 19,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         },
#         'modactive': {
#             "cal_up": 2800,
#             "cal_lo": 2400,
#             "pro_up": 108,
#             "pro_lo": 62,
#             "fat_up": 97,
#             "fat_lo": 56,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         },
#         'active':  {
#             "cal_up": 3000,
#             "cal_lo": 2800,
#             "pro_up": 263,
#             "pro_lo": 75,
#             "fat_up": 117,
#             "fat_lo": 67,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         },
#         'veryactive': {
#             "cal_up": 3600,
#             "cal_lo": 3000,
#             "pro_up": 289,
#             "pro_lo": 83,
#             "fat_up": 129,
#             "fat_lo": 74,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         }
#     },
#     'female': {
#         'sedentary': {
#             "cal_up": 2000,
#             "cal_lo": 1600,
#             "pro_up": 175,
#             "pro_lo": 50,
#             "fat_up": 77,
#             "fat_lo": 44,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         },
#         'modactive': {
#             "cal_up": 2200,
#             "cal_lo": 2000,
#             "pro_up": 192,
#             "pro_lo": 55,
#             "fat_up": 86,
#             "fat_lo": 49,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         },
#         'active': {
#             "cal_up": 2400,
#             "cal_lo": 2300,
#             "pro_up": 210,
#             "pro_lo": 60,
#             "fat_up": 93,
#             "fat_lo": 53,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         },
#         'veryactive': {
#             "cal_up": 2800,
#             "cal_lo": 2400,
#             "pro_up": 245,
#             "pro_lo": 70,
#             "fat_up": 109,
#             "fat_lo": 62,
#             "sod_up": 2400,
#             "sod_lo": 2200
#         }
#     }
# }

no_of_meals = 3

# nutrients_per_meal = {nutrients: amount /
#                       no_of_meals for nutrients, amount in user_cal_dict.items()}
recommended_recipes = recommender(
    data, no_of_meals, no_of_dishes)
combined_recipe_list = np.concatenate(recommended_recipes)


response = create_recommendation_response(combined_recipe_list)
print(json.dumps(response))
