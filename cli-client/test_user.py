import subprocess
import os
from pathlib import Path 
import random
import json
from test_helpers import *

def capture(command):
    proc = subprocess.Popen(command, 
                            stdout=subprocess.PIPE, 
                            stderr=subprocess.PIPE
                            )
    out, err = proc.communicate()
    return out, err, proc.returncode
def logout():
    command = ['node', 'se2325.js', 'logout']
    out, err, exitcode = capture(command)
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    print("logout",output, error, exitcode)
    return output, error, exitcode

def test_valid_login():
    
    command = ['node', 'se2325.js', 'login', '--username', 'angelkas123', '--passw', 'angelkas123']
    out, err, exitcode = capture(command)
    
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""

    assert os.path.exists('./authToken.txt'), "File './authToken.txt' not found."
    assert exitcode == 0 and error == "", f"Login failed with error: {error}"
    print("test_valid_login passed ✅")


    # print("Output:", output)
    # print("Error:", error)

def test_logout():
    command = ['node', 'se2325.js', 'logout']
    out, err, exitcode = capture(command)
    output = out.decode('utf-8') if out else ""
    error = err.decode('utf-8') if err else ""
    
    assert exitcode == 0 and error == "", f"Logout failed with error: {error}"
    print("test_valid_logout passed ✅")
     
