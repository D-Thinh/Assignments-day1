# Buổi 29: Storage, Authentication, Modules, Tools, Web Components trong JavaScript

---

## Phần 1: Web Storage (Lưu trữ trên trình duyệt)

### 1.1. Tổng quan Web Storage API

Web Storage API cho phép lưu dữ liệu ngay trong trình duyệt (client-side), không cần gửi lên server.

**Đặc điểm chung:**
- Dữ liệu bị giới hạn trong cùng một **origin** (origin = protocol + domain + port). Ví dụ `https://abc.com:3000` và `http://abc.com:3000` là **hai origin khác nhau** vì khác protocol.
- Đọc/ghi **đồng bộ** (synchronous) — code chạy tuần tự, không cần `await`.
- Dung lượng giới hạn khoảng **5MB mỗi origin** (tùy trình duyệt).
- Chỉ lưu được **chuỗi (string)**. Muốn lưu object/array phải chuyển qua JSON (`JSON.stringify` / `JSON.parse`).

### 1.2. localStorage

Dữ liệu **không có hạn sử dụng** — tồn tại vĩnh viễn cho đến khi:
- Bị xóa thủ công bằng code, hoặc
- Người dùng xóa dữ liệu trình duyệt thủ công, hoặc
- Đổi sang trình duyệt/máy khác (vì localStorage lưu trên máy, không đồng bộ qua tài khoản).

**Các phương thức:**

```javascript
// Ghi dữ liệu
localStorage.setItem("username", "Nam");

// Đọc dữ liệu
const username = localStorage.getItem("username"); // "Nam"

// Xóa 1 key
localStorage.removeItem("username");

// Xóa toàn bộ dữ liệu trong origin
localStorage.clear();

// Lấy tên key theo index (thứ tự không đảm bảo cố định)
const firstKey = localStorage.key(0);

// Số lượng key hiện có
console.log(localStorage.length);
```

**Lưu object / array (phải qua JSON):**

```javascript
const user = { id: 1, name: "Nam", roles: ["admin", "editor"] };

// Lưu: chuyển object thành chuỗi JSON
localStorage.setItem("user", JSON.stringify(user));

// Đọc lại: chuyển chuỗi JSON về object
const savedUser = JSON.parse(localStorage.getItem("user"));
console.log(savedUser.name); // "Nam"
```

> ⚠️ Lưu ý làm rõ thêm: Nếu key không tồn tại, `getItem()` trả về `null` chứ không báo lỗi. Nếu bạn `JSON.parse(null)` sẽ trả về `null` (không lỗi), nhưng `JSON.parse(undefined)` sẽ **lỗi**. Vì vậy nên kiểm tra trước:
```javascript
const raw = localStorage.getItem("user");
const user = raw ? JSON.parse(raw) : null;
```

### 1.3. sessionStorage

Dùng chung bộ API với `localStorage` (`setItem`, `getItem`, `removeItem`, `clear`, `key`, `length`), nhưng khác về vòng đời:

- Dữ liệu chỉ tồn tại trong **phiên của một tab**. Đóng tab là dữ liệu bị xóa.
- **Không chia sẻ giữa các tab** — mỗi tab mở cùng một trang web sẽ có bản sessionStorage riêng biệt (kể cả khi cùng origin).
- Thích hợp cho dữ liệu tạm thời: giỏ hàng tạm, dữ liệu form đang nhập dở (draft), trạng thái wizard nhiều bước...

```javascript
sessionStorage.setItem("draftForm", JSON.stringify({ email: "a@gmail.com" }));
```

> 💡 Làm rõ thêm: Nếu bạn mở lại tab đã đóng bằng "reopen closed tab" (Ctrl+Shift+T) ở một số trình duyệt, sessionStorage có thể được khôi phục — đây là hành vi đặc thù của trình duyệt, không phải chuẩn bắt buộc.

### 1.4. So sánh localStorage và sessionStorage

| Tiêu chí | localStorage | sessionStorage |
|---|---|---|
| Thời gian sống | Lâu dài, đến khi bị xóa thủ công | Chỉ trong phiên của tab, mất khi đóng tab |
| Chia sẻ giữa các tab | Có (cùng origin) | Không (mỗi tab riêng) |
| Dung lượng | ~5MB/origin | ~5MB/origin |
| Cách truy cập (API) | Giống hệt nhau | Giống hệt nhau |
| Gửi kèm request server | Không tự động | Không tự động |

### 1.5. Cookies

