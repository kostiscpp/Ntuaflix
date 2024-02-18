import unittest
import requests

def login_and_get_token(username, password):
    url = 'https://localhost:8080/api/login'
    data = {'username': username, 'password': password}
    response = requests.post(url, json=data, verify=False)

    if response.status_code == 200:
        token = response.json().get('token')
        return token
    else:
        print(f"Failed to login, status code: {response.status_code}")
        return None


class TestBackend(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None
        # Set up any necessary configurations or data for your tests
        pass

    def tearDown(self):
        # Clean up after each test if needed
        pass

    def test_login_endpoint(self):
        url = 'https://localhost:8080/api/login'  # Replace with your actual backend URL
        data = {'username': 'user', 'password': 'user'}  # Replace with test data
        response = requests.post(url, json=data, verify=False)

        # Assert that the status code is 200 (or any other expected status code)
        self.assertEqual(response.status_code, 200)

        # Assert other conditions based on your API response
        self.assertTrue('success' in response.json())
        self.assertTrue(response.json()['success'])

    # Add more test methods for other endpoints or functionalities
        
    def test_login_wrong_endpoint(self):
        url = 'https://localhost:8080/api/login'
        data = {'username': 'user', 'password': 'angelkas'}

        response = requests.post(url, json=data, verify=False)

        # Assert that the status code is 200 (or any other expected status code)
        self.assertEqual(response.status_code, 401)

        # Assert other conditions based on your API response
        self.assertTrue('success' in response.json())
        self.assertFalse(response.json()['success'])
        
    def test_signup_endpoint(self):
        url = 'https://localhost:8080/api/signup'
        data = {'username': 'angelkas', 'password': 'angelkas123', 'first_name': 'aggelos', 'last_name': 'kastrinellis', 'birth_date': '2002-02-07'}

        response = requests.post(url, json=data, verify=False)

        # Assert that the status code is 200 (or any other expected status code)
        self.assertEqual(response.status_code, 200)

        # Assert other conditions based on your API response
        self.assertTrue('success' in response.json())
        self.assertTrue(response.json()['success'])

    def test_signup_wrong_credentials_endpoint(self):
        url = 'https://localhost:8080/api/signup'
        data = {'username': 'angelkas', 'password': 'angelkas123', 'first_name': 'aggelos', 'last_name': 'kastrinellis', 'birth_date': '2002-02-07'}

        response = requests.post(url, json=data, verify=False)

        # Assert that the status code is 200 (or any other expected status code)
        self.assertEqual(response.status_code, 401)

        # Assert other conditions based on your API response
        self.assertTrue('success' in response.json())
        self.assertFalse(response.json()['success'])

    def test_search_by_title(self):
        url = 'https://localhost:8080/api/search'
        data = {'title': 'Klebolin'}

        response = requests.post(url, json=data, verify=False)
        expected_results = [{'title': 'Klebolin klebt alles', 'photourl': None}]
        self.assertEqual(response.json(), expected_results)

    def test_addReview(self):
        token = login_and_get_token('user', 'user')
        url = 'https://localhost:8080/api/addReview'
        data = {'movie': 'Klebolin klebt alles', 'rate': '9', 'text': 'amazing keanu', 'token': str(token)}

        response = requests.post(url, json=data, verify=False)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())
        self.assertTrue(response.json()['success'])

    def test_movie_info(self):
        url = 'https://localhost:8080/api/movieInfo'
        data = {'movie': 'Comando terrorista'}
        response = requests.post(url, json=data, verify=False)
        expected_results = {'title_type': 'movie', 'primary_title': 'Comando terrorista', 'original_title': 'Comando terrorista', 'is_adult': False, 'start_year': 1990, 'end_year': None, 'runtime_minutes': 83, 'poster_url': None, 'rating': None, 'no_of_ratings': None, 'akas': [{'alt_title': 'Comando terrorista', 'region': None, 'language': None, 'is_original': True, 'types': ['imdbDisplay', 'original'], 'attributes': []}, {'alt_title': 'Comando terrorista', 'region': 'ES', 'language': None, 'is_original': False, 'types': ['imdbDisplay', 'original'], 'attributes': []}], 'genres': ['Action'], 'episode_details': {'parent_title': None, 'episode_number': None, 'season_number': None}, 'directors': ['Luis Colombo'], 'writers': ['Luis Colombo', 'Javier Moreno', 'Miguel Lizondo'], 'principals': []}
        self.assertEqual(response.json(), expected_results)

    def test_search_actor(self):
        url = 'https://localhost:8080/api/searchactor'
        data = {'name': 'Roz'}
        response = requests.post(url, json=data, verify=False)
        expected_results = [{'name': 'Burkhard Brozat', 'photourl': None}, {'name': 'Jirí Brozek', 'photourl': None}, {'name': 'Regina Orozco', 'photourl': 'https://image.tmdb.org/t/p/w500/fyTgy9TKCxJetrNVGBIQ5gCIDsV.jpg'}, {'name': 'Gerardo Quiroz', 'photourl': None}, {'name': 'Mikhail Rozanov', 'photourl': 'https://image.tmdb.org/t/p/w500/h8ezx4f72QGWRa3dLH2naF6X7V0.jpg'}]
        self.assertEqual(response.json(), expected_results)

    def test_actor_info(self):
        url = 'https://localhost:8080/api/actorInfo'
        data = {'actor': 'Regina Orozco'}
        response = requests.post(url, json=data, verify=False)
        expected_results = {'primary_name': 'Regina Orozco', 'birth_year': 1964, 'death_year': None, 'biography': None, 'image_url': 'https://image.tmdb.org/t/p/w500/fyTgy9TKCxJetrNVGBIQ5gCIDsV.jpg', 'primary_profession': ['actress'], 'known_for': ['Dama de noche'], 'directs': [], 'writes': [], 'principals': [{'title': 'Dama de noche', 'category': 'actress', 'characters': ['Salomé']}]}
        self.assertEqual(response.json(), expected_results)

if __name__ == '__main__':
    unittest.main()
