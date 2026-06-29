const text =
    "javascript là ngôn ngữ lập trình phổ biến javascript chạy trên trình duyệt và javascript cũng chạy trên server";

//Hàm 1: getWords(text)
function getWords(text) {
    return text.split(" ");
}
getWords(text);

// Hàm 2: countWord(text, word)
function countWord(text, word) {
    return getWords(text).filter((item) => item === word).length;
}
countWord(text, "javascript"); // 3
countWord(text, "chạy"); // 2
countWord(text, "python"); // 0

// Hàm 3: getUniqueWords(text)
function getUniqueWords(text) {
    let raw = [];
    getWords(text).forEach((item) => {
        if (!raw.includes(item)) {
            raw.push(item);
        }
    });
    return raw.sort((a, b) => a.localeCompare(b));
}
getUniqueWords(text);

// Hàm 4: getTopWords(text, n)
function highlight(text, word) {
    return text.replaceAll(word, `**${word}**`);
}
highlight(text, "javascript");
