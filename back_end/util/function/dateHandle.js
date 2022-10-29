const moment = require("moment");

function getDatesInRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  while (start <= end) {
    dates.push(moment(start).format().slice(0, 10));
    start.setDate(start.getDate() + 1);
  }

  return dates;
}

module.exports = { getDatesInRange };
