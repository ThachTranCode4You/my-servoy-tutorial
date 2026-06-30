/**
 * @type {Number}
 *
 * @properties={"typeid":35,"uuid":"4CA9ABE4-5CDA-4C0F-9A1A-79BFD0A7F557","variableType":8}
 */
var tenantsCount = 0;

/**
 * @type {Number}
 *
 * @properties={"typeid":35,"uuid":"97932255-E9E2-4A23-9134-1805FDFFABB2","variableType":4}
 */
var userCountTotal = 0;

/**
 * @type {Number}
 *
 * @properties={"typeid":35,"uuid":"D0EF047F-EE4B-4F49-9B90-C1ECFFC5E3AD","variableType":4}
 */
var sessionCount = 0;

/**
 * @private 
 * @properties={typeid:24,uuid:"C3BB5A2E-0014-4C13-9F8D-6A38C73184DB"}
 */
function updateTenantCount(){
	var q = datasources.db.svy_security.tenants.createSelect();
	q.result.add(q.columns.tenant_name.count);
	tenantsCount = databaseManager.getDataSetByQuery(q,1).getValue(1,1);
}

/**
 * @private 
 * @properties={typeid:24,uuid:"F42FAC81-3BF8-4A77-A01F-208CA702BD16"}
 */
function updateUserCount(){
	var q = datasources.db.svy_security.users.createSelect();
	q.result.add(q.columns.user_name.count);
	userCountTotal = databaseManager.getDataSetByQuery(q,1).getValue(1,1);
}

/**
 * @private 
 * @properties={typeid:24,uuid:"B3258A7C-1CC7-4239-8249-ADDC43271EF7"}
 */
function updateSessionCount(){
	var timeout = 30 * 60 * 1000; // 30 minutes
	var expiration = new Date();
	expiration.setTime(expiration.getTime() - timeout);
	var q = datasources.db.svy_security.sessions.createSelect();
	q.result.add(q.columns.id.count);
	q.where
		.add(q.columns.session_end.isNull)
		.add(q.columns.last_client_ping.gt(expiration))
	sessionCount = databaseManager.getDataSetByQuery(q,1).getValue(1,1);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EAF7A234-6C6C-42E1-96A7-8CE67E66CB41"}
 */
function onShow(firstShow, event) {
	updateTenantCount();
	updateUserCount();
	updateSessionCount();
	scopes.svySecurityUXCharts.createChartTenantsWithMostUsers(elements.leftChart);
	scopes.svySecurityUXCharts.createChartTotalUsageOverTimeMonths(elements.rigthChart);
}
