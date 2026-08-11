# Buổi 28: Asynchronous trong JavaScript

> Tài liệu này được tổng hợp lại từ nội dung buổi học (transcript), sắp xếp theo đúng outline giáo trình, đồng thời bổ sung và làm rõ những phần buổi học chỉ nói lướt qua hoặc nói chưa rõ ràng, kèm ví dụ minh họa cụ thể để dễ hiểu.

---

## 0. Vì sao JavaScript cần "bất đồng bộ"?

JavaScript là ngôn ngữ **đơn luồng** (single-threaded) — tại một thời điểm chỉ chạy được **một** đoạn code. Nếu mọi thứ đều chạy **đồng bộ (synchronous)** — lệnh sau phải đợi lệnh trước chạy xong — thì những tác vụ mất thời gian (gọi API, đọc file, đếm giờ...) sẽ làm **đứng cứng (block)** toàn bộ trang web, người dùng không bấm được gì cả.

→ Giải pháp: JavaScript cho phép "giao" các tác vụ tốn thời gian cho một bên khác xử lý (trình duyệt, hoặc Node.js), rồi **quay lại nhận kết quả sau**, mà không chặn luồng chính. Đó chính là lập trình **bất đồng bộ (asynchronous)**.

Có 3 cách chính để làm việc bất đồng bộ trong JS, xuất hiện theo thứ tự lịch sử:

1. **Callback** (cũ nhất)
2. **Promise** (khắc phục nhược điểm của callback)
3. **Async/Await** (cú pháp viết Promise theo kiểu "đồng bộ giả")

---

## 1. Asynchronous Callback

### 1.1. Callback là gì?

> **Callback** là một hàm được truyền vào làm tham số cho một hàm khác, để hàm kia gọi lại (call back) khi cần.

```js
function sum(a, b, callback) {
  const result = a + b;
  callback(result);
}

sum(5, 2, function (result) {
  console.log("Tổng là:", result); // Tổng là: 7
});
```

Lưu ý quan trọng buổi học nhấn mạnh: **không phải callback nào cũng là bất đồng bộ**. Có 2 loại:

| Loại | Đặc điểm | Ví dụ |
|---|---|---|
| **Synchronous callback** (callback đồng bộ) | Được gọi **ngay lập tức**, trong cùng một lượt chạy code | `array.map()`, `array.forEach()`, hàm `sum(a, b, callback)` ở trên |
| **Asynchronous callback** (callback bất đồng bộ) | Được gọi **sau này**, khi một sự kiện/tác vụ nào đó hoàn thành, thông qua Web API + Event Loop | `setTimeout(callback, 1000)`, `element.addEventListener("click", callback)` |

```js
// Callback ĐỒNG BỘ — chạy ngay, không hề bất đồng bộ
[1, 2, 3].forEach((n) => console.log(n));

// Callback BẤT ĐỒNG BỘ — chạy sau, khi hết 1 giây
setTimeout(() => console.log("Chạy sau 1 giây"), 1000);
```

### 1.2. `setTimeout` / `clearTimeout`

`setTimeout(callback, delay, ...args)`: hẹn giờ chạy `callback` **một lần** sau `delay` mili-giây.

```js
const timerId = setTimeout(() => {
  console.log("Xin chào sau 2 giây!");
}, 2000);

// Muốn hủy trước khi nó chạy:
clearTimeout(timerId);
```

Lưu ý: `delay` là thời gian **tối thiểu**, không phải chính xác tuyệt đối — vì còn phải đợi Call Stack trống mới được đưa vào chạy (xem phần Event Loop bên dưới).

### 1.3. `setInterval` / `clearInterval`

`setInterval(callback, delay)`: chạy `callback` **lặp lại liên tục** mỗi `delay` mili-giây, cho tới khi bị hủy.

```js
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log("Đếm:", count);
  if (count === 5) {
    clearInterval(intervalId); // bắt buộc phải hủy, nếu không nó chạy mãi mãi
  }
}, 1000);
```

