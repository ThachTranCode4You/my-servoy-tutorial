	/**
	 * @type {String}
	 *
	 * @properties={typeid:35,uuid:"8E530AD9-6082-4362-A88A-E21E0C7D7571"}
	 */
	var MAIN_FORM = 'mod_migration$frm_migration';
	
	/** * History stack for form navigation.
	 * @type {String[]} 
	 * @properties={typeid:35,uuid:"83AE9305-937F-49DD-A0B2-69ADB8216C94",variableType:-4}
	 */
	var formHistory = [];

	/**
	 * TODO generated, please specify type and doc for the params
	 * @param arg
	 * @param queryParams
	 *
	 * @properties={typeid:24,uuid:"6FEC4960-0497-490B-9250-679219FEEDD5"}
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
	 * @properties={typeid:24,uuid:"90259850-7968-4E23-AE90-863644663083"}
	 */
//	function goToForm(formName, e) {
//	    // 1. Kiểm tra xem form có tồn tại không
//	
//	    if (!forms[formName]) {
//	        application.output("LỖI: Form '" + formName + "' không tồn tại trong Solution hiện tại!");
//	        return; // Dừng lại ở đây, không gọi controller nữa
//	    }
//	    
//	    // 2. Xử lý lịch sử (nếu cần)
//	    if (e && typeof e.getFormName === 'function') {
//	        var currentFormName = e.getFormName();
//	        if (currentFormName && currentFormName !== formName) {
//	            formHistory.push(currentFormName);
//	        }
//	    }
//	    
//	    // 3. Chỉ gọi show() khi đã chắc chắn
//	    forms[formName].controller.show();
//	}