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
        Schema::create('album_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained('albums')->cascadeOnDelete();
            $table->enum('locale', ['vi', 'en']);
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['album_id', 'locale']);
            $table->unique(['locale', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('album_translations');
    }
};
