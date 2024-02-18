import pandas as pd

filename = 'truncated_title.ratings.tsv'

df = pd.read_csv(filename, sep='\t')

alldatafile = 'truncated_title.basics.tsv'

df2 = pd.read_csv(alldatafile, sep='\t')

alltitles = df2['tconst'].tolist()

rated = df['tconst'].tolist()

for title in alltitles:
    if title not in rated:
        print(title)