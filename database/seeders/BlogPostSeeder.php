<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $categories = $this->seedCategories();
        $employee = Employee::first();

        $posts = [
            [
                'title' => ['en' => 'Best Cars of 2026 in the Saudi Market', 'ar' => 'أفضل سيارات 2026 في السوق السعودي'],
                'slug' => 'best-cars-2026-saudi-market',
                'excerpt' => [
                    'en' => 'A comprehensive look at the best cars available in the Saudi market for 2026.',
                    'ar' => 'نظرة شاملة على أفضل السيارات المتوفرة في السوق السعودي لعام 2026.',
                ],
                'content' => [
                    'en' => 'The Saudi market offers a diverse range of cars for 2026. The Toyota Land Cruiser continues to lead the market with its high reliability and durability in desert conditions. The BMW Series 5 has also emerged with its sleek design and advanced technologies. The Mercedes-Benz Classe E offers an ideal balance between luxury and performance. In the electric car category, the Tesla Model Y has seen remarkable growth in sales during the first half of 2026.',
                    'ar' => 'يقدم السوق السعودي تشكيلة متنوعة من السيارات لعام 2026. تويوتا لاند كروزر تستمر في ريادة السوق بفضل موثوقيتها العالية وقدرتها على التحمل في الظروف الصحراوية. كما برزت بي إم دبليو Serie 5 بتصميمها الأنيق وتقنياتها المتطورة. مرسيدس بنز Classe E تقدم توازناً مثالياً بين الفخامة والأداء. في فئة السيارات الكهربائية، سجلت تيسلا Model Y نمواً ملحوظاً في المبيعات خلال النصف الأول من 2026.',
                ],
                'summary' => [
                    'en' => 'The 2026 Saudi market offers diverse cars with Toyota Land Cruiser leading.',
                    'ar' => 'يقدم سوق 2026 سيارات متنوعة مع تويوتا لاند كروزر في الصدارة.',
                ],
                'meta_title' => 'Best Cars 2026 - Nawader',
                'meta_description' => 'Your comprehensive guide to the best cars in the Saudi market 2026',
                'meta_keywords' => 'cars,2026,saudi market,best cars',
                'is_published' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(2),
                'categories' => ['news', 'reviews'],
                'image_seed' => 'car-showroom-2026',
            ],
            [
                'title' => ['en' => 'Tips for Buying a Used Car', 'ar' => 'نصائح لشراء سيارة مستعملة'],
                'slug' => 'tips-for-buying-used-car',
                'excerpt' => [
                    'en' => 'The most important tips to consider when buying a used car to avoid problems.',
                    'ar' => 'أهم النصائح التي يجب مراعاتها عند شراء سيارة مستعملة لتجنب المشاكل.',
                ],
                'content' => [
                    'en' => 'Buying a used car requires extra care to avoid hidden problems. First, check the complete maintenance history and get a technical inspection from a trusted mechanic. Second, inspect the body and paint carefully to ensure no rust or previous accidents. Third, test drive the car in different conditions including highways and crowded areas. Fourth, verify all documents including registration, insurance, and service records. Finally, compare prices across multiple dealerships to ensure you get the best deal.',
                    'ar' => 'شراء سيارة مستعملة يتطلب عناية فائقة لتجنب المشاكل المخفية. أولاً، تحقق من سجل الصيانة الكامل للسيارة واطلب فحصاً فنياً من ميكانيكي موثوق. ثانياً، افحص الهيكل والطلاء بعناية للتأكد من عدم وجود صدأ أو حوادث سابقة. ثالثاً، جرب السيارة في ظروف قيادة مختلفة تشمل الطرق السريعة والمناطق المزدحمة. رابعاً، تحقق من جميع المستندات بما في ذلك التسجيل والتأمين وسجلات الصيانة. أخيراً، قارن الأسعار عبر عدة وكلاء للتأكد من حصولك على أفضل صفقة.',
                ],
                'summary' => [
                    'en' => 'Essential tips for buying a used car safely and getting the best value.',
                    'ar' => 'نصائح أساسية لشراء سيارة مستعملة بأمان والحصول على أفضل قيمة.',
                ],
                'meta_title' => 'Used Car Buying Tips - Nawader',
                'meta_description' => 'Complete guide to buying a used car in Saudi Arabia',
                'meta_keywords' => 'used car,buying tips,car inspection',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now()->subDays(5),
                'categories' => ['tips', 'guides'],
                'image_seed' => 'used-car-tips',
            ],
            [
                'title' => ['en' => 'Electric Vehicles: The Future of Transportation', 'ar' => 'السيارات الكهربائية: مستقبل النقل'],
                'slug' => 'electric-vehicles-future-transportation',
                'excerpt' => [
                    'en' => 'How electric vehicles are transforming the automotive industry worldwide.',
                    'ar' => 'كيف تُغيّر السيارات الكهربائية صناعة السيارات حول العالم.',
                ],
                'content' => [
                    'en' => 'Electric vehicles represent the future of the automotive industry. With advances in battery technology, EVs now offer ranges exceeding 400 miles on a single charge. Charging infrastructure is expanding rapidly across Saudi Arabia, making EV ownership more practical than ever. The environmental benefits are significant, with zero tailpipe emissions and lower carbon footprints. Major manufacturers like Tesla, BMW, and Mercedes-Benz are investing heavily in electric vehicle development.',
                    'ar' => 'تمثل السيارات الكهربائية مستقبل صناعة السيارات. مع التقدم في تكنولوجيا البطاريات، توفر السيارات الكهربائية الآن مسافات تتجاوز 400 ميل بشحنة واحدة. البنية التحتية للشحن تتوسع بسرعة عبر المملكة العربية السعودية، مما يجعل امتلاك سيارة كهربائية أكثر عملية من أي وقت مضى. الفوائد البيئية كبيرة، مع انبعاثات عادمة صفرية وبصمة كربون أقل. كبرى الشركات المصنعة مثل تيسلا وبي إم دبليو ومرسيدس بنز تستثمر بكثافة في تطوير السيارات الكهربائية.',
                ],
                'summary' => [
                    'en' => 'Electric vehicles are transforming the auto industry with longer ranges and expanding charging networks.',
                    'ar' => 'السيارات الكهربائية تُغيّر صناعة السيارات بمسافات أطول وشبكات شحن متوسعة.',
                ],
                'meta_title' => 'Electric Vehicles Future - Nawader',
                'meta_description' => 'How EVs are changing the automotive landscape',
                'meta_keywords' => 'electric vehicles,ev,battery,charging',
                'is_published' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(1),
                'categories' => ['news', 'industry'],
                'image_seed' => 'electric-vehicle-future',
            ],
            [
                'title' => ['en' => 'Complete Guide to Car Maintenance', 'ar' => 'دليل شامل لصيانة السيارة'],
                'slug' => 'complete-guide-car-maintenance',
                'excerpt' => [
                    'en' => 'Everything you need to know about keeping your car in perfect condition.',
                    'ar' => 'كل ما تحتاج معرفته عن الحفاظ على سيارتك في حالة ممتازة.',
                ],
                'content' => [
                    'en' => 'Regular car maintenance is essential for vehicle longevity and safety. Change oil every 5,000 to 7,500 miles to keep the engine running smoothly. Check tire pressure monthly and rotate tires every 6,000 miles. Replace air filters every 12,000 to 15,000 miles for optimal engine performance. Brake pads should be inspected every 20,000 miles and replaced as needed. Regular washes and waxing protect the paint from harsh sun and sand.',
                    'ar' => 'الصيانة الدورية للسيارة ضرورية لعمر السيارة وأمانها. قم بزيت التغيير كل 5000 إلى 7500 ميل للحفاظ على تشغيل المحرك بسلاسة. تحقق من ضغط الإطارات شهرياً وقم بتدوير الإطارات كل 6000 ميل. استبدل مرشحات الهواء كل 12000 إلى 15000 ميل لأداء محرك مثالي. يجب فحص بطاقات الفرامل كل 20000 ميل واستبدالها حسب الحاجة. الغسيل والشمع المنتظم يحمي الطلاء من الشمس الحارة والرمال.',
                ],
                'summary' => [
                    'en' => 'Essential maintenance tips to keep your car running smoothly for years.',
                    'ar' => 'نصائح صيانة أساسية للحفاظ على سيارتك تعمل بسلاسة لسنوات.',
                ],
                'meta_title' => 'Car Maintenance Guide - Nawader',
                'meta_description' => 'Complete car maintenance guide for Saudi drivers',
                'meta_keywords' => 'car maintenance,oil change,tire rotation,brake inspection',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now()->subDays(10),
                'categories' => ['guides', 'tips'],
                'image_seed' => 'car-maintenance-guide',
            ],
            [
                'title' => ['en' => 'Toyota Land Cruiser 2026 Review', 'ar' => 'مراجعة تويوتا لاند كروزر 2026'],
                'slug' => 'toyota-land-cruiser-2026-review',
                'excerpt' => [
                    'en' => 'In-depth review of the legendary Toyota Land Cruiser 2026.',
                    'ar' => 'مراجعة معمقة لتويوتا لاند كروزر 2026 الأسطورية.',
                ],
                'content' => [
                    'en' => 'The 2026 Toyota Land Cruiser continues its legacy as the king of off-road vehicles. Powered by a 3.5L V6 twin-turbo engine producing 409 horsepower, it delivers exceptional performance both on and off the road. The interior features premium leather seats, a 12.3-inch touchscreen, and a premium JBL sound system. Safety features include adaptive cruise control, lane departure warning, and a 360-degree camera system. The starting price in Saudi Arabia is SAR 285,000.',
                    'ar' => 'تتواصل تويوتا لاند كروزر 2026 إرثها كملك سيارات الطرق الوعرة. تعمل بمحرك V6 مزدوج التوربو سعة 3.5 لتر ينتج 409 حصاناً، مما يوفر أداءً استثنائياً على الطرق الوعرة والطرقات السريعة. تتميز المقصورة الداخلية بمقاعد جلدية فاخرة وشاشة لمسية 12.3 بوصة ونظام صوت JBL فاخر. تشمل ميزات الأمان مثبت سرعة تكييفي وتنبيه مغادرة المسار ونظام كاميرا 360 درجة. يبدأ السعر في السعودية من 285,000 ريال سعودي.',
                ],
                'summary' => [
                    'en' => 'The 2026 Land Cruiser remains the ultimate off-road luxury SUV.',
                    'ar' => 'لاند كروزر 2026 تبقى سيارة الدفع الرباعي الفاخرة المطلقة.',
                ],
                'meta_title' => 'Land Cruiser 2026 Review - Nawader',
                'meta_description' => 'Detailed review of Toyota Land Cruiser 2026',
                'meta_keywords' => 'toyota,land cruiser,2026,review,suv',
                'is_published' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(3),
                'categories' => ['reviews'],
                'image_seed' => 'land-cruiser-2026-review',
            ],
            [
                'title' => ['en' => 'Saudi Automotive Industry Updates', 'ar' => 'تحديثات صناعة السيارات السعودية'],
                'slug' => 'saudi-automotive-industry-updates',
                'excerpt' => [
                    'en' => 'Latest news and developments in the Saudi automotive sector.',
                    'ar' => 'آخر الأخبار والتطورات في قطاع السيارات السعودي.',
                ],
                'content' => [
                    'en' => 'The Saudi automotive industry is experiencing significant growth with new investments and partnerships. The Saudi Automotive Manufacturing Company (SAMAC) has announced plans to produce electric vehicles locally. Major international brands are expanding their presence in the Kingdom with new showrooms and service centers. The government initiative Vision 2030 continues to drive innovation in the automotive sector, with a focus on sustainability and smart mobility solutions.',
                    'ar' => 'تشهد صناعة السيارات السعودية نموًا كبيرًا مع استثمارات وشراكات جديدة. أعلنت شركة التصنيع Automotive Saudi (SAMAC) عن خطط لإنتاج سيارات كهربائية محلياً. تتوسع العلامات التجارية الدولية الكبرى في حضورها في المملكة مع معارض وخدمات جديدة. تواصل مبادئة رؤية 2030 التحرّك في الابتكار في قطاع السيارات، مع التركيز على الاستدامة وحلول النقل الذكي.',
                ],
                'summary' => [
                    'en' => 'Saudi automotive sector grows with new investments and EV production plans.',
                    'ar' => 'قطاع السيارات السعودي ينمو مع استثمارات جديدة وخطط إنتاج كهربائي.',
                ],
                'meta_title' => 'Saudi Auto Industry - Nawader',
                'meta_description' => 'Latest Saudi automotive industry news and updates',
                'meta_keywords' => 'saudi automotive,vision 2030,ev manufacturing',
                'is_published' => true,
                'is_featured' => false,
                'published_at' => now()->subDays(7),
                'categories' => ['news', 'industry'],
                'image_seed' => 'saudi-auto-industry',
            ],
        ];

        foreach ($posts as $data) {
            $categorySlugs = $data['categories'];
            unset($data['categories']);

            $imageSeed = $data['image_seed'];
            unset($data['image_seed']);

            $data['employee_id'] = $employee?->id;
            $data['thumbnail'] = $this->downloadImage($imageSeed);

            $post = BlogPost::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );

            $categoryIds = BlogCategory::whereIn('slug', $categorySlugs)->pluck('id')->toArray();
            $post->categories()->sync($categoryIds);
        }
    }

    private function seedCategories(): array
    {
        $categories = [
            ['name' => ['en' => 'News', 'ar' => 'أخبار'], 'slug' => 'news', 'icon' => 'newspaper', 'sort_order' => 1, 'is_active' => true],
            ['name' => ['en' => 'Tips', 'ar' => 'نصائح'], 'slug' => 'tips', 'icon' => 'lightbulb', 'sort_order' => 2, 'is_active' => true],
            ['name' => ['en' => 'Guides', 'ar' => 'أدلة'], 'slug' => 'guides', 'icon' => 'book-open', 'sort_order' => 3, 'is_active' => true],
            ['name' => ['en' => 'Reviews', 'ar' => 'مراجعات'], 'slug' => 'reviews', 'icon' => 'star', 'sort_order' => 4, 'is_active' => true],
            ['name' => ['en' => 'Industry', 'ar' => 'الصناعة'], 'slug' => 'industry', 'icon' => 'building', 'sort_order' => 5, 'is_active' => true],
            ['name' => ['en' => 'Updates', 'ar' => 'تحديثات'], 'slug' => 'updates', 'icon' => 'refresh-cw', 'sort_order' => 6, 'is_active' => true],
        ];

        $created = [];
        foreach ($categories as $data) {
            $created[$data['slug']] = BlogCategory::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data,
            );
        }

        return $created;
    }

    private function downloadImage(string $seed): ?string
    {
        $directory = 'blog/thumbnails';

        if (! Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        $filename = Str::slug($seed).'.jpg';
        $path = $directory.'/'.$filename;

        if (Storage::disk('public')->exists($path)) {
            return $path;
        }

        $url = 'https://picsum.photos/seed/'.$seed.'/800/450';

        $imageContents = @file_get_contents($url);

        if ($imageContents === false) {
            return null;
        }

        Storage::disk('public')->put($path, $imageContents);

        return $path;
    }
}