- Dung lượng lưu tối đa khoảng **4KB**.
- **Tự động được gửi kèm lên server** với mỗi request (khác với localStorage/sessionStorage — hai loại này KHÔNG tự gửi lên server).
- Có thể đặt thời gian hết hạn bằng `expires` (ngày giờ cụ thể) hoặc `max-age` (số giây).
- Không nên dùng để lưu dữ liệu lớn; chủ yếu dùng cho token / thông tin phiên đăng nhập.

**Ví dụ set cookie bằng JavaScript:**

```javascript
// Set cookie tồn tại 1 ngày
document.cookie = "token=abc123; max-age=86400; path=/";

// Đọc cookie (document.cookie trả về 1 chuỗi duy nhất, cần tự parse)
console.log(document.cookie); // "token=abc123; theme=dark"
```

> 💡 Làm rõ thêm — các thuộc tính quan trọng của cookie mà transcript chưa nhắc chi tiết:
> - `HttpOnly`: cookie không thể đọc được bằng JavaScript (`document.cookie`), chỉ set được từ phía server. Giúp chống đánh cắp token qua XSS.
> - `Secure`: cookie chỉ được gửi qua kết nối HTTPS.
> - `SameSite`: kiểm soát việc cookie có được gửi kèm khi request từ domain khác hay không (`Strict`, `Lax`, `None`), giúp chống tấn công CSRF.

---

## Phần 2: Authentication (Xác thực người dùng)

### 2.1. Authentication vs Authorization

- **Authentication (Xác thực)**: xác minh **bạn là ai** — ví dụ đăng nhập bằng username/password.
- **Authorization (Phân quyền)**: xác minh **bạn được phép làm gì** — ví dụ chỉ admin mới được xóa bài viết.

**Hai cách tiếp cận:**
- **Cách cũ**: lưu session trên server, định danh qua cookie chứa `sessionId`. Server phải lưu trạng thái (stateful).
- **Cách hiện đại**: dùng token (thường là JWT), gửi kèm trong mỗi request. Server không cần lưu trạng thái (**stateless**), dễ mở rộng (scale) theo chiều ngang.

### 2.2. JWT (JSON Web Token)

