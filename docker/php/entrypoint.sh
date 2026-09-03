#!/bin/sh
set -e

# Chỉ chờ DB sẵn sàng rồi chạy tiếp CMD (php-fpm).
# Cố ý KHÔNG chạy migrate/cache ở đây: nếu sau này scale app lên nhiều
# replica, mỗi container khởi động sẽ đua nhau migrate cùng lúc. Migrate +
# cache chạy như một bước "release" riêng, một lần duy nhất — xem
# docker-compose.yml (service "release") hoặc .github/workflows/deploy.yml.

host="${DB_HOST:-mysql}"
port="${DB_PORT:-3306}"

echo "Waiting for MySQL at ${host}:${port}..."
i=0
until php -r "exit(@fsockopen('${host}', ${port}) ? 0 : 1);" 2>/dev/null; do
    i=$((i + 1))
    if [ "$i" -ge 30 ]; then
        echo "MySQL did not become ready in time" >&2
        exit 1
    fi
    sleep 2
done
echo "MySQL is up."

exec "$@"
