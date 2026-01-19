# Hướng dẫn Deploy lên NAS Synology với Docker (Tunnel riêng biệt)

Đây là hướng dẫn dành cho việc deploy một project hoàn toàn mới (eng-notebook) với Database riêng và Tunnel riêng, không kẹt chung với project cũ.

## 1. Chuẩn bị Environment cho `docker-compose.yml`

File `docker-compose.yml` đã được cập nhật để chạy 2 dịch vụ:
1.  **engbook-web**: Website Next.js của bạn.
2.  **engbook-tunnel**: Cloudflare Tunnel riêng cho web này.

Bạn cần sửa các thông tin sau trong file này:

### A. Database Config
```yaml
- DATABASE_URL_DATA=postgresql://USERNAME:PASSWORD@100.100.66.15:5432/DATABASE_NAME
```
*   Thay `USERNAME`, `PASSWORD`, `DATABASE_NAME` bằng thông tin database mới mà bạn đã migrate dữ liệu vào.
*   IP `100.100.66.15` là IP NAS/Tailscale của bạn, đảm bảo đúng.

### B. NextAuth Config
```yaml
- NEXTAUTH_SECRET=... # Điền chuỗi ngẫu nhiên
- NEXTAUTH_URL=https://engbook.yangyu.win # Hoặc domain bạn muốn
```

### C. Cloudflare Tunnel Token
```yaml
- TUNNEL_TOKEN=eyJhIjoi... # Token lấy từ Cloudflare Dashboard
```
*(Xem hướng dẫn lấy Token ở bước 2)*

## 2. Tạo Tunnel mới trên Cloudflare

1.  Truy cập **Cloudflare Zero Trust Dashboard** > **Access** > **Tunnels**.
2.  Nhấn **Create a tunnel**.
3.  Đặt tên: Ví dụ `nas-engbook`.
4.  Chọn **Docker** để xem lệnh cài đặt, bạn sẽ thấy một chuỗi dài sau `--token`. **Copy đoạn token đó**.
    *   Ví dụ lệnh: `docker run ... --token eyJhIjoi...` -> Thì `eyJhIjoi...` chính là token.
    *   Paste token này vào phần `TUNNEL_TOKEN` trong file `docker-compose.yml`.
5.  Nhấn **Next** để cấu hình Public Hostname.
6.  **Add Public Hostname**:
    *   **Subdomain**: `engbook` (hoặc tên bạn thích).
    *   **Domain**: `yangyu.win`.
    *   **Service**: `HTTP` -> `engbook-web:3000` (Khuyên dùng - Nội bộ Docker)
    *   **HOẶC**: `HTTP` -> `100.100.66.15:3005` (Nếu dùng IP NAS thì phải dùng port 3005).

## 3. Upload và Chạy trên NAS

1.  Copy toàn bộ thư mục project (bao gồm `Dockerfile`, `docker-compose.yml`, `next.config.ts`...) lên NAS.
2.  SSH vào NAS hoặc dùng Terminal, cd đến thư mục đó.
3.  Chạy lệnh:
    ```bash
    docker-compose up -d --build
    ```
    *Lưu ý: App sẽ chạy ở port **3005** trên NAS.*

## 4. Kiểm tra

1.  Vào Cloudflare Dashboard, kiểm tra status Tunnel `nas-engbook` có chuyển sang **Healthy** không.
2.  Truy cập `https://engbook.yangyu.win` (hoặc domain bạn đã cấu hình).
