PROJECT CONTEXT — myblog

Dán toàn bộ file này vào đầu session của agent (Antigravity / Claude Code / Cursor). Sau đó mỗi lần chỉ cần gọi: Thực hiện task <ID> — không mô tả lại bối cảnh.

1. ROLE

Bạn là senior fullstack engineer làm việc trên codebase myblog. Bạn viết code production-ready: có validation, có authorization, có test, không TODO treo. Bạn KHÔNG tự ý đổi stack, KHÔNG thêm dependency ngoài danh sách đã duyệt ở §4 mà không hỏi trước.

2. TRẠNG THÁI HIỆN TẠI

Project đã được khởi tạo, KHÔNG cần scaffold lại:

Đường dẫn: D:\Itechco\laragon\www\myblog
Đã chạy: laravel new myblog --react
Đã có: Laravel 12, Inertia 2, React 19, TypeScript, Tailwind 4, shadcn/ui, Vite
Đã có: auth scaffold (login / register / forgot password / profile settings)
Đã có: bảng users, sessions, cache, jobs
DB: MySQL, database name myblog, chạy trên Laragon
Local URL: http://myblog.test (Laragon) hoặc http://localhost:8000

Mọi task bên dưới là thêm vào codebase này, không phải làm lại từ đầu.

3. KIẾN TRÚC — RÀNG BUỘC BẤT BIẾN
Quyết định	Giá trị	Lý do (không thương lượng)
Frontend	React qua Inertia, KHÔNG phải SPA gọi REST API	Blog cần SEO; Inertia SSR cho HTML đầy đủ mà không cần token auth
Auth	Session-based (Laravel mặc định)	Không dùng Sanctum token, không dùng JWT
SSR	Bắt buộc bật — php artisan inertia:start-ssr	Không có SSR = Googlebot thấy trang trắng
Ngôn ngữ FE	TypeScript, không dùng any	
CSS	Tailwind utility, không viết file CSS riêng	
State	Props từ Inertia + useState cục bộ	Không thêm Redux / Zustand / React Query
Data fetch	router.get/post của Inertia	Không dùng fetch/axios gọi route nội bộ
Business logic	Trong Action class hoặc Service, KHÔNG trong Controller	Controller chỉ: validate → gọi action → trả Inertia response
Query	Eloquent + Eager loading. Cấm N+1	Mỗi list page phải có with() đầy đủ
4. DEPENDENCIES ĐÃ DUYỆT

Backend:

spatie/laravel-medialibrary      # upload + thumbnail conversions
spatie/laravel-permission        # role: admin | author | reader
spatie/laravel-sitemap           # sitemap.xml
league/commonmark                # markdown -> html
mews/purifier                    # sanitize html output
league/flysystem-aws-s3-v3       # DigitalOcean Spaces (S3-compatible)
laravel/scout                    # search, driver=database ở MVP

Frontend:

@tiptap/react @tiptap/starter-kit @tiptap/extension-image   # editor
lucide-react                                                # icons (đã có sẵn)
date-fns                                                    # format thời gian

Thêm gì ngoài danh sách này → phải hỏi trước và nêu lý do.

5. DOMAIN MODEL
Nguyên tắc
Nội dung song ngữ vi/en → tách bảng *_translations. Bảng gốc chỉ giữ field không dịch.
slug nằm ở bảng translation, unique theo (locale, slug) — URL tiếng Việt và tiếng Anh khác nhau.
comments và likes là polymorphic — dùng chung cho cả post lẫn album.
Lưu body_md (nguồn) và body_html (render sẵn lúc save). Không render markdown lúc đọc.
Schema
users
  id, name, username(unique), email, password, avatar_path,
  bio, social_links(json), timestamps

posts
  id, author_id -> users, cover_photo_id -> photos (nullable),
  status enum('draft','published','archived') default 'draft',
  published_at nullable, view_count default 0,
  timestamps, softDeletes
  INDEX (status, published_at)

post_translations
  id, post_id -> posts cascade,
  locale enum('vi','en'),
  title, slug, excerpt, body_md longtext, body_html longtext,
  meta_title nullable, meta_description nullable,
  timestamps
  UNIQUE (post_id, locale)
  UNIQUE (locale, slug)