### 1.4. `addEventListener` / `removeEventListener`

Đây cũng là một dạng đăng ký **callback bất đồng bộ**: hàm callback chỉ chạy khi sự kiện xảy ra (click, load, thay đổi trạng thái...).

```js
function handleClick() {
  console.log("Người dùng đã bấm nút!");
}

button.addEventListener("click", handleClick);

// Gỡ bỏ khi không cần nữa (quan trọng để tránh memory leak)
button.removeEventListener("click", handleClick);
```

> **Lưu ý:** muốn `removeEventListener` hoạt động, callback truyền vào phải là **cùng một tham chiếu hàm** (named function), không thể là arrow function ẩn danh khai báo trực tiếp trong `addEventListener`.

#### Ví dụ thực tế trong buổi học: `xhr.addEventListener("readystatechange", callback)`

Đây là cách làm **cũ**, dùng `XMLHttpRequest` để gọi API trước khi có `fetch`:

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/products");

xhr.addEventListener("readystatechange", function () {
  // readyState chạy qua nhiều giá trị: 0 → 1 → 2 → 3 → 4
  // 4 = DONE (đã nhận xong toàn bộ phản hồi)
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  }
});

xhr.send();
```

Bảng giá trị của `readyState`:

| Giá trị | Ý nghĩa |
|---|---|
| 0 | `UNSENT` — chưa gọi `open()` |
| 1 | `OPENED` — đã gọi `open()` |
| 2 | `HEADERS_RECEIVED` — đã nhận header |
| 3 | `LOADING` — đang tải dữ liệu |
| 4 | `DONE` — đã hoàn tất |

**Nhược điểm của callback (lý do Promise ra đời):** khi có nhiều thao tác bất đồng bộ nối tiếp nhau (gọi API A xong mới gọi API B, xong mới gọi API C...), code sẽ bị lồng vào nhau rất sâu — gọi là **"Callback Hell"**:

```js
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetail(orders[0].id, (detail) => {
      console.log(detail); // lồng càng ngày càng sâu, khó đọc, khó bắt lỗi
    });
  });
});
```

---

## 2. Promise

### 2.1. Promise là gì?

> **Promise** là một đối tượng đại diện cho **kết quả trong tương lai** của một tác vụ bất đồng bộ. Nó giống như một "lời hứa": hoặc sẽ được **giữ lời** (thành công), hoặc sẽ **thất hứa** (thất bại).

Một Promise luôn ở 1 trong 3 trạng thái:

| Trạng thái | Ý nghĩa |
|---|---|
| `pending` | Đang chờ xử lý (chưa có kết quả) |
| `fulfilled` | Đã hoàn thành thành công |
| `rejected` | Đã thất bại |

Khi đã chuyển từ `pending` sang `fulfilled`/`rejected`, trạng thái đó **không thể thay đổi nữa** — gọi là "settled" (đã ổn định).

### 2.2. Tạo Promise: `new Promise`

```js
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve("Dữ liệu tải thành công!"); // chuyển sang fulfilled
    } else {
      reject(new Error("Có lỗi xảy ra!")); // chuyển sang rejected
    }
  }, 1000);
});
```

### 2.3. `.then()`, `.catch()`, `.finally()`

```js
myPromise
  .then((result) => {
    console.log("Thành công:", result);
  })
  .catch((error) => {
    console.log("Thất bại:", error.message);
  })
  .finally(() => {
    console.log("Luôn chạy dù thành công hay thất bại (VD: ẩn loading)");
  });
```

### 2.4. Promise chaining (nối chuỗi Promise)

Điểm mạnh nhất của Promise so với callback: mỗi `.then()` trả về **một Promise mới**, nên có thể nối tiếp các bước xử lý bất đồng bộ **theo hàng ngang**, thay vì lồng nhau như callback hell:

```js
fetch("https://api.example.com/users/1")
  .then((res) => res.json())
  .then((user) => fetch(`https://api.example.com/orders?userId=${user.id}`))
  .then((res) => res.json())
  .then((orders) => console.log("Đơn hàng:", orders))
  .catch((err) => console.log("Lỗi ở bất kỳ bước nào:", err));
