# Deploy — myblog

Tham khảo, không tự động chạy. Giả định Ubuntu 22.04 + nginx + PHP-FPM 8.2 + MySQL + Redis + Supervisor.

## 1. nginx

```
sudo cp deploy/nginx/myblog.conf /etc/nginx/sites-available/myblog.conf
sudo ln -s /etc/nginx/sites-available/myblog.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 2. PHP-FPM pool riêng

```
sudo cp deploy/php-fpm/myblog-pool.conf /etc/php/8.2/fpm/pool.d/myblog.conf
sudo systemctl restart php8.2-fpm
```

## 3. Supervisor (queue worker + Inertia SSR)

```
sudo cp deploy/supervisor/myblog-queue.conf /etc/supervisor/conf.d/
sudo cp deploy/supervisor/myblog-ssr.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start myblog-queue:* myblog-ssr:*
```

SSR bắt buộc phải chạy (§10 project.md) — nếu process này chết, `@inertiaHead`/`@inertia` sẽ tự động fallback sang client-side render, Googlebot sẽ thấy trang trắng.

## 4. Scheduler

Laravel scheduler cần đúng 1 dòng cron:

```
* * * * * cd /var/www/myblog && php artisan schedule:run >> /dev/null 2>&1
```

Hiện chưa có scheduled task nào đăng ký trong `routes/console.php` (sitemap bị bỏ qua theo yêu cầu). Thêm dòng cron này sẵn để khi có task định kỳ (dọn queue, xoá session cũ...) không cần sửa lại hạ tầng.

## 5. Release flow (chạy trong CI/CD, không thủ công)

```
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo supervisorctl restart myblog-queue:* myblog-ssr:*
sudo systemctl reload php8.2-fpm
```

## 6. Biến môi trường bắt buộc khác `.env.example`

- `APP_ENV=production`, `APP_DEBUG=false`
- `DO_SPACES_KEY` / `DO_SPACES_SECRET` / `DO_SPACES_BUCKET` / `DO_SPACES_CDN` — nếu để trống, `ProcessPhoto` job tự fallback về disk `public` (xem `app/Jobs/ProcessPhoto.php`)
- `REDIS_CLIENT=predis` (đã set) trừ khi server có extension `phpredis` — khi đó đổi lại `phpredis` để nhanh hơn
- `CACHE_STORE=redis` — bắt buộc vì cache dùng tag (`Cache::tags()`), driver `database`/`file` không hỗ trợ tag