JWT gồm 3 phần, ngăn cách bởi dấu chấm: `header.payload.signature`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcyMDAwMDAwMH0.4f3c9a...
```

- **Header**: chứa thuật toán mã hóa (vd `HS256`) và loại token.
- **Payload**: chứa dữ liệu (claims) như `userId`, `role`, thời gian hết hạn `exp`. 
  > ⚠️ Lưu ý quan trọng transcript chưa nói rõ: **Payload chỉ được mã hóa Base64, KHÔNG được mã hóa bí mật** — bất kỳ ai cũng có thể decode và đọc được nội dung (thử tại jwt.io). Vì vậy **không được** nhét mật khẩu hay dữ liệu nhạy cảm vào payload.
- **Signature**: được server ký bằng secret key, đảm bảo token không bị sửa đổi. Nếu ai đó sửa payload mà không có secret key, chữ ký sẽ không khớp và server sẽ từ chối token.

### 2.3. Access Token

- Thời gian sống ngắn: thường **15 - 60 phút**.
- Chứa thông tin người dùng và thời gian hết hạn.
- Client gửi kèm mỗi request qua header:

```http
Authorization: Bearer <access_token>
```

```javascript
fetch("https://api.example.com/profile", {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
```

- Server **không lưu lại** access token — chỉ kiểm tra chữ ký (signature) và thời gian hết hạn (`exp`) để xác thực. Đây chính là bản chất "stateless".

### 2.4. Refresh Token

- Thời gian sống dài: từ vài ngày đến vài tháng.
- Dùng để xin access token mới khi access token hết hạn, **không dùng để gọi API thông thường**.
- Rủi ro thấp hơn access token vì chỉ được gửi tới một endpoint duy nhất: `/auth/refresh`.
- Quy trình: khi access token hết hạn → client gọi `/auth/refresh` kèm refresh token → server xác thực → trả về **cặp token mới** (cả access token và refresh token mới — kỹ thuật này gọi là **refresh token rotation**, giúp tăng bảo mật).

```javascript
async function refreshAccessToken(refreshToken) {
  const res = await fetch("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) throw new Error("Refresh token hết hạn hoặc không hợp lệ");
  const { accessToken, refreshToken: newRefreshToken } = await res.json();
  return { accessToken, refreshToken: newRefreshToken };
}
```

### 2.5. Flow đăng ký (Register)

1. Client gửi `username`, `password` (và thông tin cần thiết khác) tới `POST /auth/register`.
2. Server tạo tài khoản, **mã hóa mật khẩu** bằng bcrypt (kỹ thuật hash + salt — không bao giờ lưu mật khẩu dạng plain text).
3. Server trả về thông báo thành công, và thường:
   - Tạo sẵn token luôn (tự động đăng nhập), hoặc
   - Redirect người dùng sang trang login để tự đăng nhập.

```javascript
async function register(username, password) {
  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}
```

> 💡 Làm rõ thêm: **bcrypt hash + salt** nghĩa là gì?
> - **Hash**: biến mật khẩu gốc thành một chuỗi mã hóa một chiều — không thể giải mã ngược lại thành mật khẩu gốc.
> - **Salt**: một chuỗi ngẫu nhiên được thêm vào mật khẩu trước khi hash, để hai người dùng có cùng mật khẩu vẫn cho ra hash khác nhau — chống lại tấn công dò bảng hash có sẵn (rainbow table).

### 2.6. Flow đăng nhập (Login)

1. Client gửi `username`/`password` tới `POST /auth/login`.
2. Server xác minh mật khẩu (so sánh hash) — **sai thì trả về `401 Unauthorized`**.
3. Đúng thì trả về `{ accessToken, refreshToken }`.
4. Client lưu cả 2 token vào `localStorage` (hoặc `sessionStorage`).

```javascript
async function login(username, password) {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (res.status === 401) throw new Error("Sai tài khoản hoặc mật khẩu");

  const { accessToken, refreshToken } = await res.json();
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}
```

### 2.7. Flow đăng xuất (Logout)

1. Client xóa `accessToken` và `refreshToken` khỏi storage.
2. Nếu server hỗ trợ, gọi `POST /auth/logout` để **thu hồi (revoke)** refresh token phía server — tránh trường hợp refresh token bị lộ vẫn còn dùng được.
3. Đưa giao diện quay về trạng thái chưa đăng nhập (ẩn các phần chỉ dành cho user đã đăng nhập).

```javascript
async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  await fetch("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}
```

### 2.8. Xử lý token hết hạn (401)

Quy trình xử lý khi gọi API mà bị `401 Unauthorized`:

1. API trả về `401` → nghĩa là access token không còn hợp lệ (hết hạn hoặc sai).
2. Client gọi `/auth/refresh` kèm refresh token để lấy access token mới.
3. Lưu lại token mới, gắn header `Authorization` và **gọi lại request ban đầu**.
4. Nếu refresh token cũng hết hạn → đưa người dùng về trang login.

**Ví dụ minh họa một hàm fetch tự động refresh:**

```javascript
async function apiFetch(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  let res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${accessToken}` }
  });

  if (res.status === 401) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const newTokens = await refreshAccessToken(refreshToken);
      localStorage.setItem("accessToken", newTokens.accessToken);
      localStorage.setItem("refreshToken", newTokens.refreshToken);

      // Gọi lại request ban đầu với access token mới
      res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${newTokens.accessToken}` }
      });
    } catch (err) {
      // Refresh token cũng hết hạn -> về login
      window.location.href = "/login";
    }
  }

  return res;
}
```

### 2.9. Lưu token an toàn

| Cách lưu | Ưu điểm | Nhược điểm |
|---|---|---|
| localStorage / sessionStorage | Đơn giản, dễ truy cập bằng JS | Dễ bị đọc trộm nếu site dính lỗ hổng **XSS** (mã độc JS chạy trên trang có thể đọc token) |
| HttpOnly Cookie | JS không đọc được → chống XSS | Cần xử lý chống **CSRF** (vì cookie tự động gửi kèm request) |

**Nguyên tắc chung nên tuân thủ:**
- Không nhúng token vào URL (dễ lộ qua lịch sử trình duyệt, log server).
- Không ghi token vào console.log ở môi trường production hoặc vào log server.
- Không commit token/secret key lên Git.
- Chọn cách lưu phù hợp theo mức độ bảo mật cần thiết của dự án.

---

## Phần 3: Modules (ES Modules)

### 3.1. Giới thiệu

- **ES Modules (ESM)** là cách chính thức để chia nhỏ và tái sử dụng code trong JavaScript.
- Mỗi file là **một module riêng biệt**, có scope riêng — biến/hàm khai báo trong module không tự động lộ ra global (khác với file script thường).
- Khi `import` thư viện như React, ta đang dùng cú pháp module để load chúng.
- Trên trình duyệt, khai báo module bằng:

```html
<script type="module" src="main.js"></script>
```

### 3.2. export

**Named export** — có thể export nhiều thứ trong 1 file:

```javascript
// math.js
export const PI = 3.14;
export function sum(a, b) {
  return a + b;
}
```

**Export theo danh sách ở cuối file:**

```javascript
// math.js
const PI = 3.14;
function sum(a, b) { return a + b; }

