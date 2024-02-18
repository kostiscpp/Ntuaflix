import pandas as pd
import glob


test =  False

file_names = ['truncated_name.basics.tsv', 
              'truncated_title.akas.tsv', 
              'truncated_title.basics.tsv', 
              'truncated_title.crew.tsv', 
              'truncated_title.episode.tsv', 
              'truncated_title.principals.tsv', 
              'truncated_title.ratings.tsv']

name_basics = pd.read_csv(file_names[0], delimiter='\t')
title_akas = pd.read_csv(file_names[1], delimiter='\t')
title_basics = pd.read_csv(file_names[2], delimiter='\t')
title_crew = pd.read_csv(file_names[3], delimiter='\t')
title_episode = pd.read_csv(file_names[4], delimiter='\t')
title_principals = pd.read_csv(file_names[5], delimiter='\t')
title_ratings = pd.read_csv(file_names[6], delimiter='\t')

file_path = "dml_for_database_dump.sql"

# Open the file in write mode, creating it if it doesn't exist
with open(file_path, "w") as file:
  # Do nothing, just create the file

    nconst_to_id = {}

    '''  
    this can go first and does not require other tables to be full
    '''
    for index, row in name_basics.iterrows():
        nconst_to_id[row['nconst']] = index + 1
        # Creating an SQL insertion string for each row
        # Replace 'None' with 'NULL' and add quotes around string values
        nconst = f"\"{row['nconst']}\"" if row['nconst'] != '\\N' else 'NULL'
        primary_name = f"\"{row['primaryName']}\"" if row['primaryName'] != '\\N' else 'NULL'
        birth_date = row['birthYear'] if row['birthYear'] != '\\N' else 'NULL'
        death_date = row['deathYear'] if row['deathYear'] != '\\N' else 'NULL'
        image_url = f"\"{row['img_url_asset']}\"" if row['img_url_asset'] != '\\N' else 'NULL'
        
        sql_query = f"INSERT INTO softeng.professional (primary_name, nconst, birth_date, death_date, image_url) VALUES ({primary_name}, {nconst} ,{birth_date}, {death_date}, {image_url});\n"

        if test:
            print(sql_query)
        else:
            file.write(sql_query)

    ''' 
    this stays after the professionals
    '''
    for index, row in name_basics.iterrows():
        professional_id = nconst_to_id[row['nconst']]
        primary_profession = row['primaryProfession']
        if primary_profession != '\\N': continue
        primary_profession = primary_profession.split(',')

        for profession in primary_profession:
            sql_query = f"INSERT INTO softeng.primary_profession (professional_id, profession) VALUES ({professional_id}, '{profession}');\n"
            
            if test:
                print(sql_query)
            else:
                file.write(sql_query)


    '''  
    this is for the ratings and should be before the media so that we have the data ready
    '''
    t_const_to_ratings = {}
    for index, row in title_ratings.iterrows():
        t_const_to_ratings[row['tconst']] = (row['averageRating'], row['numVotes'])

    tconst_to_id = {}
    genre_list = []
    genre_id_pairs = []
    '''  
    this is for the media and we use the ratings from above
    '''
    for index, row in title_basics.iterrows():
        tconst_to_id[row['tconst']] = index + 1
        tconst = f"\"{row['tconst']}\"" if row['tconst'] != '\\N' else 'NULL'
        titleType = f"\"{row['titleType']}\"" if row['titleType'] != '\\N' else 'NULL'
        primaryTitle = f"\"{row['primaryTitle']}\"" if row['primaryTitle'] != '\\N' else 'NULL'
        originalTitle = f"\"{row['originalTitle']}\"" if row['originalTitle'] != '\\N' else 'NULL'
        isAdult = row['isAdult'] if row['isAdult'] != '\\N' else 'NULL'
        startYear = row['startYear'] if row['startYear'] != '\\N' else 'NULL'
        endYear = row['endYear'] if row['endYear'] != '\\N' else 'NULL'
        runtimeMinutes = row['runtimeMinutes'] if row['runtimeMinutes'] != '\\N' else 'NULL'
        genres = row['genres'].split(',')
        for genre in genres:
            if genre not in genre_list:
                genre_list.append(genre)
            genre_id_pairs.append((index + 1, genre))
        image_url = f"\"{row['img_url_asset']}\"" if row['img_url_asset'] != '\\N' else 'NULL'

        averageRating = 'NULL'
        numVotes = 'NULL'
        if row['tconst'] in t_const_to_ratings:
            averageRating, numVotes = t_const_to_ratings[row['tconst']]

        sql_query = f"INSERT INTO softeng.media (title_type, tconst, primary_title, original_title, is_adult, start_year, end_year, runtime_minutes, poster_url, rating, no_of_ratings) VALUES ({titleType}, {tconst}, {primaryTitle}, {originalTitle}, {isAdult}, {startYear}, {endYear}, {runtimeMinutes}, {image_url}, {averageRating}, {numVotes});\n"

        if test:
            print(sql_query)
        else:
            file.write(sql_query)

    genre_to_id = {}
    ''' 
    this adds the genres to the table of genres and should be after the media
    '''
    for index, genre in enumerate(genre_list):
        genre_to_id[genre] = index + 1
        sql_query = f"INSERT INTO softeng.genre (genre_name) VALUES ('{genre}');\n"
        if test:
            print(sql_query)
        else:
            file.write(sql_query)

    '''  
    this should add the pairs to the genre media relationship table
    check if correct!!!
    '''
    for index, genre in enumerate(genre_id_pairs):
        sql_query = f"INSERT INTO softeng.belongs (media_id, genre_id) VALUES ({genre[0]}, {genre_to_id[genre[1]]});\n"
        if test:
            print(sql_query)
        else:
            file.write(sql_query)


    types_list = {}
    attributes_list = {}

    '''  
    this is for the aka's and should be after the media
    '''

    for index, row in title_akas.iterrows():
        title_id = tconst_to_id[row['titleId']]
        ordering = row['ordering'] 
        title = f"\"{row['title']}\"" if row['title'] != '\\N' else 'NULL'
        region = f"\"{row['region']}\"" if row['region'] != '\\N' else 'NULL'
        language = f"\"{row['language']}\"" if row['language'] != '\\N' else 'NULL'
        types = f"\"{row['types']}\"" if row['types'] != '\\N' else 'NULL'
        attributes = f"\"{row['attributes']}\"" if row['attributes'] != '\\N' else 'NULL'
        isOriginalTitle = row['isOriginalTitle'] if row['isOriginalTitle'] != '\\N' else 'NULL'

        if types != 'NULL':
            types_list[(title_id, ordering)] = types
        if attributes != 'NULL':
            attributes_list[(title_id, ordering)] = attributes

        sql_query = f"INSERT INTO softeng.aka (ordering, media_id , alt_title, region, language, is_original) VALUES ({ordering}, {title_id}, {title}, {region}, {language},  {isOriginalTitle});\n"
        
        if test:
            print(sql_query)
        else:
            file.write(sql_query)

            
    '''  
    this is for the types and should be after the aka's
    '''
    for key, value in types_list.items():
        
        sql_query = f"INSERT INTO softeng.types (media_id, ordering, type) VALUES ({key[0]}, {key[1]}, {value});\n"
        if test:
            print(sql_query)
        else:
            file.write(sql_query)


    ''' 
    this is for the attributes and should be after the aka's
    '''
    for key, value in attributes_list.items():
            
            sql_query = f"INSERT INTO softeng.attributes (media_id, ordering, attribute) VALUES ({key[0]}, {key[1]}, {value});\n"
            if test:
                print(sql_query)
            else:
                file.write(sql_query)

    '''  
    this is for crew, it should be after both media and professionals
    '''

    directors_list = []
    writers_list = []


    for index, row in title_crew.iterrows():
        title_id = tconst_to_id[row['tconst']]
        directors = row['directors'] if row['directors'] != '\\N' else 'NULL'
        writers = row['writers'] if row['writers'] != '\\N' else 'NULL'

        if directors != 'NULL':
            directors_list.append((title_id, directors))
        if writers != 'NULL':
            writers_list.append((title_id, writers))

    bad_data = 1

    for title_id, directors_for_media in directors_list:
        direcotrs = directors_for_media.split(',')
        for director in direcotrs:
            if director not in nconst_to_id: 
                bad_data += 1
                continue
            director_id = nconst_to_id[director]
            sql_query = f"INSERT INTO softeng.directs (media_id, professional_id) VALUES ({title_id}, {director_id});\n"
            if test:
                print(sql_query)
            else:
                file.write(sql_query)

    for title_id, writers_for_media in writers_list:
        writers = writers_for_media.split(',')
        for writer in writers:
            if writer not in nconst_to_id:
                bad_data += 1
                continue
            writer_id = nconst_to_id[writer]
            sql_query = f"INSERT INTO softeng.writes (media_id, professional_id) VALUES ({title_id}, {writer_id});\n"
            if test:
                print(sql_query)
            else:
                file.write(sql_query)

    '''  
    this is for the episodes and godspeed to whoever tries to understand this
    '''
    bad_episode_data = 0
    for index, row in title_episode.iterrows():
        if row['parentTconst'] not in tconst_to_id or row['tconst'] not in tconst_to_id: 
            bad_episode_data += 1
            continue
        title_id = tconst_to_id[row['tconst']]
        parent_id = tconst_to_id[row['parentTconst']]
        season_number = row['seasonNumber'] if row['seasonNumber'] != '\\N' else 'NULL'
        episode_number = row['episodeNumber'] if row['episodeNumber'] != '\\N' else 'NULL'
        

        sql_query = f"INSERT INTO softeng.episode_details (episode_id, belongs_to, season_number, episode_number) VALUES ({title_id}, {parent_id} , {season_number}, {episode_number});\n"
        if test:
            print(sql_query)
        else:
            file.write(sql_query)

    '''  
    this is for the principals and should be after the media and professionals
    '''
    '''  
    we don't have a row in the table for the img_url_asset
    it shouldn't be an issue since non of the urls in the data work anyways
    but something to keep in mind for literally no one who is going to read this
    '''

    characters_list = []
    for index, row in title_principals.iterrows():
        title_id = tconst_to_id[row['tconst']]
        professional_id = nconst_to_id[row['nconst']]
        ordering = row['ordering'] if row['ordering'] != '\\N' else 'NULL'
        category = f"\"{row['category']}\"" if row['category'] != '\\N' else 'NULL'
        unfinished_job = row['job'].replace('"',"'")
        job = f"\"{unfinished_job}\"" if row['job'] != '\\N' else 'NULL'
        characters = row['characters'] if row['characters'] != '\\N' else 'NULL'

        if characters != 'NULL':
            characters_list.append((title_id, professional_id,characters))

        sql_query = f"INSERT INTO softeng.principal (media_id, professional_id, ordering, category, job) VALUES ({title_id}, {professional_id}, {ordering}, {category}, {job});\n"
        if test:
            print(sql_query)
        else:
            file.write(sql_query)

    '''
    this is for the characters and should be after the principals
    '''
    for title_id, professional_id, characters in characters_list:

        characters = characters[1:-1].split(',')

        for character in characters:

            character = character.replace('"', "")
            character = character.replace('\\"', "")
            sql_query = f"INSERT INTO softeng.characters (media_id, professional_id, name) VALUES ({title_id}, {professional_id}, \"{character}\");\n"
            if test:
                print(sql_query)
            else:
                file.write(sql_query)

    '''
    this is fro the known_for, it ended up last idk why
    '''
    bad_known_for_data = 0
    for index, row in name_basics.iterrows():
        
        professional_id = nconst_to_id[row['nconst']]
        known_for = row['knownForTitles'].split(',') if row['knownForTitles'] != '\\N' else []
        if known_for == []: continue
        for media in known_for:
            if media not in tconst_to_id: 
                bad_known_for_data += 1
                continue
            media_id = tconst_to_id[media]
            sql_query = f"INSERT INTO softeng.known_for (professional_id, media_id) VALUES ({professional_id}, {media_id});\n"
            if test:
                print(sql_query)
            else:
                file.write(sql_query)

    print(bad_data)
    print(bad_episode_data)
    print(bad_known_for_data)