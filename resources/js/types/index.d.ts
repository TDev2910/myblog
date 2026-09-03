import { Config } from 'ziggy-js';

export type Locale = 'vi' | 'en';

export type Reaction = 'coffee' | 'peaceful' | 'empathy' | 'love';

export type Mood = 'calm' | 'rainy' | 'inspired' | 'nostalgic' | 'late_night';

export interface User {
    id: number;
    name: string;
    username?: string;
    email: string;
    email_verified_at?: string;
    avatar_path?: string | null;
    bio?: string | null;
    is_admin?: boolean;
    is_author?: boolean;
}

export interface Tag {
    id: number;
    slug: string;
    name_vi: string;
    name_en: string;
}

export interface PostTranslation {
    id: number;
    post_id: number;
    locale: Locale;
    title: string;
    slug: string;
    excerpt: string | null;
    body_md: string;
    body_html: string;
    meta_title: string | null;
    meta_description: string | null;
}

export interface Post {
    id: number;
    author_id: number;
    cover_photo_id: number | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    view_count: number;
    author?: User;
    translations?: PostTranslation[];
    translation?: PostTranslation | null;
    tags?: Tag[];
    cover_photo?: Photo;
    comments?: Comment[];
    comments_count?: number;
    likes_count?: number;
    liked_by_user?: boolean;
    reaction_counts?: Partial<Record<Reaction, number>>;
    my_reaction?: Reaction | null;
    is_bookmarked?: boolean;
}

export interface AlbumTranslation {
    id: number;
    album_id: number;
    locale: Locale;
    title: string;
    slug: string;
    description: string | null;
}

export interface Photo {
    id: number;
    album_id: number | null;
    moment_id?: number | null;
    uploader_id: number;
    disk: string;
    path: string;
    thumb_path: string | null;
    medium_path: string | null;
    width: number | null;
    height: number | null;
    caption: string | null;
    sort_order: number;
    thumb_url?: string;
    medium_url?: string;
    full_url?: string;
}

export interface Album {
    id: number;
    author_id: number;
    cover_photo_id: number | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    author?: User;
    translations?: AlbumTranslation[];
    translation?: AlbumTranslation | null;
    photos?: Photo[];
    cover_photo?: Photo;
    tags?: Tag[];
    comments?: Comment[];
    comments_count?: number;
    likes_count?: number;
    liked_by_user?: boolean;
    reaction_counts?: Partial<Record<Reaction, number>>;
    my_reaction?: Reaction | null;
    is_bookmarked?: boolean;
}

export interface Moment {
    id: number;
    author_id: number;
    caption: string | null;
    mood: Mood | null;
    location: string | null;
    song: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    author?: User;
    photos?: Photo[];
    comments?: Comment[];
    comments_count?: number;
    likes_count?: number;
    liked_by_user?: boolean;
    reaction_counts?: Partial<Record<Reaction, number>>;
    my_reaction?: Reaction | null;
    is_bookmarked?: boolean;
}

export interface Comment {
    id: number;
    user_id: number;
    parent_id: number | null;
    commentable_type: string;
    commentable_id: number;
    body: string;
    status: 'visible' | 'pending' | 'hidden';
    created_at: string;
    user?: User;
    replies?: Comment[];
}

export type BentoItem =
    | { type: 'post'; item: Post; published_at: string | null }
    | { type: 'album'; item: Album; published_at: string | null }
    | { type: 'moment'; item: Moment; published_at: string | null };

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    locale: Locale;
    translations: Record<string, string>;
    ziggy: Config & { location: string };
};
