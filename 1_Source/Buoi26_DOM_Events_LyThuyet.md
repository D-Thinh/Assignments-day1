# BUỔI 26: DOM EVENTS – TÀI LIỆU LÝ THUYẾT ÔN TẬP

> Tài liệu này tổng hợp lại toàn bộ lý thuyết trong bài giảng, đồng thời **làm rõ thêm** những chỗ giảng viên nói chưa chắc chắn hoặc còn mơ hồ trong lúc dạy (có đánh dấu 📌 **Làm rõ thêm**).

---

## PHẦN 1: CHỌN PHẦN TỬ THEO VỊ TRÍ TƯƠNG ĐỐI (DOM Traversal)

### 1.1. Ôn lại: chọn theo vị trí tuyệt đối (buổi trước)
Đây là các cách chọn phần tử **trong toàn bộ trang** (bắt đầu từ `document`):

| Phương thức | Trả về |
|---|---|
| `document.getElementById(id)` | 1 phần tử |
| `document.getElementsByClassName(class)` | HTMLCollection |
| `document.getElementsByTagName(tag)` | HTMLCollection |
| `document.querySelector(css)` | 1 phần tử đầu tiên khớp |
| `document.querySelectorAll(css)` | NodeList |

`querySelector`/`querySelectorAll` là 2 cách được khuyên dùng nhiều nhất vì nhận **CSS selector** rất linh hoạt (theo thẻ, theo class `.ten`, theo id `#ten`, kết hợp `,` để chọn nhiều loại, `h3.text-xl` để chọn đúng thẻ h3 có class text-xl...).

### 1.2. Chọn theo vị trí tương đối (nội dung mới của buổi này)
Khi đã có **một phần tử cụ thể** (biến đã trỏ tới 1 element), ta có thể tìm các phần tử **lân cận** của nó mà không cần query lại từ đầu:

| Thuộc tính / phương thức | Ý nghĩa |
|---|---|
| `el.nextElementSibling` | Phần tử **anh em kế tiếp** (ngay phía sau) |
| `el.previousElementSibling` | Phần tử **anh em phía trước** |
| `el.parentElement` | Phần tử **cha trực tiếp** |
| `el.children` | Danh sách **các con** (HTMLCollection) |
| `el.firstElementChild` | Con đầu tiên |
| `el.lastElementChild` | Con cuối cùng |
| `el.closest(selector)` | Tìm phần tử **gần nhất khớp selector**, duyệt từ chính nó lên cha, ông, tổ tiên... |

📌 **Làm rõ thêm – phân biệt `children` và `childNodes`:**

Trong bài giảng có nhắc tới `childNodes` cho ra 11 phần tử trong khi thực tế chỉ có 5 thẻ `<li>`. Lý do:

- `el.children` → chỉ trả về các **node kiểu Element** (thẻ HTML thật sự). Ví dụ 5 thẻ `<li>` → trả về đúng 5.
- `el.childNodes` → trả về **TẤT CẢ các loại node**, bao gồm cả:
  - Element node (các thẻ)
  - **Text node** (khoảng trắng, xuống dòng, hoặc chữ nằm giữa các thẻ cũng được tính là 1 node văn bản)
  - Comment node (nếu có)

  Vì HTML thường có khoảng trắng/xuống dòng giữa các thẻ `<li>` (để code dễ đọc), mỗi khoảng trắng đó cũng là 1 text node → khiến `childNodes` cho ra số lượng nhiều hơn hẳn (VD: 5 thẻ + 6 text node xen giữa = 11).

  **→ Trong thực hành, luôn ưu tiên dùng `children` khi chỉ cần thao tác với các thẻ HTML.**

📌 **Làm rõ thêm – Lấy con đầu tiên/cuối cùng khi không dùng `firstElementChild`/`lastElementChild`:**

```js
const list = el.children;          // HTMLCollection
const first = list[0];              // phần tử đầu tiên
const last  = list[list.length - 1]; // phần tử cuối cùng
```

