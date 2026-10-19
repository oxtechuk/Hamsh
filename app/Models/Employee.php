<?php

namespace App\Models;

use App\Casts\AsImageUrl;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Employee extends Authenticatable
{
    use HasRoles, Notifiable;

    protected $guard_name = 'employee';

    protected $fillable = ['name', 'username', 'email', 'password', 'phone', 'role', 'is_active', 'avatar'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'is_active' => 'boolean',
        'password' => 'hashed',
        'avatar' => AsImageUrl::class,
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'assigned_to');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(BookingNote::class);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin') || $this->role === 'admin';
    }

    public function getHomeRouteName(): string
    {
        if ($this->isAdmin() || $this->can('manage-dashboard')) {
            return 'crm.dashboard';
        }

        if ($this->can('manage-bookings')) {
            return 'crm.bookings.index';
        }

        if ($this->can('manage-leads')) {
            return 'crm.leads.index';
        }

        if ($this->can('manage-tracking')) {
            return 'crm.tracking.index';
        }

        if ($this->can('manage-cars')) {
            return 'crm.cars.index';
        }

        if ($this->can('manage-calculator-leads')) {
            return 'crm.calculator-leads.index';
        }

        if ($this->can('manage-tasks')) {
            return 'crm.tasks.index';
        }

        if ($this->can('manage-reports')) {
            return 'crm.reports.bookings';
        }

        if ($this->can('manage-blog')) {
            return 'crm.blogs.index';
        }

        if ($this->can('manage-employees')) {
            return 'crm.employees.index';
        }

        if ($this->can('manage-settings')) {
            return 'crm.settings.general';
        }

        return 'crm.profile.index';
    }
}
