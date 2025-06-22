const shifr = {
  total_spend_galactic: "общие расходы в галактических кредитах",
  rows_affected: "количество обработанных записей",
  less_spent_at: "день года с минимальными расходами",
  big_spent_at: "день года с максимальными расходами",
  big_spent_value: "максимальная сумма расходов за день",
  average_spend_galactic: "средние расходы в галактических кредитах",
  big_spent_civ: "цивилизация с максимальными расходами",
  less_spent_civ: "цивилизация с минимальными расходами",
};

const order = [
  "total_spend_galactic",
  "less_spent_civ",
  "rows_affected",
  "big_spent_at",
  "less_spent_at",
  "big_spent_value",
  "big_spent_civ",
  "average_spend_galactic",
];

export const arrayFromData = (jsonData) => {
  jsonData = {
    // Числовые значения с округлением
    total_spend_galactic: formatNumber(jsonData.total_spend_galactic),
    rows_affected: formatNumber(jsonData.rows_affected),
    big_spent_value: formatNumber(jsonData.big_spent_value),
    average_spend_galactic: formatNumber(jsonData.average_spend_galactic),

    // Текстовые значения без изменений
    big_spent_civ: jsonData.big_spent_civ,
    less_spent_civ: jsonData.less_spent_civ,
    less_spent_at: dayOfYearToDate(jsonData.less_spent_at),
    big_spent_at: dayOfYearToDate(jsonData.big_spent_at),
  };

  return order.map((key) => ({
    data: jsonData[key],
    naming: shifr[key],
  }));
};

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
function dayOfYearToDate(dayOfYear) {
  const date = new Date(2023, 0, parseInt(dayOfYear) + 1);

  const day = date.getDate();

  const monthName = months[date.getMonth()];

  return `${day} ${monthName}`;
}
const formatNumber = (num) => {
  const number = parseFloat(num);
  if (isNaN(number)) return "—";
  
  return Math.round(number).toLocaleString('ru-RU');
};