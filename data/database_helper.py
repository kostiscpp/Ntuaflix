import pandas as pd
import glob


file_names = ['truncated_name.basics.tsv', 
              'truncated_title.akas.tsv', 
              'truncated_title.basics.tsv', 
              'truncated_title.crew.tsv', 
              'truncated_title.episode.tsv', 
              'truncated_title.principals.tsv', 
              'truncated_title.ratings.tsv']

name_basis = pd.read_csv(file_names[0], delimiter='\t')
title_akas = pd.read_csv(file_names[1], delimiter='\t')
title_basics = pd.read_csv(file_names[2], delimiter='\t')
title_crew = pd.read_csv(file_names[3], delimiter='\t')
title_episode = pd.read_csv(file_names[4], delimiter='\t')
title_principals = pd.read_csv(file_names[5], delimiter='\t')
title_ratings = pd.read_csv(file_names[6], delimiter='\t')

'''  
Αν ανοίξει κανένας το github, πρεπει να δούμε τα δεδομένα και να αποφασίσουμε αν μας κάνει η βάση που έχουμε σχεδιάσει

'''