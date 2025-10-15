import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, integer, timestamp, varchar, date } from "drizzle-orm/pg-core";

// Enums
export const salaryRegimeEnum = pgEnum('salary_regime', ['general', 'agricultural']);
export const legalFormEnum = pgEnum('legal_form', [
  'sarl', 'sa', 'sasu', 'sas', 'eurl', 'individual', 'sole_proprietorship', 'other'
]);
export const taxRegimeEnum = pgEnum('tax_regime', [
  'normal_real', 'simplified_real', 'micro', 'other'
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'canceled', 'incomplete', 'past_due', 'trialing'
]);


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").default("incomplete"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  seats: integer("seats"),
  // Link to organization for organization subscriptions
  organizationId: text('organization_id').references(() => organization.id),
  // Link to user for personal subscriptions
  userId: text('user_id').references(() => user.id),
});


export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  activeOrganizationId: text('active_organization_id')
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const organization = pgTable("organization", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata')
});


export type Organization = typeof organization.$inferSelect;

export const role = pgEnum("role", ["member", "admin", "owner", "super_admin"]);

export type Role = (typeof role.enumValues)[number];

export const member = pgTable("member", {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: role('role').default("member").notNull(),
  createdAt: timestamp('created_at').notNull()
});



export type Member = typeof member.$inferSelect & {
  user: typeof user.$inferSelect;
};

export type User = typeof user.$inferSelect;

export const invitation = pgTable("invitation", {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').default("pending").notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

// customers table (new - for accounting entities)
export const customer = pgTable('customer', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // Unique identifiers
  ncc: varchar('ncc', { length: 7 }).unique().notNull(), // 7-digit alphanumeric
  commercialRegister: text('commercial_register'),
  taxIdentificationNumber: text('tax_identification_number'),
  
  // General information
  legalName: text('legal_name').notNull(),
  acronym: varchar('acronym', { length: 50 }),
  legalForm: legalFormEnum('legal_form').notNull(),
  activityStartDate: date('activity_start_date').notNull(),
  manager: text('manager').notNull(),
  
  // Activities
  mainActivity: text('main_activity').notNull(),
  secondaryActivity: text('secondary_activity'),
  
  // Regimes
  salaryRegime: salaryRegimeEnum('salary_regime').notNull(),
  taxRegime: taxRegimeEnum('tax_regime').notNull(),
  
  // Current accounting period
  fiscalYearStart: date('fiscal_year_start').notNull(),
  fiscalYearEnd: date('fiscal_year_end').notNull(),
  
  // Physical address
  city: text('city').notNull(),
  municipality: text('municipality').notNull(),
  district: text('district'),
  street: text('street'),
  plot: varchar('plot', { length: 20 }),
  section: varchar('section', { length: 20 }),
  block: varchar('block', { length: 20 }),
  lot: varchar('lot', { length: 20 }),
  
  // Administrative address
  regionalDirectorate: text('regional_directorate'),
  cdi: text('cdi'),
  postalBox: varchar('postal_box', { length: 20 }),
  
  // Contact information
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  
  // Banking information
  bank: text('bank'),
  bankBranch: text('bank_branch'),
  accountNumber: varchar('account_number', { length: 50 }),
  
  // Relationships
  organizationId: text('organization_id').references(() => organization.id, { onDelete: 'cascade' }),
  createdBy: text('created_by').references(() => user.id),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

export type Customer = typeof customer.$inferSelect;

// Accounting periods table
export const accountingPeriod = pgTable('accounting_period', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text('company_id').references(() => customer.id, { onDelete: 'cascade' }).notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  status: varchar('status', { length: 20 }).default('active'), // active, closed, archived
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Documents table
export const document = pgTable('document', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text('company_id').references(() => customer.id, { onDelete: 'cascade' }).notNull(),
  organizationId: text('organization_id').references(() => organization.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // balance_sheet, income_statement, etc.
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedBy: text('uploaded_by').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const customerRelations = relations(customer, ({ one, many }) => ({
  organization: one(organization, {
    fields: [customer.organizationId],
    references: [organization.id]
  }),
  creator: one(user, {
    fields: [customer.createdBy],
    references: [user.id]
  }),
  accountingPeriods: many(accountingPeriod),
  documents: many(document),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  customers: many(customer),
  subscriptions: many(subscription),
  documents: many(document),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id]
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id]
  })
}));

export const accountingPeriodRelations = relations(accountingPeriod, ({ one }) => ({
  company: one(customer, {
    fields: [accountingPeriod.companyId],
    references: [customer.id]
  }),
}));

export const documentsRelations = relations(document, ({ one }) => ({
  company: one(customer, {
    fields: [document.companyId],
    references: [customer.id]
  }),
  organization: one(organization, {
    fields: [document.organizationId],
    references: [organization.id]
  }),
  uploader: one(user, {
    fields: [document.uploadedBy],
    references: [user.id]
  }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  organization: one(organization, {
    fields: [subscription.organizationId],
    references: [organization.id]
  }),
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id]
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  members: many(member),
  customer: many(customer),
  documents: many(document),
  subscriptions: many(subscription),
}));

export const schema = { 
  user, 
  session, 
  account, 
  verification, 
  organization, 
  member, 
  invitation, 
  subscription,
  customer,
  accountingPeriod,
  document,
  // Relations
  customerRelations,
  organizationRelations, 
  memberRelations,
  accountingPeriodRelations,
  documentsRelations,
  subscriptionRelations,
  userRelations
};