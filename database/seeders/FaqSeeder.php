<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => ['ar' => 'هل تقدمون خيارات تمويل للسيارات؟', 'en' => 'Do you offer car financing options?'],
                'answer' => ['ar' => 'نعم، نقدم خطط تمويل مرنة بالتعاون مع أكبر البنوك في المملكة العربية السعودية. يمكنك الحصول على تمويل حتى 80% من قيمة السيارة مع أسعار فائدة تنافسية ومدد سداد تصل إلى 5 سنوات.', 'en' => 'Yes, we offer flexible financing plans in cooperation with the largest banks in Saudi Arabia. You can get financing up to 80% of the car value with competitive interest rates and repayment terms up to 5 years.'],
                'is_visible' => true,
                'sort_order' => 1,
            ],
            [
                'question' => ['ar' => 'هل السيارات المعرضة جديدة أم مستعملة؟', 'en' => 'Are the displayed cars new or used?'],
                'answer' => ['ar' => 'نقدم تشكيلة متنوعة تشمل سيارات جديدة 2025 وسيارات مستعملة بحالة ممتازة. جميع السيارات المستعملة تخضع لفحص فني شامل وموثقة تاريخها.', 'en' => 'We offer a diverse collection including new 2025 cars and used cars in excellent condition. All used cars undergo a comprehensive technical inspection and their history is documented.'],
                'is_visible' => true,
                'sort_order' => 2,
            ],
            [
                'question' => ['ar' => 'هل تقدمون ضماناً على السيارات؟', 'en' => 'Do you provide warranties on cars?'],
                'answer' => ['ar' => 'نعم، جميع السيارات الجديدة مدعومة بالضمان الرسمي من الشركة المصنعة. كما نقدم ضماناً إضافياً من نوادر يغطي المكونات الرئيسية لمدة تصل إلى 3 سنوات.', 'en' => 'Yes, all new cars are backed by the official manufacturer warranty. We also provide an additional warranty from Nawader covering major components for up to 3 years.'],
                'is_visible' => true,
                'sort_order' => 3,
            ],
            [
                'question' => ['ar' => 'كيف يمكنني حجز سيارة؟', 'en' => 'How can I book a car?'],
                'answer' => ['ar' => 'يمكنك حجز سيارة من خلال صفحة الحجز على الموقع أو بالتواصل معنا عبر الواتساب أو الاتصال المباشر بأحد فروعنا. سيقوم فريقنا بمتابعة طلبك خلال 24 ساعة.', 'en' => 'You can book a car through the booking page on the website, by contacting us via WhatsApp, or by directly calling one of our branches. Our team will follow up on your request within 24 hours.'],
                'is_visible' => true,
                'sort_order' => 4,
            ],
            [
                'question' => ['ar' => 'هل تقدمون خدمة التوصيل؟', 'en' => 'Do you offer delivery service?'],
                'answer' => ['ar' => 'نعم، نقدم خدمة توصيل مجانية لجميع مناطق المملكة العربية السعودية. يتم توصيل السيارة إلى باب منزلك بمنتهى العناية والسلامة.', 'en' => 'Yes, we offer free delivery service to all regions of Saudi Arabia. The car is delivered to your doorstep with utmost care and safety.'],
                'is_visible' => true,
                'sort_order' => 5,
            ],
            [
                'question' => ['ar' => 'ما هي مستندات شراء السيارة المطلوبة؟', 'en' => 'What are the required car purchase documents?'],
                'answer' => ['ar' => 'تحتاج إلى هوية وطنية أو إقامة سارية، رخصة قيادة سارية المفعول، إثبات الدخل، وبطاقة بنكية. في حالة التمويل، ستحتاج إلى مستندات إضافية حسب متطلبات البنك.', 'en' => 'You need a valid national ID or Iqama, a valid driving license, proof of income, and a bank card. In case of financing, you will need additional documents as per bank requirements.'],
                'is_visible' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($faqs as $data) {
            Faq::query()->updateOrCreate(
                ['question->en' => $data['question']['en']],
                $data,
            );
        }
    }
}
