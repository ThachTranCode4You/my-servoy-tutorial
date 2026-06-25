/**
 * TODO generated, please specify type and doc for the params
 * @param menuItemText
 * @param event
 *
 * @properties={typeid:24,uuid:"A66E1783-B09B-4470-9677-4508F7586F7D"}
 */
function onMenuItemSelected(menuItemText, event) {
    if (menuItemText == 'Customers') {
        elements.content_area.removeAllTabs();
        elements.content_area.addTab('frm_customers');
    }
}