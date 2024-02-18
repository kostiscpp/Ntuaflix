import subprocess
import os
from pathlib import Path 

def capture(command):
    proc = subprocess.Popen(command, 
                            stdout=subprocess.PIPE, 
                            stderr=subprocess.PIPE
                            )
    out, err = proc.communicate()
    return out, err, proc.returncode

def test_valid_login():
    
    command = ['node', 'se2325.js', 'login', '--username', 'admin', '--passw', 'admin']
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""

    assert os.path.exists('./authToken.txt'), "File './authToken.txt' not found."
    assert exitcode == 0 and error == "", f"Login failed with error: {error}"
    print("test_valid_login passed ✅")


    # print("Output:", output)
    # print("Error:", error)


def test_invalid_login_invalid_password():
    command = ['node', 'se2325.js', 'login', '--username', 'admin', '--passw', 'wrongpassword']
    out, err, exitcode = capture(command)
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    try:
        assert exitcode == 0 and error != "", "Login unexpectedly succeeded with incorrect password"
        # assert b"401" in out
        print("test_invalid_login_invalid_password passed ✅")
    except AssertionError as e:
        print("test_invalid_login_invalid_password failed ❌\n", e)

    # print("Output:", output)
    # print("Error:", error)


def test_invalid_login_valid_password():
    command = ['node', 'se2325.js', 'login', '--username', 'wronguser', '--passw', 'admin']
    out, err, exitcode = capture(command)
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    assert exitcode == 0 and error != "", "Login unexpectedly succeeded with incorrect username"
    # assert b"401" in out
    print("test_invalid_login_valid_password passed ✅")

def test_invalid_login_both():
    command = ['node', 'se2325.js', 'login', '--username', 'wronguser', '--passw', 'wrongpassword']
    out, err, exitcode = capture(command)
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    assert exitcode == 0 and error != "", "Login unexpectedly succeeded with incorrect username and password"
    print("test_invalid_login_both passed ✅")


def test_logout():
    command = ['node', 'se2325.js', 'logout']
    out, err, exitcode = capture(command)
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"Logout failed with error: {error}"
    print("test_valid_logout passed ✅")

def test_add_user():
    command = ['node', 'se2325.js', 'adduser', '--username', 'user1', '--passw', 'password']
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""

    assert exitcode == 0 and error == "", f"Add user failed with error: {error}"
    print("test_add_user passed ✅")


def test_query_user_info():
    command = ['node', 'se2325.js', 'user', '--username', 'user1']
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"Query failed with error: {error}"
    assert "user1" in output, f"Query failed to find user1 in output: {output}"
    print("test_query_user_info passed ✅")


def test_new_titles():
    # Assuming the filename for new titles is 'new_titles.txt'
    filename = './testing_texts/new_titles.tsv'
    command = ['node', 'se2325.js', 'newtitles', '--filename', filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"New titles processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    # Optionally, check for a specific success message in the output
    print("test_new_titles passed ✅")


def test_new_akas():

    # Assuming the filename for new akas is 'new_akas.txt'
    filename = './testing_texts/new_akas.tsv'
    command = ['node', 'se2325.js', 'newakas', '--filename',  filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"New akas processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    # Optionally, check for a specific success message in the output
    print("test_new_akas passed ✅")

def test_new_names():

    # Assuming the filename for new names is 'new_names.txt'
    filename = './testing_texts/new_names.tsv'
    command = ['node', 'se2325.js', 'newnames', '--filename',  filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"New names processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    # Optionally, check for a specific success message in the output
    print("test_new_names passed ✅")



def test_new_crew():

    filename = './testing_texts/new_crew.tsv'
    command = ['node', 'se2325.js', 'newcrew', '--filename',  filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"New crew processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    print("test_new_crew passed ✅")


def test_new_episode():

    filename = './testing_texts/new_episodes.tsv'
    command = ['node', 'se2325.js', 'newepisode', '--filename',  filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"New episode processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    print("test_new_episode passed ✅")


def test_new_principals():

    filename = './testing_texts/new_principals.tsv'
    command = ['node', 'se2325.js', 'newprincipals', '--filename',  filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"New principals processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    print("test_new_principals passed ✅")

def test_new_ratings():

    filename = './testing_texts/new_ratings.tsv'
    command = ['node', 'se2325.js', 'newratings', '--filename',  filename]
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "" , f"New ratings processing failed with error: {error}"
    #print("Output:", output)
    #print("Error:", error)
    print("test_new_ratings passed ✅")

test_valid_login()
test_logout()
test_invalid_login_invalid_password()
test_invalid_login_valid_password()
test_invalid_login_both()
test_valid_login()
test_add_user()
test_query_user_info()

test_new_titles()
test_new_akas()
test_new_names()
test_new_crew()
test_new_episode()
test_new_principals()
test_new_ratings()

test_logout()
