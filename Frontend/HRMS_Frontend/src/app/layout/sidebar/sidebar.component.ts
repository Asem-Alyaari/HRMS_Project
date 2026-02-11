import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, DrawerModule, ButtonModule, RippleModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  layoutService = inject(LayoutService);

  menuItems = [
    { label: 'لوحة التحكم', icon: 'pi pi-objects-column', route: '/dashboard' },
    {
      label: 'الحضور والانصراف',
      icon: 'pi pi-calendar-plus',
      expanded: false,
      children: [
        { label: 'لوحة التحكم', icon: 'pi pi-objects-column', route: '/attendance/dashboard' },
        { label: 'تسجيل بصمة', icon: 'pi pi-clock', route: '/attendance/punch' },
        { label: 'التحضير اليدوي', icon: 'pi pi-file-edit', route: '/attendance/manual' },
        { label: 'سجل الحضور', icon: 'pi pi-list', route: '/attendance/list' },
        { label: 'تقديم طلب', icon: 'pi pi-send', route: '/attendance/requests' },
        { label: 'إدارة المناوبات', icon: 'pi pi-calendar', route: '/attendance/roster' },
        { label: 'إغلاق الشهر', icon: 'pi pi-lock', route: '/attendance/management' }
      ]
    },
    { label: 'الموظفين', icon: 'pi pi-users', route: '/employees' },
    { label: 'الرواتب', icon: 'pi pi-wallet', route: '/payroll' },
    {
      label: 'القروض',
      icon: 'pi pi-money-bill',
      expanded: false,
      children: [
        { label: 'سجل الأقساط', icon: 'pi pi-calendar-clock', route: '/loans/list' },
        { label: 'طلبات المعلقة', icon: 'pi pi-clock', route: '/loans/requests' }
      ]
    },
    {
      label: 'الإجازات',
      icon: 'pi pi-send',
      expanded: false,
      children: [
        { label: 'طلبات الإجازات', icon: 'pi pi-list', route: '/leaves' },
        { label: 'لوحة المعلومات', icon: 'pi pi-objects-column', route: '/leaves/dashboard' },
        { label: 'أرصدة الموظفين', icon: 'pi pi-wallet', route: '/leaves/balances' },
        { label: 'تقارير الإجازات', icon: 'pi pi-file-pdf', route: '/leaves/reports' }
      ]
    },
    {
      label: 'التوظيف',
      icon: 'pi pi-briefcase',
      expanded: false,
      children: [
        { label: 'الوظائف الشاغرة', icon: 'pi pi-list', route: '/recruitment/vacancies' },
        { label: 'طلبات التوظيف', icon: 'pi pi-file-edit', route: '/recruitment/applications' }
      ]
    },
    {
      label: 'الأداء والجزاءات',
      icon: 'pi pi-chart-line',
      expanded: false,
      children: [
        { label: 'سجل المخالفات', icon: 'pi pi-exclamation-triangle', route: '/performance/violations' },
        { label: 'تقييم جديد', icon: 'pi pi-plus-circle', route: '/performance/appraisals/new' },
        { label: 'أنواع المخالفات', icon: 'pi pi-list', route: '/performance/config/violation-types' },
        { label: 'الإجراءات التأديبية', icon: 'pi pi-shield', route: '/performance/config/disciplinary-actions' },
        { label: 'مؤشرات الأداء', icon: 'pi pi-chart-bar', route: '/performance/config/kpis' },
        { label: 'دورات التقييم', icon: 'pi pi-sync', route: '/performance/config/cycles' }
      ]
    },
    { label: 'التقارير', icon: 'pi pi-chart-pie', route: '/reports' },
    {
      label: 'تهيئة النظام',
      icon: 'pi pi-cog',
      expanded: false,
      children: [
        { label: 'تهيئة الدول', icon: 'pi pi-flag', route: '/setup/countries' },
        { label: 'تهيئة المدن', icon: 'pi pi-map-marker', route: '/setup/cities' },
        { label: 'تهيئة البنوك', icon: 'pi pi-building', route: '/setup/banks' },
        { label: 'تهيئة الأقسام', icon: 'pi pi-sitemap', route: '/setup/departments' },
        { label: 'الدرجات الوظيفية', icon: 'pi pi-list', route: '/setup/job-grades' },
        { label: 'الوظائف', icon: 'pi pi-briefcase', route: '/setup/jobs' },
        { label: 'أنواع الوثائق', icon: 'pi pi-file', route: '/setup/document-types' },
        { label: 'أنواع الإجازات', icon: 'pi pi-calendar-times', route: '/setup/leave-types' },
        { label: 'إعدادات الإجازات', icon: 'pi pi-cog', route: '/setup/leave-settings' },
        { label: 'العطل الرسمية', icon: 'pi pi-sun', route: '/setup/public-holidays' },
        { label: 'سياسات الحضور', icon: 'pi pi-clock', route: '/setup/attendance-policies' },
        { label: 'أنواع الورديات', icon: 'pi pi-moon', route: '/setup/shift-types' },
        { label: 'بنود الراتب', icon: 'pi pi-dollar', route: '/setup/payroll-elements' }
      ]
    },
  ];

  toggleSubmenu(item: any) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