```

→ So với callback hell ở trên, đoạn code này đọc từ trên xuống dưới rất tự nhiên, dễ theo dõi luồng xử lý, và chỉ cần **1 chỗ `.catch()`** để bắt lỗi cho toàn bộ chuỗi.

### 2.5. `Promise.resolve()` / `Promise.reject()`

Tạo nhanh một Promise đã ở trạng thái `fulfilled` hoặc `rejected` sẵn (hữu ích khi test, hoặc khi cần trả về Promise dù giá trị đã có sẵn):

```js
Promise.resolve(42).then((v) => console.log(v)); // 42
Promise.reject("Lỗi!").catch((e) => console.log(e)); // Lỗi!
```

### 2.6. Các phương thức xử lý nhiều Promise cùng lúc

Đây là nhóm kiến thức hay bị nhầm lẫn nhất — bảng so sánh:

| Phương thức | Chờ tất cả xong? | Khi nào `resolve` | Khi nào `reject` |
|---|---|---|---|
| `Promise.all()` | Có | Khi **tất cả** đều thành công → trả về mảng kết quả theo đúng thứ tự | Ngay khi **1 cái bất kỳ thất bại** (fail fast) |
| `Promise.allSettled()` | Có | Luôn resolve khi **tất cả đã xong** (dù thành công hay thất bại), trả về mảng `{status, value/reason}` | Không bao giờ reject |
| `Promise.race()` | Không | Trả về kết quả của Promise **hoàn thành đầu tiên** (thành công hoặc thất bại đều tính) | Nếu Promise đầu tiên hoàn thành là bị lỗi |
| `Promise.any()` | Không | Trả về kết quả của Promise **thành công đầu tiên** | Chỉ reject khi **tất cả** đều thất bại (`AggregateError`) |

Ví dụ minh họa:

```js
const p1 = fetch("/api/user");
const p2 = fetch("/api/orders");
const p3 = fetch("/api/products");

// 1. Cần TẤT CẢ đều thành công mới dùng được — VD: load dashboard cần đủ 3 loại dữ liệu
Promise.all([p1, p2, p3])
  .then(([user, orders, products]) => console.log("Đủ cả 3!"))
  .catch((err) => console.log("Một trong ba API lỗi:", err));

// 2. Muốn biết kết quả của TỪNG cái, dù có cái lỗi cũng không sao
Promise.allSettled([p1, p2, p3]).then((results) => {
  results.forEach((r) => {
    if (r.status === "fulfilled") console.log("OK:", r.value);
    else console.log("Lỗi:", r.reason);
  });
});

// 3. Chỉ cần cái nào xong trước — VD: gọi cùng 1 API tới nhiều server, lấy server nào phản hồi nhanh nhất
Promise.race([p1, p2]).then((fastest) => console.log("Nhanh nhất:", fastest));

// 4. Chỉ cần MỘT cái thành công là đủ, không quan tâm mấy cái kia
Promise.any([p1, p2, p3]).then((firstSuccess) => console.log(firstSuccess));
```

---

## 3. Async/Await

### 3.1. Khái niệm

`async`/`await` là **cú pháp (syntax sugar)** giúp viết code bất đồng bộ **trông giống code đồng bộ**, dễ đọc hơn nhiều so với `.then().then().then()`. Bản chất bên dưới **vẫn là Promise**.

- `async function`: đánh dấu một hàm là bất đồng bộ. Hàm này **luôn luôn trả về một Promise** (dù bên trong bạn `return` giá trị thường, JS vẫn tự bọc nó thành `Promise.resolve(giá_trị)`).
- `await`: chỉ dùng được **bên trong hàm `async`**. Nó "tạm dừng" hàm tại đó cho tới khi Promise phía sau `await` hoàn thành (resolve/reject), rồi mới chạy tiếp dòng kế tiếp.

```js
async function getUser() {
  return "Nam"; // thực chất trả về Promise.resolve("Nam")
}

