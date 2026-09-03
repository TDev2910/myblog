# syntax=docker/dockerfile:1

# ---- Stage 1: PHP deps (composer) ----------------------------------------
# Tách riêng để ssr.tsx (import '../../vendor/tightenco/ziggy') và tsc
# có sẵn vendor/ khi build ở stage node — không thể đảo thứ tự 2 stage này.
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize --no-dev

# ---- Stage 2: frontend build (node) ---------------------------------------
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=vendor /app/vendor ./vendor
COPY . .
# build = "tsc && vite build && vite build --ssr" (package.json) -> public/build + bootstrap/ssr
RUN npm run build

# ---- Stage 3: runtime — nginx + php-fpm trong CÙNG 1 container -------------
# Cố ý gộp thay vì tách container nginx/app riêng: nginx cần đọc trực tiếp
# public/build (assets tĩnh) và public/storage (symlink -> storage/app/public,
# tạo bởi `storage:link`) trên cùng một filesystem. Tách 2 container sẽ phải
# đồng bộ named volume phức tạp hơn hẳn giá trị mang lại ở quy mô 1 VPS/blog
# cá nhân. Muốn scale ngang thật sự thì tách lại và dùng S3/Spaces cho ảnh
# (đã hỗ trợ sẵn, xem app/Jobs/ProcessPhoto.php).
FROM php:8.2-fpm-alpine AS app

RUN apk add --no-cache \
        nginx supervisor \
        icu-libs libzip freetype libjpeg-turbo libpng libwebp \
    && apk add --no-cache --virtual .build-deps \
        icu-dev libzip-dev freetype-dev libjpeg-turbo-dev libpng-dev libwebp-dev linux-headers \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) pdo_mysql bcmath intl zip gd exif opcache \
    && apk del .build-deps

COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-myblog.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/zz-opcache.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build
COPY --from=frontend /app/bootstrap/ssr ./bootstrap/ssr
COPY . .

# Symlink public/storage tạo ở BUILD TIME, không phải runtime: public/ được
# bake thẳng vào image (không phải volume), nên nếu tạo bằng `artisan
# storage:link` trong container "release" lúc chạy, symlink chỉ tồn tại
# trong writable-layer của riêng container đó — container "app" (cùng image,
# nhưng là container khác) sẽ không thấy. Tạo 1 lần ở đây thì mọi container
# sinh ra từ image này đều có sẵn.
RUN mkdir -p storage/framework/{sessions,views,cache} storage/app/public storage/logs bootstrap/cache \
    && ln -sf ../storage/app/public public/storage \
    && chown -R nginx:nginx /var/www/html storage bootstrap/cache \
    # nginx.conf mặc định của gói alpine "nginx" chạy master bằng root rồi
    # setuid worker sang user "nginx" — chỉ cần thiết khi bind cổng đặc quyền
    # (<1024). Container này nghe 8080 (không đặc quyền, xem default.conf),
    # nên bỏ hẳn root: chown 2 thư mục làm việc của nginx rồi chạy toàn bộ
    # container (nginx + php-fpm, cả 2 tiến trình) bằng user "nginx" —
    # đúng tinh thần "more secure" của gooddockerfiles.com, không chỉ đơn
    # thuần base image nhỏ.
    && chown -R nginx:nginx /var/lib/nginx /var/log/nginx

COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER nginx
EXPOSE 8080
ENTRYPOINT ["entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf", "-n"]

# ---- Stage 4: SSR runtime (node, image riêng cho service ssr) -------------
FROM node:22-alpine AS ssr
WORKDIR /var/www/html
COPY --from=frontend --chown=node:node /app/bootstrap/ssr ./bootstrap/ssr
# Copy CẢ node_modules (không chỉ 3-4 gói) — image ~600MB, không nhỏ được nữa
# với cấu trúc package.json hiện tại: vite SSR build mặc định external hoá
# import từ node_modules (không bundle vào ssr.js), và react/react-dom/
# @inertiajs/react đang nằm ở devDependencies (kế thừa từ Breeze scaffold —
# lúc đó chưa có SSR nên chưa phân biệt dev/runtime). `npm ci --omit=dev`
# hay `npm prune --omit=dev` ở đây sẽ xoá mất chính react-dom/server mà
# ssr.js cần lúc chạy. Muốn ảnh nhỏ lại: chuyển 3 gói đó (+ transitive runtime
# deps thật sự) sang "dependencies" trong package.json rồi mới prune — không
# làm ở đây vì đụng tới package.json toàn dự án, ngoài phạm vi cấu hình deploy.
COPY --from=frontend --chown=node:node /app/node_modules ./node_modules
USER node
EXPOSE 13714
# CMD gọi thẳng node, không qua "npm start" — tránh 1 tiến trình shell con
# ở giữa nuốt mất SIGTERM lúc container dừng (graceful-termination pitfall,
# xem ví dụ minh hoạ trên gooddockerfiles.com).
CMD ["node", "bootstrap/ssr/ssr.js"]