export { PI, sum };
```

**Đổi tên khi export:**

```javascript
export { sum as tong };
```

**Default export** — mỗi file chỉ có **tối đa 1** default export:

```javascript
// user.js
export default function createUser(name) {
  return { name };
}
```

**Kết hợp cả named và default trong cùng module:**

```javascript
// api.js
export const BASE_URL = "https://api.example.com";
export default function fetchData() { /* ... */ }
```

### 3.3. import

```javascript
// Import default (đặt tên tùy ý)
import createUser from "./user.js";

// Import named (phải đúng tên đã export, trừ khi alias)
import { PI, sum } from "./math.js";

// Đổi tên khi import
import { sum as tong } from "./math.js";

// Import tất cả named export thành 1 object
import * as MathUtils from "./math.js";
console.log(MathUtils.PI);

// Import kết hợp default + named
import fetchData, { BASE_URL } from "./api.js";
```

### 3.4. Đặc điểm của `type="module"`

- File có `import`/`export` được load như một module.
- **Luôn chạy ở strict mode** (`"use strict"` tự động, không cần khai báo).
- `this` ở top-level là `undefined` (khác với script thường, `this` trỏ tới `window`).
- Được load mặc định theo kiểu **deferred** — script chờ HTML parse xong (giống thuộc tính `defer`), không cần thêm `defer` thủ công.
- Bị ràng buộc bởi **CORS**: phải chạy qua server (Live Server, Vite, ...) chứ không thể mở trực tiếp file bằng `file://` trên trình duyệt, vì trình duyệt chặn request module qua giao thức file.

### 3.5. Nguyên tắc thiết kế module tốt

