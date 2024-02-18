function tOfromArray(dataArray, qgenre = null) {
  if (dataArray.length === 0) return [];

  // Group items by tconst
  const groupedByMediaId = dataArray.reduce((acc, item) => {
      if (!acc[item.tconst]) {
          acc[item.tconst] = [];
      }
      acc[item.tconst].push(item);
      return acc;
  }, {});

  // Process each group
  const result = Object.values(groupedByMediaId).map(group => {
      const firstItem = group[0];
      let converted = {
          titleID: firstItem.tconst,
          type: firstItem.title_type,
          originalTitle: firstItem.original_title,
          titlePoster: firstItem.poster_url,
          startYear: firstItem.start_year ? firstItem.start_year.toString() : firstItem.start_year,
          endYear: firstItem.end_year ? firstItem.end_year.toString() : firstItem.end_year,
          genres: [],
          titleAkas: [],
          principals: [],
          rating: {
              avRating: firstItem.rating  ? firstItem.rating.toString() : firstItem.rating,
              no_of_ratings: firstItem.no_of_ratings ? firstItem.no_of_ratings.toString() : firstItem.no_of_ratings
          }
      };

      group.forEach(item => {
          if (!converted.genres.find(genre => genre.genreTitle === item.genre_name) && !(item.genre_name === null)){
              converted.genres.push({ genreTitle: item.genre_name });
          }
          if (!converted.titleAkas.find(aka => aka.akaTitle === item.alt_title) && !(item.alt_title === null && item.region === null)) {
              converted.titleAkas.push({ akaTitle: item.alt_title, regionAbbrev: item.region });
          }
          if (!converted.principals.find(principal => principal.nameID === item.nconst) && !(item.nconst === null && item.primary_name === null && item.category === null)) {
              converted.principals.push({ nameID: item.nconst, name: item.primary_name, category: item.category });
          }
      });

      return converted;
  });

  return result.length === 1 ? result[0] : result;
}

module.exports = tOfromArray;