Lưu ý: `HTMLCollection` **không phải là Array** thật sự (không có các method như `.map`, `.filter`...), nó chỉ có index từ `0` đến `length - 1` và thuộc tính `length`. Muốn dùng các method của Array, phải chuyển đổi bằng `Array.from(list)` hoặc `[...list]`.

### 1.3. `closest()` — tìm tổ tiên gần nhất khớp selector

```js
el.closest(".event-method-list")
```

`closest()` sẽ duyệt: **chính phần tử đó → cha → ông → cụ...** cho đến khi tìm thấy phần tử khớp với CSS selector được truyền vào. Nếu tìm thấy → trả về phần tử đó. Nếu duyệt hết cây DOM mà không thấy → trả về `null`.

`closest()` là công cụ **quan trọng nhất** để thực hiện kỹ thuật **Event Delegation** (xem Phần 5).

---

## PHẦN 2: EVENT TRONG DOM LÀ GÌ?

Ngoài các phần tử HTML, DOM còn phát sinh **sự kiện (event)** — ví dụ: click chuột, gõ phím, cuộn trang, đóng trang, click chuột phải, submit form, v.v. Có **rất nhiều loại event** khác nhau (xem Phần 6).

### 2.1. Hai cách lắng nghe sự kiện

```js
// Cách 1 — khuyên dùng, có thể gắn nhiều listener cùng lúc
element.addEventListener("click", function (e) { ... });

// Cách 2 — gắn trực tiếp lên thuộc tính "on + tên sự kiện"
element.onclick = function (e) { ... };
```

📌 **Làm rõ thêm về `on` + tên sự kiện:**
Mỗi loại event đều có một thuộc tính tương ứng bắt đầu bằng `on` (ví dụ: sự kiện `click` → thuộc tính `onclick`; sự kiện `mouseleave` → thuộc tính `onmouseleave`). Về bản chất `element.onclick = fn` và `element.addEventListener("click", fn)` cho cùng hiệu quả, **nhưng khác nhau ở chỗ**:
- `onclick = ...` chỉ gán được **1 hàm xử lý** — nếu gán lần 2 sẽ **ghi đè** mất hàm cũ.
- `addEventListener` có thể gọi **nhiều lần** để gắn **nhiều hàm xử lý khác nhau** cho cùng 1 sự kiện, không bị ghi đè.

→ Vì lý do đó, `addEventListener` được khuyến khích dùng trong thực tế.

### 2.2. Tham số của hàm callback (listener)

```js
element.addEventListener("click", function (e) { ... });
```

Tham số `e` (thường gọi là **event object**) chứa toàn bộ thông tin về sự kiện vừa xảy ra: loại sự kiện, phần tử liên quan, tọa độ chuột, phím được nhấn, v.v.

📌 **Làm rõ thêm: vì sao chữ `e` có ý nghĩa?**
`e` chỉ là **tên biến do người viết code tự đặt** (có thể đặt `event`, `evt`, bất kỳ tên nào), nó là **tham số thứ nhất** mà trình duyệt tự động truyền vào hàm callback khi sự kiện xảy ra — không phải từ khoá đặc biệt của JavaScript.

### 2.3. Event object kế thừa (chuỗi prototype)

Tùy loại sự kiện, `e` sẽ thuộc một "dòng họ" object khác nhau, ví dụ:

- Sự kiện chuột/con trỏ (click, mousedown...): `PointerEvent → MouseEvent → UIEvent → Event → Object`
- Sự kiện bàn phím (keydown, keyup...): `KeyboardEvent → UIEvent → Event → Object`

Nhờ kế thừa `Event`, mọi loại sự kiện đều có chung các thuộc tính/phương thức cơ bản như `type`, `target`, `currentTarget`, `preventDefault()`, `stopPropagation()`... còn các thuộc tính đặc thù (như `clientX`, `clientY` của chuột, hay `key` của bàn phím) thì chỉ có ở object con tương ứng.

---

## PHẦN 3: CÁC THUỘC TÍNH/PHƯƠNG THỨC QUAN TRỌNG CỦA EVENT OBJECT