- Giữ module nhỏ, mỗi module chỉ đảm nhiệm một trách nhiệm (nguyên tắc **DRY** – Don't Repeat Yourself, **SRP** – Single Responsibility Principle).
- Giảm thiểu biến global.
- Tránh **circular dependency** (module A import B, B lại import A) — dễ gây lỗi giá trị `undefined` khi module chưa load xong.
- Chỉ export phần API công khai (cái người khác cần dùng), phần còn lại giữ private trong scope của module.

### 3.6. Dynamic import

`import()` là một **hàm**, trả về **Promise**, cho phép load module theo nhu cầu (lazy load / code splitting) thay vì load hết ngay từ đầu.

```javascript
// Chỉ load module khi cần, ví dụ khi người dùng bấm nút
button.addEventListener("click", async () => {
  const { showChart } = await import("./chart.js");
  showChart();
});
```

**Lợi ích:** khi trang lớn, chỉ tải phần code đang thực sự cần dùng → giảm dung lượng tải ban đầu, tăng tốc độ load trang.

### 3.7. Top-level await

Trong module (khác với script thường), có thể dùng `await` **ngay ở top-level**, không cần bọc trong `async function`.

```javascript
// config.js
const res = await fetch("/config.json");
export const config = await res.json();
```

> 💡 Làm rõ thêm: top-level await sẽ **khiến các module khác import module này phải chờ** cho tới khi promise hoàn tất, vì vậy chỉ nên dùng cho các bước khởi tạo thực sự cần thiết, tránh làm chậm toàn bộ ứng dụng.

### 3.8. CommonJS (nói qua)

- Cú pháp: `require("./module.js")` để import và `module.exports` để export.
- Là hệ thống module dùng trong **Node.js** (phiên bản cũ), cùng hệ sinh thái npm phía backend.
- **ESM đang dần trở thành chuẩn chính** cho cả browser lẫn Node.js (Node.js hiện tại đã hỗ trợ ESM đầy đủ).

```javascript
// CommonJS (kiểu cũ)
const express = require("express");
module.exports = { hello: () => "hi" };
```

| | ESM | CommonJS |
|---|---|---|
| Cú pháp | `import` / `export` | `require` / `module.exports` |
| Thời điểm load | Có thể tĩnh (phân tích trước khi chạy) | Động, load lúc runtime |
| Top-level await | Có hỗ trợ | Không hỗ trợ |
| Môi trường | Browser + Node.js (hiện đại) | Chủ yếu Node.js (cũ) |

---

## Phần 4: Tools — Node.js, npm, Vite

### 4.1. Node.js

- **Node.js** là runtime JavaScript chạy **bên ngoài trình duyệt**, dựa trên **V8 Engine** (engine JS của Google Chrome).
- Cho phép chạy JavaScript trên máy cá nhân và trên server (backend).
- Đi kèm **npm (Node Package Manager)** để quản lý thư viện/package.

**Cài đặt và kiểm tra:**

```bash
# Kiểm tra phiên bản đã cài
node --version
npm --version

# Mở REPL (môi trường gõ lệnh JS tương tác) 
node

# Chạy một file JavaScript
node index.js
```

> 💡 Làm rõ thêm: nên cài **bản LTS (Long Term Support)** thay vì bản Current mới nhất, vì LTS ổn định hơn cho việc học và dùng thực tế.

### 4.2. npm

```bash
# Tạo package.json với giá trị mặc định (-y = yes, bỏ qua các câu hỏi)
npm init -y

# Cài một thư viện (lưu vào dependencies)
npm install axios

# Cài thư viện chỉ dùng lúc phát triển (dev dependency)
npm install -D vite

# Gỡ thư viện
npm uninstall axios

# Chạy một script đã định nghĩa trong package.json
npm run dev

# Chạy một package mà không cần cài đặt lâu dài vào project
npx create-react-app my-app
```

### 4.3. package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "eslint": "^8.0.0"
  }
}
```

- `name`, `version`: định nghĩa thông tin project.
- `scripts`: các lệnh viết tắt để chạy qua `npm run <tên script>` (ví dụ: `dev`, `build`, `test`).
- `dependencies`: thư viện cần thiết khi chạy ở môi trường **production** (ví dụ: React).
- `devDependencies`: công cụ chỉ dùng lúc **phát triển** (Vite, ESLint...), không cần khi deploy production thực thi.

### 4.4. Vite

**Giới thiệu:**
- Vite là build tool / dev server hiện đại cho frontend.
- Hỗ trợ ES Modules gốc, và **Hot Module Replacement (HMR)** — cập nhật giao diện ngay lập tức khi sửa code mà **không cần reload lại toàn bộ trang**.
- Tạo project mới bằng template có sẵn:

```bash
npm create vite@latest
# Chọn template: vanilla, react, vue, ...
```

**Cấu trúc project cơ bản:**
```
my-app/
├── index.html
├── src/
│   ├── main.js
│   └── ...
├── package.json
└── vite.config.js
```

**Các lệnh chính:**

```bash
npm install       # Cài dependencies
npm run dev       # Chạy dev server (mặc định thường ở port 5173)
npm run build     # Bundle bản production ra thư mục dist/
npm run preview   # Xem thử bản đã build
```

Sau khi `build`, thư mục `dist/` chứa file tĩnh sẵn sàng để deploy lên hosting (GitHub Pages, Netlify, Vercel...).

**Vì sao dùng Vite:**
- Nhờ HMR, sửa code và thấy kết quả ngay mà không cần reload thủ công.
- Import thẳng CSS, ảnh, JS qua cú pháp ES Modules như import code JavaScript thông thường (`import "./style.css"`, `import logo from "./logo.png"`).
- Chạy nhanh hơn nhiều so với việc dùng Live Server nạp từng file một, vì Vite chỉ biên dịch (transform) module khi trình duyệt thực sự yêu cầu tới (on-demand), thay vì bundle toàn bộ trước.
- Vite sẽ được dùng chính thức từ các buổi học sau khi học React / TypeScript.

---

## Phần 5: Web Components (phần tùy chọn - Optional)

### 5.1. Giới thiệu

**Web Components** là một chuẩn của trình duyệt cho phép tự tạo các thẻ HTML tùy biến, tái sử dụng được — giống như tạo ra một "thẻ HTML riêng của bạn".

Gồm 3 công nghệ chính kết hợp với nhau:
1. **Custom Elements** — định nghĩa thẻ HTML mới.
2. **Shadow DOM** — đóng gói CSS/DOM riêng biệt, không bị ảnh hưởng bởi CSS bên ngoài.
3. **HTML Template** — định nghĩa cấu trúc HTML tái sử dụng, chưa hiển thị ngay.

### 5.2. Custom Elements

```javascript
customElements.define("my-element", class MyElement extends HTMLElement {
  // ...
});
```

> ⚠️ Quy tắc bắt buộc: tên thẻ tùy biến **phải chứa dấu gạch ngang** (`-`), ví dụ: `my-element`, `app-card`, `user-avatar`. Đây là quy định của chuẩn HTML để tránh trùng với tên thẻ HTML gốc trong tương lai (thẻ HTML gốc không bao giờ có dấu gạch ngang).

**Lifecycle (vòng đời) của Custom Element:**

| Method | Thời điểm chạy |
|---|---|
| `connectedCallback()` | Khi element được **thêm vào** document (DOM) |
| `disconnectedCallback()` | Khi element bị **gỡ khỏi** document |
| `attributeChangedCallback(name, oldValue, newValue)` | Khi một attribute **đang được theo dõi** thay đổi giá trị |
| `static observedAttributes` | Getter khai báo **danh sách attribute cần theo dõi** (bắt buộc phải khai báo thì `attributeChangedCallback` mới chạy) |

### 5.3. Shadow DOM

```javascript
this.attachShadow({ mode: "open" }); // hoặc "closed"
```

- `mode: "open"`: có thể truy cập shadow DOM từ bên ngoài qua `element.shadowRoot`.
- `mode: "closed"`: không truy cập được từ bên ngoài (bảo mật/đóng gói cao hơn, nhưng khó debug hơn).
- CSS/DOM bên trong shadow DOM **bị cô lập hoàn toàn** — style viết bên trong không "rò rỉ" ra ngoài, và style bên ngoài trang cũng không ảnh hưởng vào bên trong. Đây gọi là **encapsulation** (đóng gói).

### 5.4. HTML Template

- Thẻ `<template>` dùng để khai báo trước một đoạn HTML **nhưng không hiển thị ra trang** cho đến khi được JavaScript lấy ra dùng.
- `template.content.cloneNode(true)` tạo ra một **bản sao (clone)** nội dung template để đưa vào render trong shadow DOM (dùng `cloneNode(true)` vì `true` nghĩa là clone luôn tất cả phần tử con bên trong — deep clone).

### 5.5. Ví dụ minh họa đầy đủ: tạo thẻ `<my-card>`

```html
<!-- index.html -->
<my-card title="Xin chào"></my-card>

