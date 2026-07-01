/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"05E6D8CF-EDAD-4FE3-BBA7-B078D97C4AAC"}
 */
var password_val = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"097728E0-A522-4FF5-9C2B-18CAB86D8C25"}
 */
var username_val = '';

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3C9C394D-8790-40D8-9639-64F112FB5C78"}
 */

function onActionLogin(event) {
	elements.txt_username.removeStyleClass("is-invalid");
	elements.txt_password.removeStyleClass("is-invalid");

    elements.lbl_error_message.visible = false;

    // 2. Validate
    var error = checkValidate(username_val, password_val);

    if (error) {
        if (error.field === "username") {
        	elements.txt_username.addStyleClass("is-invalid");
        } else {
        	elements.txt_password.addStyleClass("is-invalid");
        }
        
        displayError(error.msg);
        return;
    }
    
    if (checkLogin(username_val, password_val)) {
        security.login(username_val, password_val, ['Administrators']);
//        var targetFormName = 'mod_migration$frm_migration'; 
//        application.getWindow().hide();
//        scopes.global.goToForm(scopes.global.MAIN_FORM, event);
//        globals.goToForm(globals.MAIN_FORM, event);
//        globals.goToForm('mod_migration$frm_migration', event);

     
        
    } else {
    	displayError("Invalid username or password.");
    }
}

/**
 *
 * @param {String} u
 * @param {String} p
 * @properties={typeid:24,uuid:"343AA36C-D720-4AB8-AACA-52E0E056CEBB"}
 */
function checkValidate(u, p) {
    if (!u) return { field: "username", msg: "Username is required." };
    if (!p) return { field: "password", msg: "Password is required." };
    if (p.length < 8) return { field: "password", msg: "Password must be at least 8 characters." };
    if (!/[A-Z]/.test(p)) return { field: "password", msg: "Password must contain an uppercase letter." };
    if (!/[0-9]/.test(p)) return { field: "password", msg: "Password must contain a number." };
    return null; 
}



/**
 * @param {String} u
 * @param {String} p
 *
 * @properties={typeid:24,uuid:"89776EA4-8CEA-4AC3-8521-5776DE636F7E"}
 */
function checkLogin(u, p) {
	var query = "SELECT * FROM users WHERE user_name = ? AND user_password = md5(?)";
    var dataset = databaseManager.getDataSetByQuery('svy_security', query, [u, p], 1);
//    application.output(dataset)
//	application.output("Số lượng kết quả tìm thấy: " + dataset.getMaxRowIndex());
    return dataset.getMaxRowIndex() > 0;
    
}

/**
 * TODO generated, please specify type and doc for the params
 * @param msg
 *
 * @properties={typeid:24,uuid:"9B778A8F-9DEB-47C3-B9D2-998B275B875F"}
 */

function displayError(msg) {
    elements.lbl_error_message.text = msg;
    elements.lbl_error_message.visible = true;
}