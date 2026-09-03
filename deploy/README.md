# Deploy — myblog (Docker + CI/CD)

Luồng: push `main` → GitHub Actions test → build 2 image (`app`, `ssr`) → push
GHCR → SSH vào VPS → `docker compose pull` + `run --rm release` (migrate/cache)
+ `up -d`. Toàn bộ nằm trong [.github/workflows/ci.yml](../.github/workflows/ci.yml)
(job `test` → `build-and-push` → `deploy`).

Không dùng phương án bare-metal (không Docker) nữa — các file `nginx/`,
`php-fpm/`, `supervisor/` trong thư mục này được giữ lại tham khảo nếu sau
này cần chuyển server không chạy Docker được, nhưng **không phải luồng đang
dùng**.

## 1. Chuẩn bị VPS (một lần)

Yêu cầu: Ubuntu 22.04+, đã cài [Docker Engine + Compose plugin](https://docs.docker.com/engine/install/ubuntu/).

```bash
sudo mkdir -p /var/www/myblog-deploy && cd /var/www/myblog-deploy

# copy 2 file này từ repo lên VPS (scp hoặc git clone --depth 1 rồi copy ra)
#   docker-compose.yml
#   .env.docker.example  ->  đổi tên thành .env, điền giá trị thật
```

Trong `.env`, sửa:
- `DB_PASSWORD` — đặt mật khẩu mạnh (dùng chung cho MySQL user + root, xem `docker-compose.yml`)
- `APP_URL` — domain thật
- `IMAGE=ghcr.io/<github-username-hoặc-org>/myblog` — **bắt buộc sửa**, viết thường toàn bộ (Docker registry không chấp nhận chữ hoa trong tên repo); mặc định trong `docker-compose.yml` chỉ là placeholder `your-github-username`

Sinh `APP_KEY` (không dùng phím tắt local, phải sinh riêng cho production):

```bash
docker compose run --rm -e APP_KEY= release php artisan key:generate --show
# dán kết quả vào APP_KEY= trong .env
```

Nếu image trên GHCR ở chế độ **private** (mặc định với repo private), login trên VPS một lần:

```bash
echo "<personal-access-token-scope-read:packages>" | docker login ghcr.io -u <github-username> --password-stdin
```

## 2. Cấu hình 4 secret trên GitHub

`Settings → Secrets and variables → Actions`:

| Secret | Giá trị |
|---|---|
| `DEPLOY_HOST` | IP hoặc domain VPS |
| `DEPLOY_USER` | user SSH có quyền chạy `docker` (nằm trong group `docker`) |
| `DEPLOY_SSH_KEY` | private key SSH (đã add public key vào `~/.ssh/authorized_keys` trên VPS) |
| `DEPLOY_PATH` | `/var/www/myblog-deploy` (thư mục chứa `docker-compose.yml` + `.env` ở bước 1) |

## 3. TLS (HTTPS)

Container `app` chỉ nghe HTTP trên `127.0.0.1:8080` (xem `docker-compose.yml`
— cố ý bind localhost, không public port 8080 ra ngoài). Cài nginx thẳng trên
VPS (ngoài Docker) làm reverse proxy + TLS:

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

```nginx
# /etc/nginx/sites-available/myblog
server {
    listen 80;
    server_name myblog.example.com;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/myblog /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d myblog.example.com   # tự cấu hình HTTPS + redirect + renew
```

## 4. Deploy lần đầu (thủ công, trước khi có CI chạy)

```bash
cd /var/www/myblog-deploy
docker compose pull app ssr
docker compose run --rm release   # migrate + cache config/route/view
docker compose up -d
```

## 5. Từ lần sau: tự động

Push lên `main`, xong. GitHub Actions tự test → build → deploy. Theo dõi ở
tab **Actions** trên GitHub repo.

## 6. Scheduler (cron)

Laravel scheduler cần chạy `schedule:run` mỗi phút. Chưa có scheduled task
nào đăng ký trong `routes/console.php` hiện tại, nhưng thêm sẵn để sau này
không phải sửa lại hạ tầng — thêm service này vào `docker-compose.yml`:

```yaml
  scheduler:
    image: *app-image
    restart: unless-stopped
    env_file: .env
    entrypoint: entrypoint.sh
    command: sh -c "while true; do php artisan schedule:run; sleep 60; done"
    volumes: *app-volumes
```

## 7. Rollback

Mỗi build được gắn 2 tag: `latest` và commit SHA. Rollback về commit trước:

```bash
cd /var/www/myblog-deploy
TAG=<sha-cũ> docker compose up -d app queue ssr
```

(Không chạy lại `release` khi rollback nếu migration mới không tương thích
ngược — cân nhắc thủ công theo từng trường hợp.)

## 8. Điểm rủi ro cần biết

- **Ảnh upload nằm trong Docker volume `storage_public` trên chính VPS này**
  — không có gì tự backup nó. Thêm cron backup định kỳ:
  ```bash
  0 3 * * * docker run --rm -v myblog_storage_public:/data -v /root/backups:/backup alpine tar czf /backup/storage-$(date +\%F).tar.gz -C /data .
  ```
  Muốn hết lo backup ảnh: điền `DO_SPACES_*` trong `.env` — `ProcessPhoto`
  (xem `app/Jobs/ProcessPhoto.php::targetDisk()`) tự chuyển sang lưu ở
  DigitalOcean Spaces mà không cần sửa code, chỉ cần điền env rồi
  `docker compose up -d`.
- **MySQL cũng chỉ nằm trong volume `mysql_data` trên VPS này** — cùng rủi ro
  như trên. Cron backup tương tự bằng `docker compose exec mysql mysqldump`.
- **`CACHE_STORE=redis` là bắt buộc**, không đổi được sang `file`/`database` —
  code dùng `Cache::tags([...])` (xem `app/Services/PostService.php`), 2
  driver kia không hỗ trợ tag và sẽ ném exception ngay khi gọi.
- Service `ssr` (xem `docker-compose.yml`) chết → Inertia tự fallback sang
  client-side render, không sập trang, nhưng SEO/first-paint sẽ giống SPA
  thường. Theo dõi bằng `docker compose logs ssr`.