### 3.1. `e.type`
Cho biết **loại sự kiện** đang xảy ra (VD: `"click"`, `"submit"`, `"keydown"`...).

### 3.2. `e.clientX`, `e.clientY`
Khoảng cách (tính bằng pixel) từ điểm xảy ra sự kiện đến **viền trái** (`clientX`) và **viền trên** (`clientY`) của cửa sổ trình duyệt (viewport).

### 3.3. `e.target` vs `e.currentTarget` — **QUAN TRỌNG NHẤT**

- **`e.target`**: phần tử **thực sự** mà người dùng tương tác trực tiếp vào (phần tử nằm "trên cùng" tại điểm click).
- **`e.currentTarget`**: phần tử đang **gắn listener lắng nghe** sự kiện đó (tức là phần tử mà bạn gọi `.addEventListener` lên nó).

**Ví dụ minh hoạ** (từ bài giảng): có `<ul id="list">` chứa nhiều `<li>`. Nếu gắn `addEventListener` lên `ul`, và người dùng click vào 1 `<li>` bên trong:

```js
ul.addEventListener("click", function (e) {
  console.log(e.target);          // → <li> (phần tử người dùng click trực tiếp)
  console.log(e.currentTarget);   // → <ul> (phần tử đang lắng nghe sự kiện)
});
```

Lý do `e.target` ra `<li>` chứ không phải `<ul>`: về mặt hiển thị, `<li>` "nằm trên" `<ul>` (giống như 2 lớp chồng nhau), nên click chuột luôn chạm vào phần tử con cụ thể nhất tại điểm đó trước, rồi sự kiện mới "nổi bọt" lên các phần tử cha (xem Phần 4).

Nếu chỉ có 1 phần tử duy nhất tương tác và lắng nghe (không có phần tử con lồng bên trong) thì `target` và `currentTarget` là **giống nhau**.

📌 **Làm rõ thêm — trường hợp đặc biệt với `<label>` bọc `<input>`:**

Nếu HTML viết dạng:
```html
<label>
  <input type="checkbox" id="check-all" />
  Chọn tất cả
</label>
```
và gắn `addEventListener("click", ...)` lên `label`, thì khi click vào `label`:
1. Sự kiện `click` xảy ra ở `label`.
2. Trình duyệt có hành vi **mặc định**: click vào `<label>` sẽ tự động **kích hoạt (focus/click) luôn vào `<input>`** được nó bọc bên trong.
3. Việc click "hộ" vào `input` này lại tiếp tục **nổi bọt** ngược lên `label` một lần nữa.

→ Kết quả: listener trên `label` bị gọi **2 lần** cho 1 lần click thật của người dùng — đây là lỗi rất dễ gặp và khó nhận ra.

**Cách khắc phục**: tách `input` ra khỏi `label`, dùng thuộc tính `for` để liên kết:
```html
<input type="checkbox" id="check-all" />
<label for="check-all">Chọn tất cả</label>
```
Khi đó listener chỉ được gọi đúng 1 lần.

Ngoài ra, khi cần lấy chính xác trạng thái của checkbox (`checked`) trong trường hợp label bọc input, nên dùng `e.currentTarget` (phần tử đang lắng nghe) thay vì `e.target`, để tránh nhầm giữa `label` và `input`.

### 3.4. `e.preventDefault()`

Mỗi loại sự kiện thường **đi kèm 1 hành động mặc định** của trình duyệt. Ví dụ:
- Submit form (không có `action`) → mặc định **reload lại trang**.
- Submit form có `action="url"` → mặc định **chuyển hướng (redirect)** sang `url` đó.
- Click vào link `<a>` → mặc định **điều hướng** sang trang khác.

`e.preventDefault()` dùng để **chặn hành động mặc định đó lại**, để ta tự xử lý bằng JavaScript (thường dùng khi làm Single Page Application — ứng dụng không load lại trang).

```js
form.addEventListener("submit", function (e) {
  e.preventDefault(); // chặn việc reload/redirect
  // ...xử lý dữ liệu form bằng JS (gửi AJAX, validate, v.v.)
});
```

