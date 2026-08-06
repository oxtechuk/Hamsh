<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── Basic ──
            'site_name' => [
                'ar' => 'نوادر نجد',
                'en' => 'Nawader Njed',
            ],
            'footer_text' => '© 2026 نوادر نجد. جميع الحقوق محفوظة.',
            'auto_assign_bookings' => '0',

            // ── Appearance ──
            'site_logo' => null,
            'site_favicon' => null,
            'breadcrumb_bg' => null,
            'default_car_image' => null,
            'page_loader_enabled' => '1',
            'page_loader_image' => null,

            // ── Contact ──
            'contact_email' => 'info@nawadernjed.sa',
            'contact_phone' => '+966 50 000 0000',
            'contact_whatsapp' => '+966 50 000 0000',
            'contact_address' => 'طريق الملك فهد، الرياض، المملكة العربية السعودية',

            // ── Social Media ──
            'social_media' => [
                ['icon' => 'bi-twitter-x', 'color' => '#000000', 'link' => 'https://x.com/nawader_njed'],
                ['icon' => 'bi-instagram', 'color' => '#E4405F', 'link' => 'https://instagram.com/nawader_njed'],
                ['icon' => 'bi-tiktok', 'color' => '#000000', 'link' => 'https://tiktok.com/@nawader_njed'],
                ['icon' => 'bi-snapchat', 'color' => '#FFFC00', 'link' => 'https://snapchat.com/add/nawader_njed'],
            ],

            // ── Promo Popup ──
            'promo_popup' => [
                'enabled' => false,
                'image' => null,
                'title' => 'عرض خاص لهذا الشهر!',
                'text' => 'احصل على خصم يصل إلى 15% على جميع السيارات المميزة من نوادر نجد.',
                'link' => '/offers',
                'button_text' => 'تصفح العروض',
            ],

            // ── Home Hero (new badge/text structure) ──
            'store_home_hero' => [
                'title' => [
                    'badge' => ['ar' => '🔥 أفضل العروض', 'en' => '🔥 Best Deals'],
                    'text' => ['ar' => 'نوادر نجد للسيارات', 'en' => 'Nawader Njed Cars'],
                ],
                'subtitle' => [
                    'badge' => ['ar' => '🚗 اكتشف الآن', 'en' => '🚗 Discover Now'],
                    'text' => [
                        'ar' => 'أكبر تشكيلة من السيارات بأقساط شهرية منافسة وأفضل خيارات التمويل في المملكة العربية السعودية.',
                        'en' => 'The largest selection of cars with competitive monthly installments and top financing options in Saudi Arabia.',
                    ],
                ],
                'description' => [
                    'ar' => 'نوادر نجد شريكك الموثوق في عالم السيارات. نوفر لك تشكيلة واسعة من أحدث الماركات العالمية مع ضمانات شاملة وخيارات تمويل مرنة تناسب الجميع.',
                    'en' => 'Nawader Njed is your trusted partner in the automotive world. We offer a wide range of the latest global brands with comprehensive warranties and flexible financing options.',
                ],
                'button_1_text' => ['ar' => 'تصفح السيارات', 'en' => 'Browse Cars'],
                'button_1_link' => '/cars',
                'button_2_text' => ['ar' => 'تواصل معنا', 'en' => 'Contact Us'],
                'button_2_url' => 'https://wa.me/966500000000',
            ],

            // ── Home Features ──
            'store_home_features' => [
                [
                    'icon' => 'bi-shield-check',
                    'title' => ['ar' => 'ضمان شامل', 'en' => 'Comprehensive Warranty'],
                    'description' => ['ar' => 'جميع سياراتنا مدعومة بضمان شامل يغطي المكونات الرئيسية والمحرك.', 'en' => 'All our cars are backed by a comprehensive warranty covering major components and engine.'],
                ],
                [
                    'icon' => 'bi-cash-coin',
                    'title' => ['ar' => 'تسهيلات تمويلية', 'en' => 'Flexible Financing'],
                    'description' => ['ar' => 'خطط تمويل مرنة بمعدلات فائدة تنافسية تناسب جميع الميزانيات.', 'en' => 'Flexible financing plans with competitive interest rates to suit all budgets.'],
                ],
                [
                    'icon' => 'bi-truck',
                    'title' => ['ar' => 'توصيل مجاني', 'en' => 'Free Delivery'],
                    'description' => ['ar' => 'خدمة توصيل مجانية لجميع مناطق المملكة العربية السعودية.', 'en' => 'Free delivery service to all regions of the Kingdom of Saudi Arabia.'],
                ],
            ],

            // ── Hero Slides ──
            'hero_slides' => [
                [
                    'image' => 'settings/hero/JO4J8vNqFu66Z1qINHW9OkTtmbneChFEpCxi74YN.webp',
                    'link' => '/cars',
                    'button_text' => 'اكتشف السيارات',
                ],
            ],

            // ── Homepage Featured ──
            'homepage_featured' => [
                'title' => ['ar' => 'السيارة المميزة', 'en' => 'Featured Car'],
                'description' => ['ar' => 'اكتشف سيارتنا المميزة هذا الشهر مع عرض خاص لا يُفوّت.', 'en' => 'Discover our featured car this month with a special offer not to be missed.'],
                'car_id' => null,
                'offer_id' => null,
            ],

            // ── Homepage Sections ──
            'homepage_sections' => [
                'filter' => [
                    'title' => ['ar' => 'ابحث عن سيارتك المثالية', 'en' => 'Find Your Perfect Car'],
                ],
                'featured_cars' => [
                    'badge' => ['ar' => '⭐ مميزة', 'en' => '⭐ Featured'],
                    'title' => ['ar' => 'السيارات المميزة', 'en' => 'Featured Cars'],
                    'subtitle' => ['ar' => 'تشكيلة مختارة بعناية من أفضل السيارات المتاحة حالياً', 'en' => 'A carefully curated selection of the best cars available now'],
                    'button_text' => ['ar' => 'عرض الكل', 'en' => 'View All'],
                ],
                'offers' => [
                    'badge' => ['ar' => '🏷️ عروض حصرية', 'en' => '🏷️ Exclusive Offers'],
                    'title' => ['ar' => 'العروض الحالية', 'en' => 'Current Offers'],
                    'button_text' => ['ar' => 'عرض جميع العروض', 'en' => 'View All Offers'],
                ],
                'highlighted_cars' => [
                    'badge' => ['ar' => '🔥 الأكثر طلباً', 'en' => '🔥 Most Popular'],
                    'title' => ['ar' => 'السيارات الأكثر رواجاً', 'en' => 'Most Popular Cars'],
                    'subtitle' => ['ar' => 'السيارات الأكثر طلباً من عملائنا هذا الشهر', 'en' => 'The most requested cars by our customers this month'],
                    'button_text' => ['ar' => 'استكشف المزيد', 'en' => 'Explore More'],
                ],
                'finance' => [
                    'badge' => ['ar' => '💰 تمويل سهل', 'en' => '💰 Easy Finance'],
                    'title' => ['ar' => 'حلول التمويل', 'en' => 'Financing Solutions'],
                    'subtitle' => ['ar' => 'خطط تمويل مرنة تمنحك فرصة امتلاك سيارة أحلامك بسهولة', 'en' => 'Flexible financing plans that give you the opportunity to own your dream car with ease'],
                    'button_text' => ['ar' => 'احسب قسطك', 'en' => 'Calculate Your Installment'],
                ],
                'brands' => [
                    'title' => ['ar' => 'الماركات العالمية', 'en' => 'Global Brands'],
                    'subtitle' => ['ar' => 'اكتشف تشكيلتنا من أشهر ماركات السيارات العالمية', 'en' => 'Discover our collection from the world\'s most famous car brands'],
                ],
                'budget' => [
                    'badge' => ['ar' => '🎯 حدد ميزانيتك', 'en' => '🎯 Set Your Budget'],
                    'title' => ['ar' => 'تسوّق حسب ميزانيتك', 'en' => 'Shop by Your Budget'],
                    'description' => ['ar' => 'حدد نطاق ميزانيتك وسنعرض لك أفضل الخيارات المتاحة.', 'en' => 'Set your budget range and we\'ll show you the best available options.'],
                    'button_text' => ['ar' => 'ابدأ البحث', 'en' => 'Start Searching'],
                ],
            ],

            // ── Homepage Stats ──
            'homepage_stats' => [
                ['value' => '+1200', 'label' => 'سيارة متاحة'],
                ['value' => '+8', 'label' => 'فروع في المملكة'],
                ['value' => '+5000', 'label' => 'عميل سعيد'],
                ['value' => '+10', 'label' => 'سنوات خبرة'],
            ],

            // ── Finance Stats ──
            'finance_stats' => [
                ['value' => '0%', 'label' => 'قسط أول سنة'],
                ['value' => '5', 'label' => 'سنوات سداد كحد أقصى'],
                ['value' => '3.5%', 'label' => 'نسبة الفائدة'],
            ],

            // ── Bento ──
            'bento_cars' => [],
            'main_gallery' => [],

            // ── Cars Hero ──
            'store_hero' => [
                'title' => ['ar' => 'اكتشف تشكيلتنا', 'en' => 'Discover Our Collection'],
                'subtitle' => ['ar' => 'تصفح أكثر من 1200 سيارة من أفضل الماركات العالمية بأفضل الأسعار', 'en' => 'Browse over 1200 cars from the world\'s best brands at the best prices'],
                'image' => 'settings/cars/Yo5PWrfPke5e2WIrQTpluOELt91Mq8mu6VCYggfm.png',
            ],

            // ── Hero Ads ──
            'hero_ad_1_image' => null,
            'hero_ad_1_link' => '/offers',
            'hero_ad_2_image' => null,
            'hero_ad_2_link' => '/cars',

            // ── Offers Hero ──
            'store_offers_hero' => [
                'title' => ['ar' => 'العروض الحصرية', 'en' => 'Exclusive Offers'],
                'colored_title' => ['ar' => '', 'en' => ''],
                'subtitle' => ['ar' => 'لا تفوّت هذه العروض المحدودة على أحدث السيارات', 'en' => 'Don\'t miss these limited offers on the latest cars'],
                'image' => null,
            ],

            // ── About Sections ──
            'about_sections' => [
                'hero' => [
                    'badge' => ['ar' => 'من نحن', 'en' => 'About Us'],
                    'title' => ['ar' => 'نوادر — شريكك الموثوق', 'en' => 'Nawader — Your Trusted Partner'],
                    'colored_title' => ['ar' => '', 'en' => ''],
                    'subtitle' => ['ar' => 'نحن أكثر من مجرد معرض سيارات. نحن شريكك الموثوق في رحلة امتلاك السيارة المثالية.', 'en' => 'We are more than just a car showroom. We are your trusted partner in the journey of owning the perfect car.'],
                ],
                'story' => [
                    'badge' => ['ar' => '', 'en' => ''],
                    'title' => ['ar' => 'قصتنا', 'en' => 'Our Story'],
                    'content' => ['ar' => 'تأسست نوادر عام 2016 بهدف تقديم تجربة شراء سيارات مختلفة تجمع بين الجودة والشفافية والخدمة المتميزة. منذ تأسيسنا، نمونا لنصبح واحدة من أبرز أسماء صناعة السيارات في المملكة العربية السعودية، обслуживنا أكثر من 5000 عميل راضٍ.', 'en' => 'Founded in 2016, Nawader was established with the goal of providing a different car buying experience that combines quality, transparency, and exceptional service. Since our founding, we have grown to become one of the most prominent names in the automotive industry in Saudi Arabia, serving over 5,000 satisfied customers.'],
                    'mission_title' => ['ar' => 'مهمتنا', 'en' => 'Our Mission'],
                    'mission_text' => ['ar' => 'تمكين كل عميل من امتلاك سيارة أحلامه من خلال تجربة شراء سلسة وشفافة وعادلة.', 'en' => 'To empower every customer to own their dream car through a seamless, transparent, and fair buying experience.'],
                    'vision_title' => ['ar' => 'رؤيتنا', 'en' => 'Our Vision'],
                    'vision_text' => ['ar' => 'أن نكون الخيار الأول لشراء وتمويل السيارات في المنطقة، من خلال الابتكار والجودة وخدمة العملاء الاستثنائية.', 'en' => 'To be the first choice for car buying and financing in the region, through innovation, quality, and exceptional customer service.'],
                    'message_title' => ['ar' => 'رسالتنا', 'en' => 'Our Message'],
                    'message_text' => ['ar' => 'نؤمن بأن كل عميل يستحق شريكاً موثوقاً في رحلة امتلاك سيارته. رسالتنا مبنية على الصدق والشفافية والالتزام بتقديم أفضل تجربة لكل مشتري.', 'en' => 'We believe that every customer deserves a trusted partner in their car ownership journey. Our message is built on honesty, transparency, and a commitment to delivering the best experience for every buyer.'],
                ],
                'partners' => [
                    'badge' => ['ar' => 'شركاؤنا', 'en' => 'Our Partners'],
                    'title' => ['ar' => 'شركاء النجاح', 'en' => 'Success Partners'],
                    'subtitle' => ['ar' => 'نفتخر بشراكتنا مع أكبر الماركات والمؤسسات المالية في المملكة', 'en' => 'We are proud to partner with the largest brands and financial institutions in the Kingdom'],
                ],
                'dealer' => [
                    'title' => ['ar' => 'كن موزعاً لنا', 'en' => 'Become a Dealer'],
                    'description' => ['ar' => 'انضم إلى شبكة الموزعين المعتمدين من نوادر واستفد من فرص التعاون المميزة.', 'en' => 'Join Nawader\'s authorized dealer network and benefit from exclusive cooperation opportunities.'],
                    'partner_button_text' => ['ar' => 'تواصل للشراكة', 'en' => 'Contact for Partnership'],
                    'partner_button_link' => 'https://wa.me/966500000000',
                    'contact_button_text' => ['ar' => 'تواصل معنا', 'en' => 'Contact Us'],
                ],
                'locations' => [
                    'title' => ['ar' => 'فروعنا', 'en' => 'Our Locations'],
                ],
                'testimonials' => [
                    'badge' => ['ar' => 'آراء العملاء', 'en' => 'Testimonials'],
                    'title' => ['ar' => 'ماذا يقول عملاؤنا', 'en' => 'What Our Customers Say'],
                    'rating_text' => ['ar' => 'تقييم 4.9 من 5 بناءً على أكثر من 500 تقييم', 'en' => 'Rated 4.9 out of 5 based on over 500 reviews'],
                ],
            ],

            // ── About Stats ──
            'about_stats' => [
                ['value' => '+5000', 'label' => 'عميل سعيد'],
                ['value' => '+1200', 'label' => 'سيارة بيعت'],
                ['value' => '+8', 'label' => 'فروع'],
                ['value' => '+10', 'label' => 'سنوات خبرة'],
            ],

            // ── About Branches ──
            'about_branches' => [
                [
                    'city' => 'الرياض',
                    'name' => 'فرع الرياض الرئيسي',
                    'address' => 'طريق الملك فهد، حي العليا، الرياض',
                    'phone' => '+966 50 000 0001',
                    'working_hours' => 'السبت - الخميس، 9 صباحاً - 9 مساءً',
                    'map_link' => 'https://maps.google.com/?q=24.7136,46.6753',
                ],
                [
                    'city' => 'جدة',
                    'name' => 'فرع جدة',
                    'address' => 'طريق الأمير محمد بن عبد العزيز، حي الروضة، جدة',
                    'phone' => '+966 50 000 0002',
                    'working_hours' => 'السبت - الخميس، 9 صباحاً - 9 مساءً',
                    'map_link' => 'https://maps.google.com/?q=21.5433,39.1728',
                ],
                [
                    'city' => 'الدمام',
                    'name' => 'فرع الدمام',
                    'address' => 'طريق الملك سعود، حي الفيصلية، الدمام',
                    'phone' => '+966 50 000 0003',
                    'working_hours' => 'السبت - الخميس، 9 صباحاً - 9 مساءً',
                    'map_link' => 'https://maps.google.com/?q=26.4207,50.0888',
                ],
            ],

            // ── Booking Hero ──
            'store_booking_hero' => [
                'title' => ['ar' => 'احجز سيارتك الآن', 'en' => 'Book Your Car Now'],
                'subtitle' => ['ar' => 'أكمل نموذج الحجز وسيراجعك فريقنا خلال 24 ساعة', 'en' => 'Complete the booking form and our team will review within 24 hours'],
                'image' => null,
            ],

            // ── Booking Steps ──
            'store_booking_steps' => [
                [
                    'icon' => 'bi-search',
                    'title' => ['ar' => 'اختر سيارتك', 'en' => 'Choose Your Car'],
                    'description' => ['ar' => 'تصفّح تشكيلتنا الواسعة واختر السيارة التي تناسب احتياجاتك وميزانيتك.', 'en' => 'Browse our wide collection and choose the car that suits your needs and budget.'],
                ],
                [
                    'icon' => 'bi-pencil-square',
                    'title' => ['ar' => 'أكمل النموذج', 'en' => 'Complete the Form'],
                    'description' => ['ar' => 'أدخل بياناتك الشخصية واختر خطة التمويل المناسبة لك.', 'en' => 'Enter your personal details and choose the financing plan that suits you.'],
                ],
                [
                    'icon' => 'bi-headset',
                    'title' => ['ar' => 'مراجعة الطلب', 'en' => 'Review Request'],
                    'description' => ['ar' => 'سيراجع فريقنا المتخصص طلبك ويتواصل معك لتأكيد التفاصيل.', 'en' => 'Our specialized team will review your request and contact you to confirm the details.'],
                ],
                [
                    'icon' => 'bi-key',
                    'title' => ['ar' => 'استلام سيارتك', 'en' => 'Receive Your Car'],
                    'description' => ['ar' => 'استلم سيارتك الجديدة من أقرب فرع لك أو احصل على التوصيل المجاني.', 'en' => 'Receive your new car from the nearest branch or get free delivery.'],
                ],
            ],

            // ── Booking Sections ──
            'store_booking_sections' => [
                'hero' => [
                    'badge' => ['ar' => 'احجز الآن', 'en' => 'Book Now'],
                    'title' => ['ar' => 'نموذج الحجز', 'en' => 'Booking Form'],
                    'subtitle' => ['ar' => 'املأ النموذج أدناه وسيراجعك فريقنا قريباً', 'en' => 'Fill in the form below and our team will get back to you soon'],
                ],
                'form' => [
                    'title' => ['ar' => 'بياناتك الشخصية', 'en' => 'Your Personal Information'],
                    'subtitle' => ['ar' => 'نحتاج بعض البيانات للتواصل معك وتأكيد حجزك', 'en' => 'We need some details to contact you and confirm your booking'],
                ],
                'success' => [
                    'title' => ['ar' => 'تم استلام طلبك بنجاح!', 'en' => 'Your Request Has Been Received!'],
                    'subtitle' => ['ar' => 'شكراً لك! سيتواصل فريقنا معك خلال 24 ساعة.', 'en' => 'Thank you! Our team will contact you within 24 hours.'],
                    'description' => ['ar' => 'يمكنك متابعة حالة طلبك من خلال صفحة التتبع أو التواصل معنا عبر الواتساب.', 'en' => 'You can track your request status through the tracking page or contact us via WhatsApp.'],
                ],
            ],

            // ── SEO ──
            'meta_title' => 'نوادر — بيع وشراء السيارات في المملكة العربية السعودية',
            'meta_description' => 'نوادر أكبر معرض سيارات في المملكة العربية السعودية. تشكيلة واسعة من السيارات الجديدة والمستعملة بأفضل الأسعار وخيارات تمويل مرنة.',
            'meta_keywords' => 'سيارات, بيع سيارات, شراء سيارات, سيارات مستعملة, سيارات جديدة, تمويل سيارات, نوادر, السعودية',
            'google_analytics_id' => '',
            'meta_pixel_id' => '',

            // ── Integrations ──
            'twilio_sid' => '',
            'twilio_auth_token' => '',
            'twilio_whatsapp_number' => '',
            'twilio_sms_number' => '',
            'whatsapp_template_new_lead' => 'مرحباً {customer_name}، شكراً لتواصلك معنا بخصوص {car_name}. سيقوم فريقنا بالتواصل معك قريباً.',
            'whatsapp_template_status_update' => 'مرحباً {customer_name}، نود إعلامك بأنه تم تغيير حالة طلبك الخاص بـ {car_name} لتصبح: {status}.',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
