function tOfromArray(dataArray, qgenre = null) {
  if (dataArray.length === 0) return [];

  // Group items by media_id
  const groupedByMediaId = dataArray.reduce((acc, item) => {
      if (!acc[item.media_id]) {
          acc[item.media_id] = [];
      }
      acc[item.media_id].push(item);
      return acc;
  }, {});

  // Process each group
  const result = Object.values(groupedByMediaId).map(group => {
      const firstItem = group[0];
      let converted = {
          titleID: firstItem.media_id,
          type: firstItem.title_type,
          originalTitle: firstItem.original_title,
          titlePoster: firstItem.poster_url,
          startYear: firstItem.start_year,
          endYear: firstItem.end_year,
          genres: [],
          titleAkas: [],
          principals: [],
          rating: {
              avRating: firstItem.rating,
              no_of_ratings: firstItem.no_of_ratings
          }
      };

      group.forEach(item => {
          if (!converted.genres.find(genre => genre.genreTitle === item.genre_name)) {
              converted.genres.push({ genreTitle: item.genre_name });
          }
          if (!converted.titleAkas.find(aka => aka.akaTitle === item.alt_title)) {
              converted.titleAkas.push({ akaTitle: item.alt_title, regionAbbrev: item.region });
          }
          if (!converted.principals.find(principal => principal.nameID === item.professional_id)) {
              converted.principals.push({ nameID: item.professional_id, name: item.primary_name, category: item.category });
          }
      });

      return converted;
  });

  return result.length === 1 ? result[0] : result;
}

module.exports = tOfromArray;