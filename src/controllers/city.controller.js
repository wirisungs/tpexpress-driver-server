const cities = require('../data/cities.json');

const getCityList = async (req, res) => {
  res.json(cities);
};

module.exports = { getCityList };