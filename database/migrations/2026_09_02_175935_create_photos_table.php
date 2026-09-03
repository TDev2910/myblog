<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->nullable()->constrained('albums')->nullOnDelete();
            $table->foreignId('uploader_id')->constrained('users')->cascadeOnDelete();
            $table->string('disk');
            $table->string('path');
            $table->string('thumb_path')->nullable();
            $table->string('medium_path')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('mime')->nullable();
            $table->timestamp('taken_at')->nullable();
            $table->json('exif')->nullable();
            $table->string('caption')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->foreign('cover_photo_id')->references('id')->on('photos')->nullOnDelete();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->foreign('cover_photo_id')->references('id')->on('photos')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['cover_photo_id']);
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->dropForeign(['cover_photo_id']);
        });

        Schema::dropIfExists('photos');
    }
};
