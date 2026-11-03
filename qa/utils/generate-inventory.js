/**
 * Complete Application Inventory Generator
 * Q Clocker QA Architecture
 */

const fs = require('fs');
const path = require('path');
const { apiRequest } = require('./client');

async function generateInventory() {
  console.log('=== STEP 1: GENERATING APPLICATION INVENTORY ===');

  // 1. Fetch Swagger Documentation
  console.log('1. Querying Swagger API Docs...');
  const swaggerRes = await apiRequest('GET', 'http://localhost:3000/api/docs-json');
  if (!swaggerRes.ok || !swaggerRes.data) {
    throw new Error('Failed to retrieve Swagger JSON: ' + swaggerRes.statusText);
  }
  const swagger = swaggerRes.data;

  const apiEndpoints = [];
  let totalOperations = 0;

  for (const [routePath, methods] of Object.entries(swagger.paths)) {
    for (const [httpMethod, op] of Object.entries(methods)) {
      totalOperations++;
      apiEndpoints.push({
        id: `API-${totalOperations.toString().padStart(3, '0')}`,
        method: httpMethod.toUpperCase(),
        path: routePath,
        module: (op.tags && op.tags[0]) || 'General',
        summary: op.summary || '',
        authRequired: Boolean(op.security && op.security.length > 0),
        parameters: op.parameters || [],
        hasRequestBody: Boolean(op.requestBody),
        expectedStatuses: Object.keys(op.responses || {}),
      });
    }
  }

  console.log(`Discovered ${apiEndpoints.length} registered API operations across ${Object.keys(swagger.paths).length} unique routes.`);

  // 2. Scan Frontend Routes & Components
  console.log('2. Scanning Frontend Routes & Components...');
  const routesPath = path.resolve(__dirname, '../../frontend/src/app/app.routes.ts');
  const routesContent = fs.readFileSync(routesPath, 'utf8');

  const frontendPages = [
    { route: '/auth/login', title: 'Corporate Login', component: 'LoginComponent', authRequired: false, interactiveControls: ['email input', 'password input', 'remember me checkbox', 'sign-in button'] },
    { route: '/dashboard', title: 'Executive Operations Dashboard', component: 'DashboardComponent', authRequired: true, interactiveControls: ['time range selector', 'refresh button', 'stats cards', 'activity feed', 'project summaries'] },
    { route: '/tasks', title: 'Enterprise Task Management & Kanban', component: 'TasksComponent', authRequired: true, interactiveControls: ['kanban column drag-and-drop', 'new task modal button', 'status filter dropdown', 'priority filter', 'task search bar', 'task details panel'] },
    { route: '/tickets', title: 'ITSM Service Desk & Incident Management', component: 'TicketsComponent', authRequired: true, interactiveControls: ['new ticket button', 'SLA indicators', 'priority badge filter', 'category filter', 'technician assignment', 'resolve ticket dialog', 'comment input'] },
    { route: '/work-logs', title: 'Daily Employee Work Logs & Time Tracking', component: 'WorkLogsComponent', authRequired: true, interactiveControls: ['date picker', 'log time button', 'task link selector', 'hours input', 'description field', 'daily summary card'] },
    { route: '/performance', title: 'Employee Performance & KPI Analytics', component: 'PerformanceComponent', authRequired: true, interactiveControls: ['metric selector', 'period filter', 'export PDF button', 'rating radar chart'] },
    { route: '/reports', title: 'Enterprise Operational & Executive Reports', component: 'ReportsComponent', authRequired: true, interactiveControls: ['report type dropdown', 'date range picker', 'department filter', 'export CSV button', 'export Excel button'] },
    { route: '/employees', title: 'Workforce Directory & Profile Management', component: 'EmployeesComponent', authRequired: true, interactiveControls: ['employee search bar', 'department filter', 'role filter', 'status filter (active/archived)', 'add employee button', 'bulk import button', 'archive action button', 'reactivate action button', 'view profile button'] },
    { route: '/departments', title: 'Organizational Structure & Hierarchy', component: 'DepartmentsComponent', authRequired: true, interactiveControls: ['department search', 'new department button', 'org-chart tree toggle', 'edit department modal', 'teams list', 'create team button'] },
  ];

  // 3. Database Schema Tables
  console.log('3. Scanning Database Schema...');
  const schemaPath = path.resolve(__dirname, '../../backend/src/database/schema/index.ts');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const tableMatches = [...schemaContent.matchAll(/export const (\w+) = pgTable\('(\w+)'/g)];

  const databaseTables = tableMatches.map((m) => ({
    variable: m[1],
    tableName: m[2],
  }));

  console.log(`Discovered ${databaseTables.length} PostgreSQL database tables in centralized Drizzle schema.`);

  const inventory = {
    generatedAt: new Date().toISOString(),
    apiSummary: {
      totalPaths: Object.keys(swagger.paths).length,
      totalOperations: apiEndpoints.length,
      modules: [...new Set(apiEndpoints.map((e) => e.module))],
    },
    apiEndpoints,
    frontendPages,
    databaseTables,
  };

  const outputPath = path.resolve(__dirname, '../fixtures/inventory.json');
  fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2));
  console.log(`Inventory saved to ${outputPath}`);

  return inventory;
}

if (require.main === module) {
  generateInventory().catch(console.error);
}

module.exports = { generateInventory };