getUser().then((name) => console.log(name)); // "Nam"
```

### 3.2. `await` expression

```js
async function loadData() {
  const res = await fetch("https://api.example.com/products");
  const data = await res.json();
  console.log(data);
}
```

So sánh trực tiếp với cách viết Promise chaining ở phần 2.4:

```js
// Cách Promise chaining
function loadUserOrders() {
  return fetch("/api/users/1")
    .then((res) => res.json())
    .then((user) => fetch(`/api/orders?userId=${user.id}`))
    .then((res) => res.json());
}

// Cách async/await — cùng logic, dễ đọc hơn
async function loadUserOrders() {
  const userRes = await fetch("/api/users/1");
  const user = await userRes.json();
  const orderRes = await fetch(`/api/orders?userId=${user.id}`);
  const orders = await orderRes.json();
  return orders;
}
```

### 3.3. Xử lý lỗi với `try/catch`

Vì `await` không có `.catch()` đi kèm, cách xử lý lỗi chuẩn là bọc bằng `try/catch`:

```js
async function loadData() {
  try {
    const res = await fetch("https://api.example.com/products");
    if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log("Đã có lỗi xảy ra:", error.message);
  } finally {
    console.log("Luôn chạy — ví dụ tắt loading spinner");
  }
}
```

### 3.4. Chạy song song với `await` + `Promise.all`

Lỗi thường gặp: dùng nhiều `await` liên tiếp cho các tác vụ **không phụ thuộc nhau** sẽ khiến chúng chạy **tuần tự**, mất thời gian hơn cần thiết:

```js
// CHẬM — mỗi await phải đợi cái trước xong mới chạy cái sau (tổng ~3s)
const user = await fetch("/api/user").then((r) => r.json());     // 1s
const orders = await fetch("/api/orders").then((r) => r.json()); // 1s
const products = await fetch("/api/products").then((r) => r.json()); // 1s

