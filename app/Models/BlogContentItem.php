<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

class BlogContentItem extends Model
{
    use HasTranslations;

    public $translatable = ['title', 'content'];

    protected $fillable = [
        'blog_post_id', 'title', 'content', 'sort_order',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'blog_post_id');
    }
}
