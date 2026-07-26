function formatBirthday(dateString) {
    const rawDate = new Date(dateString);
    return `${new String(rawDate.getDate()).padStart(2, 0)}/${new String(rawDate.getMonth() + 1).padStart(2, 0)}/${rawDate.getFullYear()}`;
}
formatBirthday("1995-03-25"); // "25/03/1995"
formatBirthday("2000-12-01"); // "01/12/2000"

function getAge(birthDateString, currentDateString) {
    const bir =
        Date.parse(new Date(currentDateString)) -
        Date.parse(new Date(birthDateString));
    const msPerDay = 1000 * 60 * 60 * 24;
    const birthDay = Math.floor(bir / msPerDay / 360);

    return new Date(currentDateString).getMonth() >
        new Date(birthDateString).getMonth()
        ? birthDay
        : birthDay - 1;
}
getAge("1995-03-25", "2026-07-19"); // 31  (đã qua sinh nhật tháng 3)
getAge("2000-12-01", "2026-07-19"); // 25  (chưa tới sinh nhật tháng 12, nên chưa tính là 26)
getAge("1995-08-01", "2026-07-19"); // 30  (còn vài ngày nữa mới tới sinh nhật)

function getDayOfWeekName(dateString) {
    const day = new Date(dateString).getDay();
    switch (day) {
        case 0:
            return "Chủ nhật";
            break;
        case 1:
            return "Thứ hai";
            break;
        case 2:
            return "Thứ ba";
            break;
        case 3:
            return "Thứ tư";
            break;
        case 4:
            return "Thứ năm";
            break;
        case 5:
            return "Thứ sáu";
            break;
        case 6:
            return "Thứ bảy";
            break;
    }
}
getDayOfWeekName("2026-07-19"); // "Chủ nhật"
getDayOfWeekName("2000-01-01"); // "Thứ bảy"
