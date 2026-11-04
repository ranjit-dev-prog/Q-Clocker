import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService, TaskItem, CreateTaskPayload } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="space-y-6">
      <!-- Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Task Management Engine</h1>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
              Enterprise
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">Multi-stage Kanban boards, drag-and-drop status workflows, and time tracking</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- View Switcher -->
          <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              (click)="activeView.set('kanban')"
              [ngClass]="activeView() === 'kanban' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <span class="material-icons text-sm">view_kanban</span>
              Kanban
            </button>
            <button
              (click)="activeView.set('list')"
              [ngClass]="activeView() === 'list' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <span class="material-icons text-sm">format_list_bulleted</span>
              List
            </button>
          </div>

          <button
            (click)="showCreateModal.set(true)"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span class="material-icons text-base">add</span>
            New Task
          </button>
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div *ngIf="taskService.kanban() as k" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</div>
          <div class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ k.stats.total }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Backlog</div>
          <div class="text-xl font-bold text-slate-700 dark:text-slate-200 mt-1">{{ k.stats.backlogCount }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">In Progress</div>
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ k.stats.inProgressCount }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-purple-500 uppercase tracking-wider">Under Review</div>
          <div class="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ k.stats.reviewCount }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Completed</div>
          <div class="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ k.stats.completedCount }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Overdue</div>
          <div class="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{{ k.stats.overdueCount }}</div>
        </div>
      </div>

      <!-- KANBAN VIEW -->
      <div *ngIf="activeView() === 'kanban'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" cdkDropListGroup>
        
        <!-- COLUMN 1: BACKLOG -->
        <div class="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800 flex flex-col min-h-[500px]">
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Backlog & Assigned</span>
            </div>
            <span class="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-xs">
              {{ backlogTasks.length }}
            </span>
          </div>

          <div
            cdkDropList
            [cdkDropListData]="backlogTasks"
            (cdkDropListDropped)="drop($event, 'ASSIGNED')"
            class="space-y-3 flex-1 overflow-y-auto max-h-[720px] p-1"
          >
            <div
              *ngFor="let task of backlogTasks"
              cdkDrag
              (click)="openDetails(task)"
              class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-mono font-bold text-slate-400">{{ task.referenceId }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getPriorityClass(task.priority)">
                  {{ task.priority }}
                </span>
              </div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition leading-snug">
                {{ task.title }}
              </h4>
              <p *ngIf="task.description" class="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {{ task.description }}
              </p>
              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span class="flex items-center gap-1">
                  <span class="material-icons text-xs">category</span>
                  {{ task.category }}
                </span>
                <span class="font-mono">{{ task.estimatedHours }}h est</span>
              </div>
            </div>
            <div *ngIf="backlogTasks.length === 0" class="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              Drag tasks here
            </div>
          </div>
        </div>

        <!-- COLUMN 2: IN PROGRESS -->
        <div class="bg-blue-50/40 dark:bg-slate-900/60 rounded-2xl p-3.5 border border-blue-100/60 dark:border-slate-800 flex flex-col min-h-[500px]">
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-blue-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">In Progress</span>
            </div>
            <span class="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs">
              {{ inProgressTasks.length }}
            </span>
          </div>

          <div
            cdkDropList
            [cdkDropListData]="inProgressTasks"
            (cdkDropListDropped)="drop($event, 'IN_PROGRESS')"
            class="space-y-3 flex-1 overflow-y-auto max-h-[720px] p-1"
          >
            <div
              *ngFor="let task of inProgressTasks"
              cdkDrag
              (click)="openDetails(task)"
              class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-mono font-bold text-slate-400">{{ task.referenceId }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getPriorityClass(task.priority)">
                  {{ task.priority }}
                </span>
              </div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                {{ task.title }}
              </h4>
              <!-- Progress Bar -->
              <div class="mt-2.5">
                <div class="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                  <span>Progress</span>
                  <span class="text-blue-600 dark:text-blue-400">{{ task.completionPercentage }}%</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full transition-all" [style.width.%]="task.completionPercentage"></div>
                </div>
              </div>
              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span class="flex items-center gap-1">
                  <span class="material-icons text-xs">person</span>
                  {{ task.assignedEmployeeName || 'Assigned' }}
                </span>
                <span class="font-mono text-blue-600 dark:text-blue-400">{{ task.actualHours || 0 }}h / {{ task.estimatedHours }}h</span>
              </div>
            </div>
            <div *ngIf="inProgressTasks.length === 0" class="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              Drag tasks here
            </div>
          </div>
        </div>

        <!-- COLUMN 3: PENDING REVIEW -->
        <div class="bg-purple-50/40 dark:bg-slate-900/60 rounded-2xl p-3.5 border border-purple-100/60 dark:border-slate-800 flex flex-col min-h-[500px]">
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-purple-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Under Review</span>
            </div>
            <span class="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-xs">
              {{ reviewTasks.length }}
            </span>
          </div>

          <div
            cdkDropList
            [cdkDropListData]="reviewTasks"
            (cdkDropListDropped)="drop($event, 'PENDING_REVIEW')"
            class="space-y-3 flex-1 overflow-y-auto max-h-[720px] p-1"
          >
            <div
              *ngFor="let task of reviewTasks"
              cdkDrag
              (click)="openDetails(task)"
              class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-mono font-bold text-slate-400">{{ task.referenceId }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getPriorityClass(task.priority)">
                  {{ task.priority }}
                </span>
              </div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition leading-snug">
                {{ task.title }}
              </h4>
              <p *ngIf="task.description" class="text-[11px] text-slate-500 line-clamp-2 mt-1">
                {{ task.description }}
              </p>
              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span class="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                  <span class="material-icons text-xs">rate_review</span>
                  Awaiting Approval
                </span>
                <span class="font-mono">{{ task.actualHours }}h</span>
              </div>
            </div>
            <div *ngIf="reviewTasks.length === 0" class="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              Drag tasks here
            </div>
          </div>
        </div>

        <!-- COLUMN 4: COMPLETED -->
        <div class="bg-emerald-50/40 dark:bg-slate-900/60 rounded-2xl p-3.5 border border-emerald-100/60 dark:border-slate-800 flex flex-col min-h-[500px]">
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-emerald-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Completed</span>
            </div>
            <span class="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs">
              {{ completedTasks.length }}
            </span>
          </div>

          <div
            cdkDropList
            [cdkDropListData]="completedTasks"
            (cdkDropListDropped)="drop($event, 'COMPLETED')"
            class="space-y-3 flex-1 overflow-y-auto max-h-[720px] p-1"
          >
            <div
              *ngFor="let task of completedTasks"
              cdkDrag
              (click)="openDetails(task)"
              class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:shadow-md transition cursor-pointer group opacity-90"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-mono font-bold text-slate-400">{{ task.referenceId }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Done
                </span>
              </div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white line-through decoration-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                {{ task.title }}
              </h4>
              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span class="material-icons text-xs">check_circle</span>
                  100% Complete
                </span>
                <span class="font-mono">{{ task.actualHours }}h logged</span>
              </div>
            </div>
            <div *ngIf="completedTasks.length === 0" class="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              Drag tasks here
            </div>
          </div>
        </div>

      </div>

      <!-- LIST VIEW -->
      <div *ngIf="activeView() === 'list'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Task ID & Title</th>
                <th class="py-3 px-4">Assignee</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Due Date</th>
                <th class="py-3 px-4">Est / Actual</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let task of taskService.tasks()" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900 dark:text-white">{{ task.title }}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{{ task.referenceId }} • {{ task.category }}</div>
                </td>
                <td class="py-3 px-4">{{ task.assignedEmployeeName || 'Unassigned' }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getStatusClass(task.status)">
                    {{ task.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span [ngClass]="task.isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : ''">
                    {{ task.dueDate | date:'mediumDate' }}
                  </span>
                </td>
                <td class="py-3 px-4 font-mono">{{ task.estimatedHours }}h / {{ task.actualHours }}h</td>
                <td class="py-3 px-4 text-right">
                  <button
                    (click)="openDetails(task)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CREATE TASK MODAL -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Create Enterprise Task</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                [(ngModel)]="newTaskTitle"
                placeholder="e.g., Configure Production Load Balancer"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                [(ngModel)]="newTaskDesc"
                rows="3"
                placeholder="Detailed objectives and acceptance criteria..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  [(ngModel)]="newTaskPriority"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  [(ngModel)]="newTaskCategory"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Development">Development</option>
                  <option value="Security">Security</option>
                  <option value="Operations">Operations</option>
                  <option value="Frontend">Frontend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="task-start-date" class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                <input
                  id="task-start-date"
                  type="date"
                  aria-label="Task Start Date"
                  [(ngModel)]="newTaskStartDate"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label for="task-due-date" class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input
                  id="task-due-date"
                  type="date"
                  aria-label="Task Due Date"
                  [(ngModel)]="newTaskDueDate"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label for="task-est-hours" class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Hours</label>
              <input
                id="task-est-hours"
                type="number"
                aria-label="Estimated Hours"
                placeholder="4"
                [(ngModel)]="newTaskEstHours"
                min="0.5"
                step="0.5"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label for="task-lead-assignee" class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Assignee</label>
              <select
                id="task-lead-assignee"
                [(ngModel)]="newLeadAssigneeId"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="">Self / Unassigned</option>
                <option *ngFor="let emp of employeeService.employees()" [value]="emp.id">
                  {{ emp.firstName }} {{ emp.lastName }} ({{ emp.roleCode }})
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="showCreateModal.set(false)"
              class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              [disabled]="!newTaskTitle.trim() || isSubmitting()"
              (click)="submitCreateTask()"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              {{ isSubmitting() ? 'Creating...' : 'Create Task' }}
            </button>
          </div>
        </div>
      </div>

      <!-- TASK DETAILS MODAL -->
      <div *ngIf="showDetailsModal() && selectedTaskDetail()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">{{ selectedTaskDetail().referenceId }}</span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{{ selectedTaskDetail().title }}</h3>
            </div>
            <button (click)="showDetailsModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <!-- Metadata Badges -->
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-lg font-bold uppercase" [ngClass]="getPriorityClass(selectedTaskDetail().priority)">
              Priority: {{ selectedTaskDetail().priority }}
            </span>
            <span class="px-2.5 py-1 rounded-lg font-bold uppercase" [ngClass]="getStatusClass(selectedTaskDetail().status)">
              Status: {{ selectedTaskDetail().status.replace('_', ' ') }}
            </span>
            <span class="px-2.5 py-1 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {{ selectedTaskDetail().category }}
            </span>
          </div>

          <div *ngIf="selectedTaskDetail().description" class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            {{ selectedTaskDetail().description }}
          </div>

          <!-- Comments & Timeline Section -->
          <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Activity & Comments</h4>

            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div
                *ngFor="let comment of selectedTaskDetail().comments"
                class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 dark:text-white">{{ comment.authorFirstName }} {{ comment.authorLastName }}</span>
                  <span class="text-[10px] text-slate-400">{{ comment.createdAt | date:'short' }}</span>
                </div>
                <p class="text-slate-600 dark:text-slate-300">{{ comment.comment }}</p>
              </div>
              <div *ngIf="!selectedTaskDetail().comments || selectedTaskDetail().comments.length === 0" class="text-xs text-slate-400 italic">
                No comments yet on this task.
              </div>
            </div>

            <!-- Add Comment Input -->
            <div class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="newCommentText"
                placeholder="Write a comment or status update..."
                class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                (keyup.enter)="submitComment()"
              />
              <button
                [disabled]="!newCommentText.trim()"
                (click)="submitComment()"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class TasksComponent implements OnInit {
  taskService = inject(TaskService);
  authService = inject(AuthService);
  employeeService = inject(EmployeeService);

  activeView = signal<'kanban' | 'list'>('kanban');
  showCreateModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  selectedTaskDetail = signal<any | null>(null);

  // Kanban column local arrays
  backlogTasks: TaskItem[] = [];
  inProgressTasks: TaskItem[] = [];
  reviewTasks: TaskItem[] = [];
  completedTasks: TaskItem[] = [];

  // Form bindings
  newTaskTitle = '';
  newTaskDesc = '';
  newTaskPriority = 'MEDIUM';
  newTaskCategory = 'Development';
  newTaskStartDate = new Date().toISOString().substring(0, 10);
  newTaskDueDate = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().substring(0, 10);
  newTaskEstHours = 4;
  newLeadAssigneeId = '';
  newCommentText = '';

  ngOnInit() {
    this.refreshKanban();
  }

  refreshKanban() {
    this.taskService.loadKanban().subscribe(() => {
      const k = this.taskService.kanban();
      if (k) {
        this.backlogTasks = [...(k.backlog || [])];
        this.inProgressTasks = [...(k.inProgress || [])];
        this.reviewTasks = [...(k.review || [])];
        this.completedTasks = [...(k.completed || [])];
      }
    });
  }

  drop(event: CdkDragDrop<TaskItem[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedItem = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Persist status change to backend
      const progress = targetStatus === 'COMPLETED' ? 100 : targetStatus === 'PENDING_REVIEW' ? 90 : 30;
      this.taskService.updateTaskStatus(movedItem.id, targetStatus, progress).subscribe({
        error: () => {
          // Revert on error
          this.refreshKanban();
        },
      });
    }
  }

  openDetails(task: TaskItem) {
    this.taskService.getTaskDetails(task.id).subscribe((res) => {
      this.selectedTaskDetail.set(res.data);
      this.showDetailsModal.set(true);
    });
  }

  submitCreateTask() {
    if (!this.newTaskTitle.trim()) return;
    this.isSubmitting.set(true);

    const payload: CreateTaskPayload = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDesc.trim() || undefined,
      priority: this.newTaskPriority,
      category: this.newTaskCategory,
      startDate: new Date(this.newTaskStartDate).toISOString(),
      dueDate: new Date(this.newTaskDueDate).toISOString(),
      estimatedHours: this.newTaskEstHours,
      assignedEmployeeId: this.newLeadAssigneeId || undefined,
      status: 'ASSIGNED',
    };

    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.newTaskTitle = '';
        this.newTaskDesc = '';
        this.refreshKanban();
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  submitComment() {
    if (!this.newCommentText.trim() || !this.selectedTaskDetail()) return;
    const taskId = this.selectedTaskDetail().id;
    this.taskService.addComment(taskId, this.newCommentText.trim()).subscribe(() => {
      this.newCommentText = '';
      this.taskService.getTaskDetails(taskId).subscribe((res) => {
        this.selectedTaskDetail.set(res.data);
      });
    });
  }

  getPriorityClass(p: string): string {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      case 'HIGH':
      case 'URGENT': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }

  getStatusClass(s: string): string {
    switch (s) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      case 'PENDING_REVIEW': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      case 'REJECTED': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }
}