📌 **Làm rõ thêm — nút nào kích hoạt sự kiện `submit`?**
- `<button type="submit">` (mặc định của `<button>` trong `<form>` cũng là `submit` nếu không khai báo `type`) → kích hoạt sự kiện `submit`, có thể `preventDefault()`.
- `<button type="reset">` → **reset toàn bộ input về giá trị ban đầu**, KHÔNG kích hoạt sự kiện `submit`. Ít được dùng trong thực tế vì dễ khiến người dùng bấm nhầm, mất hết dữ liệu đã nhập.
- `<button type="button">` → không có hành động mặc định nào cả (chỉ dùng để gắn sự kiện tùy ý qua JS).

📌 **Làm rõ thêm — khi nào cần gọi `form.reset()`?**
Nếu bạn `preventDefault()` để tự xử lý submit (ví dụ gửi dữ liệu lên server bằng JS), sau khi gửi thành công, bạn có thể **chủ động gọi `form.reset()`** bằng code để xoá trắng lại các input — đây là cách dùng "reset" phổ biến trong thực tế, thay vì dựa vào nút `type="reset"`.

### 3.5. `e.stopPropagation()`
Dùng để **chặn sự kiện tiếp tục lan truyền** (nổi bọt lên cha hoặc đi xuống con) — sẽ giải thích chi tiết trong phần Bubbling/Capturing bên dưới.

---

## PHẦN 4: EVENT FLOW — CAPTURING & BUBBLING

Khi 1 sự kiện xảy ra tại 1 phần tử (VD: click vào `<li>` nằm trong `<ul>` trong `<div>` trong `<body>`...), sự kiện đó thực chất trải qua **3 giai đoạn**:

```
window → html → body → div → ul → li     (1) CAPTURING PHASE
                                    li     (2) TARGET PHASE
li → ul → div → body → html → window      (3) BUBBLING PHASE
```

1. **Capturing (giai đoạn tóm bắt)**: sự kiện đi **từ ngoài vào trong**, bắt đầu từ `window` → xuống dần các phần tử cha, ông... → tới đúng phần tử được click (`target`).
2. **Target phase**: sự kiện chính thức xảy ra tại phần tử target.
3. **Bubbling (giai đoạn nổi bọt)**: sự kiện tiếp tục đi **từ trong ra ngoài**, từ phần tử target → lên cha → lên ông... → tới `window`.

### 4.1. Mặc định trình duyệt bắt sự kiện ở giai đoạn nào?

Mặc định, `addEventListener(type, fn)` sẽ lắng nghe ở giai đoạn **bubbling** (giai đoạn 3).

Muốn lắng nghe ở giai đoạn **capturing** (giai đoạn 1), truyền thêm tham số thứ 3:

```js
el.addEventListener("click", fn, { capture: true });
// hoặc viết tắt:
el.addEventListener("click", fn, true);
```

### 4.2. Ý nghĩa thực tế

- Phần lớn các trường hợp trong thực tế chỉ cần dùng **bubbling** (mặc định) — đây cũng là cơ sở cho kỹ thuật **Event Delegation** ở Phần 5.
- **Capturing** ít khi dùng, chỉ áp dụng cho các bài toán đặc thù (ví dụ: muốn chặn 1 sự kiện trước khi nó "chạm" tới phần tử con).

### 4.3. Ví dụ minh hoạ tính chất nổi bọt (bubbling)

```html
<ul id="list">
  <li class="active">Item con</li>
</ul>
```
```js
document.querySelector(".active").addEventListener("click", () => console.log("Click phần tử con"));
document.querySelector("#list").addEventListener("click", () => console.log("Click phần tử cha"));
document.body.addEventListener("click", () => console.log("Click ở body"));
```
Khi click vào phần tử `.active`, cả 3 dòng log đều chạy (theo thứ tự con → cha → body), vì sự kiện **nổi bọt dần lên trên**.

---

## PHẦN 5: EVENT DELEGATION (ỦY QUYỀN SỰ KIỆN)

