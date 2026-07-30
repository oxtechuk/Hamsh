<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => ['ar' => 'عبدالله الشمري', 'en' => 'Abdullah Al-Shamari'],
                'title' => ['ar' => 'رجل أعمال', 'en' => 'Businessman'],
                'content' => ['ar' => 'تجربة ممتازة في شراء سيارة تويوتا لاند كروزر من نوادر. الخدمة كانت احترافية والسعر كان منافساً جداً.', 'en' => 'Excellent experience buying a Toyota Land Cruiser from Nawader. The service was professional and the price was very competitive.'],
                'image' => 'testimonials/tKIbLsKjjpL2n8lmPw8NGv1MP3t9G64C3GylJQz6.webp',
                'review_image' => 'testimonials/reviews/WONrGKfOvBwRLtjgS2GXCK9Ni6I4zTxKiBAkg8a7.webp',
                'rating' => 5,
                'is_visible' => true,
            ],
            [
                'name' => ['ar' => 'نورة العتيبي', 'en' => 'Noura Al-Otaibi'],
                'title' => ['ar' => 'مهندسة', 'en' => 'Engineer'],
                'content' => ['ar' => 'أفضل تجربة شراء سيارة مررت بها. الفريق كان متعاون جداً والتمويل كان سهل وسريع.', 'en' => 'The best car buying experience I\'ve had. The team was very cooperative and the financing was easy and fast.'],
                'image' => null,
                'review_image' => null,
                'rating' => 5,
                'is_visible' => true,
            ],
            [
                'name' => ['ar' => 'محمد القحطاني', 'en' => 'Mohammed Al-Qahtani'],
                'title' => ['ar' => 'مهندس برمجيات', 'en' => 'Software Engineer'],
                'content' => ['ar' => 'اشتريت بي إم دبليو X5 من نوادر وكانت التجربة أكثر من رائعة. أنصح الجميع بزيارة معارضهم.', 'en' => 'I bought a BMW X5 from Nawader and the experience was more than wonderful. I recommend everyone visit their showrooms.'],
                'image' => null,
                'review_image' => null,
                'rating' => 5,
                'is_visible' => true,
            ],
            [
                'name' => ['ar' => 'سارة الدوسري', 'en' => 'Sarah Al-Dosari'],
                'title' => ['ar' => 'طبيبة', 'en' => 'Doctor'],
                'content' => ['ar' => 'خدمة ما بعد البيع ممتازة. تم حل مشكلة في وقت قياسي. شكراً نوادر!', 'en' => 'After-sales service is excellent. A problem was resolved in record time. Thank you Nawader!'],
                'image' => null,
                'review_image' => null,
                'rating' => 4,
                'is_visible' => true,
            ],
        ];

        foreach ($testimonials as $data) {
            Testimonial::query()->updateOrCreate(
                ['name->en' => $data['name']['en']],
                $data,
            );
        }
    }
}
