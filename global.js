/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"97E1A079-3BF0-4CA2-B129-C8B09EFC8011"}
 */
var MAIN_FORM = 'mod_migration$frm_migration';

/**
 * TODO generated, please specify type and doc for the params
 * @param arg
 * @param queryParams
 *
 * @properties={typeid:24,uuid:"5C3828F7-C881-4A85-9B98-B9C14A14A280"}
 */
function onSolutionOpen(arg, queryParams) {
	application.output(security.getUserName())
    if (security.getUserName()) {
    	
        return true; 
    }
    
    return false; 
}

/**
 * TODO generated, please specify type and doc for the params
 * @param formName
 * @param e
 *
 * @properties={typeid:24,uuid:"23C7C515-E1AF-4315-9E40-E711CF043FC2"}
 */
function goToForm(formName, e) {
    var currentFormName = e.getFormName();
    
    if (currentFormName && currentFormName !== formName) {
        formHistory.push(currentFormName);
    }
    forms[formName].controller.show();
}