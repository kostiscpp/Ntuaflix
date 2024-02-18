import subprocess
import os
from pathlib import Path 
import random
import pandas as pd
import numpy as np
import requests
import io 
import csv
from urllib3.exceptions import InsecureRequestWarning
from urllib3 import disable_warnings

# Disable the warning
disable_warnings(InsecureRequestWarning)


def is_CSV(s):
    # Check if the CSV text is in the expected format
    try:
        # Use StringIO to convert the string into a file-like object for the csv.reader
        f = io.StringIO(s)
        
        # Try reading the first row to see if it's in CSV format
        reader = csv.reader(f)
        first_row = next(reader)
        
        # If we can read the first row without errors, it's likely a CSV string
        return True
    except (csv.Error, StopIteration):
        # csv.Error for parsing issues, StopIteration if the string is empty
        return False

def CSV_has_same(csv_text, item, title_flag = True):
    # Check if the CSV text contains the expected item
    df = pd.read_csv(io.StringIO(csv_text))
    count = 0
    if title_flag:
        for key, value in df.items():
            
            if 'titleID' in key and item != value.iloc[0]:
                return False
            elif 'titleID' in key and item == value.iloc[0]:
                count += 1
    else:
        for key, value in df.items():
            if 'nameID' in key and item != value.iloc[0]:
                return False
            elif 'nameID' in key and item == value.iloc[0]:
                count += 1
    return count == 1

def CSV_has_samePart(csv_text, item, title_flag = True):
    # Check if the CSV text contains the expected item
    df = pd.read_csv(io.StringIO(csv_text))
    if title_flag:
        for key, value in df.items():
            if 'originalTitle' == key:
                for v in value:
                    if item not in v:
                        False
    else:
        for key, value in df.items():
            if 'name' == key:
                for v in value:
                    if item not in v:
                        False
    return True

def CSV_genre_min(csv_text, genre, min_rating, year_from = None, year_to = None):
    # Check if the CSV text contains the expected item
    if(csv_text == '[]'):
        return True
   # print(csv_text)
    df = pd.read_csv(io.StringIO(csv_text))
    seen_genre = set()
    seen_rating = set()
    for key, value in df.items():
        if 'genres' in key or 'avRating' in key:
            for i, v in enumerate(value):
                if 'genres' in key and v is not np.nan and genre in v:
                    seen_genre.add(i)
                elif 'avRating' in key and float(v) >= min_rating:
                    seen_rating.add(i)
    
    if year_from is not None or year_to is not None:
        years = df['startYear']
        for i, year in enumerate(years):
            if (year_from is not None and year < year_from) or (year_to is not None and year > year_to):
                return False
    return len(seen_genre) == df.shape[0] and len(seen_rating) == df.shape[0] 



def is_titleObject_u(json_obj):
    # Define top-level fields with their expected types and optionality
    top_level_fields = {
        'titleID': (str, False),
        'type': (str, True),
        'originalTitle': (str, False),
        'titlePoster': (str, True),  # True indicates the field can be None
        'startYear': (str, True),
        'endYear': (str, True),
        'genres': (list, True),
        'titleAkas': (list, True),
        'principals': (list, True),
        'rating': (dict, True)
    }

    for field, (expected_type, is_optional) in top_level_fields.items():
        if field not in json_obj and not is_optional:
            print(f"Missing field: '{field}'.")
            return False
        if field in json_obj and json_obj[field] is not None or not is_optional:
            if not isinstance(json_obj[field], expected_type):
                print(f"Incorrect type for field: '{field}'. Expected {expected_type}, got {type(json_obj[field])}")
                return False

    # Additional validations for list items
    validations = {
        'genres': ('genreTitle',),
        'titleAkas': ('akaTitle', 'regionAbbrev'),
        'principals': ('nameID', 'name', 'category'),
    }
    
    for list_field, required_keys in validations.items():
        for item in json_obj.get(list_field, []):  # Use .get to avoid KeyError if field is missing
            if not isinstance(item, dict) or not all(key in item for key in required_keys):
                print(f"Invalid item in '{list_field}': {item}")
                return False
    
    # Validate 'rating' object structure
    if json_obj.get('rating') is not None:  # Check 'rating' exists and is not None
        required_rating_keys = {'avRating', 'nVotes'}
        if not (key in json_obj['rating'] for key in required_rating_keys):
            print("Invalid 'rating' object.")
            return False

    #print("JSON structure is valid.")
    return True

def is_titleObject(json_obj):
    flag = True
    if (type(json_obj) == list):
        for i in json_obj:
            flag = flag and is_titleObject_u(i)
            if flag == False:
                return False
        return True
    else:
        return is_titleObject_u(json_obj)

def is_nameObject(json_obj):
    # Define the expected structure
    expected_structure = {
        'nameID': (str,False),
        'name': (str,True),
        'namePoster': (str,True),
        'birthYr': (str,True),
        'deathYr': (str,True),
        'profession': (str, True),
        'nameTitles': (list, False)  # This expects a list of dictionaries with certain keys
    }
    
    # List of keys expected in each item of the nameTitles list
    expected_name_titles_keys = {'titleID', 'category'}

    # Check if all expected fields are in the JSON object and have the correct type or are allowed to be None
    for field, (expected_type, is_optional) in expected_structure.items():
        if field not in json_obj and not is_optional:
            print(f"Missing field: '{field}'.")
            return False
        if field in json_obj and json_obj[field] is not None or not is_optional:
            if not isinstance(json_obj[field], expected_type):
                print(f"Incorrect type for field: '{field}'. Expected {expected_type}, got {type(json_obj[field])}")
                return False
        
        # Additional check for the 'nameTitles' list to ensure each item has the expected structure
        if field == 'nameTitles' and json_obj[field] is not None:
            for item in json_obj[field]:
                if not isinstance(item, dict) or not expected_name_titles_keys.issubset(item.keys()):
                    print(f"Incorrect structure in 'nameTitles' item: {item}")
                    return False
    
    # If all checks pass
    return True