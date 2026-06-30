/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @properties={typeid:24,uuid:"D1CC12FB-FB89-4067-9802-2500D226AC87"}
 */
function onActionManageTenants(event, dataTarget) {
	// TODO form name can go into ENUM (TO BE DEFINED)
	var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.TENANTS);
	scopes.svyNavigation.open(item);
}
