import type { bankDB } from '$lib/types/customTypes';
import { NDG_RequisitionStatus, type NDG_Requisition } from '$lib/types/nordigen';

type bankStatus = bankDB['Row']['status'];
type params = {
	requisition: NDG_Requisition;
	redirectError?: string | null;
	redirectErrorDetails?: string | null;
};

/**
 * --- Status meaning ---
 * Created : Mean that bank is not connected yet. Maybe some connections were tried but it didn’t get any critical error
 * Reset: Same as created, but bank is being reset. Two requisitions are used, one past, one new.
 * Linked: Requisition has no critical error and (accounts can be listed OR requisition status is LN)
 * Error: Requisition must be reset
 */
export function getStatusOfRequisition(p: params): bankStatus | null {
	const requisition = { ...p.requisition };
	const hasAccounts = requisition.accounts.length > 0;
	const isLinked = requisition.status === NDG_RequisitionStatus.LINKED;
	const hasCriticalStatus = [
		NDG_RequisitionStatus.EXPIRED,
		NDG_RequisitionStatus.REJECTED,
		NDG_RequisitionStatus.SUSPENDED
	].includes(requisition.status);
	const hasRedirectError = Boolean(p.redirectError || p.redirectErrorDetails);

	if (hasCriticalStatus) return 'error';
	if (isLinked && !hasRedirectError) return 'linked';
	if (hasAccounts) return 'linked';
	return null;
}
