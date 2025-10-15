"use server";

import { db } from "@/db/drizzle";
import { Customer, customer } from "@/db/schema";
import { CreateCustomerInput, CreateCustomerSchema } from "@/lib/validations/customer";
import { eq } from "drizzle-orm";
import z from "zod";
import { getCurrentUser } from "./users";
import { getActiveOrganization } from "./organizations";

// Implement search and pagination
export async function getCustomers() {
    try {
        const allCustomers = await db.select().from(customer);
        return allCustomers;
    } catch (error) {
        console.error(error);
        throw error
    }
}

// Implement search and pagination
export async function getSingleCustomer(id: string) {
    try {
        const [newCustomer] = await db.select()
            .from(customer)
            .where(eq(customer.id, id))
            .limit(1);

        if (!newCustomer) {
            throw new Error('Customer not found');
        }

        return newCustomer;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw error;
    }
}

export async function createCustomer(data: CreateCustomerInput) {
    try {

        const { currentUser } = await getCurrentUser();

        const validatedData = CreateCustomerSchema.parse(data);

        // Préparer les données pour l'insertion
        const customerData = {
            id: crypto.randomUUID(),
            ncc: validatedData.ncc,
            commercialRegister: validatedData.commercialRegister || null,
            taxIdentificationNumber: validatedData.taxIdentificationNumber || null,
            legalName: validatedData.legalName,
            acronym: validatedData.acronym || null,
            legalForm: validatedData.legalForm,
            activityStartDate: validatedData.activityStartDate,
            manager: validatedData.manager,
            mainActivity: validatedData.mainActivity,
            secondaryActivity: validatedData.secondaryActivity || null,
            salaryRegime: validatedData.salaryRegime,
            taxRegime: validatedData.taxRegime,
            fiscalYearStart: validatedData.fiscalYearStart,
            fiscalYearEnd: validatedData.fiscalYearEnd,
            city: validatedData.city,
            municipality: validatedData.municipality,
            district: validatedData.district || null,
            street: validatedData.street || null,
            plot: validatedData.plot || null,
            section: validatedData.section || null,
            block: validatedData.block || null,
            lot: validatedData.lot || null,
            regionalDirectorate: validatedData.regionalDirectorate || null,
            cdi: validatedData.cdi || null,
            postalBox: validatedData.postalBox || null,
            phone: validatedData.phone || "",
            email: validatedData.email || null,
            bank: validatedData.bank || null,
            bankBranch: validatedData.bankBranch || null,
            accountNumber: validatedData.accountNumber || null,
            organizationId: validatedData.organizationId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
        };


        const [newCustomer] = await db.insert(customer).values(customerData).returning();

        return {
            success: true,
            data: newCustomer,
            message: "Client créé avec succès"
        };

    } catch (error) {
        console.error(error);
        return { error: "Failed to create customer" };
    }
}

export async function updateCustomer(id: string, data: Partial<CreateCustomerInput>) {
    try {

        const { currentUser } = await getCurrentUser();

        const activeOrganization = await getActiveOrganization(currentUser.id);


        const UpdateCustomerSchema = CreateCustomerSchema.partial();
        const validatedData = UpdateCustomerSchema.parse(data);

        // Filtrer les champs undefined et ajouter updatedAt
        const updateData = {
            ...validatedData,
            createdBy: currentUser.id,
            organizationId: activeOrganization?.id,
            updatedAt: new Date(),
        };

        console.log(updateData);

        // Vérifier s'il y a des données à mettre à jour (plus que updatedAt)
        const hasDataToUpdate = Object.keys(validatedData).length > 0;

        if (!hasDataToUpdate) {
            return {
                success: false,
                message: "Aucune donnée valide à mettre à jour"
            };
        }

        const [updatedCustomer] = await db.update(customer)
            .set(updateData)
            .where(eq(customer.id, id))
            .returning();

        if (!updatedCustomer) {
            return {
                success: false,
                message: "Client non trouvé"
            };
        }

        return {
            success: true,
            data: updatedCustomer,
            message: "Client mis à jour avec succès"
        };

    } catch (error) {
        console.error("Error updating customer:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Données de validation invalides",
                details: error.flatten()
            };
        }

        return {
            success: false,
            error: "Échec de la mise à jour du client"
        };
    }
}

export async function deleteCustomer(id: string) {
    try {
        await db.delete(customer).where(eq(customer.id, id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete customer" };
    }
}


// Your update function would look like this:
export async function updateCourseField(id: string, fieldName: string, value: any) {
    try {
        // Validate that the fieldName exists in the courses table schema
        const validFields = Object.keys(customer);
        if (!validFields.includes(fieldName)) {
            return { success: false, error: "Invalid field name" };
        }

        // Create update object with dynamic field name
        const updateData = {
            [fieldName]: value,
            updatedAt: new Date(), // Optionally update timestamp
        };

        // Execute update query
        const result = await db
            .update(customer)
            .set(updateData)
            .where(eq(customer.id, id));

        // Check if the update was successful
        // In Drizzle, result contains the number of affected rows
        if (result.rowCount && result.rowCount > 0) {
            return { success: true };
        } else {
            return { success: false, error: "Course not found or no changes made" };
        }
    } catch (error) {
        console.error("Error updating course field:", error);
        return { success: false, error: "Failed to update course" };
    }
}