<script type="module" src="my-card.js"></script>
```

```javascript
// my-card.js
const template = document.createElement("template");
template.innerHTML = `
  <style>
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      font-family: sans-serif;
    }
    .card h3 {
      margin: 0 0 8px 0;
      color: #333;
    }
  </style>
  <div class="card">
    <h3></h3>
    <slot></slot>
  </div>
`;

class MyCard extends HTMLElement {
  static get observedAttributes() {
    return ["title"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    console.log("my-card đã được thêm vào trang");
    this.updateTitle();
  }

  disconnectedCallback() {
    console.log("my-card đã bị gỡ khỏi trang");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") this.updateTitle();
  }

  updateTitle() {
    const h3 = this.shadowRoot.querySelector("h3");
    h3.textContent = this.getAttribute("title") || "";
  }
}

customElements.define("my-card", MyCard);
```

Sử dụng trong HTML:

```html
<my-card title="Sản phẩm mới">
  Đây là nội dung mô tả sản phẩm.
</my-card>
```

> 💡 Chú thích thêm: thẻ `<slot></slot>` trong template cho phép nội dung con (children) mà bạn viết giữa `<my-card>...</my-card>` được "chiếu" (project) vào đúng vị trí đó bên trong shadow DOM — đây là cơ chế cho phép custom element vẫn nhận nội dung linh hoạt từ bên ngoài dù DOM bên trong bị cô lập.

---

## Tổng kết buổi học

| Chủ đề | Nội dung cốt lõi cần nhớ |
|---|---|
| **Storage** | localStorage (lâu dài), sessionStorage (theo tab), cookie (tự gửi server, giới hạn 4KB) |
| **Auth** | Access token (ngắn hạn, gửi mỗi request) + Refresh token (dài hạn, chỉ dùng để lấy access token mới), xử lý 401 tự động refresh |
| **Modules** | `export`/`import`, `type="module"`, dynamic import để lazy-load, top-level await |
| **Tools** | Node.js chạy JS ngoài browser, npm quản lý package, Vite là dev server/build tool hiện đại với HMR |
| **Web Components** | Custom Elements (thẻ tự định nghĩa) + Shadow DOM (đóng gói CSS/DOM) + Template (HTML tái sử dụng) |
