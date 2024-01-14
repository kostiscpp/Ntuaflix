// config.js
const apiUrl = 'http://localhost:9876/ntuaflix_api';

module.exports = {
  endpoints: {
    login: `${apiUrl}/login`,
    logout: `${apiUrl}/logout`,
    users: `${apiUrl}/admin/users`,
    usermod: `${apiUrl}/admin/usermod`,
    healthcheck: `${apiUrl}/admin/healthcheck`,
    resetall: `${apiUrl}/admin/resetall`,
    newtitles: `${apiUrl}/admin/upload/titlebasics`,
    newakas: `${apiUrl}/admin/upload/titleakas`,
    newnames: `${apiUrl}/admin/upload/namebasics`,
    newcrew: `${apiUrl}/admin/upload/titlecrew`,
    newepisode: `${apiUrl}/admin/upload/titleepisode`,
    newprincipals: `${apiUrl}/admin/upload/titleprincipals`,
    newratings: `${apiUrl}/admin/upload/titleratings`,
    title: `${apiUrl}/title`,
    searchtitle: `${apiUrl}/searchtitle`,
    bygenre: `${apiUrl}/bygenre`,
    name: `${apiUrl}/name`,
    searchname: `${apiUrl}/searchname`,
  },
};
