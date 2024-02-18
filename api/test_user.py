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

apiUrl = 'https://localhost:9876/ntuaflix_api'


username = 'angelkas123'
password = 'angelkas123'



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

def CSV_has_same(csv_text, item, endpoint):
    # Check if the CSV text contains the expected item
    df = pd.read_csv(io.StringIO(csv_text))
    count = 0
    if endpoint == '/title':
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

def CSV_has_samePart(csv_text, item, endpoint):
    # Check if the CSV text contains the expected item
    df = pd.read_csv(io.StringIO(csv_text))
    if endpoint == '/searchtitle':
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


def login_and_get_token(username, password):
    url = apiUrl + '/login'
    
    data = {'username': username, 'password': password}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post(url, data=data, headers=headers, verify=False)

    if response.status_code == 200:
        token = response.json().get('token')
        return token
    else:
        print(f"Failed to login, status code: {response.status_code}, ❌")
        return None


def test_api_response(endpoint, items, expected_success=True, format=''):
    token = login_and_get_token(username, password)  # Use appropriate credentials
    if token is None:
        print("Failed to obtain token, cannot proceed with the test. ❌")
        return

    headers = {
        'X-OBSERVATORY-AUTH': f'{token}',  # Adjust header as per your API's auth mechanism
        'Accept': 'application/json'  # Assuming JSON responses
    }

    for item in items:
        url = f"{apiUrl}{endpoint}/{item}" + format
        response = requests.get(url, headers=headers, verify=False)
        if expected_success:
            assert response.status_code == 200, f"API failed for {item} with status code: {response.status_code}"
            if format[-3:] == 'csv':
                assert is_CSV(response.text), f"API failed for valid titleObject format'{item}'"
                assert CSV_has_same(response.text, item, endpoint), f"API failed for valid item '{item}'"
            else:
                if endpoint == '/title':
                    assert is_titleObject(response.json()), f"API failed for valid titleObject format'{item}'"
                    assert response.json()['titleID'] == item, f"API failed for valid titleID '{item}'"
                else:
                    assert is_nameObject(response.json()), f"API failed for valid nameObject format'{item}'"
                    assert response.json()['nameID'] == item, f"API failed for valid nameID '{item}'"
        else:
            if format[-3:] == 'csv':
                assert response.status_code == 200, f"API unexpectedly succeeded for {item}"
                assert response.text == '[]', f"API found results for {item} with unexpected response: {response.text}"
            else:
                assert response.status_code == 200, f"API failed for {item} with status code: {response.status_code}"
                assert response.json() == [], f"API found results for {item} with unexpected response: {response.json()}"
        print(f"Test passed for {item} ✅")


def test_title_api_responses():
    
    valid_title_ids = [
        "tt0000929", "tt0000977", "tt0034841", "tt0040844", "tt0078006", 
        "tt0082473", "tt0082891", "tt0084447", "tt0084638", "tt0087306", 
        "tt0090144", "tt0091490", "tt0093099", "tt0093211", "tt0093646", 
        "tt0094390", "tt0095147", "tt0095229", "tt0095571"
    ]

    test_api_response('/title', valid_title_ids, expected_success=True)
    test_api_response('/title', valid_title_ids, format='?format=json', expected_success=True)
    test_api_response('/title', valid_title_ids, format='?format=csv', expected_success=True)

    invalid_title_ids = [
        "t0000929", "t0000977", "t0034841", "t0040844", "t0078006", 
        "t0082473", "t0082891", "t0084447", "t0084638", "t0087306", 
        "t0090144", "t0091490", "t0093099", "t0093211", "t0093646", 
        "t0094390", "t0095147", "t0095229", "t0095571"
    ]


    test_api_response('/title', invalid_title_ids, expected_success=False)
    test_api_response('/title', invalid_title_ids,format='?format=json', expected_success=False)
    test_api_response('/title', invalid_title_ids,format='?format=csv', expected_success=False)

