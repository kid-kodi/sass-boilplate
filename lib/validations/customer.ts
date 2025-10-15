// lib/validations/customer.ts
import { z } from 'zod';

// Enums pour la validation
export const LegalFormEnum = z.enum(['sarl', 'sa', 'sasu', 'sas', 'eurl', 'individual', 'sole_proprietorship', 'other']);
export const SalaryRegimeEnum = z.enum(['general', 'agricultural']);
export const TaxRegimeEnum = z.enum(['normal_real', 'simplified_real', 'micro', 'other']);

// Validations réutilisables
const nccSchema = z.string()
  .min(1, "NCC is required")
  .length(7, 'NCC must be exactly 7 characters')
  .regex(/^[A-Z0-9]+$/, 'NCC must be alphanumeric uppercase')
  .transform(val => val.toUpperCase());

const dateSchema = z.string()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine(val => !isNaN(new Date(val).getTime()), 'Invalid date');

const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .optional()
  .or(z.literal(''));

const emailSchema = z.string()
  .email('Invalid email address')
  .optional()
  .or(z.literal(''));

// Schema principal pour la création
export const CreateCustomerSchema = z.object({
  // Unique identifiers
  ncc: nccSchema,
  commercialRegister: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),

  // General information
  legalName: z.string().min(1, 'Legal name is required').max(255),
  acronym: z.string().max(50).optional(),
  legalForm: LegalFormEnum,
  activityStartDate: dateSchema,
  manager: z.string().min(1, 'Manager is required').max(255),

  // Activities
  mainActivity: z.string().min(1, 'Main activity is required'),
  secondaryActivity: z.string().optional(),

  // Regimes
  salaryRegime: SalaryRegimeEnum,
  taxRegime: TaxRegimeEnum,

  // Current accounting period
  fiscalYearStart: dateSchema,
  fiscalYearEnd: dateSchema,

  // Physical address
  city: z.string().min(1, 'City is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  district: z.string().optional(),
  street: z.string().optional(),
  plot: z.string().max(20).optional(),
  section: z.string().max(20).optional(),
  block: z.string().max(20).optional(),
  lot: z.string().max(20).optional(),

  // Administrative address
  regionalDirectorate: z.string().optional(),
  cdi: z.string().optional(),
  postalBox: z.string().max(20).optional(),

  // Contact information
  phone: phoneSchema,
  email: emailSchema,

  // Banking information
  bank: z.string().optional(),
  bankBranch: z.string().optional(),
  accountNumber: z.string().max(50).optional(),

  // Relationships
  organizationId: z.string().optional().or(z.literal('')),
}).refine(
  (data) => new Date(data.fiscalYearStart) <= new Date(data.fiscalYearEnd),
  {
    message: "Fiscal year start must be before or equal to end",
    path: ["fiscalYearStart"],
  }
).refine(
  (data) => new Date(data.activityStartDate) <= new Date(data.fiscalYearStart),
  {
    message: "Activity start date must be before fiscal year start",
    path: ["activityStartDate"],
  }
);

// Types
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type LegalForm = z.infer<typeof LegalFormEnum>;
export type SalaryRegime = z.infer<typeof SalaryRegimeEnum>;
export type TaxRegime = z.infer<typeof TaxRegimeEnum>;