// NHANH HƠN — cả 3 request bắn đi cùng lúc, chỉ đợi lâu nhất trong 3 cái (tổng ~1s)
const [user, orders, products] = await Promise.all([
  fetch("/api/user").then((r) => r.json()),
  fetch("/api/orders").then((r) => r.json()),
  fetch("/api/products").then((r) => r.json()),
]);
```

---

## 4. Event Loop

Đây là phần **cốt lõi** giải thích *tại sao* các đoạn code bất đồng bộ lại chạy theo đúng thứ tự như vậy. Buổi học có demo trực quan bằng công cụ mô phỏng **JS Visualizer / Loupe** (loại trang minh họa Call Stack – Web API – Queue theo thời gian thực) với ví dụ:

```js
console.log("Start");
setTimeout(() => {
  console.log("Callback bên trong setTimeout");
}, 0);
console.log("End");
```

**Kết quả in ra:**
```
Start
End
Callback bên trong setTimeout
```

### 4.1. Các thành phần tham gia

| Thành phần | Vai trò |
|---|---|
| **Call Stack** (ngăn xếp lệnh) | Nơi JavaScript thực thi code, hoạt động theo cơ chế **LIFO** (vào sau ra trước — giống chồng đĩa: xếp chồng lên, muốn lấy cái dưới phải lấy hết cái trên ra trước) |
| **Web APIs** | Các API do **trình duyệt** cung cấp (không phải JS engine), đảm nhận các việc tốn thời gian như đếm giờ (`setTimeout`), lắng nghe sự kiện, gọi mạng (`fetch`)... Ở Node.js thì tương ứng là **Node APIs / libuv** |
| **Callback Queue / Task Queue** | Hàng đợi (FIFO — vào trước ra trước) chứa các callback đã sẵn sàng, chờ được đưa vào Call Stack để chạy |
| **Event Loop** | Người "gác cổng": liên tục kiểm tra — nếu Call Stack **đang trống**, thì lấy callback tiếp theo từ hàng đợi đưa vào Call Stack để thực thi |

### 4.2. Diễn giải từng bước ví dụ trên (giống demo buổi học)

1. Tạo **Global Execution Context**, đẩy vào Call Stack.
2. `console.log("Start")` được đẩy vào Call Stack → chạy ngay → in ra `"Start"` → bị lấy ra khỏi stack.
3. `setTimeout(callback, 0)` được đẩy vào Call Stack → JS nhận ra đây là một **Web API** → JS **giao callback này cho trình duyệt xử lý** (đếm giờ), rồi lập tức lấy `setTimeout` ra khỏi Call Stack (JS không tự đếm giờ, không chờ).
4. `console.log("End")` được đẩy vào Call Stack → chạy ngay → in ra `"End"`.
5. → Đến đây, **Call Stack đã trống**, luồng code đồng bộ đã chạy xong hoàn toàn.
6. Trong lúc đó, trình duyệt đếm xong 0ms → đẩy callback của `setTimeout` vào **Task Queue** (cụ thể là **Macrotask Queue**).
7. **Event Loop** phát hiện Call Stack đang trống → lấy callback từ Task Queue → đẩy vào Call Stack để chạy → in ra `"Callback bên trong setTimeout"`.

> **Quy tắc vàng:** dù `delay = 0`, code bất đồng bộ **luôn luôn chạy sau** toàn bộ code đồng bộ, vì nó phải xếp hàng chờ Call Stack trống rồi mới tới lượt Event Loop đưa vào.

### 4.3. Microtask Queue vs Macrotask Queue

Buổi học có nhắc tới việc Task Queue chia làm 2 loại, đây là phần quan trọng nhưng nói khá lướt — làm rõ thêm:

| | Microtask Queue | Macrotask Queue (Task Queue thường) |
|---|---|---|
| Chứa gì | `.then/.catch/.finally` của Promise, `queueMicrotask()`, `async/await` (phần sau `await`) | `setTimeout`, `setInterval`, các sự kiện DOM (click, load...), I/O |
| Độ ưu tiên | **Cao hơn** — Event Loop luôn xử lý **hết sạch toàn bộ** Microtask Queue trước | Thấp hơn — chỉ lấy **1 task** mỗi vòng lặp, rồi lại quay về kiểm tra Microtask Queue |

Ví dụ minh họa rõ sự khác biệt (câu hỏi kinh điển hay gặp trong phỏng vấn):

```js
console.log("1. Đồng bộ - đầu");

setTimeout(() => console.log("4. Macrotask - setTimeout"), 0);

Promise.resolve().then(() => console.log("3. Microtask - promise.then"));

console.log("2. Đồng bộ - cuối");

// Kết quả in ra theo thứ tự: 1, 2, 3, 4
```

**Giải thích:** code đồng bộ chạy trước tiên (1, 2) → Call Stack trống → Event Loop ưu tiên xử lý **toàn bộ Microtask Queue** trước (3) → cuối cùng mới xử lý Macrotask Queue (4).

---

## 5. Fetch API

### 5.1. Cú pháp cơ bản: `fetch(url, options)`

`fetch()` trả về một **Promise**, dùng để gọi HTTP request — thay thế cho `XMLHttpRequest` cũ đã nói ở phần 1.4.

```js
fetch("https://api.example.com/products/64")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
    return response.json(); // .json() cũng trả về 1 Promise, cần return để chain tiếp
  })
  .then((data) => console.log(data))
  .catch((error) => console.log("Lỗi:", error));