def test_searchtitle_api_responses():

    valid_titles = [
        "Klebolin klebt alles",
        "Mutterliebe",
        "Hen Hop",
        "Crossroads of Laredo",
        "Norman and the Killer",
        "Great Barrier Reef",
        "Peep Show",
        "Open House",
        "Scenes from the Life of Andy Warhol: Friendships and Intersections",
        "Les funérailles du Larle Naba",
        "Le temps des bouffons",
        "Martina's Playhouse",
        "Going Equipped",
        "Horrorshow",
        "Nonstop",
        "Zwisch!",
        "Feet of Song",
        "God morgon Gerda Gök",
        "The Making of Monsters",
        "Sapphire Man",
        "Seven Days a Week - CITY LIFE - Warsaw",
        "That Burning Question",
        "Unter Freunden",
        "Bravo Papa 2040",
        "The Child Eater",
        "Ex libris",
        "The First Emperor of China",
        "Gisèle Kérozène",
        "The Hill Farm",
        "Ident"
    ]

    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    invalid_titles = [ ''.join([random.choice(letters) for _ in range(10)]) for _ in range(10) ]

    token = login_and_get_token(username, password)  # Use appropriate credentials
    if token is None:
        print("Failed to obtain token, cannot proceed with the test. ❌")
        return
    for title in valid_titles:
        url = apiUrl + '/searchtitle'
        urllist = []
        urllist.append(url)
        urllist.append(url + "?format=json")
        urllist.append(url + "?format=csv")
        for url in urllist:
            data = {'titlePart': title}
            headers = {
                'Accept': 'application/json',
                'X-OBSERVATORY-AUTH': f'{token}'  # Adjust header as per your API's auth mechanism
            }
            response = requests.request(method='get',url=url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"API failed for {title} with status code: {response.status_code}"
            if(url[-3:] == 'csv'):
                assert is_CSV(response.text), f"searchtitle API failed for valid titleObject format'{title}'"
                assert CSV_has_samePart(response.text, title, '/searchtitle'), f"searchtitle API failed for valid title part '{title}'"
            else:
                assert is_titleObject(response.json()), f"searchtitle API failed for valid titleObject format'{title}'"
                assert response.json()['originalTitle'] == title, f"searchtitle API failed for valid title part '{title}'"
            print(f"Test passed for {title} ✅")
    
    # Test with invalid title parts (random strings unlikely to match any real title)
    for title in invalid_titles:
        url = apiUrl + '/searchtitle'
        urllist = []
        urllist.append(url)
        urllist.append(url + "?format=json")
        urllist.append(url + "?format=csv")
        for url in urllist:
            data = {'titlePart': title}
            headers = {
                'Accept': 'application/json',
                'X-OBSERVATORY-AUTH': f'{token}'  # Adjust header as per your API's auth mechanism
            }
            response = requests.request(method='get',url=url,data=data, headers=headers, verify=False)
            if(url[-3:] == 'csv'):
                assert response.status_code == 200, f"API failed for {title} with status code: {response.status_code}"
                assert response.text == '[]', f"API found results for {title} with unexpected response: {response.text}"
            else:
                assert response.status_code == 200, f"API failed for {title} with status code: {response.status_code}"
                assert response.json() == [], f"Unexpectedly found results for '{title}'"
            print(f"Test passed for {title} ✅")




def test_bygenre_api_responses():
    Genres = ['Comedy', 'Short', 'Animation', 'Western', 'Horror', 'Documentary', 'Drama', 'Crime', 'Musical', 'Family', 'Action', 'Fantasy', 'Sci-Fi', 'Thriller', 'Romance', 'Music', 'N', 'Mystery', 'Sport', 'Biography', 'History', 'Adult', 'War', 'Adventure', 'News']
    token = login_and_get_token(username, password)  # Use appropriate credentials
    if token is None:
        print("Failed to obtain token, cannot proceed with the test.")
        return

    headers = {
        'Accept': 'application/json',
        'X-OBSERVATORY-AUTH': f'{token}' # Adjust header as per your API's auth mechanism
    }

    baseurl = apiUrl + '/bygenre'
    urllist = []
    urllist.append(baseurl)
    urllist.append(baseurl + "?format=json")
    urllist.append(baseurl + "?format=csv")

    for url in urllist:
    
    # Test with random genre and min in the range 0 to 10
        for _ in range(5):
            genre = random.choice(Genres)
            min_rating = random.randint(0, 10)
            data= {'qgenre': genre, 'minrating': min_rating}
            response = requests.get(apiUrl + '/bygenre', data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"API failed for genre: {genre}, minrating: {min_rating} with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert is_CSV(response.text), f"bygenre API formatting failed for valid genre'{genre}'"
                assert CSV_genre_min(response.text, genre,min_rating), f"bygenre API failed for valid genre '{genre}'"
            else:
                assert is_titleObject(response.json()), f"bygenre API formatting failed for valid genre'{genre}'"
                if type(response.json()) == list:
                    for i in response.json():
                        assert genre in (g['genreTitle'] for g in i['genres']), f"bygenre API failed for valid genre '{genre}'"
                        assert float(i['rating']['avRating']) >= min_rating, f"bygenre API failed for valid minrating '{min_rating}'"
                else:
                    assert genre in (g['genreTitle'] for g in response.json()['genres']), f"bygenre API failed for valid genre '{genre}'"
                    assert float(response.json()['rating']['avRating']) >= min_rating, f"bygenre API failed for valid minrating '{min_rating}'"
            
            print(f"Test passed for genre: {genre}, minrating: {min_rating} ✅")

        # Test with random genre and min above 5
        for _ in range(5):
            genre = random.choice(Genres)
            min_rating = random.randint(11, 15)
            data= {'qgenre': genre, 'minrating': min_rating}
            response = requests.get(url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"API failed for genre: {genre}, minrating: {min_rating} with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert response.text == "[]", f"bygenre API returned non empty unexpectedly'{genre}'"
            else:
                assert response.json() == [], f"bygenre API returned non empty unexpectedly'{genre}'"
            print(f"Test passed for genre: {genre}, minrating: {min_rating} ✅")


        # Test with random text as the genre
        for _ in range(5):
            genre = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=5))
            min_rating = random.randint(0, 10)
            data= {'qgenre': genre, 'minrating': min_rating}
            response = requests.get(url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"API failed for genre: {genre}, minrating: {min_rating} with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert response.text == "[]", f"bygenre API returned non empty unexpectedly'{genre}'"
            else:
                assert response.json() == [], f"bygenre API returned non empty unexpectedly'{genre}'"
            print(f"Test passed for genre: {genre}, minrating: {min_rating} ✅")

        # Test with --from and --to arguments
        for _ in range(5):
            genre = random.choice(Genres)
            year_from = random.randint(1959, 1996) # Ensuring --to year is always greater
            year_to = random.randint(year_from, 2000)
            min_rating = random.randint(0, 10)
            data= {'qgenre': genre, 'minrating': str(min_rating),'yrFrom': str(year_from), 'yrTo': str(year_to)}
            response = requests.get(url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"API failed for genre: {genre}, minrating:{min_rating}, from: {year_from}, to: {year_to} with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert is_CSV(response.text), f"bygenre API failed for valid titleObject format genre: {genre}, minrating:{min_rating}, from: {year_from}, to: {year_to}"
                assert CSV_genre_min(response.text, genre,min_rating, year_from, year_to), f"bygenre API failed for valid genre: {genre}, minrating:{min_rating}, from: {year_from}, to: {year_to}"
            else:
                assert is_titleObject(response.json()), f"bygenre API failed for valid titleObject format'{genre}'"
                if type(response.json()) == list:
                    for i in response.json():
                        assert genre in (g['genreTitle'] for g in i['genres']), f"bygenre API failed for valid genre: {genre}, minrating:{min_rating}, from: {year_from}, to: {year_to}"
                        assert float(i['rating']['avRating']) >= min_rating, f"bygenre API failed for valid minrating genre: {genre}, minrating:{min_rating}, from: {year_from}, to: {year_to}"
                        assert int(i['startYear']) >= year_from and int(i['startYear']) <= year_to, f"bygenre API failed for valid year range genre: {genre}, minrating:{min_rating}, from: {year_from}, to: {year_to}"
                else:
                    assert genre in (g['genreTitle'] for g in response.json()['genres']), f"bygenre API failed for valid genre '{genre}'"
                    assert float(response.json()['rating']['avRating']) >= min_rating, f"bygenre API failed for valid minrating '{min_rating}'"
                    assert (response.json()['startYear'] is None or int(response.json()['startYear']) >= year_from) and (response.json()['endYear'] is None or int(response.json()['endYear']) <= year_to), f"bygenre API failed for valid year range'{year_from}'"
            
            print(f"Test passed for genre: {genre}, minrating: {min_rating}, from: {year_from}, to: {year_to} ✅")


        # Test with --from and not the --to argument
        for _ in range(5):
            genre = random.choice(Genres)
            year_from = random.randint(1959, 2000)
            min_rating = random.randint(0, 10)
            data= {'qgenre': genre, 'minrating': str(min_rating),'yrFrom': str(year_from)}
            response = requests.get(url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"API failed for genre: {genre}, minrating:{min_rating}, from: {year_from} with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert is_CSV(response.text), f"bygenre API failed for valid titleObject format genre: {genre}, minrating:{min_rating}, from: {year_from}"
                assert CSV_genre_min(response.text, genre, min_rating, year_from), f"bygenre API failed for valid genre: {genre}, minrating:{min_rating}, from: {year_from}"
            else:
                assert is_titleObject(response.json()), f"bygenre API failed for valid titleObject format'{genre}'"
                if type(response.json()) == list:
                    for i in response.json():
                        assert genre in (g['genreTitle'] for g in i['genres']), f"bygenre API failed for valid genre: {genre}, minrating:{min_rating}, from: {year_from}"
                        assert float(i['rating']['avRating']) >= min_rating, f"bygenre API failed for valid minrating genre: {genre}, minrating:{min_rating}, from: {year_from}"
                        assert int(i['startYear']) >= year_from, f"bygenre API failed for valid year range genre: {genre}, minrating:{min_rating}, from: {year_from}"
                else:
                    assert genre in (g['genreTitle'] for g in response.json()['genres']), f"bygenre API failed for valid genre '{genre}'"
                    assert float(response.json()['rating']['avRating']) >= min_rating, f"bygenre API failed for valid minrating '{min_rating}'"
                    assert int(response.json()['startYear']) >= year_from, f"bygenre API failed for valid year range'{year_from}'"
            print(f"Test passed for genre: {genre}, minrating: {min_rating}, from: {year_from} ✅")



def test_name_api_responses():
    valid_name_ids = [
        "nm0000019",
        "nm0000030",
        "nm0000035",
        "nm0000047",
        "nm0000053",
        "nm0000085",
        "nm0000095",
        "nm0000099",
        "nm0000123",
        "nm0000147",
        "nm0000149",
        "nm0000154",
        "nm0000167",
        "nm0000176",
        "nm0000177",
        "nm0000198",
        "nm0000199",
        "nm0000214",
        "nm0000221",
        "nm0000248",
        "nm0000256",
        "nm0000259",
        "nm0000275",
        "nm0000293",
        "nm0000296",
        "nm0000334",
        "nm0000347",
        "nm0000355",
        "nm0000372",
        "nm0000374"
    ]
    invalid_name_ids = [
        "nmm000000", "nmm999999", "nmm123456", "nmm654321", "nmm111111", 
        "nmm222222", "nmm333333", "nmm444444", "nmm555555", "nmm666666"
    ]
    test_api_response('/name', valid_name_ids, expected_success=True)
    test_api_response('/name', valid_name_ids, format='?format=json',expected_success=True)
    test_api_response('/name', valid_name_ids, format='?format=csv',expected_success=True)
    test_api_response('/name', invalid_name_ids, expected_success=False)
    test_api_response('/name',  invalid_name_ids, format='?format=json', expected_success=False)
    test_api_response('/name',  invalid_name_ids, format='?format=csv', expected_success=False)    



def test_searchname_api_responses():
    
    valid_names = ['Federico Fellini',
                   'Audrey Hepburn',
                   'James Horner',
                   'Sophia Loren',
                   'Robert Mitchum',
                   'Henner Hofmann',
                   'Woody Allen',
                   'Patricia Arquette',
                   'George Clooney',
                   'Colin Firth',
                   'Jodie Foster',
                   'Mel Gibson',
                   'Elizabeth Hurley',
                   'Nastassja Kinski',
                   'Kevin Kline',
                   'Gary Oldman',
                   'Al Pacino',
                   'Mia Sara',
                   'Charlie Sheen',
                   'Edward D. Wood Jr.',
                   'Jenny Agutter',
                   'Ginger Lynn',
                   'Rosanna Arquette',
                   'Sean Bean',
                   'Robert Beltran',
                   'Chow Yun-Fat',
                   'Tim Curry',
                   'Anthony Daniels',
                   'Amanda Donohoe',
                   'Brad Dourif']
    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    invalid_names = [ ''.join([random.choice(letters) for _ in range(10)]) for _ in range(10) ]
    
    token = login_and_get_token(username, password)  # Use appropriate credentials
    if token is None:
        print("Failed to obtain token, cannot proceed with the test.")
        return
    url = apiUrl + '/searchname'
    urllist = []
    urllist.append(url)
    urllist.append(url + "?format=json")
    urllist.append(url + "?format=csv")

    for url in urllist:
    
        for name in valid_names:
            data= {'namePart': name}
            headers = {
                'Accept': 'application/json',
                'X-OBSERVATORY-AUTH': f'{token}'  # Adjust header as per your API's auth mechanism
            }
            response = requests.get(url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"searchname API failed for valid name part '{name}' with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert is_CSV(response.text), f"searchname API failed for valid titleObject format'{name}'"
                assert CSV_has_samePart(response.text, name, '/searchname'), f"searchname API failed for valid name part '{name}'"
            else:
                assert is_nameObject(response.json()), f"searchname API failed for valid nameObject format'{name}'"
                assert response.json()['name'] == name, f"searchname API failed for valid name part '{name}'"
            print(f"Test passed for valid name part '{name}' ✅")



        # Test with invalid name parts (random strings unlikely to match any real name)
        for name in invalid_names:
            data= {'namePart': name}
            headers = {
                'Accept': 'application/json',
                'X-OBSERVATORY-AUTH': f'{token}'  # Adjust
            }
            response = requests.get(url, data=data, headers=headers, verify=False)
            assert response.status_code == 200, f"searchname API failed for invalid name part '{name}' with status code: {response.status_code}"
            if url[-3:] == 'csv':
                assert response.text == '[]', f"searchname API found results for invalid name part '{name}' with unexpected response: {response.text}"
            else:
                assert response.json()==[], f"searchname API failed for valid name part '{name}'"
            print(f"Test passed for invalid name part '{name}' ✅")

test_title_api_responses()
test_searchtitle_api_responses()
test_bygenre_api_responses()
test_name_api_responses()
test_searchname_api_responses()

        
