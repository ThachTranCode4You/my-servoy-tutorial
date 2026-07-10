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
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5BE45A94-C0AC-41C1-ACB1-CD872A757288",variableType:8}
 */
var failedAttempts = 0;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"CFB7BBD6-D935-496B-A9D2-AC4EB451E784",variableType:-4}
 */
var isLocked = false;

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3C9C394D-8790-40D8-9639-64F112FB5C78"}
 */

function onActionLogin(event) {
	if (isLocked) {
		return;
	}

	elements.txt_username.removeStyleClass("is-invalid");
	elements.txt_password.removeStyleClass("is-invalid");
	elements.txt_password_visible.removeStyleClass("is-invalid");

	elements.lbl_error_message.visible = false;

	if (username_val) {
		username_val = username_val.trim();
	}

	// Only check required fields here - password strength rules belong to sign-up / change-password, not login
	var error = checkValidate(username_val, password_val);

	if (error) {
		if (error.field === "username") {
			elements.txt_username.addStyleClass("is-invalid");
		} else {
			elements.txt_password.addStyleClass("is-invalid");
			elements.txt_password_visible.addStyleClass("is-invalid");
		}

		displayError(error.msg);
		return;
	}

	elements.button_2.enabled = false;
	elements.button_2.text = "Logging in...";
	application.updateUI();

	if (checkLogin(username_val, password_val)) {
		failedAttempts = 0;

		// Credentials are valid - hand off to svySecurity, which checks lock state
		// and resolves the user's real roles/permissions instead of a hardcoded group
		var user = null;
		try {
			user = scopes.svySecurity.getUser(username_val);
		} catch (e) {
			user = null;
		}

		if (user && scopes.svySecurity.login(user)) {
			return;
		}

		// Valid credentials but svySecurity refused the session (locked account/tenant, or no permissions assigned)
		displayError("Your account cannot log in right now. Please contact an administrator.");
		elements.button_2.enabled = true;
		elements.button_2.text = "Login";
		return;
	}

	// Wrong credentials: don't reveal which field is wrong, just highlight both + count the failed attempt
	failedAttempts++;
	elements.txt_username.addStyleClass("is-invalid");
	elements.txt_password.addStyleClass("is-invalid");
	elements.txt_password_visible.addStyleClass("is-invalid");

	if (failedAttempts >= 5) {
		lockLoginTemporarily(30);
		return;
	}

	displayError("Invalid username or password.");
	elements.button_2.enabled = true;
	elements.button_2.text = "Login";
}

/**
 * @param {Number} seconds
 *
 * @properties={typeid:24,uuid:"35E033B8-14B7-482B-B53E-22B568A96594"}
 */
function lockLoginTemporarily(seconds) {
	isLocked = true;
	elements.txt_username.enabled = false;
	elements.txt_password.enabled = false;
	elements.txt_password_visible.enabled = false;
	elements.btn_toggle_password.enabled = false;
	elements.button_2.enabled = false;
	elements.button_2.text = "Try again in " + seconds + "s";
	displayError("Too many failed attempts. Please try again in " + seconds + " seconds.");

	if (seconds > 0) {
		application.executeLater(function() {
				lockLoginTemporarily(seconds - 1);
			}, 1000);
	} else {
		isLocked = false;
		failedAttempts = 0;
		elements.txt_username.enabled = true;
		elements.txt_password.enabled = true;
		elements.txt_password_visible.enabled = true;
		elements.btn_toggle_password.enabled = true;
		elements.button_2.enabled = true;
		elements.button_2.text = "Login";
		elements.lbl_error_message.visible = false;
	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"437A9B2C-C4FE-48A8-A3D3-66B40186DA6D"}
 */
function onShowLogin(event) {
	elements.txt_username.requestFocus();
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4588B5AC-F40E-48DB-9CFD-245F5B667A7D"}
 */
function onTogglePasswordVisibility(event) {
	var isRevealing = !elements.txt_password_visible.visible;

	elements.txt_password_visible.visible = isRevealing;
	elements.txt_password.visible = !isRevealing;
	elements.btn_toggle_password.imageStyleClass = isRevealing ? 'fas fa-eye-slash' : 'fas fa-eye';

	if (isRevealing) {
		elements.txt_password_visible.requestFocus();
	} else {
		elements.txt_password.requestFocus();
	}
}

/**
 *
 * @param {String} username
 * @param {String} password
 * @return {{field: String, msg: String}}
 * @properties={typeid:24,uuid:"343AA36C-D720-4AB8-AACA-52E0E056CEBB"}
 */
function checkValidate(username, password) {
	if (!username) return { field: "username", msg: "Username is required." };
	if (!password) return { field: "password", msg: "Password is required." };
	return null;
}

/**
 * @param {String} username
 * @param {String} password
 * @return {Boolean}
 * @properties={typeid:24,uuid:"89776EA4-8CEA-4AC3-8521-5776DE636F7E"}
 */
function checkLogin(username, password) {
	try {
		var user = scopes.svySecurity.getUser(username);
		if (!user) {
			return false;
		}
		return user.checkPassword(password);
	} catch (e) {
		// eg. ambiguous username across multiple tenants - treat as invalid credentials
		return false;
	}
}

/**
 * @param msg
 *
 * @properties={typeid:24,uuid:"9B778A8F-9DEB-47C3-B9D2-998B275B875F"}
 */

function displayError(msg) {
	elements.lbl_error_message.text = msg;
	elements.lbl_error_message.visible = true;
}