### 5.1. Vấn đề cần giải quyết
Nếu có danh sách nhiều phần tử con (ví dụ 100 `<li>`), cách làm thông thường là gắn `addEventListener` lên **từng phần tử con** → tốn rất nhiều bộ nhớ/tài nguyên trình duyệt, code dài dòng, và **không tự động áp dụng cho phần tử mới thêm vào sau này** (vì phần tử mới chưa được gắn listener).

### 5.2. Giải pháp: Event Delegation
Thay vì gắn listener lên từng phần tử con, ta chỉ gắn **1 listener duy nhất lên phần tử cha**, tận dụng tính chất **bubbling**: khi click vào bất kỳ phần tử con nào, sự kiện đều nổi bọt lên tới cha → cha "bắt" được sự kiện đó.

```js
const ul = document.querySelector(".event-method-list");

ul.addEventListener("click", function (e) {
  // e.target là phần tử con thực sự bị click (có thể là li, hoặc phần tử lồng trong li)
  const li = e.target.closest("li"); // tìm ngược lên <li> gần nhất
  if (li) {
    console.log(li.textContent);
  }
});
```

📌 **Làm rõ thêm — tại sao phải dùng `closest("li")` thay vì dùng `e.target` trực tiếp?**
Vì `e.target` có thể là **bất kỳ phần tử con nào bên trong `<li>`** (ví dụ nếu trong `<li>` còn có `<span>`, `<b>`...), không nhất thiết là chính `<li>`. Dùng `closest("li")` đảm bảo luôn lấy đúng phần tử `<li>` cha gần nhất chứa điểm click, bất kể người dùng click trúng chỗ nào bên trong nó. Nếu click ra ngoài `<li>` (VD: click vào khoảng trống của `<ul>`), `closest("li")` sẽ trả về `null`, nên cần luôn kiểm tra `if (li)` trước khi xử lý tiếp.

### 5.3. Lợi ích
- Chỉ cần **1 listener** thay vì hàng chục/hàng trăm.
- **Tự động hoạt động với phần tử được thêm mới sau này** (vì listener nằm ở cha, không phụ thuộc con nào tồn tại từ đầu).
- Tiết kiệm bộ nhớ, tăng hiệu năng trang.

---

## PHẦN 6: CÁC NHÓM SỰ KIỆN (EVENT TYPES) PHỔ BIẾN

### 6.1. Nhóm chuột / con trỏ (Mouse & Pointer)

| Sự kiện (Mouse) | Ý nghĩa |
|---|---|
| `click` | Nhấp chuột 1 lần |
| `dblclick` | Nhấp đúp chuột |
| `mousedown` | Nhấn chuột xuống |
| `mouseup` | Nhả chuột lên |
| `mousemove` | Di chuyển chuột trên phần tử |
| `mouseover` | Con trỏ **di chuyển vào** phần tử (có bubbling) |
| `mouseout` | Con trỏ **di chuyển ra khỏi** phần tử (có bubbling) |
| `contextmenu` | Click chuột phải |

📌 **Làm rõ thêm — điểm nhầm lẫn trong bài giảng: `mouseout` "bắn" cả khi con trỏ vẫn ở trong phần tử?**

Đây là hành vi **đúng theo chuẩn**, không phải lỗi: `mouseover`/`mouseout` **có tính chất bubbling (nổi bọt)**. Nếu bên trong phần tử cha còn có các phần tử con, thì khi di chuyển chuột **từ phần tử cha sang 1 phần tử con bên trong nó**, trình duyệt coi như con trỏ đã "rời khỏi" phần tử cha rồi lại "đi vào" phần tử con → sự kiện `mouseout` vẫn bị bắn ra ở phần tử cha, dù con trỏ vẫn còn nằm trong vùng hiển thị của cha (chỉ là đã đổi sang phần tử con).

Ngược lại, có 2 sự kiện **KHÔNG bubbling**, chỉ bắn ra đúng khi con trỏ thực sự rời khỏi/đi vào phần tử đó (không bị ảnh hưởng bởi các phần tử con bên trong):

