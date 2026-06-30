/**
 * TODO generated, please specify type and doc for the params
 * @param menuItemText
 * @param event
 *
 * @properties={typeid:24,uuid:"AF8D2D5D-F574-4FC8-9C90-51C4AC7BF5A9"}
 */
 function onMenuItemSelected(menuItem, event) {
	    // 1. Lấy giá trị tên đã cấu hình (thường nằm ở thuộc tính .name)
	    var rawName = menuItem.name; 
	    
	    // 2. Làm sạch chuỗi: Loại bỏ phần [module_name] nếu có
	    // Dùng regex để cắt bỏ phần ngoặc vuông và nội dung bên trong nó
	    var formName = rawName.split(' [')[0]; 
	    
	    application.output("Chuỗi gốc: " + rawName);
	    application.output("Tên form chuẩn: " + formName);
	    
	    // 3. Gọi form
	    if (forms[formName]) {
	        forms[formName].controller.show();
	    } else {
	        application.output("LỖI: Không tìm thấy form: " + formName);
	    }
	}