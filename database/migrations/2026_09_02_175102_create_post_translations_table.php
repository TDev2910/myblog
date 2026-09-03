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
        Schema::create('post_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
            $table->enum('locale', ['vi', 'en']);
            $table->string('title');
            $table->string('slug');
            $table->text('excerpt')->nullable();
            $table->longText('body_md');
            $table->longText('body_html');
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();

            $table->unique(['post_id', 'locale']);
            $table->unique(['locale', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_translations');
    }
};
