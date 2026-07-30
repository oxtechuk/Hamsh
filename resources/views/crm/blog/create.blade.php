@extends('partials.Layouts.crm-master')
@section('title', __('كتابة مقالة') . ' | AutoCRM')

@section('content')
<div class="container-fluid" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

    <div class="d-flex align-items-center gap-3 mb-4">
        <a href="{{ route('crm.blog.index') }}" class="btn btn-light btn-sm rounded-circle shadow-xs">
            <i class="bi bi-arrow-{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}"></i>
        </a>
        <div>
            <h4 class="mb-0 fw-bold">{{ __('إضافة مقالة جديدة للمدونة') }}</h4>
            <p class="text-muted small mb-0">{{ __('قم بكتابة محتوى ملهم لعملائك لزيادة التفاعل') }}</p>
        </div>
    </div>

    @if ($errors->any())
    <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm rounded-4 mb-4">
        <ul class="mb-0 small fw-bold">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    @endif

    <form action="{{ route('crm.blog.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="row g-4">
            
            {{-- المحتوى الرئيسي --}}
            <div class="col-12 col-lg-8">
                <div class="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
                    <div class="card-header bg-white border-0 pt-4 px-4">
                        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-pencil-fill text-primary me-2"></i> {{ __('محتوى المقالة') }}</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-4">
                            <label class="form-label fw-bold small text-muted">{{ __('عنوان المقالة (بالعربية)') }} <span class="text-danger">*</span></label>
                            <input type="text" name="title[ar]" class="form-control bg-light border-0 shadow-none fs-5 fw-bold" placeholder="{{ __('مثال: نصائح لشراء سيارة مستعملة...') }}" value="{{ old('title.ar') }}" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold small text-muted">{{ __('عنوان المقالة (بالإنجليزية)') }} <span class="text-danger">*</span></label>
                            <input type="text" name="title[en]" class="form-control bg-light border-0 shadow-none fs-5 fw-bold" placeholder="e.g.: Tips for buying a used car..." value="{{ old('title.en') }}" required>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="form-label fw-bold small text-muted">{{ __('مقتطف تعريفي (عربي)') }}</label>
                                <textarea name="excerpt[ar]" class="form-control bg-light border-0 shadow-none" rows="2" placeholder="{{ __('وصف قصير يظهر في بطاقة المقالة...') }}">{{ old('excerpt.ar') }}</textarea>
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="form-label fw-bold small text-muted">{{ __('مقتطف تعريفي (EN)') }}</label>
                                <textarea name="excerpt[en]" class="form-control bg-light border-0 shadow-none" rows="2" placeholder="Short description for article card...">{{ old('excerpt.en') }}</textarea>
                            </div>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">{{ __('خلاصة القول (عربي)') }}</label>
                                <textarea name="summary[ar]" class="form-control bg-light border-0 shadow-none" rows="3" placeholder="{{ __('خلاصة أو خلاصة القول...') }}">{{ old('summary.ar') }}</textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">{{ __('خلاصة القول (EN)') }}</label>
                                <textarea name="summary[en]" class="form-control bg-light border-0 shadow-none" rows="3" placeholder="Summary / Conclusion...">{{ old('summary.en') }}</textarea>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0 small">{{ __('أقسام المحتوى') }}</h6>
                            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="addContentItemRow()">
                                <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة قسم') }}
                            </button>
                        </div>
                        <div id="content-items-container" class="d-flex flex-column gap-3 mb-4">
                        </div>
                        <div id="no-content-items-msg" class="text-center py-4 bg-light rounded-3 mb-4">
                            <i class="bi bi-file-text fs-1 text-muted opacity-25 d-block mb-1"></i>
                            <span class="text-muted small">{{ __('لا توجد أقسام. اضغط "إضافة قسم" للبدء.') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            {{-- الإعدادات الجانبية --}}
            <div class="col-12 col-lg-4">
                
                {{-- النشر --}}
                <div class="card border-0 shadow-sm mb-4 rounded-4 bg-primary text-white overflow-hidden">
                    <div class="card-body p-4 position-relative" style="background-color: black !important;">
                        <i class="bi bi-send-fill position-absolute opacity-10" style="font-size: 80px; right: -10px; bottom: -20px;"></i>
                        <h6 class="mb-3 fw-bold" style="color: #ee1b24 !important;">{{ __('إعدادات النشر') }}</h6>
                        
                        <div class="form-check form-switch mb-4 p-3 bg-white bg-opacity-10 rounded-3 border-0">
                            <input class="form-check-input {{ app()->getLocale() == 'ar' ? 'ms-0 me-2 float-none' : '' }}" type="checkbox" name="is_published" value="1" id="isPublished" {{ old('is_published') ? 'checked' : '' }}>
                            <label class="form-check-label fw-bold ms-2" for="isPublished" style="color: #ee1b24 !important;">{{ __('نشر المقالة فوراً') }}</label>
                        </div>

                        <div class="form-check form-switch mb-4 p-3 bg-white bg-opacity-10 rounded-3 border-0">
                            <input class="form-check-input {{ app()->getLocale() == 'ar' ? 'ms-0 me-2 float-none' : '' }}" type="checkbox" name="is_featured" value="1" id="isFeatured" {{ old('is_featured') ? 'checked' : '' }}>
                            <label class="form-check-label fw-bold ms-2" for="isFeatured" style="color: #ee1b24 !important;">{{ __('تمييز المقالة (تثبيت في المميزة)') }}</label>
                        </div>
                        
                        @can('manage-blog')
                        <button type="submit" class="btn btn-white w-100 py-3 fw-black text-primary border-0 rounded-3 shadow-sm">
                            <i class="bi bi-save2 me-1"style="color: #ee1b24 !important;"></i> {{ __('حفظ المقالة الآن') }}
                        </button>
                        @endcan
                    </div>
                </div>

                {{-- الصورة البارزة --}}
                <div class="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
                    <div class="card-header bg-white border-0 pt-4 px-4">
                        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-image text-danger me-2"></i> {{ __('الصورة البارزة') }}</h6>
                    </div>
                    <div class="card-body p-4 pt-2">
                        <div class="bg-light rounded-4 p-3 mb-3 border border-dashed text-center position-relative overflow-hidden" style="min-height: 150px;">
                            <div id="thumbnailPreview" class="d-none">
                                <img id="thumbImg" src="" alt="preview" class="img-fluid rounded shadow-xs mb-2">
                                <button type="button" class="btn btn-sm btn-danger rounded-pill px-3 shadow-sm" onclick="removeImage()">{{ __('حذف') }}</button>
                            </div>
                            <div id="uploadPlaceholder">
                                <i class="bi bi-cloud-upload fs-1 opacity-25 d-block mb-2"></i>
                                <span class="small fw-bold text-muted">{{ __('اضغط لرفع صورة المقالة') }}</span>
                            </div>
                            <input type="file" name="thumbnail" class="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" accept="image/*" id="thumbnailInput">
                        </div>
                        <small class="text-muted small">{{ __('يفضل استخدام صور ذات جودة عالية (أبعاد 800x600)') }}</small>
                    </div>
                </div>

                {{-- التصنيفات --}}
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div class="card-header bg-white border-0 pt-4 px-4">
                        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-tags text-warning me-2"></i> {{ __('تصنيفات المقالة') }}</h6>
                    </div>
                    <div class="card-body p-4 pt-2">
                        @if(isset($categories) && $categories->isNotEmpty())
                            <div class="d-flex flex-wrap gap-2">
                                @foreach($categories as $category)
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="categories[]"
                                            value="{{ $category->id }}" id="cat{{ $category->id }}"
                                            {{ in_array($category->id, old('categories', [])) ? 'checked' : '' }}>
                                        <label class="form-check-label small" for="cat{{ $category->id }}">
                                            @if($category->icon)
                                                <i class="bi bi-{{ $category->icon }} me-1"></i>
                                            @endif
                                            {{ $category->name }}
                                        </label>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <p class="text-muted small mb-0">{{ __('لا توجد تصنيفات متاحة بعد.') }}</p>
                            <a href="{{ route('crm.blog-categories.index') }}" class="small">{{ __('إضافة تصنيفات جديدة') }}</a>
                        @endif
                    </div>
                </div>

                {{-- SEO --}}
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div class="card-header bg-white border-0 pt-4 px-4">
                        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-search text-success me-2"></i> {{ __('تحسين محركات البحث (SEO)') }}</h6>
                    </div>
                    <div class="card-body p-4 pt-2">
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">{{ __('عنوان Meta') }}</label>
                            <input type="text" name="meta_title" class="form-control bg-light border-0 shadow-none" value="{{ old('meta_title') }}" placeholder="{{ __('من 50 إلى 60 حرفاً') }}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">{{ __('وصف Meta') }}</label>
                            <textarea name="meta_description" class="form-control bg-light border-0 shadow-none" rows="3" placeholder="{{ __('من 150 إلى 160 حرفاً لنتائج بحث أفضل') }}">{{ old('meta_description') }}</textarea>
                        </div>
                        <div class="mb-0">
                            <label class="form-label fw-bold small text-muted">{{ __('الكلمات المفتاحية') }}</label>
                            <input type="text" name="meta_keywords" class="form-control bg-light border-0 shadow-none" value="{{ old('meta_keywords') }}" placeholder="{{ __('سيارات، نصائح، عروض...') }}">
                        </div>
                    </div>
                </div>
                
            </div>
            
        </div>
    </form>
</div>

<style>
    .btn-white { background: #fff; }
    .fw-black { font-weight: 900; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .cursor-pointer { cursor: pointer; }
    .bg-primary-subtle { background: #e7f1ff; }
</style>
@endsection

@section('js')
<script>
let contentItemCount = 0;
function addContentItemRow() {
    const idx = contentItemCount++;
    document.getElementById('no-content-items-msg').classList.add('d-none');
    const div = document.createElement('div');
    div.className = 'content-item-row card border border-light-subtle rounded-3';
    div.id = 'content-item-row-' + idx;
    div.innerHTML = `
        <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-semibold small text-muted">{{ __('قسم') }} ` + (idx + 1) + `</span>
                <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeContentItemRow(${idx})"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="row g-2">
                <div class="col-md-6">
                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('العنوان — عربي') }}</label>
                    <input type="text" name="content_item_title[${idx}][ar]" class="form-control bg-light border-0 form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('العنوان — إنجليزي') }}</label>
                    <input type="text" name="content_item_title[${idx}][en]" class="form-control bg-light border-0 form-control-sm" dir="ltr">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('المحتوى — عربي') }}</label>
                    <textarea name="content_item_content[${idx}][ar]" rows="4" class="form-control bg-light border-0 form-control-sm"></textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('المحتوى — إنجليزي') }}</label>
                    <textarea name="content_item_content[${idx}][en]" rows="4" class="form-control bg-light border-0 form-control-sm" dir="ltr"></textarea>
                </div>
            </div>
        </div>`;
    document.getElementById('content-items-container').appendChild(div);
}
function removeContentItemRow(idx) {
    document.getElementById('content-item-row-' + idx)?.remove();
    if (!document.querySelector('.content-item-row')) document.getElementById('no-content-items-msg').classList.remove('d-none');
}

// رفع وعرض الصورة
document.getElementById('thumbnailInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('thumbImg').src = ev.target.result;
        document.getElementById('thumbnailPreview').classList.remove('d-none');
        document.getElementById('uploadPlaceholder').classList.add('d-none');
    };
    reader.readAsDataURL(file);
});

function removeImage() {
    document.getElementById('thumbnailInput').value = '';
    document.getElementById('thumbnailPreview').classList.add('d-none');
    document.getElementById('uploadPlaceholder').classList.remove('d-none');
}
</script>
@endsection
