export default function formatDate(date) {
  let date1 = new Date(date);
  const resDate1 =
    date1.getFullYear() +
    "-" +
    _formatDate(date1.getMonth() + 1) +
    "-" +
    _formatDate(date1.getDate());
  const resTime1 =
    _formatDate(date1.getHours()) +
    ":" +
    _formatDate(date1.getMinutes()) +
    ":" +
    _formatDate(date1.getSeconds());
  return resDate1 + " " + resTime1;
}

function _formatDate(s) {
  return s < 10 ? "0" + s : s;
}