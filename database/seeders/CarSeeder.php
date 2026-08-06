<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to safely refresh cars table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Car::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Seed Brands
        $brandsData = [
            'hyundai' => ['en' => 'Hyundai', 'ar' => 'هيونداي'],
            'toyota' => ['en' => 'Toyota', 'ar' => 'تويوتا'],
            'chevrolet' => ['en' => 'Chevrolet', 'ar' => 'شفروليه'],
            'kia' => ['en' => 'Kia', 'ar' => 'كيا'],
            'honda' => ['en' => 'Honda', 'ar' => 'هوندا'],
            'nissan' => ['en' => 'Nissan', 'ar' => 'نيسان'],
        ];

        $brands = [];
        foreach ($brandsData as $slug => $name) {
            $brands[$slug] = Brand::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
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

        foreach ($cars as $carData) {
            Car::create($carData);
        }
    }
}
