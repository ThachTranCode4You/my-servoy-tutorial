/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8AC9DF13-C47E-4AD0-B425-16BC1AA62F24"}
 */
var password_val = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3BBE72B2-2928-49CF-A102-9226FECC8A3C"}
 */
var username_val = '';

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7FA3AD71-F9B1-4646-9ABA-B1D01FAA2C80"}
 */
function onActionLogin(event) {
    // Reset thông báo lỗi
    elements.lbl_error_message.visible = false;
    
    // Validate bằng cách gọi hàm với các biến đã bind
    var errorMsg = checkValidate(username_val, password_val);
    
    if (errorMsg) {
        displayError(errorMsg);
        return;
    }

    // Đăng nhập
    
    if (checkLogin(username_val, password_val)) {
        security.login(username_val, password_val, ['Administrators']);
        application.getWindow().hide();
    } else {
    	
        displayError("Invalid username or password.");
    }
}

/**
 *
 * @param {String} u
 * @param {String} p
 *
 * @properties={typeid:24,uuid:"F8AE1EC0-E524-43C9-AA2C-399E637535D3"}
 */
function checkValidate(u, p) {
    if (!u) return "Username is required.";
    if (!p) return "Password is required.";
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(p)) return "Password must contain an uppercase letter.";
    if (!/[0-9]/.test(p)) return "Password must contain a number.";
    return null;
}

/**
 * Gọi Database
 * @param {String} u
 * @param {String} p
 *
 * @properties={typeid:24,uuid:"8E9551F6-7179-4482-A02A-A5F7C8057D15"}
 */
function checkLogin(u, p) {
    var query = "SELECT * FROM users WHERE user_name = ? AND user_password = ?";
    var dataset = databaseManager.getDataSetByQuery('example_data', query, [u, p], 1);
    
    return dataset.getMaxRowIndex() > 0;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param msg
 *
 * @properties={typeid:24,uuid:"0AA3F917-C28D-43B2-B97A-8C35B92EC080"}
 */
function displayError(msg) {
    elements.lbl_error_message.text = msg;
    elements.lbl_error_message.visible = true;
}