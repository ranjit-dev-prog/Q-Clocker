/**
 * Master Enterprise QA Test Suite Runner
 * Q Clocker - Enterprise Workforce & Operations ERP
 */

const fs = require('fs');
const path = require('path');
const { tracker } = require('./utils/client');
const { generateInventory } = require('./utils/generate-inventory');
const { runApiTests } = require('./api/test-apis');
const { runSecurityTests } = require('./security/test-security');
const { runE2EWorkflows } = require('./e2e/test-business-workflows');
const { runDatabaseTests } = require('./database/test-database');
const { runPerformanceTests } = require('./performance/test-performance');
const { runAccessibilityTests } = require('./accessibility/test-ui-accessibility');

async function runMasterSuite() {
  console.log('================================================================');
  console.log('🚀 STARTING FULL ENTERPRISE QA SUITE EXECUTION: Q CLOCKER');
  console.log('================================================================\n');

  const overallStart = performance.now();

  // Step 1: Inventory
  const inventory = await generateInventory();

  // Step 2: API Suite
  console.log('\n>>> RUNNING API AUTOMATION SUITE');
  await runApiTests();

  // Step 3: Security & OWASP Suite
  console.log('\n>>> RUNNING SECURITY & OWASP AUDIT SUITE');
  await runSecurityTests();

  // Step 4: E2E Business Workflows
  console.log('\n>>> RUNNING END-TO-END BUSINESS WORKFLOWS');
  await runE2EWorkflows();

  // Step 5: Database Architecture & Time-Decoupling Suite
  console.log('\n>>> RUNNING DATABASE ARCHITECTURE & INTEGRITY SUITE');
  await runDatabaseTests();

  // Step 6: Performance & Load Benchmarks
  console.log('\n>>> RUNNING PERFORMANCE & LOAD BENCHMARKS');
  await runPerformanceTests();

  // Step 7: Frontend Accessibility & Responsive UI Suite
  console.log('\n>>> RUNNING FRONTEND ACCESSIBILITY & RESPONSIVE UI AUDIT');
  await runAccessibilityTests();

  const totalDurationSeconds = ((performance.now() - overallStart) / 1000).toFixed(2);
  const summary = tracker.getSummary();

  console.log('\n================================================================');
  console.log('🏁 FULL ENTERPRISE QA AUDIT COMPLETE');
  console.log('================================================================');
  console.log(`Total Scenarios Executed: ${summary.total}`);
  console.log(`Passed:                   ${summary.passed}`);
  console.log(`Failed:                   ${summary.failed}`);
  console.log(`Blocked:                  ${summary.blocked}`);
  console.log(`Pass Rate:                ${summary.passRate}`);
  console.log(`Total Duration:           ${totalDurationSeconds}s`);
  console.log('================================================================\n');

  return { summary, inventory, totalDurationSeconds };
}

if (require.main === module) {
  runMasterSuite().catch(console.error);
}

module.exports = { runMasterSuite };
