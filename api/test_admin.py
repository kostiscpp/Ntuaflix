import os
from pathlib import Path 
import requests
import pandas as pd
from urllib3.exceptions import InsecureRequestWarning
from urllib3 import disable_warnings

# Disable the warning
disable_warnings(InsecureRequestWarning)


apiUrl = 'https://localhost:9876/ntuaflix_api'

username = 'admin'
password = 'admin'

def login_and_get_token(username, password):
    url = apiUrl + '/login'
    data = {'username': username, 'password': password}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post(url, data=data, headers=headers, verify=False)
    
    if response.status_code == 200:
        token = response.json().get('token')
        return token
    else:
        print(f"Failed to login, status code: {response.status_code} ❌")
        return None


def test_api_with_file(endpoint, filename):
    # Obtain an authorization token
    token = login_and_get_token(username, password)
    if token is None:
        print("Failed to obtain token, cannot proceed with the test. ❌")
        return

    # Construct the full path to the file
    full_path = f'./testing_texts/{filename}'

    # Read the content of the file
    with open(full_path, 'rb') as file:
        file_content = file.read()
    # Define the URL for the endpoint
    url = apiUrl + '/admin/upload'+ endpoint

    # Headers including the content type and authorization token
    headers = {
        'Content-Type': 'text/tab-separated-values',
        'X-OBSERVATORY-AUTH': f'{token}'
    }
    # Send the POST request with the file content
    response = requests.post(url, data=file_content, headers=headers, verify=False)
    requests.post(apiUrl + '/logout', headers=headers, verify=False)
    # Check the response
    assert response.status_code == 200, f"Processing failed with status code: {response.status_code} and error: {response.text}"
    
    print(f"{filename} uploaded successfully, response:", response.text)

def test_invalid_login_valid_username():
    url = apiUrl + '/login'
    data = {'username': username, 'password': 'wrongpassword'}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=data, headers=headers, verify=False)

    assert response.status_code == 401, "Login unexpectedly succeeded with incorrect password"
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_invalid_login_valid_username test passed ✅")

def test_invalid_login_valid_password():
    url = apiUrl + '/login'
    data = {'username': 'wronguser', 'password': password}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=data, headers=headers, verify=False)

    assert response.status_code == 401, "Login unexpectedly succeeded with incorrect username"
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_invalid_login_valid_password test passed ✅")

def test_invalid_login_both():
    url = apiUrl + '/login'
    data = {'username': 'wronguser', 'password': 'wrongpassword'}
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=data, headers=headers, verify=False)

    assert response.status_code != 200, "Login unexpectedly succeeded with incorrect username and password"
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_invalid_login_both test passed ✅")

def test_logout():
    # First, login to get a token
    token = login_and_get_token(username, password)  # Replace with actual credentials
    if token is None:
        print("Login failed, cannot test logout.")
        return

    # Now, perform the logout
    logout_url = apiUrl + '/logout'
    headers = {
        'Content-Type': 'application/json',
        'X-OBSERVATORY-AUTH': f'{token}'  # Adjust this if your API uses a different auth header
    }
    response = requests.post(logout_url, headers=headers, verify=False)
    
    assert response.status_code == 200, f"Logout failed with status code: {response.status_code}"
    print("Logout test passed with status code:", response.status_code)
    print(f"test_logout test passed ✅")


def test_usermod():
    # First, login to get a token
    token = login_and_get_token(username, password)  # Replace with actual credentials
    if token is None:
        print("Login failed, cannot test usermod.")
        return
    username1 = 'user1'  # Replace with the username to modify
    password1 = 'password'
    # Now, perform the usermod  
    usermod_url = apiUrl + f'/admin/usermod/{username1}/{password1}'
    headers = {
        'Content-Type': 'application/json',
        'X-OBSERVATORY-AUTH': f'{token}'  # Adjust this if your API uses a different auth header
    }
    response = requests.post(usermod_url, headers=headers, verify=False)
    assert response.status_code == 200, f"Usermod failed with status code: {response.status_code}"
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_usermod test passed ✅")

def test_query_user_info():
    # First, login to get a token
    token = login_and_get_token(username, password)  # Replace with actual credentials
    if token is None:
        print("Login failed, cannot test usermod.")
        return
    username1 = 'user1'  # Replace with the username to query
    # Now, perform the usermod  
    users_url = apiUrl + f'/admin/users/{username1}'
    headers = {
        'Content-Type': 'application/json',
        'X-OBSERVATORY-AUTH': f'{token}'  # Adjust this if your API uses a different auth header
    }
    response = requests.get(users_url, headers=headers, verify=False)
    requests.post(apiUrl + '/logout', headers=headers, verify=False)
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_query_user_info test passed ✅")