def test_title():
    valid_title_ids = [
        "tt0000929", "tt0000977", "tt0034841", "tt0040844", "tt0078006", 
        "tt0082473", "tt0082891", "tt0084447", "tt0084638", "tt0087306", 
        "tt0090144", "tt0091490", "tt0093099", "tt0093211", "tt0093646", 
        "tt0094390", "tt0095147", "tt0095229", "tt0095571"
    ]
    invalid_title_ids = [
        "t0000929", "t0000977", "t0034841", "t0040844", "t0078006", 
        "t0082473", "t0082891", "t0084447", "t0084638", "t0087306", 
        "t0090144", "t0091490", "t0093099", "t0093211", "t0093646", 
        "t0094390", "t0095147", "t0095229", "t0095571"
    ]

    for title_id in valid_title_ids:
        command = ['node', 'se2325.js', 'title', '--titleID', title_id]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Title search failed for valid title ID {title_id} with error: {error}"
        assert is_titleObject(output), f"Output for valid title ID {title_id} is not a JSON object."
        assert output['titleID'] == title_id, f"TitleID doesnt match {title_id} with error: {error}"

        command = ['node', 'se2325.js', 'title', '--titleID', title_id, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Title search failed for valid title ID {title_id} with error: {error}"
        assert is_titleObject(output), f"Output for valid title ID {title_id} is not a JSON object."
        assert output['titleID'] == title_id, f"TitleID doesnt match {title_id} with error: {error}"

        command = ['node', 'se2325.js', 'title', '--titleID', title_id, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and error == "", f"Title search failed for valid title ID {title_id} with error: {error}"
        assert is_CSV(output), f"Output for valid title ID {title_id} is not a CSV object."
        assert CSV_has_same(output, title_id)
        
        print(f"Test passed for valid title ID {title_id} ✅")

    for title_id in invalid_title_ids:
        command = ['node', 'se2325.js', 'title', '--titleID', title_id]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)

        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid title ID {title_id}"
        if error:
            print(f"Test passed for invalid title ID {title_id}: Error message received - {error}")
            
        command = ['node', 'se2325.js', 'title', '--titleID', title_id, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid title ID {title_id}"
        if error:
            print(f"Test passed for invalid title ID {title_id}: Error message received - {error}")

        command = ['node', 'se2325.js', 'title', '--titleID', title_id, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and output == "[]", f"CLI unexpectedly succeeded for invalid title ID {title_id}"
        if error:
            print(f"Test passed for invalid title ID {title_id}: Error message received - {error}")
            
        print(f"Test passed for invalid title ID {title_id} ✅")
        
def test_name():
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

    for name_id in valid_name_ids:
        command = ['node', 'se2325.js', 'name', '--nameid', name_id]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Name search failed for valid name ID {name_id} with error: {error}"
        assert is_nameObject(output), f"Output for valid name ID {name_id} is not a JSON object."
        assert output['nameID'] == name_id, f"NameID doesnt match {name_id} with error: {error}"

        command = ['node', 'se2325.js', 'name', '--nameid', name_id, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Name search failed for valid name ID {name_id} with error: {error}"
        assert is_nameObject(output), f"Output for valid name ID {name_id} is not a JSON object."
        assert output['nameID'] == name_id, f"NameID doesnt match {name_id} with error: {error}"

        command = ['node', 'se2325.js', 'name', '--nameid', name_id, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and error == "", f"Name search failed for valid name ID {name_id} with error: {error}"
        assert is_CSV(output), f"Output for valid name ID {name_id} is not a CSV object."
        assert CSV_has_same(output, name_id, title_flag=False)
        
        print(f"Test passed for valid name ID {name_id} ✅")

    for name_id in invalid_name_ids:
        command = ['node', 'se2325.js', 'name', '--nameid', name_id]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid name ID {name_id}"
        if error:
            print(f"Test passed for invalid name ID {name_id}: Error message received - {error}")
            
        command = ['node', 'se2325.js', 'name', '--nameid', name_id, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid name ID {name_id}"
        if error:
            print(f"Test passed for invalid name ID {name_id}: Error message received - {error}")

        command = ['node', 'se2325.js', 'name', '--nameid', name_id, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and output == "[]", f"CLI unexpectedly succeeded for invalid name ID {name_id}"
        if error:
            print(f"Test passed for invalid name ID {name_id}: Error message received - {error}")
            
        print(f"Test passed for invalid name ID {name_id} ✅")
        
    # for title_id in invalid_title_ids:
    #     command = ['node', 'se2325.js', 'title', '--titleID', title_id]
    #     out, err, exitcode = capture(command)
    #     output = out.decode('utf-8').strip() if out else ""
    #     error = err.decode('utf-8').strip() if err else ""
    #     output = json.loads(output)
    #     assert exitcode == 0, f"CLI unexpectedly succeeded for invalid title ID {title_id}"
    #     if error:
    #         print(f"Test passed for invalid title ID {title_id}: Error message received - {error}")
    #     print(f"Test passed for invalid title ID {title_id} ✅")

def test_search_title():
    valid_titles = [
        "Klebolin klebt alles",
        "Mutterliebe",
        "Hen Hop",
        "Crossroads of Laredo",
        "Norman and the Killer",
        "The Great Barrier Reef",
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

    for title in valid_titles:
        command = ['node', 'se2325.js', 'searchtitle', '--titlepart', title]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Title search failed for valid title ID {title} with error: {error}"
        assert is_titleObject(output), f"Output for valid title search {title} is not a JSON object."

        command = ['node', 'se2325.js', 'searchtitle', '--titlepart', title ,'--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)

        assert exitcode == 0 and error == "", f"Title search failed for valid title ID {title} with error: {error}"
        assert is_titleObject(output), f"Output for valid title search {title} is not a JSON object."
        command = ['node', 'se2325.js', 'searchtitle', '--titlepart', title, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""

        assert exitcode == 0 and error == "", f"Title search failed for valid title ID {title} with error: {error}"
        assert is_CSV(output), f"Output for valid title search {title} is not a CSV object."
        
        print(f"Test passed for valid search title {title} ✅")

    for title in invalid_titles:
        command = ['node', 'se2325.js', 'searchtitle', '--titlepart', title]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid title search {title}"
        if error:
            print(f"Test passed for invalid title search {title}: Error message received - {error}")
            
        command = ['node', 'se2325.js', 'searchtitle', '--titlepart', title, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid title search {title}"
        if error:
            print(f"Test passed for invalid title ID {title}: Error message received - {error}")

        command = ['node', 'se2325.js', 'searchtitle', '--titlepart', title, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and output == "[]", f"CLI unexpectedly succeeded for invalid title search {title}"
        if error:
            print(f"Test passed for invalid title search {title}: Error message received - {error}")
            
        print(f"Test passed for invalid title search {title} ✅")
 
def test_search_name():
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
    
    for name in valid_names:
        command = ['node', 'se2325.js', 'searchname', '--name', name]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Name search failed for valid name search {name} with error: {error}"
        assert is_nameObject(output), f"Output for valid name search {name} is not a JSON object."

        command = ['node', 'se2325.js', 'searchname', '--name', name, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Name search failed for valid name search {name} with error: {error}"
        assert is_nameObject(output), f"Output for valid name search {name} is not a JSON object."

        command = ['node', 'se2325.js', 'searchname', '--name', name, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and error == "", f"Name search failed for valid name search {name} with error: {error}"
        assert is_CSV(output), f"Output for valid name search {name} is not a CSV object."
        
        assert CSV_has_samePart(output, name, title_flag=False)
        
        print(f"Test passed for valid name search {name} ✅")

    for name in invalid_names:
        command = ['node', 'se2325.js', 'searchname', '--name', name]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid name search {name}"
        if error:
            print(f"Test passed for invalid name search {name}: Error message received - {error}")
            
        command = ['node', 'se2325.js', 'searchname', '--name', name, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and output == [], f"CLI unexpectedly succeeded for invalid name search {name}"
        if error:
            print(f"Test passed for invalid name search {name}: Error message received - {error}")

        command = ['node', 'se2325.js', 'searchname', '--name', name, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and output == "[]", f"CLI unexpectedly succeeded for invalid name search {name}"
        if error:
            print(f"Test passed for invalid name search {name}: Error message received - {error}")
            
        print(f"Test passed for invalid name search {name} ✅")
        
def test_bygenre():
    Genres = ['Comedy', 'Short', 'Animation', 'Western', 'Horror', 'Documentary', 'Drama', 'Crime', 'Musical', 'Family', 'Action', 'Fantasy', 'Sci-Fi', 'Thriller', 'Romance', 'Music', 'N', 'Mystery', 'Sport', 'Biography', 'History', 'Adult', 'War', 'Adventure', 'News']
    command_base = ['node', 'se2325.js', 'bygenre', '--genre']


    for genre in Genres:
        min_rating = random.randint(0, 7)
        min_rating = str(min_rating)

        command = ['node', 'se2325.js', 'bygenre', '--genre', genre,'--min', min_rating]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output) if output != "" else ""
        assert exitcode == 0 and error == "", f"Search by genre failed for valid search by genre {genre} with error: {error}"
        assert is_titleObject(output), f"Output for valid search by genre {genre} is not a JSON object."

        command = ['node', 'se2325.js', 'bygenre', '--genre', genre, '--min', min_rating, '--format', 'json']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        output = json.loads(output)
        assert exitcode == 0 and error == "", f"Search by genre failed for valid search by genre {genre} with error: {error}"
        assert is_titleObject(output), f"Output for valid search by genre {genre} is not a JSON object."

        command = ['node', 'se2325.js', 'bygenre', '--genre', genre, '--min', min_rating, '--format', 'csv']
        out, err, exitcode = capture(command)
        output = out.decode('utf-8').strip() if out else ""
        error = err.decode('utf-8').strip() if err else ""
        assert exitcode == 0 and error == "", f"Search by genre failed for valid search by genre {genre} with error: {error}"
        assert is_CSV(output), f"Output for valid search by genre {genre} is not a CSV object."
        
        print(f"Test passed for valid genre {genre} ✅")
        
    for i in range(10):
        genre = random.choice(Genres)
        year_from = random.randint(1959, 1996) # Ensuring --to year is always greater
        year_to = random.randint(year_from, 2000)
        min_rating = random.randint(0, 7)
        min_rating = str(min_rating)
        year_from = str(year_from)
        year_to = str(year_to)
        command = command_base + [genre, '--min', min_rating, '--from', year_from, '--to', year_to]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8') if out else ""
        assert exitcode == 0 and error == "", f"Search failed for valid search by genre {genre} with error: {error}"
        
        year_from = random.randint(1959, 1996) 
        year_from = str(year_from)
        command = command_base + [genre, '--min', min_rating, '--from', year_from]
        out, err, exitcode = capture(command)
        output = out.decode('utf-8') if out else ""
        assert exitcode == 0 and error == "", f"Output for valid search by genre {genre} with error: {error}"
    
        print(f"Test passed for valid genre {genre} with year constraints ({i+1}/10) ✅")

#test_logout()
test_valid_login()
test_title()
test_name()
test_search_title()
test_search_name()
test_bygenre()
test_logout()
