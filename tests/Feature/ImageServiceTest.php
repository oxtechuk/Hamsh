<?php

namespace Tests\Feature;

use App\Services\ImageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Tests\TestCase;

class ImageServiceTest extends TestCase
{
    public function test_it_can_optimize_and_upload_image(): void
    {
        Storage::fake('public');

        $service = new ImageService;
        $file = UploadedFile::fake()->image('test_banner.jpg', 2400, 1600);

        $path = $service->optimizeAndUpload(
            file: $file,
            directory: 'blog',
            maxWidth: 1200,
            quality: 80,
            disk: 'public',
            formatName: 'webp'
        );

        Storage::disk('public')->assertExists($path);
        $this->assertStringEndsWith('.webp', $path);
        $this->assertStringStartsWith('blog/', $path);

        // Verify dimensions of saved image
        $savedImage = Image::decode(Storage::disk('public')->get($path));
        $this->assertLessThanOrEqual(1200, $savedImage->width());
    }

    public function test_it_can_create_thumbnail(): void
    {
        Storage::fake('public');

        $service = new ImageService;
        $file = UploadedFile::fake()->image('avatar.png', 800, 800);

        $path = $service->createThumbnail(
            file: $file,
            directory: 'thumbnails',
            width: 300,
            height: 300,
            disk: 'public'
        );

        Storage::disk('public')->assertExists($path);
        $this->assertStringStartsWith('thumbnails/thumb_', $path);

        $savedImage = Image::decode(Storage::disk('public')->get($path));
        $this->assertEquals(300, $savedImage->width());
        $this->assertEquals(300, $savedImage->height());
    }

    public function test_it_can_upload_multiple_images(): void
    {
        Storage::fake('public');

        $service = new ImageService;
        $files = [
            UploadedFile::fake()->image('car1.jpg', 1800, 1200),
            UploadedFile::fake()->image('car2.jpg', 1800, 1200),
        ];

        $paths = $service->optimizeAndUploadMultiple($files, 'cars');

        $this->assertCount(2, $paths);
        foreach ($paths as $path) {
            Storage::disk('public')->assertExists($path);
            $this->assertStringStartsWith('cars/', $path);
        }
    }

    public function test_it_can_delete_image(): void
    {
        Storage::fake('public');

        $service = new ImageService;
        $file = UploadedFile::fake()->image('delete_me.jpg', 400, 400);

        $path = $service->optimizeAndUpload($file, 'temp');
        Storage::disk('public')->assertExists($path);

        $deleted = $service->delete($path);
        $this->assertTrue($deleted);
        Storage::disk('public')->assertMissing($path);
    }
}
