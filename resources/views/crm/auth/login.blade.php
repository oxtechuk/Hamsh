<!DOCTYPE html>
<html lang="{{ App::getLocale() }}" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    @php
        $siteLogoSetting = null;
        $siteNameRaw = config('app.name', 'هامش');

        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                $siteLogoSetting = \App\Models\Setting::where('key', 'site_logo')->first()?->value;
                $siteNameRaw = \App\Models\Setting::where('key', 'site_name')->first()?->value ?? config('app.name', 'هامش');
            }
        } catch (\Throwable $e) {
            // Fallback
        }

        if (! empty($siteLogoSetting) && \Illuminate\Support\Facades\Storage::disk('public')->exists($siteLogoSetting)) {
            $logoUrl = asset('storage/'.$siteLogoSetting);
        } elseif (file_exists(public_path('images/logo_without_bg.svg'))) {
            $logoUrl = asset('images/logo_without_bg.svg');
        } elseif (file_exists(public_path('images/logo_without_bg.png'))) {
            $logoUrl = asset('images/logo_without_bg.png');
        } else {
            $logoUrl = asset('assets/images/logo.png');
        }

        $siteName = is_array($siteNameRaw) ? ($siteNameRaw[app()->getLocale()] ?? ($siteNameRaw['ar'] ?? 'هامش')) : $siteNameRaw;
    @endphp

    <title>{{ __('تسجيل دخول المديرين') }} | {{ $siteName }}</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        :root {
            --primary: #c59b27;
            --primary-light: #dfb847;
            --primary-dark: #9a781b;
            --primary-glow: rgba(197, 155, 39, 0.25);
            --dark-surface: #0f141d;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --bg-page: #f8fafc;
            --input-bg: #f8fafc;
            --input-border: #e2e8f0;
            --danger: #ef4444;
            --radius-lg: 20px;
            --radius-md: 14px;
            --radius-sm: 10px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
            min-height: 100vh;
            background-color: var(--bg-page);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-main);
            overflow-x: hidden;
        }

        .login-wrapper {
            width: 100%;
            min-height: 100vh;
            display: flex;
        }

        /* Poster Showcase Side (Right in RTL, Left in LTR) */
        .brand-showcase {
            flex: 1.3;
            position: relative;
            background-image: url('{{ asset("images/bak.jpeg") }}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 45px 55px;
            color: #ffffff;
            overflow: hidden;
        }

        /* Luxury dark gradient overlay to ensure contrast and premium feel */
        .brand-showcase::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to bottom,
                rgba(10, 14, 23, 0.45) 0%,
                rgba(10, 14, 23, 0.1) 40%,
                rgba(10, 14, 23, 0.75) 100%
            );
            z-index: 1;
        }

        .showcase-top,
        .showcase-bottom {
            position: relative;
            z-index: 2;
        }

        .showcase-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            background: rgba(15, 23, 42, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 50px;
            font-size: 13px;
            font-weight: 700;
            color: #ffffff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .showcase-badge i {
            color: var(--primary-light);
            font-size: 16px;
        }

        .showcase-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .showcase-bottom a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.15);
            padding: 6px 16px;
            border-radius: 50px;
            backdrop-filter: blur(8px);
            transition: var(--transition);
        }

        .showcase-bottom a:hover {
            background: var(--primary);
            color: #ffffff;
            transform: translateY(-2px);
        }

        /* Form Area Side */
        .form-area {
            width: 520px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 45px 50px;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 2;
        }

        .form-top-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .back-home-link {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 8px;
            background: #f1f5f9;
            transition: var(--transition);
        }

        .back-home-link:hover {
            color: var(--primary-dark);
            background: #e2e8f0;
        }

        .lang-switch-btn {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-muted);
            text-decoration: none;
            padding: 6px 14px;
            border-radius: 8px;
            border: 1px solid var(--input-border);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: var(--transition);
        }

        .lang-switch-btn:hover {
            color: var(--primary);
            border-color: var(--primary);
        }

        .form-body {
            margin: auto 0;
            width: 100%;
        }

        /* Logo Header */
        .brand-logo-wrapper {
            text-align: center;
            margin-bottom: 28px;
        }

        .brand-logo-img {
            max-height: 90px;
            max-width: 220px;
            width: auto;
            height: auto;
            object-fit: contain;
            filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.06));
            transition: var(--transition);
        }

        .brand-logo-img:hover {
            transform: scale(1.02);
        }

        .login-header-title {
            font-size: 26px;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 6px;
            text-align: center;
        }

        .login-header-subtitle {
            font-size: 14px;
            color: var(--text-muted);
            text-align: center;
            margin-bottom: 28px;
        }

        /* Form Controls */
        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 8px;
        }

        .input-box {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-icon-start {
            position: absolute;
            color: #94a3b8;
            font-size: 18px;
            pointer-events: none;
            transition: var(--transition);
            z-index: 2;
        }

        [dir="rtl"] .input-icon-start {
            right: 18px;
        }

        [dir="ltr"] .input-icon-start {
            left: 18px;
        }

        .toggle-password-btn {
            position: absolute;
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 18px;
            cursor: pointer;
            padding: 6px;
            transition: var(--transition);
            z-index: 2;
        }

        [dir="rtl"] .toggle-password-btn {
            left: 14px;
        }

        [dir="ltr"] .toggle-password-btn {
            right: 14px;
        }

        .toggle-password-btn:hover {
            color: var(--text-main);
        }

        .custom-input {
            width: 100%;
            height: 52px;
            background-color: var(--input-bg);
            border: 1.5px solid var(--input-border);
            border-radius: var(--radius-md);
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
            outline: none;
            transition: var(--transition);
        }

        [dir="rtl"] .custom-input {
            padding: 0 48px 0 48px;
            text-align: right;
        }

        [dir="ltr"] .custom-input {
            padding: 0 48px 0 48px;
            text-align: left;
        }

        .custom-input:focus {
            background-color: #ffffff;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .input-box:focus-within .input-icon-start {
            color: var(--primary);
        }

        .form-options {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .remember-checkbox {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
            user-select: none;
        }

        .remember-checkbox input {
            width: 18px;
            height: 18px;
            accent-color: var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }

        /* Login Button */
        .btn-submit-login {
            width: 100%;
            height: 54px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: #ffffff;
            border: none;
            border-radius: var(--radius-md);
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: var(--transition);
            box-shadow: 0 8px 24px rgba(197, 155, 39, 0.3);
            position: relative;
            overflow: hidden;
        }

        .btn-submit-login::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: 0.5s;
        }

        .btn-submit-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(197, 155, 39, 0.4);
        }

        .btn-submit-login:hover::before {
            left: 100%;
        }

        .btn-submit-login:active {
            transform: translateY(0);
        }

        /* Error Alert */
        .alert-error-box {
            background: #fef2f2;
            border: 1px solid #fee2e2;
            color: #b91c1c;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: shake 0.4s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }

        .form-footer {
            text-align: center;
            font-size: 12px;
            color: var(--text-muted);
            padding-top: 20px;
        }

        .form-footer a {
            color: var(--primary-dark);
            text-decoration: none;
            font-weight: 700;
        }

        /* Spinner */
        .spinner {
            display: none;
            width: 22px;
            height: 22px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .btn-submit-login.loading .btn-text,
        .btn-submit-login.loading .btn-icon {
            display: none;
        }

        .btn-submit-login.loading .spinner {
            display: inline-block;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
            .brand-showcase {
                padding: 35px;
            }
            .form-area {
                width: 480px;
                padding: 35px;
            }
        }

        @media (max-width: 850px) {
            .brand-showcase {
                display: none;
            }
            .form-area {
                width: 100%;
                max-width: 480px;
                margin: auto;
                min-height: 100vh;
                box-shadow: none;
                padding: 30px 24px;
            }
        }
    </style>
</head>

<body>

    <div class="login-wrapper">

        <!-- Poster Showcase Side (Right in RTL / Left in LTR) -->
        <div class="brand-showcase" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
            <div class="showcase-top">
                <div class="showcase-badge">
                    <i class="bi bi-shield-lock-fill"></i>
                    <span>{{ __('لوحة الإدارة والتحكم') }} • {{ $siteName }}</span>
                </div>
            </div>

            <div class="showcase-bottom">
                <span>&copy; {{ date('Y') }} {{ $siteName }}. {{ __('جميع الحقوق محفوظة.') }}</span>
                <a href="{{ route('store.home') }}">
                    <span>{{ __('زيارة الموقع') }}</span>
                    <i class="bi bi-arrow-{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}"></i>
                </a>
            </div>
        </div>

        <!-- Form Card Panel -->
        <div class="form-area" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

            <!-- Top Header Actions -->
            <div class="form-top-actions">
                <a href="{{ route('store.home') }}" class="back-home-link">
                    <i class="bi bi-arrow-{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}"></i>
                    <span>{{ __('العودة للموقع') }}</span>
                </a>

                <a href="{{ route('lang.switch', app()->getLocale() == 'ar' ? 'en' : 'ar') }}" class="lang-switch-btn">
                    <i class="bi bi-translate"></i>
                    <span>{{ app()->getLocale() == 'ar' ? 'English' : 'العربية' }}</span>
                </a>
            </div>

            <!-- Form Body Content -->
            <div class="form-body">

                <!-- Dynamic Site Logo -->
                <div class="brand-logo-wrapper">
                    <a href="{{ route('store.home') }}" title="{{ $siteName }}">
                        <img src="{{ $logoUrl }}" alt="{{ $siteName }}" class="brand-logo-img">
                    </a>
                </div>

                <h1 class="login-header-title">{{ __('تسجيل الدخول') }}</h1>
                <p class="login-header-subtitle">{{ __('أهلاً بك، الرجاء إدخال بياناتك للمتابعة إلى لوحة الإدارة') }}</p>

                @if($errors->any())
                    <div class="alert-error-box" id="errorBox">
                        <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                        <span>{{ $errors->first() }}</span>
                    </div>
                @endif

                <form action="{{ route('crm.login.post') }}" method="POST" id="adminLoginForm">
                    @csrf

                    <!-- Username / Email -->
                    <div class="form-group">
                        <label class="form-label" for="username">{{ __('اسم المستخدم أو البريد الإلكتروني') }}</label>
                        <div class="input-box">
                            <i class="bi bi-person-fill input-icon-start"></i>
                            <input type="text"
                                   id="username"
                                   name="username"
                                   class="custom-input"
                                   value="{{ old('username') }}"
                                   placeholder="admin"
                                   required
                                   autofocus
                                   autocomplete="username">
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="form-group">
                        <label class="form-label" for="password">{{ __('كلمة المرور') }}</label>
                        <div class="input-box">
                            <i class="bi bi-lock-fill input-icon-start"></i>
                            <input type="password"
                                   id="password"
                                   name="password"
                                   class="custom-input"
                                   placeholder="••••••••"
                                   required
                                   autocomplete="current-password">
                            <button type="button" class="toggle-password-btn" id="togglePasswordBtn" title="{{ __('إظهار / إخفاء كلمة المرور') }}">
                                <i class="bi bi-eye-fill" id="eyeIcon"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Remember Me -->
                    <div class="form-options">
                        <label class="remember-checkbox" for="remember">
                            <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                            <span>{{ __('تذكر بيانات الدخول') }}</span>
                        </label>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn-submit-login" id="submitBtn">
                        <span class="btn-text">{{ __('تسجيل الدخول') }}</span>
                        <span class="btn-icon">
                            <i class="bi bi-arrow-{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}-short fs-4"></i>
                        </span>
                        <div class="spinner"></div>
                    </button>
                </form>

            </div>

            <!-- Footer -->
            <div class="form-footer">
                &copy; {{ date('Y') }} <a href="{{ route('store.home') }}">{{ $siteName }}</a>. {{ __('نظام الإدارة المتكامل') }}
            </div>

        </div>

    </div>

    <!-- Interactive Scripts -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Password toggle
            const togglePasswordBtn = document.getElementById('togglePasswordBtn');
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');

            if (togglePasswordBtn && passwordInput && eyeIcon) {
                togglePasswordBtn.addEventListener('click', function () {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    eyeIcon.className = isPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill';
                });
            }

            // Form Submit Animation
            const loginForm = document.getElementById('adminLoginForm');
            const submitBtn = document.getElementById('submitBtn');

            if (loginForm && submitBtn) {
                loginForm.addEventListener('submit', function () {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                });
            }

            // Smooth error dismissal
            const errorBox = document.getElementById('errorBox');
            if (errorBox) {
                const inputs = document.querySelectorAll('.custom-input');
                inputs.forEach(function (input) {
                    input.addEventListener('focus', function () {
                        errorBox.style.opacity = '0';
                        errorBox.style.transform = 'translateY(-8px)';
                        errorBox.style.transition = 'all 0.3s ease';
                        setTimeout(() => errorBox.style.display = 'none', 300);
                    }, { once: true });
                });
            }
        });
    </script>

</body>

</html>