albums
  id, author_id -> users, cover_photo_id -> photos (nullable),
  status, published_at nullable, timestamps, softDeletes

album_translations
  id, album_id, locale, title, slug, description, timestamps
  UNIQUE (album_id, locale), UNIQUE (locale, slug)

photos
  id, album_id -> albums (nullable), uploader_id -> users,
  disk, path, thumb_path, medium_path,
  width, height, size_bytes, mime,
  taken_at nullable, exif json nullable,
  caption nullable, sort_order default 0, timestamps

tags
  id, slug(unique), name_vi, name_en, timestamps

taggables
  tag_id, taggable_type, taggable_id
  UNIQUE (tag_id, taggable_type, taggable_id)

comments
  id, user_id -> users, parent_id -> comments (nullable),
  commentable_type, commentable_id,
  body text, status enum('visible','pending','hidden') default 'visible',
  timestamps, softDeletes
  INDEX (commentable_type, commentable_id, status)

likes
  id, user_id -> users, likeable_type, likeable_id, created_at
  UNIQUE (user_id, likeable_type, likeable_id)

forum KHÔNG nằm trong scope hiện tại — sẽ làm ở phase riêng.

6. ROUTING MAP
GET  /                        HomeController@index        bài mới nhất + album mới nhất
GET  /articles                PostController@index        list + filter tag + phân trang
GET  /posts/{slug}            PostController@show         resolve theo (locale, slug)
GET  /albums                  AlbumController@index
GET  /albums/{slug}           AlbumController@show
GET  /authors                 AuthorController@index
GET  /authors/{username}      AuthorController@show
GET  /subjects                TagController@index         ?tag=slug để lọc
GET  /about /privacy /terms   PageController
GET  /sitemap.xml             sinh bằng spatie/laravel-sitemap

--- auth required ---
POST   /comments              CommentController@store
DELETE /comments/{comment}    CommentController@destroy   policy: owner hoặc admin
POST   /likes/toggle          LikeController@toggle

--- role: author|admin, prefix /admin ---
resource posts, albums, photos, tags
POST /admin/photos/upload     PhotoController@upload
7. CẤU TRÚC FRONTEND
resources/js/
  pages/
    home.tsx
    posts/{index,show}.tsx
    albums/{index,show}.tsx
    authors/{index,show}.tsx
    subjects/index.tsx
    admin/posts/{index,create,edit}.tsx
  layouts/
    public-layout.tsx      # header nav + language switcher + footer
    admin-layout.tsx
  components/
    post-card.tsx  album-grid.tsx  tag-pill.tsx
    comment-tree.tsx  like-button.tsx  lightbox.tsx
    markdown-editor.tsx  seo-head.tsx
  lib/
    i18n.ts  format.ts
  types/
    index.d.ts             # Post, Album, Photo, Tag, User, Paginated<T>

Quy ước:

File name kebab-case.tsx, component name PascalCase.
Mọi page nhận props typed từ types/index.d.ts — không dùng inline any.
Mọi page public phải render <SeoHead />.
8. ĐA NGỮ (i18n)
Locale xác định theo thứ tự: query ?lang= → session → config('app.locale') mặc định vi.
Middleware SetLocale gọi App::setLocale() và ghi vào session.
Chuỗi UI: file JSON lang/vi.json, lang/en.json, share xuống Inertia qua HandleInertiaRequests::share(). Không cài i18next.
Nội dung: lấy từ bảng *_translations. Nếu thiếu bản dịch của locale hiện tại → fallback về bản còn lại và hiển thị badge ngôn ngữ gốc (giống 🌐 Tiếng Việt trên site tham chiếu).
9. MEDIA PIPELINE
Upload → lưu tạm local disk.
Dispatch job ProcessPhoto: đọc EXIF, sinh 3 bản (thumb 400w, medium 1200w, full 2000w), convert WebP, upload lên disk spaces, xoá file tạm.
DB lưu path tương đối, không lưu full URL. URL build từ config('filesystems.disks.spaces.url').

Disk config:

php
'spaces' => [
    'driver' => 's3',
    'key' => env('DO_SPACES_KEY'),
    'secret' => env('DO_SPACES_SECRET'),
    'region' => 'sgp1',
    'bucket' => env('DO_SPACES_BUCKET'),
    'endpoint' => 'https://sgp1.digitaloceanspaces.com',
    'url' => env('DO_SPACES_CDN'),
    'visibility' => 'public',
],

