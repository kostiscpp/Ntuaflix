function nOfromArray(dataArray, qgenre = null) {
  if (dataArray.length === 0) return [];

  // Group items by professional_id
  const groupedByNconst = dataArray.reduce((acc, item) => {
      if (!acc[item.nconst]) {
          acc[item.nconst] = [];
      }
      acc[item.nconst].push(item);
      return acc;
  }, {});

  // Process each group
  const result = Object.values(groupedByNconst).map(group => {
      const firstItem = group[0];
      let converted = {
          nameID: firstItem.nconst,
          name: firstItem.primary_name,
          namePoster: firstItem.image_url,
          birthYr: firstItem.birth_date ? firstItem.birth_date.toString() : firstItem.birth_date,
          deathYr: firstItem.death_date ? firstItem.death_date.toString() : firstItem.death_date,
          nameTitles: [],
      };

      group.forEach(item => {
          if (!converted.nameTitles.find(title => title.titleID === item.tconst) && !(item.tconst === null && item.category === null)) {
              converted.nameTitles.push({ titleID: item.tconst, category: item.category });
          }
      });

      return converted;
  });

  return result.length === 1 ? result[0] : result;
}

module.exports = nOfromArray;