| Sự kiện | Ý nghĩa |
|---|---|
| `mouseenter` | Con trỏ đi vào phần tử (không bubble) |
| `mouseleave` | Con trỏ rời khỏi phần tử (không bubble) |

**→ Trong thực tế, nếu chỉ muốn bắt đúng lúc chuột thực sự vào/ra 1 phần tử (không bị ảnh hưởng bởi con cháu bên trong), nên dùng `mouseenter`/`mouseleave` thay vì `mouseover`/`mouseout`.**

### 6.2. Nhóm Pointer (hiện đại hơn, thay thế cho Mouse + Touch)

| Sự kiện | Ý nghĩa |
|---|---|
| `pointerdown` | Nhấn xuống (chuột hoặc chạm) |
| `pointerup` | Nhả ra |
| `pointermove` | Di chuyển |
| `pointerover` / `pointerout` | Vào/ra phần tử (có bubbling — tương đương mouseover/mouseout) |
| `pointerenter` / `pointerleave` | Vào/ra phần tử (không bubbling — tương đương mouseenter/mouseleave) |

`pointer*` là nhóm sự kiện hiện đại, **đại diện chung cho cả chuột và cảm ứng (touch)** trên 1 API duy nhất — nên trong thực tế được khuyên dùng thay cho việc phải xử lý riêng `mouse*` và `touch*`.

### 6.3. Nhóm bàn phím (Keyboard)

| Sự kiện | Ý nghĩa |
|---|---|
| `keydown` | Nhấn phím xuống |
| `keyup` | Nhả phím lên |
| `keypress` | Giữ phím (đã lỗi thời, ít dùng, ưu tiên `keydown`) |

### 6.4. Nhóm form

| Sự kiện | Ý nghĩa |
|---|---|
| `submit` | Gắn trên `<form>`, kích hoạt khi bấm nút `type="submit"` |
| `change` | Giá trị input thay đổi **và đã rời focus** (hoặc chọn xong với checkbox/select) |
| `input` | Giá trị input thay đổi **ngay lập tức** khi gõ/click (thời gian thực) |
| `focus` | Phần tử được focus vào |
| `blur` | Phần tử bị mất focus |
| `reset` | Form bị reset |

📌 **Làm rõ thêm — vì sao trong bài checkbox phải lắng nghe sự kiện `change` trên input thay vì đọc trạng thái ngay sau `click`?**

Khi người dùng click vào checkbox, trình duyệt cần một khoảng xử lý để **cập nhật xong thuộc tính `checked`** của input rồi mới coi là "thay đổi xong". Nếu bạn đọc `input.checked` **ngay trong sự kiện `click`**, có thể đọc được giá trị **cũ** (chưa kịp cập nhật) trong một số trường hợp. Sự kiện `change` được thiết kế để đảm bảo bắn ra **sau khi** giá trị đã thực sự thay đổi xong, nên đọc `checked` trong `change` sẽ luôn chính xác và an toàn hơn.

### 6.5. Nhóm cửa sổ (Window)

| Sự kiện | Ý nghĩa |
|---|---|
| `load` | Toàn bộ trang (kể cả ảnh, css...) đã tải xong |
| `DOMContentLoaded` | Cây DOM đã dựng xong (chưa cần chờ ảnh/css tải hết) |
| `resize` | Cửa sổ trình duyệt đổi kích thước |
| `scroll` | Trang được cuộn |
| `beforeunload` | Trước khi người dùng rời/đóng trang (thường dùng để hỏi xác nhận) |

### 6.6. Nhóm khác