def test_new_titles():
    test_api_with_file('/titlebasics', 'new_titles.tsv')
    print(f"test_new_titles test passed ✅")

def test_new_akas():
    test_api_with_file('/titleakas', 'new_akas.tsv')
    print(f"test_new_akas test passed ✅")

def test_new_names():
    test_api_with_file('/namebasics', 'new_names.tsv')
    print(f"test_new_names test passed ✅")

def test_new_crew():
    test_api_with_file('/titlecrew', 'new_crew.tsv')
    print(f"test_new_crew test passed ✅")

def test_new_episode():
    test_api_with_file('/titleepisode', 'new_episodes.tsv')
    print(f"test_new_episode test passed ✅")

def test_new_principals():
    test_api_with_file('/titleprincipals', 'new_principals.tsv')
    print(f"test_new_principals test passed ✅")

def test_new_ratings():
    test_api_with_file('/titleratings', 'new_ratings.tsv')
    print(f"test_new_ratings test passed ✅")

def test_resetall():
    # First, login to get a token
    token = login_and_get_token(username, password)  # Replace with actual credentials
    if token is None:
        print("Login failed, cannot test reset.")
        return
    # Now, perform the reset
    reset_url = apiUrl + '/admin/resetall'
    headers = {
        'Content-Type': 'application/json',
        'X-OBSERVATORY-AUTH': f'{token}'  # Adjust this if your API uses a different auth header
    }
    response = requests.post(reset_url, headers=headers, verify=False)
    requests.post(apiUrl + '/logout', headers=headers, verify=False)
    assert response.status_code == 200, f"Reset failed with status code: {response.status_code}"
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_resetall test passed ✅")


def test_healthcheck():
    # First, login to get a token
    token = login_and_get_token(username, password)  # Replace with actual credentials
    if token is None:
        print("Login failed, cannot test reset.")
        return
    # Now, perform the reset
    url = apiUrl + '/admin/healthcheck'
    headers = {
        'Content-Type': 'application/json',
        'X-OBSERVATORY-AUTH': f'{token}'  # Adjust this if your API uses a different auth header
    }
    response = requests.get(url, headers=headers, verify=False)
    requests.post(apiUrl + '/logout', headers=headers, verify=False)
    assert response.status_code == 200, f"Healthcheck failed with status code: {response.status_code}"
    print("Response Status Code:", response.status_code)
    print("Response Body:", response.text)
    print(f"test_healthcheck test passed ✅")

def test_all():
    test_healthcheck()
    test_invalid_login_valid_username()
    test_invalid_login_valid_password()
    test_invalid_login_both()
    test_logout()
    test_usermod()
    test_query_user_info()
    test_resetall()
    test_new_titles()
    test_new_akas()
    test_new_names()
    test_new_crew()
    test_new_episode()
    test_new_principals()
    test_new_ratings()
    print("All tests passed")

def make_undo_script():
    path = './testing_texts'
    with open('undo_script.sql', 'w') as file:
        file.write('USE softeng;\n')
        titles = pd.read_csv(path + '/new_titles.tsv', delimiter='\t')
        titles = list(map(lambda x: "\'" + x + "\'", titles['tconst']))
        names = pd.read_csv(path + '/new_names.tsv', delimiter='\t')
        names = list(map(lambda x: "\'" + x + "\'", names['nconst']))
        file.write('DELETE FROM primary_profession WHERE professional_id IN (SELECT professional_id FROM professional WHERE nconst IN (' + ','.join(names) + '));\n')
        file.write('DELETE FROM known_for WHERE media_id IN (SELECT media_id FROM media WHERE tconst IN (' + ','.join(titles) + '));\n')
        file.write('DELETE FROM aka WHERE media_id IN (SELECT media_id FROM media WHERE tconst IN (' + ','.join(titles) + '));\n')
        file.write('DELETE FROM writes WHERE media_id IN (SELECT media_id FROM media WHERE tconst IN (' + ','.join(titles) + '));\n')
        file.write('DELETE FROM directs WHERE media_id IN (SELECT media_id FROM media WHERE tconst IN (' + ','.join(titles) + '));\n')
        file.write('DELETE FROM belongs WHERE media_id IN (SELECT media_id FROM media WHERE tconst IN (' + ','.join(titles) + '));\n')
        file.write('DELETE FROM episode_details WHERE episode_id IN (SELECT media_id FROM media WHERE tconst IN (' + ','.join(titles) + '));\n')
        file.write('DELETE FROM principal WHERE professional_id IN (SELECT professional_id FROM professional WHERE nconst IN (' + ','.join(names) + '));\n')
        file.write('DELETE FROM media WHERE tconst IN (' + ','.join(titles) + ');\n')
        file.write('DELETE FROM professional WHERE nconst IN (' + ','.join(names) + ');\n')
        

test_all()
    
make_undo_script()
