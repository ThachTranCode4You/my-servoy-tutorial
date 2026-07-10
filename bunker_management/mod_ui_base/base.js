/**
 * TODO generated, please specify type and doc for the params
 * @param menuItemText
 * @param event
 *
 * @properties={typeid:24,uuid:"AF8D2D5D-F574-4FC8-9C90-51C4AC7BF5A9"}
 */
function onMenuItemSelected(menuItemText, event) {
	if (menuItemText == 'orders') {
        elements.content_area.removeAllTabs();
        elements.content_area.addTab('frm_orders');
    }
	
    if (menuItemText == 'customers') {
        elements.content_area.removeAllTabs();
        elements.content_area.addTab('frm_customers');
    }
}