```

Hoặc viết với `async/await` (khớp đúng với đoạn demo "product detail" trong buổi học — lấy `id` sản phẩm từ query string trên URL rồi gọi API):

```js
async function fetchProduct() {
  const params = new URLSearchParams(location.search); // ?id=64 → lấy giá trị "id"
  const id = params.get("id");

  const response = await fetch(`https://f8team.dev/api/product/${id}`);
  const body = await response.json();
  const product = body.data; // thường API trả về { data: {...}, message: ... }

  console.log(product);
  return product;
}
```

> **Ghi chú làm rõ:** `URLSearchParams` là API có sẵn của trình duyệt giúp làm việc với chuỗi query string (`location.search`, ví dụ `"?id=64&campaign=vne"`) dễ dàng hơn, thay vì tự viết `split("&")`, `split("=")` thủ công như buổi học có nhắc tới cách làm "chay".

### 5.2. `options` của `fetch`

```js
fetch("https://api.example.com/products", {
  method: "POST", // GET (mặc định), POST, PUT, PATCH, DELETE...
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <token>",
  },
  body: JSON.stringify({ name: "Áo thun", price: 150000 }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 5.3. Lưu ý quan trọng dễ nhầm

`fetch()` chỉ `reject` khi có lỗi **mạng** (mất kết nối, sai domain...), **không tự động reject** khi server trả về mã lỗi như `404`, `500`. Vì vậy luôn cần kiểm tra `response.ok` hoặc `response.status` thủ công như ví dụ ở 5.1.

---

## 6. AbortController

Dùng để **hủy** một `fetch` (hoặc tác vụ bất đồng bộ khác có hỗ trợ) đang chạy dở — hữu ích khi: người dùng rời trang trước khi API trả về, hoặc gõ tìm kiếm liên tục và chỉ muốn giữ lại request mới nhất.

### 6.1. `abortController.signal` và `abortController.abort()`

```js
const controller = new AbortController();

fetch("https://api.example.com/search?q=abc", {
  signal: controller.signal, // gắn signal vào request
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Request đã bị hủy!");
    } else {
      console.log("Lỗi khác:", err);
    }
  });

// Muốn hủy request (ví dụ khi người dùng gõ chữ tiếp theo):
controller.abort();
```

### Ví dụ thực tế: hủy request cũ khi tìm kiếm liên tục (debounce search)

```js
let currentController = null;

async function search(keyword) {
  // nếu có request cũ đang chạy → hủy nó trước
  if (currentController) currentController.abort();

  currentController = new AbortController();

  try {
    const res = await fetch(`/api/search?q=${keyword}`, {
      signal: currentController.signal,
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    if (err.name !== "AbortError") console.log("Lỗi:", err);
  }
}
```

---

## 7. Web Workers

### 7.1. Vấn đề cần giải quyết

JavaScript chạy trên **1 luồng duy nhất** (main thread) — nếu có một tác vụ **tính toán nặng** (không phải chờ I/O, mà là CPU phải tính toán liên tục, ví dụ: xử lý ảnh, tính toán số lớn, mã hóa dữ liệu...) thì dù có `async/await` hay Promise cũng **không giúp được gì**, vì bản chất luồng chính vẫn bị chiếm dụng, giao diện sẽ bị đứng (không phản hồi khi bấm chuột, cuộn trang...).

> Đây là điểm khác biệt quan trọng: **Promise/async-await giải quyết vấn đề chờ đợi (I/O)**, còn **Web Worker giải quyết vấn đề tính toán nặng (CPU)** bằng cách chạy trên **một luồng riêng, song song** với luồng chính.

### 7.2. Tạo Worker: `new Worker(url, options)`

**File chính (main.js):**
```js
const worker = new Worker("worker.js");

// Gửi dữ liệu sang worker
worker.postMessage({ command: "start", number: 1000000000 });

// Lắng nghe kết quả trả về từ worker
worker.addEventListener("message", (event) => {
  console.log("Kết quả từ worker:", event.data);
});

// Khi không cần worker nữa, nên dừng để giải phóng tài nguyên
// worker.terminate();
```

**File worker (worker.js) — chạy trên luồng riêng biệt, không truy cập được DOM:**
```js
self.addEventListener("message", (event) => {
  const { number } = event.data;

  let sum = 0;
  for (let i = 0; i < number; i++) {
    sum += i; // vòng lặp tính toán nặng — nếu chạy ở main thread sẽ làm đứng UI
  }

  self.postMessage(sum); // gửi kết quả về lại main thread
});
```

### 7.3. Bảng tổng hợp API của Worker

| Gọi từ đâu | Cú pháp | Ý nghĩa |
|---|---|---|
| Main thread | `worker.postMessage(message)` | Gửi dữ liệu **tới** worker |
| Main thread | `worker.addEventListener("message", cb)` | Lắng nghe dữ liệu worker gửi **về** |
| Main thread | `worker.terminate()` | Dừng hẳn worker, giải phóng luồng |
| Bên trong Worker | `self.postMessage(message)` | Gửi dữ liệu **về** main thread |
| Bên trong Worker | `self.addEventListener("message", cb)` | Lắng nghe dữ liệu main thread gửi **tới** |
| Bên trong Worker | `self.close()` | Worker tự đóng chính nó |

### 7.4. Lưu ý quan trọng

- Web Worker chạy trong file **riêng biệt** (không thể viết chung 1 file với main thread).
- Bên trong Worker **không có quyền truy cập `window`, DOM, `document`** — chỉ trao đổi dữ liệu qua `postMessage`/`onmessage`.
- Dữ liệu truyền qua lại giữa main thread và worker được **copy** (structured clone), không phải tham chiếu trực tiếp.

---

## 8. Tổng kết & So sánh nhanh 3 cách xử lý bất đồng bộ

| Tiêu chí | Callback | Promise | Async/Await |
|---|---|---|---|
| Độ dễ đọc khi nhiều bước nối tiếp | Kém (dễ callback hell) | Tốt hơn (chain phẳng) | Tốt nhất (giống code đồng bộ) |
| Xử lý lỗi | Phải tự kiểm tra ở từng callback | `.catch()` dùng chung cho cả chuỗi | `try/catch` |
| Chạy song song nhiều tác vụ | Khó, phải tự đếm số lượng hoàn thành | `Promise.all/race/any/allSettled` | Kết hợp `await Promise.all([...])` |
| Bản chất | Cơ chế gốc | Đối tượng chuẩn hóa cho async | Cú pháp viết trên nền Promise |

**Ghi nhớ cốt lõi của cả buổi học:**
1. JS đơn luồng → cần cơ chế bất đồng bộ để không bị block khi chờ (setTimeout, gọi API...).
2. Code đồng bộ **luôn chạy xong trước**, code bất đồng bộ luôn phải chờ đến lượt qua Event Loop.
3. Trong hàng đợi, **Microtask (Promise) được ưu tiên hơn Macrotask (setTimeout, sự kiện DOM)**.
4. `fetch` + `Promise`/`async-await` giải quyết bài toán **I/O** (chờ mạng, chờ dữ liệu).
5. `Web Worker` giải quyết bài toán **CPU nặng** (tính toán tốn thời gian).
6. `AbortController` giúp **hủy** một request đang chạy dở khi không còn cần thiết nữa.

---

## 9. Bài tập gợi ý để tự luyện

1. Viết một hàm `delay(ms)` trả về Promise, `resolve` sau `ms` mili-giây, rồi dùng `async/await` để in ra "Bắt đầu" → chờ 2s → in ra "Kết thúc".
2. Cho 3 API giả lập (dùng `setTimeout` để mô phỏng độ trễ khác nhau), viết code dùng `Promise.all` để gọi song song và `Promise.race` để lấy API nào phản hồi nhanh nhất.
3. Viết một ô input tìm kiếm: mỗi lần người dùng gõ, hủy request tìm kiếm cũ (dùng `AbortController`) trước khi gửi request mới.
4. Dự đoán thứ tự output của đoạn code sau rồi chạy thử để kiểm tra:
   ```js
   console.log("A");
   setTimeout(() => console.log("B"), 0);
   Promise.resolve().then(() => console.log("C"));
   console.log("D");
   ```
5. Viết một Web Worker tính tổng các số nguyên tố nhỏ hơn 1 triệu, so sánh trải nghiệm UI (có bị đứng không) giữa cách chạy trực tiếp trên main thread và chạy trong Worker.
