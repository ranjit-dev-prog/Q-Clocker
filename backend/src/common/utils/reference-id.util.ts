import * as crypto from 'crypto';

/**
 * Enterprise Public Reference ID Generator
 *
 * Generates collision-resistant, cryptographically secure public reference codes
 * using unambiguous uppercase characters (omitting 0, O, 1, I to avoid human transcription errors).
 *
 * Examples:
 * - EMP-7K9X2M (Employee)
 * - DEP-8N4P6Q (Department)
 * - TEM-5R9W2A (Team)
 * - TSK-3X7K8B (Task)
 * - TKT-6M2P9D (Ticket)
 * - TMS-4Q8N5Z (Timesheet)
 * - ATT-9A3K7P (Attendance Event)
 * - FUP-2W6X8C (Follow-up)
 * - APR-5B9M3R (Approval)
 * - WLG-8C4N2X (Work Log)
 * - PRJ-7D5K9P (Project)
 * - AST-3M8Q6W (Asset)
 */

export type EntityPrefix =
  | 'EMP'
  | 'DEP'
  | 'TEM'
  | 'TSK'
  | 'TKT'
  | 'TMS'
  | 'ATT'
  | 'FUP'
  | 'APR'
  | 'WLG'
  | 'PRJ'
  | 'AST'
  | 'SLA'
  | 'SES';

const UNAMBIGUOUS_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateReferenceId(prefix: EntityPrefix, length = 6): string {
  const bytes = crypto.randomBytes(length);
  let randomPart = '';

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % UNAMBIGUOUS_CHARSET.length;
    randomPart += UNAMBIGUOUS_CHARSET[index];
  }

  return `${prefix}-${randomPart}`;
}
