<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Format;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    /**
     * ضغط وتصغير وحفظ الصورة بصيغة محددة (افتراضياً WebP).
     *
     * @param  UploadedFile|string  $file  الملف المرفوع أو المسار أو البيانات الثنائية
     * @param  string  $directory  المجلد المراد الحفظ بداخله (مثال: 'blog', 'cars')
     * @param  int  $maxWidth  أقصى عرض للصورة بالبكسل
     * @param  int  $quality  نسبة الجودة (1-100)
     * @param  string  $disk  اسم قرص التخزين
     * @param  string  $formatName  الصيغة المستهدفة ('webp', 'jpg', 'jpeg', 'png')
     * @return string المسار النسبي للملف المحفوظ
     */
    public function optimizeAndUpload(
        UploadedFile|string $file,
        string $directory = 'uploads',
        int $maxWidth = 1600,
        int $quality = 80,
        string $disk = 'public',
        string $formatName = 'webp'
    ): string {
        $source = $file instanceof UploadedFile ? $file->getRealPath() : $file;
        $image = Image::decode($source);

        // تصغير الأبعاد فقط إذا كان عرض الصورة أكبر من الحد الأقصى مع الحفاظ على النسبة
        if ($image->width() > $maxWidth) {
            $image->scaleDown(width: $maxWidth);
        }

        $format = $this->resolveFormat($formatName);
        $encoded = $image->encodeUsingFormat($format, quality: $quality);

        $extension = $this->getExtensionForFormat($format);
        $fileName = Str::uuid().'.'.$extension;
        $path = trim($directory, '/').'/'.$fileName;

        Storage::disk($disk)->put($path, (string) $encoded);

        return $path;
    }

    /**
     * إنشاء صورة مصغرة بأبعاد محددة (Thumbnail).
     */
    public function createThumbnail(
        UploadedFile|string $file,
        string $directory = 'thumbnails',
        int $width = 400,
        int $height = 300,
        int $quality = 80,
        string $disk = 'public',
        string $formatName = 'webp'
    ): string {
        $source = $file instanceof UploadedFile ? $file->getRealPath() : $file;
        $image = Image::decode($source);

        // قص وضبط الصورة لتناسب الأبعاد بدقة (Cover)
        $image->cover($width, $height);

        $format = $this->resolveFormat($formatName);
        $encoded = $image->encodeUsingFormat($format, quality: $quality);

        $extension = $this->getExtensionForFormat($format);
        $fileName = 'thumb_'.Str::uuid().'.'.$extension;
        $path = trim($directory, '/').'/'.$fileName;

        Storage::disk($disk)->put($path, (string) $encoded);

        return $path;
    }

    /**
     * رفع وضغط مصفوفة من الصور في وقت واحد.
     *
     * @param  array<UploadedFile>  $files
     * @return array<string>
     */
    public function optimizeAndUploadMultiple(
        array $files,
        string $directory = 'uploads',
        int $maxWidth = 1600,
        int $quality = 80,
        string $disk = 'public'
    ): array {
        $paths = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $paths[] = $this->optimizeAndUpload(
                    file: $file,
                    directory: $directory,
                    maxWidth: $maxWidth,
                    quality: $quality,
                    disk: $disk
                );
            }
        }

        return $paths;
    }

    /**
     * حذف صورة من القرص إذا كانت موجودة.
     */
    public function delete(?string $path, string $disk = 'public'): bool
    {
        if (! empty($path) && Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    /**
     * تحديد كائن الـ Format المناسب.
     */
    protected function resolveFormat(string $formatName): Format
    {
        return match (strtolower($formatName)) {
            'jpg', 'jpeg' => Format::JPEG,
            'png' => Format::PNG,
            'gif' => Format::GIF,
            'avif' => Format::AVIF,
            default => Format::WEBP,
        };
    }

    /**
     * الحصول على الامتداد المناسب للصيغة.
     */
    protected function getExtensionForFormat(Format $format): string
    {
        return match ($format) {
            Format::JPEG => 'jpg',
            Format::PNG => 'png',
            Format::GIF => 'gif',
            Format::AVIF => 'avif',
            default => 'webp',
        };
    }
}
