<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

#[Signature('export:postman {--output=postman_collection.json : Output filename}')]
#[Description('Export Postman Collection JSON for all ERP and Store API routes')]
class ExportPostmanCollection extends Command
{
    public function handle()
    {
        $collection = [
            'info' => [
                'name' => config('app.name', 'Hamsh').' API Collection',
                'description' => 'Complete Postman Collection for Hamsh ERP and Store Public APIs.',
                'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
            ],
            'variable' => [
                [
                    'key' => 'base_url',
                    'value' => config('app.url', 'http://localhost:8000'),
                    'type' => 'string',
                ],
                [
                    'key' => 'bearer_token',
                    'value' => '',
                    'type' => 'string',
                ],
            ],
            'item' => [
                $this->buildErpAuthFolder(),
                $this->buildErpCoreFolder(),
                $this->buildStoreCarsFolder(),
                $this->buildStoreBookingCalculatorFolder(),
                $this->buildStoreContentFolder(),
                $this->buildStorePagesFolder(),
                $this->buildStoreSettingsFolder(),
            ],
        ];

        $outputFilename = $this->option('output');
        $filePath = base_path($outputFilename);

        File::put($filePath, json_encode($collection, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        $this->info("Postman Collection generated successfully: {$filePath}");

        return Command::SUCCESS;
    }

    private function buildErpAuthFolder(): array
    {
        return [
            'name' => 'ERP - Auth',
            'item' => [
                [
                    'name' => 'Login',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode(['email' => 'admin@example.com', 'password' => 'password'], JSON_PRETTY_PRINT),
                        ],
                        'url' => [
                            'raw' => '{{base_url}}/api/erp/login',
                            'host' => ['{{base_url}}'],
                            'path' => ['api', 'erp', 'login'],
                        ],
                    ],
                ],
                [
                    'name' => 'Get Current User (Me)',
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => [
                            'raw' => '{{base_url}}/api/erp/me',
                            'host' => ['{{base_url}}'],
                            'path' => ['api', 'erp', 'me'],
                        ],
                    ],
                ],
                [
                    'name' => 'Switch Company',
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode(['company_id' => 1], JSON_PRETTY_PRINT),
                        ],
                        'url' => [
                            'raw' => '{{base_url}}/api/erp/switch-company',
                            'host' => ['{{base_url}}'],
                            'path' => ['api', 'erp', 'switch-company'],
                        ],
                    ],
                ],
                [
                    'name' => 'Logout',
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'POST',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => [
                            'raw' => '{{base_url}}/api/erp/logout',
                            'host' => ['{{base_url}}'],
                            'path' => ['api', 'erp', 'logout'],
                        ],
                    ],
                ],
            ],
        ];
    }

    private function buildErpCoreFolder(): array
    {
        return [
            'name' => 'ERP - Core Modules',
            'item' => [
                $this->buildResourceFolder('Companies', 'api/erp/companies', ['name' => 'Company Name', 'code' => 'COMP01', 'is_active' => true]),
                $this->buildResourceFolder('Branches', 'api/erp/branches', ['company_id' => 1, 'name' => 'Main Branch', 'code' => 'BR01']),
                $this->buildResourceFolder('Departments', 'api/erp/depts', ['branch_id' => 1, 'name' => 'IT Department']),
                $this->buildResourceFolder('Contacts', 'api/erp/contacts', ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '0500000000']),
                $this->buildResourceFolder('Tasks', 'api/erp/tasks', ['title' => 'System Update', 'status' => 'pending', 'due_date' => '2026-12-31']),
                [
                    'name' => 'Modules',
                    'item' => [
                        [
                            'name' => 'List Modules',
                            'request' => [
                                'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                                'method' => 'GET',
                                'header' => [['key' => 'Accept', 'value' => 'application/json']],
                                'url' => ['raw' => '{{base_url}}/api/erp/modules', 'host' => ['{{base_url}}'], 'path' => ['api', 'erp', 'modules']],
                            ],
                        ],
                        [
                            'name' => 'Enable Module',
                            'request' => [
                                'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                                'method' => 'POST',
                                'header' => [['key' => 'Accept', 'value' => 'application/json']],
                                'url' => ['raw' => '{{base_url}}/api/erp/modules/crm/enable', 'host' => ['{{base_url}}'], 'path' => ['api', 'erp', 'modules', 'crm', 'enable']],
                            ],
                        ],
                        [
                            'name' => 'Disable Module',
                            'request' => [
                                'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                                'method' => 'POST',
                                'header' => [['key' => 'Accept', 'value' => 'application/json']],
                                'url' => ['raw' => '{{base_url}}/api/erp/modules/crm/disable', 'host' => ['{{base_url}}'], 'path' => ['api', 'erp', 'modules', 'crm', 'disable']],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }

    private function buildStoreCarsFolder(): array
    {
        return [
            'name' => 'Store - Cars Catalog',
            'item' => [
                [
                    'name' => 'List Cars',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/cars', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'cars']],
                    ],
                ],
                [
                    'name' => 'Cars Meta Data',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/cars/meta', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'cars', 'meta']],
                    ],
                ],
                [
                    'name' => 'Search Cars',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => [
                            'raw' => '{{base_url}}/api/store/cars/search?q=toyota',
                            'host' => ['{{base_url}}'],
                            'path' => ['api', 'store', 'cars', 'search'],
                            'query' => [['key' => 'q', 'value' => 'toyota']],
                        ],
                    ],
                ],
                [
                    'name' => 'Compare Cars',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => [
                            'raw' => '{{base_url}}/api/store/cars/compare?ids[]=1&ids[]=2',
                            'host' => ['{{base_url}}'],
                            'path' => ['api', 'store', 'cars', 'compare'],
                            'query' => [
                                ['key' => 'ids[]', 'value' => '1'],
                                ['key' => 'ids[]', 'value' => '2'],
                            ],
                        ],
                    ],
                ],
                [
                    'name' => 'Car Details by Slug',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/cars/toyota-camry-2024', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'cars', 'toyota-camry-2024']],
                    ],
                ],
                [
                    'name' => 'List Brands',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/brands', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'brands']],
                    ],
                ],
                [
                    'name' => 'List Car Categories',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/car-categories', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'car-categories']],
                    ],
                ],
                [
                    'name' => 'List Car Types',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/car-types', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'car-types']],
                    ],
                ],
                [
                    'name' => 'List Cities',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/cities', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'cities']],
                    ],
                ],
            ],
        ];
    }

    private function buildStoreBookingCalculatorFolder(): array
    {
        return [
            'name' => 'Store - Booking & Calculator',
            'item' => [
                [
                    'name' => 'Booking Meta',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/booking/meta', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'booking', 'meta']],
                    ],
                ],
                [
                    'name' => 'Create Booking',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode([
                                'car_id' => 1,
                                'name' => 'Mohammed Ali',
                                'phone' => '0501234567',
                                'city_id' => 1,
                                'payment_type' => 'cash',
                            ], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/booking', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'booking']],
                    ],
                ],
                [
                    'name' => 'Calculator Banks',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/calculator/banks', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'calculator', 'banks']],
                    ],
                ],
                [
                    'name' => 'Calculator Settings',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/calculator/settings', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'calculator', 'settings']],
                    ],
                ],
                [
                    'name' => 'Calculate Financing',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode([
                                'price' => 100000,
                                'down_payment' => 10000,
                                'years' => 5,
                                'bank_id' => 1,
                            ], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/calculator/calculate', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'calculator', 'calculate']],
                    ],
                ],
                [
                    'name' => 'Save Calculator Lead',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode([
                                'name' => 'Ahmed Hassan',
                                'phone' => '0501234567',
                                'car_id' => 1,
                                'salary' => 8000,
                                'monthly_installment' => 1500,
                            ], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/calculator/lead', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'calculator', 'lead']],
                    ],
                ],
                [
                    'name' => 'Send OTP',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode(['phone' => '0501234567'], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/calculator/otp/send', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'calculator', 'otp', 'send']],
                    ],
                ],
                [
                    'name' => 'Verify OTP',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode(['phone' => '0501234567', 'code' => '1234'], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/calculator/otp/verify', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'calculator', 'otp', 'verify']],
                    ],
                ],
            ],
        ];
    }

    private function buildStoreContentFolder(): array
    {
        return [
            'name' => 'Store - Content & Blog',
            'item' => [
                [
                    'name' => 'List Blog Posts',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/blog', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'blog']],
                    ],
                ],
                [
                    'name' => 'List Blog Categories',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/blog/categories', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'blog', 'categories']],
                    ],
                ],
                [
                    'name' => 'Blog Post Detail',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/blog/post-slug', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'blog', 'post-slug']],
                    ],
                ],
                [
                    'name' => 'List Offers',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/offers', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'offers']],
                    ],
                ],
                [
                    'name' => 'Subscribe to Newsletter',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode(['email' => 'subscriber@example.com'], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/newsletter', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'newsletter']],
                    ],
                ],
                [
                    'name' => 'List FAQs',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/faqs', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'faqs']],
                    ],
                ],
            ],
        ];
    }

    private function buildStorePagesFolder(): array
    {
        return [
            'name' => 'Store - Pages & Info',
            'item' => [
                [
                    'name' => 'Home Page Data',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/home', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'home']],
                    ],
                ],
                [
                    'name' => 'About Us Data',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/about', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'about']],
                    ],
                ],
                [
                    'name' => 'Submit Contact Form',
                    'request' => [
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode([
                                'name' => 'Visitor Name',
                                'phone' => '0501234567',
                                'message' => 'Hello, I would like to inquire about sales.',
                            ], JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/api/store/contact', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'contact']],
                    ],
                ],
                [
                    'name' => 'List Testimonials',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/testimonials', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'testimonials']],
                    ],
                ],
                [
                    'name' => 'List Partners',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/partners', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'partners']],
                    ],
                ],
            ],
        ];
    }

    private function buildStoreSettingsFolder(): array
    {
        return [
            'name' => 'Store - Settings & Media',
            'item' => [
                [
                    'name' => 'General Settings',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/settings', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'settings']],
                    ],
                ],
                [
                    'name' => 'Footer Settings',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/settings/footer', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'settings', 'footer']],
                    ],
                ],
                [
                    'name' => 'Finance Solution Settings',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/settings/finance-solution', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'settings', 'finance-solution']],
                    ],
                ],
                [
                    'name' => 'Gallery Items',
                    'request' => [
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/api/store/gallery', 'host' => ['{{base_url}}'], 'path' => ['api', 'store', 'gallery']],
                    ],
                ],
            ],
        ];
    }

    private function buildResourceFolder(string $resourceName, string $basePath, array $sampleData): array
    {
        $singularName = rtrim($resourceName, 's');
        $pathParts = explode('/', $basePath);

        return [
            'name' => $resourceName,
            'item' => [
                [
                    'name' => "List {$resourceName}",
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/'.$basePath, 'host' => ['{{base_url}}'], 'path' => $pathParts],
                    ],
                ],
                [
                    'name' => "Create {$singularName}",
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'POST',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode($sampleData, JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/'.$basePath, 'host' => ['{{base_url}}'], 'path' => $pathParts],
                    ],
                ],
                [
                    'name' => "Get {$singularName} by ID",
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'GET',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/'.$basePath.'/1', 'host' => ['{{base_url}}'], 'path' => array_merge($pathParts, ['1'])],
                    ],
                ],
                [
                    'name' => "Update {$singularName}",
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'PUT',
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json'],
                            ['key' => 'Content-Type', 'value' => 'application/json'],
                        ],
                        'body' => [
                            'mode' => 'raw',
                            'raw' => json_encode($sampleData, JSON_PRETTY_PRINT),
                        ],
                        'url' => ['raw' => '{{base_url}}/'.$basePath.'/1', 'host' => ['{{base_url}}'], 'path' => array_merge($pathParts, ['1'])],
                    ],
                ],
                [
                    'name' => "Delete {$singularName}",
                    'request' => [
                        'auth' => ['type' => 'bearer', 'bearer' => [['key' => 'token', 'value' => '{{bearer_token}}', 'type' => 'string']]],
                        'method' => 'DELETE',
                        'header' => [['key' => 'Accept', 'value' => 'application/json']],
                        'url' => ['raw' => '{{base_url}}/'.$basePath.'/1', 'host' => ['{{base_url}}'], 'path' => array_merge($pathParts, ['1'])],
                    ],
                ],
            ],
        ];
    }
}
