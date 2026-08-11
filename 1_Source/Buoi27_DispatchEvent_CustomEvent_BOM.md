# Buổi 27: Custom Event, Dispatch Event & BOM (Browser Object Model)

> Tài liệu này tổng hợp lại toàn bộ nội dung buổi học từ transcript, được sắp xếp lại
> theo trình tự logic, bổ sung giải thích cho những chỗ transcript nói tắt/nói chưa rõ,
> và có ví dụ code minh họa đầy đủ để dễ ôn tập, tra cứu lại.

---

## Mục lục

1. [Custom Event](#1-custom-event)
2. [Dispatch Event](#2-dispatch-event)
3. [Sự kiện nổi bọt (bubbling) với Custom Event](#3-sự-kiện-nổi-bọt-bubbling-với-custom-event)
4. [Gửi dữ liệu kèm theo Custom Event (`detail`)](#4-gửi-dữ-liệu-kèm-theo-custom-event-detail)
5. [BOM là gì?](#5-bom-là-gì)
6. [Đối tượng `window`](#6-đối-tượng-window)
7. [Đối tượng `screen`](#7-đối-tượng-screen)
8. [Đối tượng `location`](#8-đối-tượng-location)
9. [Đối tượng `history`](#9-đối-tượng-history)
10. [Đối tượng `navigator`](#10-đối-tượng-navigator)
11. [Tổng kết buổi học](#11-tổng-kết-buổi-học)

---

## 1. Custom Event

### 1.1. Custom Event là gì?

Bình thường, các sự kiện (event) trong trình duyệt đều có tên **cố định**, do trình
duyệt định nghĩa sẵn: `click`, `mousedown`, `mouseup`, `mouseover`, `keydown`,
`keyup`, `submit`, v.v.

**Custom Event** cho phép chúng ta **tự tạo ra một sự kiện với cái tên do chính mình
đặt**, không nhất thiết phải trùng với các tên sự kiện có sẵn của trình duyệt. Đây là
cách để lập trình viên tự định nghĩa một "tín hiệu" riêng, dùng để giao tiếp giữa các
phần khác nhau trong trang.

### 1.2. Cú pháp tạo Custom Event

```js
const myEvent = new CustomEvent("custom-event", {
  bubbles: true,   // có cho nổi bọt lên cha hay không (mặc định: false)
  cancelable: true // có cho phép huỷ (preventDefault) hay không (mặc định: false)
});
```

- Tham số đầu tiên: **tên sự kiện** — chuỗi tuỳ ý do bạn đặt (ví dụ: `"custom-event"`,
  `"todo-added"`, `"cart-updated"`...).
- Tham số thứ hai: **object cấu hình (options)**, gồm các cờ như `bubbles`,
  `cancelable`, và đặc biệt là `detail` (xem mục 4).

> Việc tạo `new CustomEvent(...)` chỉ tạo ra một **object sự kiện nằm trong bộ nhớ
> JavaScript**. Nó **chưa hề xảy ra** trên trang. Muốn "bắn" sự kiện đó ra thật sự để
> các nơi khác lắng nghe được, ta cần dùng `dispatchEvent` (mục 2).

---

## 2. Dispatch Event

### 2.1. `dispatchEvent` là gì?

`dispatchEvent()` là phương thức để **kích hoạt (bắn ra)** một sự kiện lên một phần
tử (element) hoặc lên `document`. Nó áp dụng được cho cả sự kiện có sẵn (`click`,
`keydown`...) lẫn Custom Event mà ta tự tạo.

Cú pháp:

```js
element.dispatchEvent(eventObject);
```

### 2.2. Ví dụ minh hoạ đầy đủ

```html
<button id="dispatch-event" class="bg-red-300 hover:bg-blue-300 p-3 transition duration-200">
  Bấm vào đây
</button>
```

```js
const btn = document.querySelector("#dispatch-event");

// 1. Lắng nghe sự kiện click bình thường trên nút
btn.addEventListener("click", () => {
  console.log("Nút đã được click!");
});

// 2. Khi click, ngoài sự kiện "click" mặc định,
//    ta còn muốn bắn thêm 1 custom event tên "custom-event"
btn.addEventListener("click", () => {
  const customEvent = new CustomEvent("custom-event");
  btn.dispatchEvent(customEvent);
});

// 3. Lắng nghe custom event đó ở một nơi khác trong code
document.addEventListener("custom-event", () => {
  console.log("Custom event được gọi!");
});
```

Kết quả: mỗi khi bấm nút, cả 2 dòng log đều chạy — chứng tỏ ta đã tự tạo và tự bắn
ra được một sự kiện của riêng mình, hoàn toàn tách biệt với sự kiện `click` gốc.

### 2.3. Tại sao ví dụ trên ban đầu KHÔNG chạy được?

Trong buổi học, giảng viên demo lần đầu bị **không log ra được** dòng "Custom event
được gọi" dù đã `dispatchEvent`. Nguyên nhân được giải thích ở mục tiếp theo.

---

## 3. Sự kiện nổi bọt (bubbling) với Custom Event

### 3.1. Hiện tượng

- Nếu ta `dispatchEvent` trên **chính phần tử** (`btn.dispatchEvent(...)`) nhưng lại
  **lắng nghe ở `document`** (`document.addEventListener("custom-event", ...)`), thì
  mặc định sẽ **KHÔNG bắt được sự kiện**.
- Nhưng nếu thêm cờ `bubbles: true` khi tạo sự kiện, thì `document` sẽ bắt được.

### 3.2. Giải thích bản chất

- **Sự kiện nổi bọt (event bubbling)**: khi một sự kiện xảy ra trên một phần tử con
  (ví dụ `btn`), nó sẽ tiếp tục "nổi" lên các phần tử cha chứa nó (ví dụ `document`),
  và các phần tử cha đó cũng "nghe thấy" sự kiện y như thể sự kiện xảy ra ngay trên nó.
- Các sự kiện có sẵn của trình duyệt như `click` **mặc định đã bật sẵn tính nổi bọt**.
  Vì vậy khi click vào `btn`, `document` cũng nhận được sự kiện `click` dù không click
  trực tiếp vào `document`.
- Nhưng với **Custom Event do ta tự tạo**, tính nổi bọt **mặc định là `false`**
  (không nổi bọt). Vì thế nếu bắn sự kiện tại `btn` mà lắng nghe tại `document`, sự
  kiện sẽ không bao giờ tới nơi.

### 3.3. Cách khắc phục

**Cách 1 — Bật `bubbles: true`:**

```js
const customEvent = new CustomEvent("custom-event", { bubbles: true });
btn.dispatchEvent(customEvent);

// document giờ đã nghe được vì sự kiện đã "nổi bọt" lên tới document
document.addEventListener("custom-event", () => {
  console.log("Custom event được gọi!");
});
```

**Cách 2 — Lắng nghe đúng ngay tại nơi phát ra sự kiện** (không cần bubbles):

```js
btn.addEventListener("custom-event", () => {
  console.log("Custom event được gọi!");
});
```

> **Quy tắc chung**: nếu sự kiện **không nổi bọt**, phải lắng nghe **đúng tại phần tử
> phát ra sự kiện**. Nếu muốn lắng nghe ở một phần tử cha (ví dụ `document`) thì phần
> tử phát sự kiện phải bật cờ `bubbles: true`.

---

## 4. Gửi dữ liệu kèm theo Custom Event (`detail`)

### 4.1. Vấn đề

Custom Event không chỉ dùng để "báo hiệu" mà còn có thể **mang theo dữ liệu** đi kèm,
giúp nơi lắng nghe biết được thông tin chi tiết về sự kiện đó.

### 4.2. Cú pháp — thuộc tính `detail`

```js
const customEvent = new CustomEvent("custom-event", {
  bubbles: true,
  detail: {
    message: "Hello"
  }
});

btn.dispatchEvent(customEvent);
```

Khi lắng nghe, dữ liệu được lấy ra qua `event.detail`:

```js
document.addEventListener("custom-event", (e) => {
  console.log(e.detail); // { message: "Hello" }
});
```

### 4.3. Lưu ý quan trọng

- `detail` phải nằm **trong object khởi tạo (option thứ 2)** của `new CustomEvent(...)`,
  **không phải** truyền lúc `dispatchEvent`. Bản thân dữ liệu phải "gắn liền" với sự
  kiện ngay từ lúc sự kiện được tạo ra, vì `dispatchEvent()` chỉ có nhiệm vụ bắn sự
  kiện đã có sẵn ra ngoài, chứ không tạo thêm dữ liệu cho nó.
- `detail` thường là một **object**, vì object có thể chứa được nhiều thông tin cùng
  lúc (nhiều field khác nhau), linh hoạt hơn so với 1 giá trị đơn.

**Ứng dụng thực tế**: đây là một cách để **truyền/gửi dữ liệu xuyên suốt trang**, giữa
các phần code khác nhau, mà không cần phải nối trực tiếp các hàm với nhau — giống ý
tưởng "publish/subscribe" hoặc là tiền đề của các thư viện quản lý state (state
management) sau này.

---

## 5. BOM là gì?

**BOM (Browser Object Model)** là tập hợp các **đối tượng do trình duyệt cung cấp**,
đại diện cho **trình duyệt** (không phải nội dung HTML của trang — đó là DOM).

- **DOM (Document Object Model)**: làm việc với các phần tử **bên trong trang HTML**
  (thẻ, thuộc tính, nội dung...).
- **BOM (Browser Object Model)**: làm việc với **chính trình duyệt** — cửa sổ, màn
  hình, đường dẫn URL, lịch sử duyệt web, thông tin thiết bị/trình duyệt...

Đối tượng lớn nhất, bao trùm tất cả trong BOM chính là `window` — mọi đối tượng khác
(`document`, `screen`, `location`, `history`, `navigator`...) đều nằm **bên trong**
`window`.

---

## 6. Đối tượng `window`

### 6.1. `window` là gì?

`window` đại diện cho **cửa sổ trình duyệt** hiện tại. Đây là đối tượng **toàn cục**
(global object) lớn nhất trong JavaScript chạy trên trình duyệt.

**Điểm quan trọng cần nhớ**: mọi biến, hàm, đối tượng bạn khai báo ở phạm vi toàn cục
(kể cả không có `var/let/const` rõ ràng), hay bất kỳ API nào của trình duyệt
(`document`, `alert`, `setTimeout`...) — tất cả đều **thực chất nằm trong `window`**,
và có thể gọi trực tiếp không cần viết `window.` phía trước.

```js
window.abc = "Hello";
console.log(abc); // "Hello" — vì abc thực chất là window.abc

console.log(window.document === document); // true
```

> Nếu bạn gọi một biến không hề được khai báo ở bất cứ đâu, trình duyệt sẽ báo lỗi
> (`ReferenceError`), vì lúc đó `window` cũng không có thuộc tính tương ứng.

### 6.2. `window.innerWidth` / `window.innerHeight`

- Là kích thước của **viewport** — tức là **vùng nhìn thấy được** của trang web bên
  trong cửa sổ trình duyệt (không tính thanh địa chỉ, thanh tab, thanh bookmark...).

```js
console.log(window.innerWidth);  // ví dụ: 567
console.log(window.innerHeight); // ví dụ: 418
```

### 6.3. `window.outerWidth` / `window.outerHeight`

- Là kích thước của **toàn bộ cửa sổ trình duyệt**, bao gồm cả các thanh công cụ,
  thanh địa chỉ, viền cửa sổ...

```js
console.log(window.outerWidth);  // ví dụ: 576 (thường ~ bằng inner nếu full màn hình)
console.log(window.outerHeight); // ví dụ: 919 (lớn hơn inner vì gồm cả thanh trình duyệt)
```

> **Ghi nhớ nhanh**: `inner` = phần **web page** thấy được (viewport). `outer` = toàn
> bộ **cửa sổ trình duyệt** vật lý trên màn hình.

### 6.4. `window.location` / `window.navigator`

- `window.location` → trỏ tới đối tượng `location` (xem mục 8).
- `window.navigator` → trỏ tới đối tượng `navigator` (xem mục 10).

### 6.5. Các phương thức hộp thoại: `alert`, `confirm`, `prompt`

**`window.alert(message)`**

Hiện một hộp thoại thông báo đơn giản, chỉ có nút OK.

```js
alert("Xin chào!");
```

**`window.confirm(message)`**

Hiện hộp thoại hỏi có 2 lựa chọn **OK** / **Cancel**, và **trả về giá trị boolean**:
- Bấm **OK** → trả về `true`
- Bấm **Cancel** (hoặc đóng hộp thoại) → trả về `false`

```js
const ok = confirm("Bạn có muốn tiếp tục không?");
console.log(ok); // true hoặc false
```

**`window.prompt(message, defaultValue)`**

Hiện hộp thoại cho phép người dùng **nhập dữ liệu** (text input), trả về:
- Chuỗi người dùng nhập, nếu bấm OK.
- `null`, nếu bấm Cancel.

```js
const newTask = prompt("Nhập công việc mới:", "Nấu cơm");
console.log(newTask); // ví dụ: "Nấu cơm 1"
```

> **Lưu ý thực tế**: `alert`, `confirm`, `prompt` có giao diện rất **thô sơ, xấu, và
> chặn luồng code (blocking)** — code phía sau sẽ dừng lại chờ người dùng bấm. Vì vậy
> hiện nay các ứng dụng thực tế **hiếm khi dùng cho người dùng cuối (end-user)**, mà
> chủ yếu dùng để:
> - **Demo nhanh** khi học hoặc test.
> - Ứng dụng phía **admin/backend nội bộ** (nơi không cần giao diện đẹp), ví dụ dùng
>   `confirm` để hỏi "Bạn có chắc muốn xóa?" trước một thao tác nguy hiểm.
> - Ứng dụng thực tế cho end-user sẽ dùng các **thư viện UI** (modal, toast...) đẹp và
>   linh hoạt hơn thay vì `alert/confirm/prompt`.

**Ví dụ thực hành sửa Todo bằng `prompt` (cách cũ) và cách làm hiện đại hơn:**

```js
// Cách cũ, dùng prompt — đơn giản nhưng xấu, ít dùng trong thực tế
function editTask(oldValue) {
  const newValue = prompt("Nhập công việc mới:", oldValue);
  return newValue; // null nếu bấm Cancel
}
```

```js
// Cách hiện đại hơn — dùng DOM: chuyển thẻ <span> thành <input> ngay tại chỗ
span.addEventListener("dblclick", () => {
  const input = document.createElement("input");
  input.value = span.textContent;
  span.replaceWith(input);
  input.focus();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      span.textContent = input.value;
      input.replaceWith(span);
    }
  });
});
```

### 6.6. `setTimeout(callback, delay)`

- **Trì hoãn** việc thực hiện một đoạn code (hàm callback), sau khoảng thời gian
  `delay` (đơn vị: **mili-giây**), chỉ chạy **1 lần duy nhất**.

```js
setTimeout(() => {
  console.log("Chạy sau 3 giây");
}, 3000); // 3000ms = 3 giây
```

- `setTimeout` **trả về một giá trị ID** (số nguyên), dùng để huỷ nó bằng
  `clearTimeout(id)` nếu cần.

```js
const id = setTimeout(() => console.log("Sẽ không bao giờ chạy"), 3000);
clearTimeout(id); // hủy trước khi kịp chạy
```

> **Mẹo hay**: ID của `setTimeout`/`setInterval` là một **bộ đếm dùng chung, tăng dần
> từ 1** cho toàn bộ trang. Nếu bạn gọi thêm 1 `setTimeout` mới và log ID ra, con số
> đó cho biết **đã có bao nhiêu timer (`setTimeout`/`setInterval`) được tạo ra trên
> trang** trước đó (kể cả timer do các thư viện/framework khác tạo ngầm), ví dụ ID =
> 86 nghĩa là đã có 85 timer khác được tạo trước nó.

### 6.7. `setInterval(callback, delay)`

- Giống `setTimeout` nhưng **chạy lặp lại liên tục, vô hạn**, cứ sau mỗi khoảng
  `delay` lại chạy một lần nữa (chạy mãi cho tới khi bị huỷ).

```js
const intervalId = setInterval(() => {
  console.log("Chạy lại mỗi 1 giây");
}, 1000);
```

- Cũng trả về một **ID** để huỷ bằng `clearInterval(id)`.

```js
clearInterval(intervalId); // dừng vòng lặp lại
```

**So sánh `setTimeout` vs `setInterval`:**

| Đặc điểm | `setTimeout` | `setInterval` |
|---|---|---|
| Số lần chạy | 1 lần | Lặp lại vô hạn |
| Trả về ID | Có | Có |
| Dùng để hủy | `clearTimeout(id)` | `clearInterval(id)` |
| Ứng dụng thường gặp | Demo delay, hẹn giờ một lần | Slideshow tự động next, đồng hồ đếm, polling dữ liệu |

> ⚠️ **Lưu ý**: nếu quên `clearInterval`, `setInterval` sẽ **chạy vô hạn**, có thể
> khiến trang bị **lag/nặng** theo thời gian — luôn nhớ dọn dẹp (`clearInterval`) khi
> không còn cần dùng nữa (ví dụ: khi rời khỏi component/trang trong ứng dụng SPA).

**Về hành vi bất đồng bộ (async) khi delay = 0:**

Trong buổi học có 1 tình huống hay: đặt `setTimeout(fn, 0)` rồi `clearInterval` ngay
sau đó (đồng bộ, không delay), nhưng hàm callback **vẫn chạy** trước khi bị huỷ kịp.
Lý do: `setTimeout`/`setInterval` **luôn là bất đồng bộ (asynchronous)** — dù để delay
= 0ms, JavaScript vẫn phải **chạy hết code đồng bộ hiện tại trước**, rồi mới đưa
callback vào hàng đợi (event loop) để thực thi. Vì vậy nếu logic huỷ nằm ngay sau
trong cùng khối code đồng bộ, callback có thể **đã kịp thực thi trước** khi lệnh huỷ
được gọi tới. (Chủ đề này sẽ được giải thích kỹ hơn ở bài học riêng về bất đồng bộ.)

### 6.8. `window.open(url, name, specs)`

Mở một **cửa sổ/tab trình duyệt mới**.

```js
window.open("https://google.com", "_blank");
```

Tham số:
1. `url`: đường dẫn muốn mở.
2. `name` (target): 
   - `"_blank"` → mở **cửa sổ/tab mới** (giống thẻ `<a target="_blank">`).
   - `"_self"` (hoặc để trống) → mở **đè lên cửa sổ hiện tại** (không mở tab mới).
3. `specs` (tùy chọn): chuỗi cấu hình kích thước/vị trí cửa sổ mới, ví dụ
   `"width=400,height=300"`. Nếu có truyền kích thước, trình duyệt thường sẽ **tách nó
   ra thành một cửa sổ popup riêng** thay vì mở tab.

```js
window.open("https://google.com", "_blank", "width=400,height=300");
```

> ⚠️ **Lưu ý về trình chặn popup (popup blocker)**: nhiều trình duyệt sẽ **tự động
> chặn** `window.open` nếu nó được gọi **không phải trực tiếp từ hành động click của
> người dùng** (ví dụ gọi trong `setTimeout`). Vì vậy `window.open` nên được gọi ngay
> trong sự kiện click, không nên delay qua timer.

### 6.9. `window.close()`

Đóng cửa sổ trình duyệt **hiện tại** (chỉ hoạt động với cửa sổ do chính script mở ra
bằng `window.open`, không thể tự đóng tab do người dùng tự mở vì lý do bảo mật).

```js
setTimeout(() => {
  window.close();
}, 3000); // đóng cửa sổ sau 3 giây
```

---

## 7. Đối tượng `screen`

`screen` là một đối tượng con thuộc `window` (`window.screen`), cung cấp thông tin về
**màn hình vật lý** của thiết bị (không phải kích thước cửa sổ trình duyệt).

### 7.1. `screen.width` / `screen.height`

Độ phân giải màn hình, tính theo **CSS pixel** (không phải pixel vật lý thật).

```js
console.log(screen.width);  // ví dụ: 1470
console.log(screen.height); // ví dụ: 956
```

> **Giải thích thêm về CSS pixel vs pixel vật lý (device pixel):**
> - Màn hình hiện đại thường có **mật độ điểm ảnh cao** (Retina, HiDPI...). Một "CSS
>   pixel" mà lập trình viên nhìn thấy và đo đạc trên trình duyệt **không phải là 1
>   điểm ảnh vật lý thật** trên màn hình, mà có thể tương ứng với **nhiều điểm ảnh vật
>   lý** gộp lại.
> - Tỉ lệ giữa số điểm ảnh vật lý và số CSS pixel gọi là **`devicePixelRatio`**
>   (`window.devicePixelRatio`). Ví dụ tỉ lệ là 2 nghĩa là: **1 CSS pixel = 2x2 = 4
>   điểm ảnh vật lý** gộp lại để hiển thị.
> - Tỉ lệ này tùy thiết bị, thường gặp: `1`, `1.5`, `1.75`, `2`, `2.5`, `3`...
> - `screen.width/height` luôn trả theo **CSS pixel**, đây là con số ta thường làm
>   việc, đo đạc trên trình duyệt (DevTools).

### 7.2. `screen.availWidth` / `screen.availHeight`

Kích thước màn hình **khả dụng thực tế** — tức là phần màn hình **có thể hiển thị nội
dung được**, đã **trừ đi** các phần bị chiếm bởi hệ điều hành (thanh taskbar, dock,
menu bar...) — các phần này **không bao giờ biến mất**.

```js
console.log(screen.availWidth);  // thường bằng screen.width nếu taskbar nằm ngang cạnh dưới không ảnh hưởng chiều ngang
console.log(screen.availHeight); // nhỏ hơn screen.height, ví dụ 919 so với 956 (do trừ đi thanh trên/dưới màn hình)
```

### 7.3. `screen.orientation`

Cung cấp thông tin về **hướng màn hình** — trả về một object gồm `angle` (góc xoay,
độ) và `type`:

```js
console.log(screen.orientation);
// { angle: 0, type: "landscape-primary" }
```

Hai loại hướng chính:
- **`landscape`** — màn hình nằm **ngang** (chiều rộng > chiều cao). Mặc định trên
  **máy tính/laptop**.
- **`portrait`** — màn hình nằm **dọc** (chiều cao > chiều rộng). Mặc định trên
  **điện thoại và iPad** (kể cả khi người dùng thường xoay ngang để sử dụng, giá trị
  mặc định vẫn được tính là "portrait" theo thiết kế thiết bị).

> **Ghi chú buổi học**: đối tượng `screen` nói chung **ít khi được dùng trong thực
> tế**, chỉ cần dùng khi ứng dụng thực sự cần **truy xuất thông tin về màn hình vật
> lý** để xử lý logic đặc biệt (ví dụ: game, ứng dụng canvas cần biết độ phân giải
> thật).

---

## 8. Đối tượng `location`

`location` chứa thông tin về **đường dẫn (URL)** của trang hiện tại, đồng thời cho
phép **điều khiển việc chuyển hướng trang** bằng JavaScript.

### 8.1. `location.href`

Toàn bộ URL đầy đủ của trang. **Đọc** để lấy URL hiện tại, **gán giá trị mới** để
**chuyển hướng trang** (điều hướng tới URL khác).

```js
console.log(location.href); // "http://127.0.0.1:5050/index.html"

// Chuyển hướng sang trang khác (nội bộ)
btn.addEventListener("click", () => {
  location.href = "./contact.html";
});

// Chuyển hướng ra trang ngoài
location.href = "https://google.com";
```

> ⚠️ Chuyển hướng bằng `location.href` **sẽ làm trang bị load lại hoàn toàn (reload)**
> — có hiện tượng **nháy trắng màn hình**. Đây là nhược điểm so với cách điều hướng
> "mượt, không nháy" mà các framework như **React**, **Next.js** sử dụng (dựa trên
> `history.pushState`, xem mục 9.3).

### 8.2. Các thuộc tính khác của `location`

Giả sử URL hiện tại là:
`http://127.0.0.1:5050/index.html?username=vuquocha#abc`

| Thuộc tính | Ý nghĩa | Ví dụ giá trị |
|---|---|---|
| `location.protocol` | Giao thức | `"http:"` |
| `location.host` | Domain **+ port** | `"127.0.0.1:5050"` |
| `location.hostname` | Chỉ **domain**, không có port | `"127.0.0.1"` |
| `location.port` | Cổng | `"5050"` |
| `location.origin` | Giao thức + domain + port (không path) | `"http://127.0.0.1:5050"` |
| `location.pathname` | Đường dẫn sau domain/port, không gồm `?` hoặc `#` | `"/index.html"` |
| `location.search` | Phần sau dấu `?` (query string) | `"?username=vuquocha"` |
| `location.hash` | Phần sau dấu `#` | `"#abc"` |

```js
console.log(location);
// { protocol, host, hostname, port, origin, pathname, search, hash, href, ... }
```

> **`host` vs `hostname`**: `host` = domain + port (nếu có); `hostname` = **chỉ**
> domain, **không** bao gồm port.

### 8.3. Get/Set — có thể vừa đọc vừa gán lại giá trị

Hầu hết các thuộc tính trên (`port`, `protocol`, `hostname`, `search`,...) đều là
**getter/setter**: đọc để lấy giá trị, **gán giá trị mới sẽ khiến trình duyệt chuyển
hướng** (làm F5/reload trang) sang URL tương ứng.

```js
location.port = 80; // đổi port -> trình duyệt điều hướng sang URL mới với port=80
```

> ⚠️ **Mọi thay đổi trên `location`** (đổi `search`, `port`, `hostname`,
> `protocol`...) đều khiến trang **bị reload**.

### 8.4. `location.search` — dùng làm nơi lưu dữ liệu tạm trên URL

`location.search` là phần **query string** (bắt đầu bằng `?`), gồm các cặp
`key=value`, cách nhau bởi `&`:

```
?key1=value1&key2=value2&key3=value3
```

Ứng dụng: đây có thể được dùng như một cách **lưu trữ dữ liệu đơn giản trên URL**, dữ
liệu này sẽ **không mất khi F5 lại trang** (khác với biến JS thông thường, biến JS sẽ
luôn reset về giá trị ban đầu mỗi khi F5).

**Ví dụ minh hoạ (đếm số lần bấm, lưu trên URL):**

```js
btn.addEventListener("click", () => {
  const params = new URLSearchParams(location.search);
  let hello = Number(params.get("hello")) || 10; // giá trị ban đầu là 10 nếu chưa có
  hello += 10;
  location.search = `?hello=${hello}`; // gán lại -> trang F5, nhưng giá trị hello giữ nguyên trên URL
});
```

> Lưu ý: bản thân transcript minh họa bằng cách `split("=")` thủ công để tách chuỗi,
> nhưng cách làm **chuẩn và an toàn hơn** trong thực tế là dùng
> **`URLSearchParams`** như ví dụ trên, giúp tránh lỗi khi có nhiều tham số hoặc dấu
> đặc biệt.

### 8.5. Phương thức của `location`

**`location.assign(url)`**

Chuyển hướng sang trang mới (giống gán `location.href = url`). Trang cũ **vẫn được
lưu vào lịch sử duyệt web** — bấm "Back" sẽ quay lại được trang cũ.

```js
location.assign("https://google.com");
```

**`location.replace(url)`**

Chuyển hướng sang trang mới, nhưng **thay thế luôn trang hiện tại trong lịch sử**
(không thêm bản ghi lịch sử mới) — bấm "Back" sẽ **KHÔNG quay lại được** trang trước
đó nữa.

```js
location.replace("https://google.com");
```

> **Khi nào dùng `replace` thay vì `assign`?** Tình huống điển hình: người dùng vừa
> gặp lỗi/trang lỗi, sau đó bấm nút "Quay về trang chủ". Nếu dùng `replace`, trang chủ
> sẽ **ghi đè** lên trang lỗi trong lịch sử, người dùng bấm "Back" sẽ không quay lại
> trang lỗi nữa (tránh vòng lặp lỗi liên tục).

**`location.reload()`**

Tải lại (F5) trang hiện tại.

```js
location.reload();
```

> **Kết luận về `location`**: các phương thức điều hướng (`href`, `assign`,
> `replace`) đều gây **reload trang**, nên trong các ứng dụng hiện đại (SPA), người ta
> thường **không dùng `location` để điều hướng** mà chuyển sang dùng `history` (mục
> 9). `location` chủ yếu vẫn hữu ích để **đọc thông tin URL, phân tích tham số**.

---

## 9. Đối tượng `history`

`history` cũng là một đối tượng con của `window`, đại diện cho **lịch sử duyệt web**
của tab hiện tại. Đây chính là công nghệ nền tảng mà các framework/thư viện
**Single Page Application (SPA)** như **React Router**, **Next.js**... sử dụng để
điều hướng trang **mà không bị reload / không bị nháy trắng**.

### 9.1. `history.length`

Số lượng trang đã có trong lịch sử của tab hiện tại (đếm từ khi mở tab, hoặc từ
session hiện tại).

```js
console.log(history.length); // 1 nếu chưa điều hướng đi đâu cả
```

### 9.2. `history.back()` / `history.forward()` / `history.go(n)`

- `history.back()` — quay lại trang trước đó (giống nút Back của trình duyệt).
- `history.forward()` — tiến tới trang sau (giống nút Forward).
- `history.go(n)` — di chuyển **n bước** trong lịch sử:
  - `history.go(2)` → tiến 2 bước.
  - `history.go(-2)` → lùi 2 bước.
  - `history.go(0)` (hoặc không truyền gì) → tương đương reload trang hiện tại.

```js
history.back();
history.forward();
history.go(2);
history.go(-2);
```

> Lưu ý: các thao tác này **vẫn khiến trang bị load lại (nháy)** vì bản chất chúng
> điều hướng qua các URL/trang thật sự đã từng ghé qua.

### 9.3. `history.pushState(state, title, url)`

Đây là phương thức **quan trọng nhất** của `history`, và là **nền tảng cho cơ chế
routing của SPA**.

**Chức năng**: thêm một bản ghi (entry) mới vào lịch sử trình duyệt, và **đổi URL
hiển thị trên thanh địa chỉ**, nhưng **KHÔNG load lại trang** (không có network
request mới, không nháy trắng).

```js
history.pushState({ page: "contact" }, "", "/contact");
```

Tham số:
1. `state`: object dữ liệu tuỳ ý gắn kèm theo bản ghi lịch sử này (lấy lại được sau
   này qua sự kiện `popstate`, xem mục 9.5).
2. `title`: tiêu đề trang (hiện tại hầu hết trình duyệt **bỏ qua** tham số này).
3. `url`: đường dẫn mới sẽ hiển thị trên thanh địa chỉ — **tham số quan trọng nhất**.

**So sánh với việc click vào thẻ `<a>` (điều hướng thông thường):**

| Hành động | Đổi URL | Load lại trang (network request) | Thêm vào lịch sử |
|---|---|---|---|
| Click thẻ `<a>` | ✅ | ✅ (làm 3 việc) | ✅ |
| `history.pushState(...)` | ✅ | ❌ (chỉ làm 2 việc: đổi URL + thêm lịch sử) | ✅ |

> **Điểm mấu chốt cần nhớ**: `pushState` chỉ **đổi URL trên thanh địa chỉ** và **thêm
> bản ghi vào lịch sử**, nhưng **KHÔNG tự động thay đổi nội dung hiển thị trên trang**.
> Nội dung (HTML) trên trang **vẫn giữ nguyên như cũ**, vì trình duyệt không hề tải
> lại bất cứ thứ gì. Muốn nội dung trang thay đổi đúng theo URL mới, lập trình viên
> phải **tự viết code JavaScript để cập nhật giao diện** (ví dụ đổi `innerHTML`,
> `document.title`...) — đây chính xác là **nguyên lý hoạt động cốt lõi của cơ chế
> "routing" trong các thư viện SPA** (React Router, Vue Router, Next.js Router...).

**Ví dụ minh hoạ đầy đủ (tự tay dựng một SPA đơn giản):**

```js
const btn = document.querySelector("#nav-contact");

btn.addEventListener("click", () => {
  // 1. Đổi URL + thêm lịch sử, KHÔNG reload trang
  history.pushState({ page: "contact" }, "", "/contact");

  // 2. Tự tay cập nhật nội dung trang cho khớp với URL mới
  document.title = "Contact";
  document.querySelector("#content").innerHTML = "<h1>Contact</h1>";
});
```

### 9.4. `history.replaceState(state, title, url)`

Giống `pushState` (cũng đổi URL, cũng không reload trang), nhưng khác ở chỗ: nó
**không thêm bản ghi mới vào lịch sử**, mà **thay thế luôn bản ghi hiện tại**. Vì vậy
sau khi `replaceState`, bấm "Back" sẽ **không quay lại được** trạng thái trước đó.

```js
history.replaceState({ page: "contact" }, "", "/contact");
```

> Vì mất lịch sử điều hướng, `replaceState` được dùng **ít hơn** `pushState`, chỉ
> trong các trường hợp thực sự cần "ghi đè" (ví dụ tương tự tình huống dùng
> `location.replace` đã nói ở mục 8.5).

### 9.5. Sự kiện `popstate` — bắt sự kiện khi người dùng bấm Back/Forward

Khi dùng `pushState`/`replaceState`, nếu người dùng sau đó bấm nút **Back/Forward**
của trình duyệt (hoặc gọi `history.back()/forward()/go()`), trình duyệt sẽ bắn ra sự
kiện **`popstate`** trên `window`. Ta lắng nghe sự kiện này để **đồng bộ lại giao
diện** cho khớp với URL mới sau khi người dùng điều hướng qua lại.

```js
window.addEventListener("popstate", (event) => {
  console.log(event.state); // lấy lại state đã gắn lúc pushState/replaceState

  if (event.state && event.state.page === "contact") {
    document.querySelector("#content").innerHTML = "<h1>Contact</h1>";
  } else {
    document.querySelector("#content").innerHTML = "<h1>Trang chủ</h1>";
  }
});
```

> **Lưu ý về `popstate`**: sự kiện này **chỉ được bắn khi người dùng điều hướng qua
> lịch sử đã có** (Back/Forward/`history.go()`), **KHÔNG bị bắn** khi tự gọi
> `pushState`/`replaceState` (vì đó là hành động "thêm mới", không phải "quay lại").
> Vì vậy khi tự viết code gọi `pushState`, ta phải **tự tay** gọi luôn hàm cập nhật
> giao diện ngay tại đó (như ví dụ mục 9.3), còn `popstate` chỉ lo phần "khi người
> dùng bấm Back/Forward".

### 9.6. Kết luận về SPA (Single Page Application)

Nhờ `pushState`/`replaceState` + sự kiện `popstate`, ta có thể tự dựng một ứng dụng
"Single Page Application" **thuần JavaScript, không cần React/Vue**:
- Trang thực chất **chỉ có 1 file HTML duy nhất** (`index.html`).
- Khi "điều hướng" sang các trang khác (`/contact`, `/about`...), thực chất KHÔNG có
  file `contact.html`/`about.html` nào tồn tại thật — chỉ là JS đổi URL bằng
  `pushState` và tự đổi nội dung DOM tương ứng.
- Đây chính là cơ chế mà **React Router, Next.js, Vue Router** sử dụng bên dưới (các
  framework này chỉ **đóng gói/tự động hoá** lại quy trình này cho lập trình viên dùng
  tiện hơn, chứ bản chất kỹ thuật vẫn dựa trên `history` API của trình duyệt).

---

## 10. Đối tượng `navigator`

`navigator` cung cấp thông tin về **trình duyệt** và (gián tiếp) **hệ điều hành** của
thiết bị đang truy cập trang web.

### 10.1. `navigator.userAgent`

Chuỗi định danh trình duyệt (bao gồm tên trình duyệt, phiên bản, hệ điều hành...).

```js
console.log(navigator.userAgent);
// "Mozilla/5.0 (Macintosh; ...) AppleWebKit/... Chrome/... Safari/..."
```

> **Lưu ý thú vị**: dù bạn đang dùng Chrome, chuỗi `userAgent` vẫn thường bắt đầu bằng
> `"Mozilla/5.0"` — đây là **lý do lịch sử** (tương thích ngược từ thời trình duyệt
> Netscape/Mozilla), không có nghĩa là bạn đang dùng trình duyệt Mozilla.

### 10.2. `navigator.language` / `navigator.languages`

- `navigator.language` — ngôn ngữ **ưu tiên nhất** mà trình duyệt đang dùng (theo cài
  đặt hệ thống/trình duyệt).
- `navigator.languages` — **mảng** các ngôn ngữ, sắp xếp theo **thứ tự ưu tiên** (từ
  cao xuống thấp).

```js
console.log(navigator.language);   // "en"
console.log(navigator.languages);  // ["en", "en-US", "vi"]
```

### 10.3. `navigator.onLine`

Trạng thái kết nối mạng hiện tại: `true` nếu trình duyệt **đang online**, `false` nếu
**offline** (mất mạng, hoặc bật chế độ Offline trong DevTools).

```js
console.log(navigator.onLine); // true / false
```

> Ứng dụng thực tế: hiển thị thông báo "Mất kết nối mạng" cho người dùng khi
> `navigator.onLine === false`, hoặc lắng nghe 2 sự kiện `online`/`offline` trên
> `window` để phản ứng ngay khi trạng thái mạng thay đổi:

```js
window.addEventListener("offline", () => console.log("Mất mạng rồi!"));
window.addEventListener("online", () => console.log("Có mạng lại rồi!"));
```

### 10.4. `navigator.platform`

Trả về thông tin về **kiến trúc/hệ điều hành** của thiết bị (API này hiện đã **cũ**,
nhiều trình duyệt hiện đại đang dần loại bỏ độ chính xác của nó vì lý do bảo mật/riêng
tư, nhưng vẫn còn tồn tại).

```js
console.log(navigator.platform); // ví dụ: "MacIntel" (dù máy đang dùng chip Apple Silicon/ARM, vẫn có thể trả về giá trị cũ như "MacIntel" vì lý do tương thích ngược)
```

### 10.5. `navigator.cookieEnabled`

Kiểm tra xem trình duyệt có **cho phép sử dụng cookie** hay không (`true`/`false`).

```js
console.log(navigator.cookieEnabled); // true
```

### 10.6. `navigator.geolocation` — Định vị vị trí người dùng

`navigator.geolocation` là một object cung cấp khả năng **truy cập vị trí địa lý**
của thiết bị (thông qua GPS, Wi-Fi, IP...), **cần người dùng cấp quyền** khi trình
duyệt hỏi.

**`navigator.geolocation.getCurrentPosition(successCallback, errorCallback)`**

```js
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude);  // vĩ độ (tung độ)
    console.log(position.coords.longitude); // kinh độ (hoành độ)
  },
  (error) => {
    console.log("Không lấy được vị trí:", error);
  }
);
```

- Tham số 1: hàm callback chạy khi **lấy vị trí thành công**, nhận vào object
  `position`, trong đó `position.coords.latitude`/`position.coords.longitude` là toạ
  độ vị trí hiện tại.
- Tham số 2: hàm callback chạy khi **lấy vị trí thất bại** (người dùng từ chối cấp
  quyền, thiết bị không hỗ trợ...).

> **Lưu ý thứ tự toạ độ**: `latitude` (vĩ độ, tương ứng "tung độ") lấy trước,
> `longitude` (kinh độ, "hoành độ") lấy sau — rất dễ nhầm lẫn nếu không nhớ kỹ trật tự
> field. Bạn có thể dán toạ độ này vào Google Maps để kiểm tra vị trí thực tế.

### 10.7. `navigator.sendBeacon()` (nhắc qua)

Một phương thức khác của `navigator` (được nhắc lướt qua trong buổi học) dùng để
**gửi dữ liệu bất đồng bộ tới server**, thường dùng để gửi dữ liệu **thống kê/log**
ngay trước khi người dùng rời trang (đóng tab), vì nó đảm bảo request vẫn được gửi đi
thành công dù trang đã đóng. Đây là API **ít dùng**, chỉ cần biết tới sự tồn tại của
nó.

### 10.8. Ứng dụng: Fingerprinting (dấu vân tay trình duyệt)

Kết hợp các thông tin lấy được từ `navigator` (`userAgent`, `platform`, `language`...)
và các thông tin khác của trình duyệt/hệ điều hành, các trang web có thể tạo ra một
**"dấu vân tay" (fingerprint)** gần như **duy nhất cho từng thiết bị/trình duyệt**.

**Ứng dụng thực tế**:
- **Theo dõi quảng cáo (tracking)**: đây là lý do vì sao đôi khi bạn xem một sản phẩm
  trên một trang web, sau đó lướt Facebook/Instagram lại thấy quảng cáo đúng sản phẩm
  đó — hệ thống quảng cáo dựa vào "dấu vân tay" thiết bị để nhận diện đây **cùng một
  người/thiết bị** dù đang ở trình duyệt hay ứng dụng khác nhau.
- **Đếm số lượng thiết bị thực sự truy cập** trang web (phân biệt với việc đếm số
  tab/trình duyệt, vì 1 người có thể mở nhiều tab, nhiều trình duyệt khác nhau — Chrome,
  Safari, Firefox — nhưng vẫn cùng 1 thiết bị/1 người).

> **Lưu ý về độ tin cậy**: fingerprinting dựa trên `navigator` **có thể bị giả mạo**
> (spoof/fake) khá dễ dàng (người dùng có thể đổi user-agent, dùng chế độ ẩn danh, VPN,
> extension chống fingerprinting...). Để có độ chính xác cao hơn, cần các **ứng dụng
> cài đặt trực tiếp trên máy (native app)** mới có thể xác định "dấu vân tay" thiết bị
> một cách đáng tin cậy hơn. Chủ đề fingerprinting/cookie sẽ được học sâu hơn ở bài
> riêng về Cookie.

---

## 11. Tổng kết buổi học

### 11.1. Custom Event & Dispatch Event
- `new CustomEvent(tên, { bubbles, detail })` — tự tạo sự kiện với tên tuỳ ý.
- `element.dispatchEvent(event)` — bắn sự kiện đó ra để nơi khác lắng nghe được.
- Custom Event **mặc định không nổi bọt** — muốn `document` (hoặc phần tử cha khác)
  bắt được, phải bật `bubbles: true`, hoặc lắng nghe đúng tại phần tử phát ra sự kiện.
- Có thể gắn kèm dữ liệu qua `detail`, lấy lại bằng `event.detail` — hữu ích để
  truyền dữ liệu linh hoạt giữa các phần khác nhau của trang.

### 11.2. BOM — mức độ sử dụng trong thực tế (theo lời giảng viên)

| Đối tượng | Mức độ dùng | Ghi chú |
|---|---|---|
| `document` (DOM) | Rất nhiều | Đây là phần công việc chính khi làm frontend |
| `setTimeout` / `setInterval` | Khá thường xuyên | Demo nhanh, slideshow, đếm giờ, polling |
| `screen` | Ít dùng | Chỉ cần khi thực sự cần truy xuất kích thước màn hình vật lý |
| `location` | Trước đây dùng để điều hướng, nay ít hơn | Vẫn hữu ích để đọc/phân tích URL |
| `history` | Ngày càng quan trọng | Nền tảng của điều hướng SPA (React Router, Next.js...) |
| `navigator` (`onLine`, `language`, `userAgent`) | Dùng khá nhiều | Check mạng, ngôn ngữ, fingerprinting |
| `navigator.geolocation` | Dùng khi cần | Ứng dụng bản đồ, giao hàng... |

### 11.3. Thông điệp thêm của buổi học (về việc dùng AI khi học lập trình)

Giảng viên nhấn mạnh: bài tập nên **tự làm tay trước**, không nên dán trực tiếp đề
bài đã được mô tả chi tiết vào AI để lấy đáp án ngay — vì như vậy người học sẽ trở
thành một mắt xích **"trong suốt" (không tạo ra giá trị)** trong chuỗi: *yêu cầu → xử
lý → kết quả*, khiến việc học không thực sự hiệu quả và khó phát triển kỹ năng
**kiểm soát/verify** kết quả do AI tạo ra — kỹ năng này chỉ có được khi bản thân đã
từng tự tay làm qua công việc đó.

---

*Hết nội dung buổi học 27.*
