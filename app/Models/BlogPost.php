<?php

namespace App\Models;

use App\Casts\AsImageUrl;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class BlogPost extends Model
{
    use HasTranslations;

    public $translatable = ['title', 'excerpt', 'content', 'summary'];

    protected $fillable = [
        'employee_id', 'title', 'slug', 'thumbnail', 'excerpt', 'content', 'summary',
        'meta_title', 'meta_description', 'meta_keywords',
        'is_published', 'is_featured', 'published_at',
    ];

    protected $appends = ['reading_time'];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'thumbnail' => AsImageUrl::class,
    ];

    public function getReadingTimeAttribute(): int
    {
        return max(1, (int) ceil(mb_strlen(strip_tags($this->content ?? '')) / 1000));
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_post_category');
    }

    public function contentItems(): HasMany
    {
        return $this->hasMany(BlogContentItem::class)->orderBy('sort_order');
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }
}
