function addDays(dateString, days) {
    let date = new Date(dateString);
    console.log(date.getDate());
    date.setDate(date.getDate() + days);
    console.log(date.getDate());
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}-${String(date.getDate()).padStart(2, 0)}`;
}
addDays("2026-07-19", 10); // "2026-07-29"
addDays("2026-07-25", 10); // "2026-08-04"
addDays("2026-01-01", -5); // "2025-12-27"

function getDaysBetween(date1String, date2String) {
    const range =
        Date.parse(new Date(date2String)) - Date.parse(new Date(date1String));
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(range / msPerDay);
}
getDaysBetween("2026-07-19", "2026-08-01"); // 13
getDaysBetween("2026-01-01", "2026-12-31"); // 364

function isExpired(expiryDateString, currentDateString) {
    const exp =
        Date.parse(new Date(currentDateString)) -
        Date.parse(new Date(expiryDateString));
    return exp > 0 ? true : false;
}
isExpired("2026-07-01", "2026-07-19"); // true  (đã qua ngày hết hạn)
isExpired("2026-12-31", "2026-07-19"); // false (chưa tới hạn)

function getCountdown(targetDateString, currentDateString) {
    const range =
        Date.parse(new Date(targetDateString)) -
        Date.parse(new Date(currentDateString));
    return range > 0 ? `còn ${range / 1000 / 60 / 60} giờ ` : "Đã quá hạn";
}
getCountdown("2026-08-01T00:00:00", "2026-07-19T12:00:00");
// "Còn 12 ngày 12 giờ"

getCountdown("2026-07-01T00:00:00", "2026-07-19T12:00:00");
// "Đã qua hạn"