- **Clipboard**: `copy`, `cut`, `paste`
- **Media** (audio/video): `play`, `pause`, `seeked`...
- **Animation/Transition**: `animationend`, `transitionend`
- **Touch** (cảm ứng, cách cũ hơn — chỉ xuất hiện trên thiết bị/chế độ cảm ứng): `touchstart`, `touchmove`, `touchend`, `touchcancel` (`touchcancel` xảy ra khi 1 lượt chạm bị gián đoạn đột ngột, ví dụ người dùng bấm nút Home giữa chừng khi đang chạm)
- **Drag & Drop**: `dragstart`, `drag`, `dragenter`, `dragleave`, `dragover`, `drop`, `dragend` — cần thêm thuộc tính `draggable="true"` cho phần tử muốn kéo được.

  📌 **Làm rõ thêm — phân biệt "drag" và "hover":** Drag = nhấn giữ chuột xuống rồi kéo đi (có mousedown trước). Hover = chỉ di chuyển chuột qua lại trên phần tử, không nhấn giữ. Đây là 2 khái niệm khác nhau, không dùng lẫn.

---

## PHẦN 7: TỔNG HỢP VÍ DỤ THỰC HÀNH — CHECKBOX "CHỌN TẤT CẢ" (Select All Todo)

Bài toán: có 1 checkbox "chọn tất cả" và nhiều checkbox con (todo). Yêu cầu:
1. Click "chọn tất cả" → tất cả checkbox con được check/uncheck theo.
2. Click 1 checkbox con → tự động cập nhật trạng thái của "chọn tất cả":
   - Tất cả con đều check → "chọn tất cả" ở trạng thái **checked**.
   - Không con nào check → "chọn tất cả" ở trạng thái **unchecked**.
   - Một phần được check → "chọn tất cả" ở trạng thái **indeterminate** (dấu gạch ngang `-`).
3. Hiển thị số lượng todo đang được chọn.

### 7.1. HTML mẫu (rút gọn)
```html
<input type="checkbox" id="check-all" />
<label for="check-all">Chọn tất cả</label>
<span id="counter">Không có công việc nào được chọn</span>

<ul>
  <li>
    <input type="checkbox" class="input-todo" id="todo1" />
    <label for="todo1">Todo 1</label>
  </li>
  <li>
    <input type="checkbox" class="input-todo" id="todo2" />
    <label for="todo2">Todo 2</label>
  </li>
  <li>
    <input type="checkbox" class="input-todo" id="todo3" />
    <label for="todo3">Todo 3</label>
  </li>
</ul>
```

### 7.2. Logic xử lý

```js
const checkAll = document.querySelector("#check-all");
const inputTodos = document.querySelectorAll(".input-todo");
const counter = document.querySelector("#counter");

let checkedCount = 0;

// (1) Khi bấm "chọn tất cả"
checkAll.addEventListener("change", function (e) {
  const isChecked = e.currentTarget.checked;
  inputTodos.forEach((input) => {
    input.checked = isChecked;
  });
  checkedCount = isChecked ? inputTodos.length : 0;
  updateCounter();
  updateCheckAllState();
});

// (2) Khi bấm từng checkbox con
inputTodos.forEach((input) => {
  input.addEventListener("change", function (e) {
    checkedCount += e.currentTarget.checked ? 1 : -1;
    updateCounter();
    updateCheckAllState();
  });
});

// Cập nhật số lượng hiển thị
function updateCounter() {
  counter.textContent = checkedCount + " công việc được chọn";
}

// Cập nhật trạng thái checkbox "chọn tất cả": checked / unchecked / indeterminate
function updateCheckAllState() {
  switch (checkedCount) {
    case inputTodos.length:
      checkAll.checked = true;
      checkAll.indeterminate = false;
      break;
    case 0:
      checkAll.checked = false;
      checkAll.indeterminate = false;
      break;
    default:
      checkAll.checked = false;
      checkAll.indeterminate = true;
      break;
  }
}
```

📌 **Làm rõ thêm về `indeterminate`:**
`indeterminate` là một thuộc tính **chỉ dùng cho checkbox**, khi đặt `checkbox.indeterminate = true`, checkbox sẽ hiển thị **dấu gạch ngang (-)** thay vì tick (✓) hoặc để trống — biểu thị trạng thái "chưa xác định hoàn toàn" (một phần được chọn). Đây thuần túy là **hiệu ứng hiển thị**, không ảnh hưởng đến giá trị thật của `checked` (giá trị `checked` khi đó vẫn là `true` hoặc `false` tùy bạn set, không có giá trị thứ 3).

