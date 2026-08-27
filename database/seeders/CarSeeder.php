<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarImage;
use App\Models\Feature;
use App\Models\SafetyFeature;
use App\Models\Specification;
use App\Services\Cache\CarCacheService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to safely refresh cars table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('car_specification')->truncate();
        DB::table('car_feature')->truncate();
        DB::table('car_safety_feature')->truncate();
        Specification::truncate();
        Feature::truncate();
        SafetyFeature::truncate();
        CarImage::truncate();
        Car::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Seed Brands
        $brandsData = [
            'hyundai' => [
                'name' => ['en' => 'Hyundai', 'ar' => 'هيونداي'],
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg',
            ],
            'toyota' => [
                'name' => ['en' => 'Toyota', 'ar' => 'تويوتا'],
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg',
            ],
            'chevrolet' => [
                'name' => ['en' => 'Chevrolet', 'ar' => 'شفروليه'],
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Chevrolet-logo.png',
            ],
            'kia' => [
                'name' => ['en' => 'Kia', 'ar' => 'كيا'],
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/4/47/Kia_logo.svg',
            ],
            'honda' => [
                'name' => ['en' => 'Honda', 'ar' => 'هوندا'],
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg',
            ],
            'nissan' => [
                'name' => ['en' => 'Nissan', 'ar' => 'نيسان'],
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg',
            ],
        ];

        $brands = [];
        foreach ($brandsData as $slug => $data) {
            $brands[$slug] = Brand::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $data['name'],
                    'logo' => $data['logo'],
                    'is_active' => true,
                ]
            );
        }

        // 2. Seed Category
        $sedanCategory = CarCategory::updateOrCreate(
            ['slug' => 'sedan'],
            [
                'name' => ['en' => 'Sedan', 'ar' => 'سيدان'],
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        // 3. Cars Data (Explicit 11 Vehicles requested by User)
        $cars = [
            // 1. هيونداي أكسنت 2026 فليت
            [
                'brand_id' => $brands['hyundai']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Hyundai Accent 2026 Fleet', 'ar' => 'هيونداي أكسنت 2026 فليت'],
                'slug' => ['en' => 'hyundai-accent-2026-fleet', 'ar' => 'هيونداي-أكسنت-2026-فليت'],
                'model' => 'Accent Fleet',
                'year' => 2026,
                'type' => 'sedan',
                'cash_price' => 66000,
                'min_down_payment' => 0,
                'min_installment' => 940,
                'thumbnail' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '1.5L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '115 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline (Petrol)'],
                    ['label' => 'Transmission', 'value' => 'CVT Automatic'],
                    ['label' => 'Drive Type', 'value' => 'Front-Wheel Drive (FWD)'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '18.9 km/L'],
                ],
                'colors' => [
                    ['name' => 'White', 'hex' => '#FFFFFF'],
                    ['name' => 'Silver', 'hex' => '#C0C0C0'],
                    ['name' => 'Gray', 'hex' => '#808080'],
                ],
                'description' => [
                    'en' => 'The Hyundai Accent 2026 Fleet edition offers maximum efficiency, modern style, and exceptional reliability for city driving and fleet management.',
                    'ar' => 'تتميز هيونداي أكسنت 2026 فليت بالكفاءة العالية واستهلاك الوقود الممتاز مع مظهر عصري واعتمادية فائقة مناسبة للقيادة اليومية والشركات.',
                ],
                'features' => [
                    'en' => 'Rear Sensors, Bluetooth, Tire Pressure Monitor, Eco Mode, Steering Wheel Controls',
                    'ar' => 'حساسات خلفية، بلوتوث، نظام مراقبة ضغط الإطارات، وضع توفير الوقود، تحكم بالدكسون',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'featured',
                'availability_status' => 'available',
                'rating' => 4.8,
            ],

            // 2. تويوتا يارس
            [
                'brand_id' => $brands['toyota']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Toyota Yaris', 'ar' => 'تويوتا يارس'],
                'slug' => ['en' => 'toyota-yaris', 'ar' => 'تويوتا-يارس'],
                'model' => 'Yaris Y',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 67500,
                'min_down_payment' => 0,
                'min_installment' => 960,
                'thumbnail' => 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '1.3L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '97 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => 'CVT Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '22.4 km/L'],
                ],
                'colors' => [
                    ['name' => 'White', 'hex' => '#FFFFFF'],
                    ['name' => 'Black', 'hex' => '#000000'],
                    ['name' => 'Red', 'hex' => '#CC0000'],
                ],
                'description' => [
                    'en' => 'Toyota Yaris combines unmatched fuel economy with legendary Toyota reliability and modern infotainment features.',
                    'ar' => 'تجمع تويوتا يارس بين الاقتصاد الاستثنائي في استهلاك الوقود والموثوقية اليابانية المعهودة من تويوتا، مع مقصورة حديثة وعصرية.',
                ],
                'features' => [
                    'en' => 'Apple CarPlay, Android Auto, Rear Camera, LED Headlights, Cruise Control',
                    'ar' => 'أبل كاربلاي، أندرويد أوتو، كاميرا خلفية، مصابيح LED، مثبت سرعة',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'trending',
                'availability_status' => 'available',
                'rating' => 4.9,
            ],

            // 3. تويوتا كامري
            [
                'brand_id' => $brands['toyota']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Toyota Camry', 'ar' => 'تويوتا كامري'],
                'slug' => ['en' => 'toyota-camry', 'ar' => 'تويوتا-كامري'],
                'model' => 'Camry LE',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 112000,
                'min_down_payment' => 0,
                'min_installment' => 1600,
                'thumbnail' => 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '2.5L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '204 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => '8-Speed Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '18.3 km/L'],
                ],
                'colors' => [
                    ['name' => 'Pearl White', 'hex' => '#F5F5F5'],
                    ['name' => 'Midnight Black', 'hex' => '#0F0F0F'],
                    ['name' => 'Silver Metallic', 'hex' => '#D3D3D3'],
                ],
                'description' => [
                    'en' => 'The iconic Toyota Camry offers ultimate luxury, smooth ride comfort, powerful engine performance, and cutting-edge safety features.',
                    'ar' => 'تويوتا كامري الشهيرة توفر الفخامة المطلقة والراحة التامة أثناء القيادة، مع محرك قوي وتقنيات أمان متطورة تناسب كافة الرحلات.',
                ],
                'features' => [
                    'en' => 'Toyota Safety Sense, Adaptive Cruise Control, Sunroof, Leather Seats, Smart Key',
                    'ar' => 'أنظمة تويوتا للأمان، مثبت سرعة تكيفي، فتحة سقف، مقاعد جلد، دخول ذكي بدون مفتاح',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'featured',
                'availability_status' => 'available',
                'rating' => 5.0,
            ],

            // 4. شفروليه كروز
            [
                'brand_id' => $brands['chevrolet']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Chevrolet Cruze', 'ar' => 'شفروليه كروز'],
                'slug' => ['en' => 'chevrolet-cruze', 'ar' => 'شفروليه-كروز'],
                'model' => 'Cruze LT',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 59000,
                'min_down_payment' => 0,
                'min_installment' => 845,
                'thumbnail' => 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '1.4L Turbo 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '153 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => '6-Speed Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '17.8 km/L'],
                ],
                'colors' => [
                    ['name' => 'White', 'hex' => '#FFFFFF'],
                    ['name' => 'Blue', 'hex' => '#003399'],
                    ['name' => 'Gray', 'hex' => '#555555'],
                ],
                'description' => [
                    'en' => 'Chevrolet Cruze delivers standard turbo power, sporty handling, and low monthly installments for practical everyday mobility.',
                    'ar' => 'تقدم شفروليه كروز محرك تيربو قوي مع أداء رياضي وثبات رائع على الطريق وبأقساط شهرية ميسرة للغاية.',
                ],
                'features' => [
                    'en' => 'MyLink Touchscreen, Keyless Start, Rear View Camera, Alloy Wheels, ABS',
                    'ar' => 'شاشة MyLink باللمس، تشغيل بضغطة زر، كاميرا خلفية، جنوط ألومنيوم، فرامل مانعة للانزلاق',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'none',
                'availability_status' => 'available',
                'rating' => 4.6,
            ],

            // 5. كيا K3
            [
                'brand_id' => $brands['kia']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Kia K3', 'ar' => 'كيا K3'],
                'slug' => ['en' => 'kia-k3', 'ar' => 'كيا-k3'],
                'model' => 'K3 LX',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 62000,
                'min_down_payment' => 0,
                'min_installment' => 890,
                'thumbnail' => 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '1.6L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '123 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => '6-Speed Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '16.8 km/L'],
                ],
                'colors' => [
                    ['name' => 'Snow White', 'hex' => '#FAFAFA'],
                    ['name' => 'Silky Silver', 'hex' => '#D8D8D8'],
                    ['name' => 'Gravity Gray', 'hex' => '#4A4A4A'],
                ],
                'description' => [
                    'en' => 'The Kia K3 brings dynamic Korean design, advanced safety standards, and practical interior space at an economical price.',
                    'ar' => 'تأتي كيا K3 بتصميم كوري ديناميكي، ومعايير أمان عالية، ومساحة داخلية مريحة تعطي قيمة ممتازة مقابل السعر.',
                ],
                'features' => [
                    'en' => '10.25-inch Display, Wireless Charging, Parking Sensors, LED DRLs',
                    'ar' => 'شاشة مقاس 10.25 بوصة، شاحن لاسلكي، حساسات ركن، إضاءة نهارية LED',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'trending',
                'availability_status' => 'available',
                'rating' => 4.7,
            ],

            // 6. كيا K4
            [
                'brand_id' => $brands['kia']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Kia K4', 'ar' => 'كيا K4'],
                'slug' => ['en' => 'kia-k4', 'ar' => 'كيا-k4'],
                'model' => 'K4 EX',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 76000,
                'min_down_payment' => 0,
                'min_installment' => 1090,
                'thumbnail' => 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '2.0L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '147 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => 'IVT Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '17.5 km/L'],
                ],
                'colors' => [
                    ['name' => 'Interstellar Gray', 'hex' => '#3D3D3D'],
                    ['name' => 'Clear White', 'hex' => '#FFFFFF'],
                    ['name' => 'Ocean Blue', 'hex' => '#1B3B6F'],
                ],
                'description' => [
                    'en' => 'The brand-new Kia K4 redefines the compact sedan category with bold futuristic styling, dual widescreen displays, and class-leading legroom.',
                    'ar' => 'تعيد كيا K4 الجديدة كلياً تعريف سيارات السيدان بتصميم مستقبلي جريء، شاشات مزدوجة عملاقة، ومساحة رحبة للركاب.',
                ],
                'features' => [
                    'en' => 'Dual Digital Displays, Blind Spot Collision Warning, Lane Keep Assist, Ambient Lighting',
                    'ar' => 'شاشات رقمية مزدوجة، نظام تحذير النقاط العمياء، نظام المساعدة على بقاء المسار، إضاءة محيطية',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'new_arrival',
                'availability_status' => 'available',
                'rating' => 4.9,
            ],

            // 7. هيونداي إلنترا
            [
                'brand_id' => $brands['hyundai']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Hyundai Elantra', 'ar' => 'هيونداي إلنترا'],
                'slug' => ['en' => 'hyundai-elantra', 'ar' => 'هيونداي-إلنترا'],
                'model' => 'Elantra Smart',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 73000,
                'min_down_payment' => 0,
                'min_installment' => 1050,
                'thumbnail' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '1.6L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '128 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => '6-Speed Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '19.3 km/L'],
                ],
                'colors' => [
                    ['name' => 'Cyber Gray', 'hex' => '#9E9E9E'],
                    ['name' => 'Atlas White', 'hex' => '#F4F4F4'],
                    ['name' => 'Abyss Black', 'hex' => '#121212'],
                ],
                'description' => [
                    'en' => 'Hyundai Elantra features Parametric Dynamics design, outstanding fuel efficiency, and a driver-centric high-tech cockpit.',
                    'ar' => 'هيونداي إلنترا تتميز بتصميم هندسي فائق الأناقة، واستهلاك وقود اقتصادي، ومقصورة قيادة متطورة تركز بالكامل على السائق.',
                ],
                'features' => [
                    'en' => 'Smart Key, Remote Engine Start, Touchscreen Audio, Rear Air Vents, Drive Mode Select',
                    'ar' => 'مفتاح ذكي، تشغيل المحرك عن بعد، شاشة لمس، فتحات تكييف خلفية، اختيار وضعية القيادة',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'featured',
                'availability_status' => 'available',
                'rating' => 4.9,
            ],

            // 8. هيونداي سوناتا
            [
                'brand_id' => $brands['hyundai']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Hyundai Sonata', 'ar' => 'هيونداي سوناتا'],
                'slug' => ['en' => 'hyundai-sonata', 'ar' => 'هيونداي-سوناتا'],
                'model' => 'Sonata Smart',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 101000,
                'min_down_payment' => 0,
                'min_installment' => 1450,
                'thumbnail' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '2.5L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '191 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => '8-Speed Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '16.3 km/L'],
                ],
                'colors' => [
                    ['name' => 'Serenity White', 'hex' => '#F0F0F0'],
                    ['name' => 'Transmission Blue', 'hex' => '#2B4C7E'],
                    ['name' => 'Nocturne Gray', 'hex' => '#3C3C3C'],
                ],
                'description' => [
                    'en' => 'Hyundai Sonata is an executive midsize sedan with Seamless Horizon Lamp, dual curved panoramic displays, and unmatched highway comfort.',
                    'ar' => 'هيونداي سوناتا هي سيارة سيدان متوسطة الحجم فاخرة، وتتميز بإضاءة الأفق المتصلة والشاشات البانورامية المنحنية وراحة استثنائية على الطرق السريعة.',
                ],
                'features' => [
                    'en' => 'Curved Widescreen Display, Shift-by-Wire, Bose Premium Audio, Panoramic Sunroof, Hyundai SmartSense',
                    'ar' => 'شاشة بانورامية منحنية، ناقل حركة بالسلك، نظام صوتي بوز الفاخر، سقف بانورامي، تقنيات الأمان SmartSense',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'featured',
                'availability_status' => 'available',
                'rating' => 4.9,
            ],

            // 9. كيا K5
            [
                'brand_id' => $brands['kia']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Kia K5', 'ar' => 'كيا K5'],
                'slug' => ['en' => 'kia-k5', 'ar' => 'كيا-k5'],
                'model' => 'K5 LX',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 96000,
                'min_down_payment' => 0,
                'min_installment' => 1375,
                'thumbnail' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '2.5L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '194 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => '8-Speed Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '16.1 km/L'],
                ],
                'colors' => [
                    ['name' => 'Wolf Gray', 'hex' => '#78866B'],
                    ['name' => 'Snow White Pearl', 'hex' => '#F8F9FA'],
                    ['name' => 'Aurora Black', 'hex' => '#111111'],
                ],
                'description' => [
                    'en' => 'Kia K5 combines aggressive fastback silhouette, driver-oriented cockpit, and exhilarating performance for style-conscious drivers.',
                    'ar' => 'تجمع كيا K5 بين المظهر الرياضي الجذاب المستوحى من سيارات الفاستباك، مع مقصورة قيادة رياضية وأداء قوي على الطريق.',
                ],
                'features' => [
                    'en' => 'Fastback Design, Leatherette Seats, 12.3-inch Infotainment, Drive Mode Select, Forward Collision Warning',
                    'ar' => 'تصميم فاستباك رياضي، مقاعد جلدية، شاشة ترفيه 12.3 بوصة، نمط القيادة المتعدد، نظام تفادي الاصطدام الأمامي',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'trending',
                'availability_status' => 'available',
                'rating' => 4.8,
            ],

            // 10. هوندا أكورد
            [
                'brand_id' => $brands['honda']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Honda Accord', 'ar' => 'هوندا أكورد'],
                'slug' => ['en' => 'honda-accord', 'ar' => 'هوندا-أكورد'],
                'model' => 'Accord LX Turbo',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 114000,
                'min_down_payment' => 0,
                'min_installment' => 1600,
                'thumbnail' => 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '1.5L Turbo 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '192 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => 'CVT Automatic'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '17.3 km/L'],
                ],
                'colors' => [
                    ['name' => 'Platinum White', 'hex' => '#F5F7FA'],
                    ['name' => 'Meteoroid Gray', 'hex' => '#4A4E51'],
                    ['name' => 'Crystal Black', 'hex' => '#0A0A0B'],
                ],
                'description' => [
                    'en' => 'The Honda Accord sets the benchmark for midsize sedans with refined engineering, smooth turbo power, premium materials, and Honda Sensing suite.',
                    'ar' => 'تعتبر هوندا أكورد المعيار الذهبي لسيارات السيدان بفضل الهندسة اليابانية الرفيعة، محرك التيربو السلس، المواد الفاخرة وأنظمة Honda Sensing للأمان.',
                ],
                'features' => [
                    'en' => 'Honda Sensing Suite, Wireless Apple CarPlay, Head-Up Display, 10.2 Digital Gauge Cluster',
                    'ar' => 'مجموعة Honda Sensing، أبل كاربلاي لاسلكي، شاشة عرض على الزجاج (Head-Up)، لوحة عدادات رقمية 10.2 بوصة',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'featured',
                'availability_status' => 'available',
                'rating' => 5.0,
            ],

            // 11. نيسان ألتيما
            [
                'brand_id' => $brands['nissan']->id,
                'category_id' => $sedanCategory->id,
                'name' => ['en' => 'Nissan Altima', 'ar' => 'نيسان ألتيما'],
                'slug' => ['en' => 'nissan-altima', 'ar' => 'نيسان-ألتيما'],
                'model' => 'Altima S',
                'year' => 2025,
                'type' => 'sedan',
                'cash_price' => 110000,
                'min_down_payment' => 0,
                'min_installment' => 1585,
                'thumbnail' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    ['image_path' => 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80', 'type' => 'exterior'],
                    ['image_path' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', 'type' => 'interior'],
                ],
                'specs' => [
                    ['label' => 'Engine', 'value' => '2.5L 4-Cylinder'],
                    ['label' => 'Horsepower', 'value' => '188 HP'],
                    ['label' => 'Fuel Type', 'value' => 'Gasoline'],
                    ['label' => 'Transmission', 'value' => 'Xtronic CVT'],
                    ['label' => 'Drive Type', 'value' => 'FWD'],
                    ['label' => 'Seats', 'value' => '5 Seats'],
                    ['label' => 'Fuel Economy', 'value' => '16.6 km/L'],
                ],
                'colors' => [
                    ['name' => 'Glacier White', 'hex' => '#FCFCFC'],
                    ['name' => 'Gun Metallic', 'hex' => '#404040'],
                    ['name' => 'Super Black', 'hex' => '#050505'],
                ],
                'description' => [
                    'en' => 'Nissan Altima features Zero Gravity Seats, ProPILOT Assist technology, and outstanding ride comfort for long-distance highway cruises.',
                    'ar' => 'تتميز نيسان ألتيما بمقاعد انعدام الجاذبية فائقة الراحة، تقنيات ProPILOT للمساعدة في القيادة، وراحة تامة على الطرقات الطويلة.',
                ],
                'features' => [
                    'en' => 'Zero Gravity Seats, NissanConnect 12.3 Display, Remote Engine Start, Intelligent Emergency Braking',
                    'ar' => 'مقاعد انعدام الجاذبية، شاشة NissanConnect 12.3 بوصة، تشغيل المحرك عن بعد، فرامل الطوارئ الذكية',
                ],
                'is_featured' => true,
                'is_active' => true,
                'is_highlighted' => 'trending',
                'availability_status' => 'available',
                'rating' => 4.8,
            ],
        ];

        // Common Specifications definitions
        $specsPool = [
            'engine_capacity' => Specification::create([
                'name' => ['ar' => 'سعة المحرك', 'en' => 'Engine Capacity'],
                'value' => ['ar' => '2.5 لتر 4 أسطوانات DOHC', 'en' => '2.5L 4-Cylinder DOHC'],
                'icon' => 'bi-speedometer2',
            ]),
            'horsepower' => Specification::create([
                'name' => ['ar' => 'القوة الحصانية', 'en' => 'Horsepower'],
                'value' => ['ar' => '188 حصان @ 6000 د/د', 'en' => '188 HP @ 6000 RPM'],
                'icon' => 'bi-lightning-charge',
            ]),
            'torque' => Specification::create([
                'name' => ['ar' => 'عزم الدوران', 'en' => 'Torque'],
                'value' => ['ar' => '244 نيوتن.متر', 'en' => '244 Nm'],
                'icon' => 'bi-gear-wide-connected',
            ]),
            'transmission' => Specification::create([
                'name' => ['ar' => 'ناقل الحركة', 'en' => 'Transmission'],
                'value' => ['ar' => 'أوتوماتيكي Xtronic CVT تتابعي', 'en' => 'Xtronic CVT Automatic'],
                'icon' => 'bi-sliders',
            ]),
            'drive_system' => Specification::create([
                'name' => ['ar' => 'نظام الدفع', 'en' => 'Drive Type'],
                'value' => ['ar' => 'دفع أمامي FWD', 'en' => 'Front-Wheel Drive (FWD)'],
                'icon' => 'bi-arrow-left-right',
            ]),
            'fuel_economy' => Specification::create([
                'name' => ['ar' => 'اقتصاد الوقود', 'en' => 'Fuel Economy'],
                'value' => ['ar' => '16.6 كم / لتر (ممتاز+)', 'en' => '16.6 km/L'],
                'icon' => 'bi-fuel-pump',
            ]),
            'fuel_tank' => Specification::create([
                'name' => ['ar' => 'سعة خزان الوقود', 'en' => 'Fuel Tank Capacity'],
                'value' => ['ar' => '61 لتر', 'en' => '61 Liters'],
                'icon' => 'bi-droplet',
            ]),
            'seats_count' => Specification::create([
                'name' => ['ar' => 'عدد المقاعد', 'en' => 'Seating Capacity'],
                'value' => ['ar' => '5 مقاعد رحبة', 'en' => '5 Seats'],
                'icon' => 'bi-people',
            ]),
            'wheels' => Specification::create([
                'name' => ['ar' => 'قياس العجلات', 'en' => 'Wheel Size'],
                'value' => ['ar' => 'جنوط ألمنيوم قياس 17 بوصة', 'en' => '17-inch Alloy Wheels'],
                'icon' => 'bi-circle',
            ]),
            'trunk_capacity' => Specification::create([
                'name' => ['ar' => 'سعة الصندوق الخلفي', 'en' => 'Cargo Space'],
                'value' => ['ar' => '436 لتر', 'en' => '436 Liters'],
                'icon' => 'bi-box-seam',
            ]),
        ];

        // Common Features definitions
        $featuresPool = [
            'zero_gravity' => Feature::create([
                'name' => ['ar' => 'مقاعد انعدام الجاذبية', 'en' => 'Zero Gravity Seats'],
                'value' => ['ar' => 'مقاعد أمامية مستوحاة من أبحاث ناسا لراحة فائقة وتخفيف الإجهاد', 'en' => 'NASA-inspired Zero Gravity Seats for fatigue reduction'],
                'icon' => 'bi-person-check',
            ]),
            'touchscreen' => Feature::create([
                'name' => ['ar' => 'شاشة لمس 12.3 بوصة', 'en' => '12.3-inch Touchscreen'],
                'value' => ['ar' => 'نظام NissanConnect المتطور عالي الدقة مع ملاحة سحابية', 'en' => 'Advanced NissanConnect HD Display with Cloud Navigation'],
                'icon' => 'bi-display',
            ]),
            'carplay' => Feature::create([
                'name' => ['ar' => 'Apple CarPlay و Android Auto', 'en' => 'Apple CarPlay & Android Auto'],
                'value' => ['ar' => 'اتصال لاسلكي كامل وتزامن للهواتف الذكية وتطبيقات الخرائط والموسيقى', 'en' => 'Wireless connectivity for navigation, calls, and audio apps'],
                'icon' => 'bi-phone',
            ]),
            'remote_start' => Feature::create([
                'name' => ['ar' => 'تشغيل المحرك عن بعد', 'en' => 'Remote Engine Start'],
                'value' => ['ar' => 'تشغيل المحرك ونظام التكييف المسبق عن بعد بالمفتاح الذكي', 'en' => 'Remote start with climate control pre-conditioning'],
                'icon' => 'bi-key',
            ]),
            'audio_system' => Feature::create([
                'name' => ['ar' => 'نظام صوتي رقمي فاخر', 'en' => 'Premium Audio System'],
                'value' => ['ar' => '6 مكبرات صوت نقية مع معالجة رقمية للصوت وموزع استريو', 'en' => '6 Crystal-clear speakers with digital audio processing'],
                'icon' => 'bi-music-note-beamed',
            ]),
            'climate_control' => Feature::create([
                'name' => ['ar' => 'تكييف أوتوماتيكي ثنائي', 'en' => 'Dual-Zone Climate Control'],
                'value' => ['ar' => 'تحكم منفصل بدرجة الحرارة للسائق والراكب مع فتحات تهوية خلفية', 'en' => 'Independent driver & passenger temp control with rear vents'],
                'icon' => 'bi-wind',
            ]),
            'wireless_charger' => Feature::create([
                'name' => ['ar' => 'شاحن لاسلكي سريع', 'en' => 'Wireless Fast Charger'],
                'value' => ['ar' => 'منصة شحن لاسلكي مدمجة للهواتف الذكية مع منفذ USB-C إضافي', 'en' => 'Built-in wireless phone charging pad with fast USB-C ports'],
                'icon' => 'bi-battery-charging',
            ]),
            'led_lights' => Feature::create([
                'name' => ['ar' => 'إضاءة LED متكاملة', 'en' => 'Full LED Lighting'],
                'value' => ['ar' => 'مصابيح أمامية وخلفية LED مع إضاءة نهارية مميزة وحساس إضاءة تلقائي', 'en' => 'Signature LED headlights and taillights with auto sensor'],
                'icon' => 'bi-lightbulb',
            ]),
            'sunroof' => Feature::create([
                'name' => ['ar' => 'فتحة سقف كهربائية', 'en' => 'Power Sunroof'],
                'value' => ['ar' => 'فتحة سقف زجاجية كهربائية بلمسة واحدة مع حاجب شمس مدمج', 'en' => 'One-touch tilt/slide power glass sunroof with sunshade'],
                'icon' => 'bi-sun',
            ]),
        ];

        // Common Safety Features definitions
        $safetyPool = [
            'propilot' => SafetyFeature::create([
                'name' => ['ar' => 'مساعد القيادة ProPILOT Assist', 'en' => 'ProPILOT Assist'],
                'value' => ['ar' => 'مساعد القيادة الذاتي للمحافظة على المسار والمسافة التفاعلية وتثبيت السرعة', 'en' => 'Intelligent lane-centering and adaptive cruise control system'],
                'icon' => 'bi-shield-check',
            ]),
            'emergency_braking' => SafetyFeature::create([
                'name' => ['ar' => 'فرامل الطوارئ الذكية AEB', 'en' => 'Intelligent Emergency Braking'],
                'value' => ['ar' => 'رصد المشاة والمركبات مع الفرملة التلقائية لتفادي الاصطدامات الأمامية', 'en' => 'Forward collision warning with automatic emergency braking and pedestrian detection'],
                'icon' => 'bi-exclamation-octagon',
            ]),
            'blind_spot' => SafetyFeature::create([
                'name' => ['ar' => 'تنبيه النقطة العمياء BSW', 'en' => 'Blind Spot Warning'],
                'value' => ['ar' => 'مراقبة حركة المركبات في الزوايا غير المرئية مع تنبيهات ضوئية وصوتية', 'en' => 'Radar sensor alert for vehicles in your blind spots'],
                'icon' => 'bi-eye',
            ]),
            'lane_departure' => SafetyFeature::create([
                'name' => ['ar' => 'تنبيه مغادرة المسار LDW', 'en' => 'Lane Departure Warning'],
                'value' => ['ar' => 'تنبيه السائق عند الانحراف غير المقصود عن المسار واهتزاز عجلة القيادة', 'en' => 'Alerts driver if car drifts out of travel lane without turn signal'],
                'icon' => 'bi-signpost-split',
            ]),
            'rear_cross_traffic' => SafetyFeature::create([
                'name' => ['ar' => 'تنبيه حركة المرور الخلفية RCTA', 'en' => 'Rear Cross Traffic Alert'],
                'value' => ['ar' => 'استشعار المركبات القادمة من الجانبين عند الرجوع للخلف في المواقف', 'en' => 'Warns of approaching cross traffic when backing out of spaces'],
                'icon' => 'bi-arrow-left-right',
            ]),
            'airbags' => SafetyFeature::create([
                'name' => ['ar' => 'منظومة 8 وسائد هوائية SRS', 'en' => '8 Advanced SRS Airbags'],
                'value' => ['ar' => 'وسائد هوائية أمامية وجانبية وستائرية لحماية الرأس والركبة', 'en' => 'Dual-stage front, side-impact, curtain, and knee airbags'],
                'icon' => 'bi-shield',
            ]),
            'rear_camera' => SafetyFeature::create([
                'name' => ['ar' => 'كاميرا رؤية خلفية مع حساسات', 'en' => 'Rear Camera & Parking Sensors'],
                'value' => ['ar' => 'كاميرا خلفية عالية الدقة مع خطوط توجيهية ديناميكية وحساسات ركن', 'en' => 'High-resolution rearview camera with dynamic guidelines and rear sensors'],
                'icon' => 'bi-camera-video',
            ]),
            'tpms' => SafetyFeature::create([
                'name' => ['ar' => 'مراقبة ضغط الإطارات TPMS', 'en' => 'Tire Pressure Monitor'],
                'value' => ['ar' => 'مراقبة مباشرة لضغط كل إطار مع تنبيه عند انخفاض الضغط', 'en' => 'Individual tire pressure readout with Easy-Fill alert'],
                'icon' => 'bi-speedometer',
            ]),
            'vdc_traction' => SafetyFeature::create([
                'name' => ['ar' => 'التحكم بالثبات والجر VDC & TCS', 'en' => 'Vehicle Dynamic & Traction Control'],
                'value' => ['ar' => 'نظام التحكم الديناميكي لمنع الانزلاق وتثبيت السيارة في المنعطفات الحادة', 'en' => 'Maintains directional stability and wheel traction on slippery roads'],
                'icon' => 'bi-shield-shaded',
            ]),
            'hill_assist' => SafetyFeature::create([
                'name' => ['ar' => 'مساعدة صعود المرتفعات HSA', 'en' => 'Hill Start Assist'],
                'value' => ['ar' => 'منع رجوع السيارة للخلف عند بدء الحركة على الطرق المائلة والمرتفعات', 'en' => 'Holds brake pressure temporarily when starting on inclines'],
                'icon' => 'bi-arrow-up-right-circle',
            ]),
        ];

        foreach ($cars as $carData) {
            $gallery = $carData['gallery'] ?? [];
            unset($carData['gallery']);

            $car = Car::create($carData);

            foreach ($gallery as $img) {
                $car->images()->create($img);
            }

            // Attach rich specifications, features, and safety features
            $car->specifications()->sync(array_values(array_map(fn ($s) => $s->id, $specsPool)));
            $car->features_list()->sync(array_values(array_map(fn ($f) => $f->id, $featuresPool)));
            $car->safety_features()->sync(array_values(array_map(fn ($sf) => $sf->id, $safetyPool)));
        }

        // Clear car caches
        app(CarCacheService::class)->forgetCars();
    }
}
