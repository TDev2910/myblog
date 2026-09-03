<?php

use App\Http\Controllers\Admin\AlbumController;
use App\Http\Controllers\Admin\MomentController;
use App\Http\Controllers\Admin\PhotoController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TagController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'role:author|admin'])
    ->group(function () {
        Route::resource('posts', PostController::class)->except(['show', 'create']);
        Route::resource('albums', AlbumController::class)->except(['show', 'create']);
        Route::resource('tags', TagController::class)->except(['show', 'create', 'edit']);
        Route::resource('moments', MomentController::class)->except(['show', 'create']);

        Route::post('/photos/upload', [PhotoController::class, 'upload'])
            ->middleware('throttle:uploads')
            ->name('photos.upload');
    });