📌 **Làm rõ thêm — tại sao ví dụ không dùng Event Delegation cho các checkbox con?**
Trong bài giảng, giảng viên có ý định dùng delegation (gắn 1 listener lên `<ul>` cha) nhưng gặp lại đúng lỗi bị gọi listener 2 lần (do label bọc input như đã nói ở Phần 3.3), nên trong ví dụ cụ thể này chọn cách gắn listener trực tiếp lên từng input con cho đơn giản, dễ kiểm soát. Với số lượng nhỏ (vài chục checkbox) thì cách này vẫn ổn; nếu số lượng rất lớn (hàng trăm), nên tách input ra khỏi label (dùng `for`) rồi áp dụng delegation kết hợp `closest()` để tối ưu hiệu năng.

---

## PHẦN 8: BÀI TẬP THỰC HÀNH (áp dụng lý thuyết vừa học)

**Yêu cầu:** Xây dựng component **Tabs** gồm:
1. 3 tab tiêu đề: `Tab 1`, `Tab 2`, `Tab 3`.
2. 3 nội dung tương ứng: `Content 1`, `Content 2`, `Content 3`.
3. Khi bấm vào 1 tab:
   - Tab đó chuyển sang trạng thái **active** (đổi màu, ví dụ chữ/nền xanh).
   - Các tab còn lại **bỏ active**.
   - Vùng nội dung bên dưới hiển thị đúng nội dung tương ứng với tab đang active.
4. Mặc định khi tải trang, Tab 1 và Content 1 ở trạng thái active.

**Gợi ý áp dụng kiến thức vừa học:**
- Dùng `querySelectorAll` để lấy danh sách tất cả các nút tab.
- Dùng `forEach` để gắn `addEventListener("click", ...)` cho từng tab (hoặc dùng Event Delegation gắn lên phần tử cha bọc các tab).
- Dùng `classList.add("active")` / `classList.remove("active")` để đổi trạng thái active (kiến thức DOM cơ bản buổi trước).
- Dùng `e.currentTarget` (hoặc `e.target` kết hợp `closest()` nếu dùng delegation) để xác định tab nào vừa được click.
- Có thể dùng thuộc tính `data-*` (VD: `data-tab="1"`) trên mỗi tab và mỗi nội dung để dễ dàng khớp tab ↔ content tương ứng.

---

## TỔNG KẾT NHỮNG ĐIỂM CẦN NHỚ

1. **Chọn tương đối**: `nextElementSibling`, `previousElementSibling`, `parentElement`, `children`, `firstElementChild`/`lastElementChild`, `closest()`.
2. **Lắng nghe sự kiện**: ưu tiên `addEventListener` hơn `onEvent` (vì gắn được nhiều listener, không bị ghi đè).
3. **`e.target`** = phần tử bị tương tác trực tiếp; **`e.currentTarget`** = phần tử đang gắn listener. Luôn phân biệt rõ 2 khái niệm này.
4. **`e.preventDefault()`**: chặn hành động mặc định (VD: submit form không bị reload trang).
5. **Event flow** có 3 giai đoạn: Capturing (ngoài → trong) → Target → Bubbling (trong → ngoài, mặc định của `addEventListener`).
6. **Event Delegation**: gắn 1 listener duy nhất lên phần tử cha, dùng `e.target.closest(selector)` để xác định phần tử con thực sự được tương tác — tối ưu hiệu năng, tự động áp dụng cho phần tử thêm mới sau này.
7. **mouseover/mouseout** có bubbling (dễ bị bắn nhầm khi qua lại giữa các phần tử con); **mouseenter/mouseleave** không bubbling (chính xác hơn khi cần bắt đúng lúc vào/ra 1 phần tử).
8. **pointer\*** events là chuẩn hiện đại, thay thế được cả mouse và touch trong đa số trường hợp.
9. Chú ý bẫy **listener bị gọi 2 lần** khi `<label>` bọc `<input>` — nên tách ra dùng thuộc tính `for`.
