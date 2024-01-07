function nOfromArray(dataArray, qgenre = null) {
  if (dataArray.length === 0) return [];

  // Group items by professional_id
  const groupedByProfessionalId = dataArray.reduce((acc, item) => {
      if (!acc[item.professional_id]) {
          acc[item.professional_id] = [];
      }
      acc[item.professional_id].push(item);
      return acc;
  }, {});

  // Process each group
  const result = Object.values(groupedByProfessionalId).map(group => {
      const firstItem = group[0];
      let converted = {
          nameID: firstItem.media_id,
          name: firstItem.primary_name,
          namePoster: firstItem.image_url,
          birthYr: firstItem.birth_date,
          deathYr: firstItem.death_date,
          nameTitles: [],
      };

      group.forEach(item => {
          if (!converted.nameTitles.find(title => title.titleID === item.media_id)) {
              converted.nameTitles.push({ titleID: item.media_id, category: item.category });
          }
      });

      return converted;
  });

  return result.length === 1 ? result[0] : result;
}

module.exports = nOfromArray;