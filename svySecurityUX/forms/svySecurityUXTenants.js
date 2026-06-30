/**
 * @protected 
 * @type {String}
 *
 * @properties={"typeid":35,"uuid":"49AD6498-B0AF-458B-9779-7D8D28265A85"}
 */
var labelAction = null;

/**
 * @protected
 * @type {String}
 *
 * @properties={"typeid":35,"uuid":"F33D39C5-87E2-421D-AEFC-715693FAA4BD"}
 */
var name = null;

/**
 * @protected
 * @type {String}
 * @properties={"typeid":35,"uuid":"BE4CCAD6-3192-44B8-8C78-4193DFD29A0B"}
 */
var target = null;

/**
 * @param {JSRecord<db:/svy_security/tenants>} [recordMaster]
 * @param {Boolean} [makeSubTenant]
 * @public
 *
 * @properties={typeid:24,uuid:"3426CF21-3FD2-4CE5-8659-1C38110EEC07"}
 */
function addNewTenant(recordMaster, makeSubTenant) {
	if (!name) {
		return;
	}
	if (scopes.svySecurity.getTenant(name)) {
		plugins.dialogs.showErrorDialog('Could Not Create Tenant', utils.stringFormat('The specified tenant name "%1$s" is already in use.', [name]));
		return;
	}
	var tenant;
	if (recordMaster) {
		var masterTenant = scopes.svySecurity.getTenant(recordMaster.tenant_name);
		tenant = scopes.svySecurity.cloneTenant(masterTenant, name, makeSubTenant ? true : false);
	} else {
		tenant = scopes.svySecurity.createTenant(name);
	}
	if (!tenant) {
		plugins.dialogs.showErrorDialog('Could not create tenant', 'There was an unknown error. Please check server logs.');
		return;
	}
}

/**
 * @protected 
 * @return
 * @properties={typeid:24,uuid:"56991A57-3607-4EA7-9CC0-3B04B89ADCC1"}
 */
function setSelectedTenant() {
	scopes.svySecurityUX.selectedTenant = foundset.tenant_name;
}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 * @private
 * @properties={typeid:24,uuid:"A22E3AB6-84EB-456A-9322-75C724A782BA"}
 */
function createTenant(event, dataTarget) {
	showHideElements();
	target = 'new';
	labelAction = 'Tenant Name';
}

/**
 * @param {JSEvent} event the event that triggered the action
 *@private
 * @properties={typeid:24,uuid:"AE08DBFD-6B4F-47EB-8DAA-7C8EF92615FC"}
 */
function createSubTenant(event) {
	showHideElements();
	target = 'sub';
	labelAction = 'SubTenant Name';
}

/**
 * @param {JSEvent} event the event that triggered the action
 * @private
 * @properties={typeid:24,uuid:"18C5F305-6B43-46D8-9CAA-823B81C89FD9"}
 */
function cloneTenant(event) {
	showHideElements();
	target = 'clone';
	labelAction = 'Clone Name';
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 *
 * @param {number} foundsetindex
 * @param {number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"07EB8578-68FE-4AE0-8B82-1F1289AD908A"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	var column = elements.table.getColumn(columnindex);
	if (column.id == "edit") {
		setSelectedTenant();
		var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.TENANT);
		scopes.svyNavigation.open(item);
	}
}

/**
 * @protected 
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 *
 * @param {number} foundsetindex
 * @param {number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 *
 * @properties={typeid:24,uuid:"973B430C-259E-45BA-82D4-46C497E412E4"}
 */
function onCellDoubleClick(foundsetindex, columnindex, record, event) {
	setSelectedTenant();
	var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.TENANT);
	scopes.svyNavigation.open(item);
}

/**
 * @protected 
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @properties={typeid:24,uuid:"0357891F-B55E-462B-94DC-4C057A85C32C"}
 */
function onActionBack(event, dataTarget) {
	var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.HOME);
	scopes.svyNavigation.open(item);
}

/**
 * @param event
 * @private
 * @properties={typeid:24,uuid:"239EA149-BB12-4F22-B824-CDC9FDC4F4DB"}
 */
function onActionDelete(event) {
	if (!tenant_name) {
		return;
	}
	var tenant = scopes.svySecurity.getTenant(tenant_name);
	if (!tenant) {
		return;
	}
	var btnDelete = 'Delete';
	var btnCancel = 'Cancel';
	var res = plugins.dialogs.showWarningDialog('Confirm Delete', utils.stringFormat('You are about to delete the account for tenant <b>"%1$s"</b> and all users associated with it.<br>There is no undo for this operation.<br>Do you want to continue?', [tenant_name]), btnCancel, btnDelete);
	if (res == btnDelete) {
		res = scopes.svySecurity.deleteTenant(tenant);
		if (res) {
			plugins.webnotificationsToastr.success('Delete Successful', 'The tenant has been deleted.');
		} else {
			plugins.dialogs.showWarningDialog('Delete Not Successful', 'Could not delete tenant.');
		}
	}
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"5D23A0C4-713E-4501-B528-4F7DDC0300BE"}
 */
function showHideElements() {
	elements.labelAction.visible = true;
	elements.name.visible = true;
	elements.iconConfirme.visible = true;
	elements.iconCancel.visible = true;

	elements.btnNewTenant.visible = false;
	elements.btnCloneTenant.visible = false;
	elements.btnNewSubTenant.visible = false;
	elements.btnDeleteTenant.visible = false;
	
	elements.iconNewTenant.visible = false;
	elements.iconCloneTenant.visible = false;
	elements.iconNewSubTenant.visible = false;
	elements.iconDeleteTenant.visible = false;
}

/**
 * @protected 
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @properties={typeid:24,uuid:"89B7FA8C-A7C3-4DBF-9AF1-5E5440BE40BD"}
 */
function onActionSave(event, dataTarget) {
	if (target == 'new') {
		addNewTenant();
	} else if (target == 'clone') {
		if (utils.hasRecords(foundset)) {
			addNewTenant(foundset.getSelectedRecord(), false);
		}
	}else if (target == 'sub') {
		if (utils.hasRecords(foundset)) {
			addNewTenant(foundset.getSelectedRecord(), true);
		}
	}

	resetFields();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"6A246D19-1031-42D1-8D4E-8C848337A008"}
 */
function resetFields() {
	name = null;
	target = null;
	labelAction = null;
	elements.labelAction.visible = false;
	elements.name.visible = false;
	elements.iconConfirme.visible = false;
	elements.iconCancel.visible = false;

	elements.btnNewTenant.visible = true;
	elements.btnCloneTenant.visible = true;
	elements.btnNewSubTenant.visible = true;
	elements.btnDeleteTenant.visible = true;
	
	elements.iconNewTenant.visible = true;
	elements.iconCloneTenant.visible = true;
	elements.iconNewSubTenant.visible = true;
	elements.iconDeleteTenant.visible = true;
}

/**
 * @protected 
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @properties={typeid:24,uuid:"F123AB71-00DA-4A17-8932-1AAE932472F3"}
 */
function onActionCancel(event, dataTarget) {
	resetFields();
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"06280C18-EB29-497F-86B4-A4A71EB86F7F"}
 */
function onHide(event) {
	resetFields();
	return true;
}