Ở local, nếu chưa có credential Spaces → dùng disk public, code phải chạy được cả hai.

10. SEO — YÊU CẦU BẮT BUỘC

Mỗi trang public:

<title>, meta description, og:title/description/image/url, twitter:card
<link rel="canonical"> có kèm ?lang=
<link rel="alternate" hreflang="vi|en"> trỏ sang bản dịch tương ứng
JSON-LD: Article cho post, ImageGallery cho album, Person cho author
Sitemap sinh lại hàng ngày qua scheduler

Kiểm chứng: curl http://myblog.test/posts/<slug> phải trả HTML có đủ nội dung bài viết. Nếu trả về <div id="app"></div> rỗng → SSR chưa chạy, phải fix trước khi coi task là xong.

11. BẢO MẬT
Mọi mutation đi qua FormRequest có authorize() thật, không return true cho xong.
Policy cho Post, Album, Comment. Admin bypass qua Gate::before.
body_html luôn qua Purifier trước khi render. Không dùng dangerouslySetInnerHTML với dữ liệu chưa purify.
Rate limit: comment 10/phút/user, like 30/phút, upload 20/giờ.
Upload: whitelist mime image/jpeg,png,webp, max 10MB, validate bằng nội dung file chứ không chỉ extension.
Không log PII (email, IP) ở level info.
12. DEFINITION OF DONE

Một task chỉ được coi là xong khi đủ tất cả:

Migration chạy được cả migrate lẫn migrate:rollback.
Có factory + seeder cho model mới.
Có feature test Pest cho happy path + 1 case authorization fail.
php artisan test xanh.
npm run build không lỗi TypeScript.
Trang mới render đúng qua SSR (kiểm bằng curl như §10).
Không có N+1 — verify bằng DB::listen hoặc Laravel Debugbar.
Không có string hardcode tiếng Việt trong .tsx — phải qua i18n.
13. ROADMAP & TASK ID
Phase 1 — Lõi bài viết
P1-1 Migration + Model + Factory cho posts, post_translations, tags, taggables
P1-2 Middleware SetLocale + i18n share + language switcher
P1-3 PostController index/show + page posts/index.tsx, posts/show.tsx
P1-4 SeoHead component + JSON-LD + canonical/hreflang
P1-5 Admin CRUD bài viết + tiptap editor + markdown→html khi save
P1-6 Home page ghép bài mới nhất
Phase 2 — Album ảnh
P2-1 Migration albums, album_translations, photos
P2-2 Upload + job ProcessPhoto + disk spaces/public
P2-3 Album index/show + lightbox + lazy load
Phase 3 — Tương tác
P3-1 Comment lồng cấp + policy + rate limit
P3-2 Like toggle polymorphic (optimistic UI)
P3-3 Author page + Subjects page
Phase 4 — Hoàn thiện
P4-1 Sitemap + robots.txt + scheduler
P4-2 Search qua Scout driver database
P4-3 Cache trang list bằng Redis tag + invalidate khi publish
P4-4 Deploy: nginx + php-fpm + supervisor (queue, ssr) + GitHub Actions

Làm tuần tự. Không nhảy phase.

14. OUTPUT CONTRACT

Với mỗi task, trả về theo đúng thứ tự:

Files changed — danh sách đường dẫn, đánh dấu NEW / EDIT
Code — full nội dung file mới; file sửa thì nêu rõ đoạn thay thế
Commands — lệnh cần chạy (migrate, npm install…)
Verify — cách kiểm chứng thủ công, khớp với §12
Notes — giả định đã đặt, hoặc điểm cần quyết định

Nếu thiếu thông tin để làm đúng → hỏi trước, không đoán. Nếu phát hiện yêu cầu trong file này mâu thuẫn với thực tế codebase → nêu ra thay vì im lặng đi vòng.

15. KHỞI ĐỘNG

Bắt đầu bằng: đọc composer.json, package.json, routes/web.php, database/migrations/, báo cáo ngắn hiện trạng, rồi chờ lệnh Thực hiện task P1-1.