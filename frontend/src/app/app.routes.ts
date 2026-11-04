import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./features/tickets/tickets.component').then((m) => m.TicketsComponent),
      },
      {
        path: 'work-logs',
        loadComponent: () =>
          import('./features/work-logs/work-logs.component').then((m) => m.WorkLogsComponent),
      },
      {
        path: 'performance',
        loadComponent: () =>
          import('./features/performance/performance.component').then(
            (m) => m.PerformanceComponent,
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: {
          roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'IT_MANAGER', 'AUDITOR'],
        },
        loadComponent: () =>
          import('./features/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'employees',
        canActivate: [roleGuard],
        data: {
          roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'HR_ADMINISTRATOR', 'TEAM_LEAD', 'AUDITOR'],
        },
        loadComponent: () =>
          import('./features/employees/employees.component').then((m) => m.EmployeesComponent),
      },
      {
        path: 'departments',
        canActivate: [roleGuard],
        data: {
          roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'HR_ADMINISTRATOR', 'TEAM_LEAD', 'AUDITOR'],
        },
        loadComponent: () =>
          import('./features/departments/departments.component').then(
            (m) => m.DepartmentsComponent,
          ),
      },
      {
        path: 'admin/roles',
        canActivate: [roleGuard],
        data: {
          roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR'],
        },
        loadComponent: () =>
          import('./features/admin/roles/roles-admin.component').then(
            (m) => m.RolesAdminComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
