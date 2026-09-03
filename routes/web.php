<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MomentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/articles', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{slug}', [PostController::class, 'show'])->name('posts.show');

Route::get('/albums', [AlbumController::class, 'index'])->name('albums.index');
Route::get('/albums/{slug}', [AlbumController::class, 'show'])->name('albums.show');

Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');
Route::get('/authors/{username}', [AuthorController::class, 'show'])->name('authors.show');

Route::get('/subjects', [TagController::class, 'index'])->name('subjects.index');

Route::get('/moments', [MomentController::class, 'index'])->name('moments.index');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/comments', [CommentController::class, 'store'])
        ->middleware('throttle:comments')
        ->name('comments.store');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::post('/likes/toggle', [LikeController::class, 'toggle'])
        ->middleware('throttle:likes')
        ->name('likes.toggle');

    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/bookmarks/toggle', [BookmarkController::class, 'toggle'])
        ->middleware('throttle:likes')
        ->name('bookmarks.toggle');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
