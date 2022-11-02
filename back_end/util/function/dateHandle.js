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

function formatDateTime(date) {
  const formatedDate = moment(date).format();
  return formatedDate.slice(0, 10) + " " + formatedDate.slice(11, 19);
}

function formatInvDate(date) {
  const formatedDate = moment(date).format();
  return (
    formatedDate.slice(2, 4) +
    formatedDate.slice(5, 7) +
    formatedDate.slice(8, 10)
  );
}

function formatDate(date) {
  const formatedDate = moment(date).format();
  return (
    formatedDate.slice(0, 4) +
    "/" +
    formatedDate.slice(5, 7) +
    "/" +
    formatedDate.slice(8, 10)
  );
}

module.exports = {
  getDatesInRange: getDatesInRange,
  formatDateTime: formatDateTime,
  formatInvDate: formatInvDate,
  formatDate: formatDate,
};
