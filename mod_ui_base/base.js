/**
 * TODO generated, please specify type and doc for the params
 * @param menuItemText
 * @param event
 *
 * @properties={typeid:24,uuid:"AF8D2D5D-F574-4FC8-9C90-51C4AC7BF5A9"}
 */
 function onMenuItemSelected(menuItem, event) {
	  var formName = menuItem.name;
	    
	    application.output(forms[formName]);

	    if (forms[formName]) {
	        forms[formName].controller.show();
	        return;
	    } else {
	        application.output("LỖI: Không tìm thấy form: " + formName);
	    }
	    return;

	}
 
	/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"40719E9F-A67F-4657-9613-6A38AA7D6133"}
 */
function onActionCreate(event) {
	var currentFormName = event.getFormName();
    var createFormName = currentFormName + "_create";


    if (forms[createFormName]) {
    	var win = application.createWindow(createFormName, JSWindow.MODAL_DIALOG);
        win.title = "Create new";
        

        win.show(forms[createFormName]);
    } else {
        application.output("Lỗi: Không tìm thấy form " + createFormName);
    }
}