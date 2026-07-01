///**
// * @param {String} sourceServer
// * @param {String} sourceTable
// * @param {String} targetServer
// * @param {String} targetTable
// * @param {Object} mapping
// * @param {Object} defaults
// *
// * @properties={typeid:24,uuid:"B7D3CB09-A448-4DA3-8443-881A5B427597"}
// */
// function importDataGeneric(sourceServer, sourceTable, targetServer, targetTable, mapping, defaults) {
//	    var query = "SELECT * FROM " + sourceTable;
//	    var sourceDS = databaseManager.getDataSetByQuery(sourceServer, query, null, -1);
//	    
//	    if (!sourceDS || sourceDS.getMaxRowIndex() === 0) {
//	        application.output("Không có dữ liệu nguồn: " + sourceTable);
//	        return false;
//	    }
//
//	    var targetFS = databaseManager.getFoundSet(targetServer, targetTable);
//	    var sourceColNames = sourceDS.getColumnNames(); // Danh sách tên cột thật từ DB nguồn
//
//	    try {
//	        for (var i = 1; i <= sourceDS.getMaxRowIndex(); i++) {
//	            var newRec = targetFS.getRecord(targetFS.newRecord());
//	            
//	            // Dùng mapping để map dữ liệu
//	            for (var srcKey in mapping) {
//	                var targetCol = mapping[srcKey];
//	                var foundVal = null;
//
//	                // TÌM CỘT NGUỒN: So khớp tên trong mapping với tên trong DB nguồn (không phân biệt hoa thường)
//	                for (var j = 0; j < sourceColNames.length; j++) {
//	                    if (sourceColNames[j].toLowerCase() === srcKey.toLowerCase()) {
//	                        foundVal = sourceDS.getValue(i, j + 1);
//	                        break;
//	                    }
//	                }
//
//	                // Gán vào bản ghi mới
//	                if (foundVal != null) {
//	                    newRec[targetCol] = foundVal;
//	                }
//	            }
//	            
//	            // Gán giá trị mặc định
//	            for (var col in defaults) {
//	                var val = defaults[col];
//	                newRec[col] = (typeof val === 'function') ? val() : val;
//	            }
//
//	            // UUID
//	            newRec.vessel_uuid = application.getUUID().toString();
//
//	            databaseManager.saveData(newRec);
//	        }
//	        return true;
//	    } catch (e) {
//	        application.output("Lỗi import: " + e.message);
//	        return false;
//	    }
//	}

	

/**
 * Script migrate data từ my_mariadb (orderitem) sang code4you (pur_orders)
 * @properties={typeid:24,uuid:"YOUR-UUID-HERE"}
 */
function importData() {
	application.output("Bắt đầu migrate");
    var sourceQuery = datasources.db.my_mariadb.orderitem.createSelect();
    var sourcePorts = databaseManager.getFoundSet(sourceQuery);
    
    // Lưu ý: Nếu data quá lớn (hàng trăm ngàn dòng), nên cân nhắc dùng paging.
    sourcePorts.loadAllRecords(); 
    var totalRecords = sourcePorts.getSize();
    
    application.output("Bắt đầu migrate. Tổng số record nguồn: " + totalRecords);

    var targetPorts = databaseManager.getFoundSet("db:/code4you/pur_orders");

    for (var index = 1; index <= totalRecords; index++) {
        var sourceRecord = sourcePorts.getRecord(index);
        
        // Tạo record mới một cách an toàn và lấy ra object record đó
        var newRecordIndex = targetPorts.newRecord();
        var targetRecord = targetPorts.getRecord(newRecordIndex);

        // ---------------------------------------------------------
        // 1. ÁNH XẠ CÁC TRƯỜNG BẮT BUỘC (UUID & Audit fields)
        // ---------------------------------------------------------
        targetRecord.order_uuid = application.getUUID().toString();
        targetRecord.created_on = new Date();
        targetRecord.created_by_name = "migration_system";

        // ---------------------------------------------------------
        // 2. MAPPING DỮ LIỆU (MariaDB CamelCase -> Postgres snake_case)
        // ---------------------------------------------------------
        // QUAN TRỌNG: Hãy mở bảng "orderitem" trong Servoy Developer (phần Data Providers) 
        // để xem chính xác tên thuộc tính Servoy đang hiển thị là gì.
        // Dưới đây dùng toán tử OR (||) để phòng hờ trường hợp sai case.
        
        var orderNo = sourceRecord.orderno;
        targetRecord.client_reference = orderNo; 
        
        var itemNo = sourceRecord.itemno;
        targetRecord.item_no = itemNo; // Đảm bảo bên Postgres đã tạo cột item_no
        
        var inquiryDate = sourceRecord.inquirydate;
        targetRecord.request_date = inquiryDate;
        
        var fixingDate = sourceRecord.fixingdate;
        targetRecord.accepted_on = fixingDate;
        
        // Bạn có thể tiếp tục thêm các cột tương ứng ở đây...
        // targetRecord.ten_cot_snake_case = sourceRecord.TenCotCamelCase;
    }

    // ---------------------------------------------------------
    // 3. LƯU DỮ LIỆU VÀ BẮT LỖI
    // ---------------------------------------------------------
    // Lưu toàn bộ foundset thay vì lưu từng record sẽ tăng hiệu suất đáng kể
    var success = databaseManager.saveData(targetPorts);
    
    if (!success) {
        var errors = databaseManager.getFailedRecords(targetPorts);
        application.output("Migration thất bại. Có " + errors.length + " bản ghi bị lỗi.");
        
        for (var i = 0; i < errors.length; i++) {
            var errorRecord = errors[i];
            // Lấy exception chi tiết từ Servoy
            var exceptionMsg = errorRecord.exception ? errorRecord.exception.getMessage() : "Lỗi không xác định (có thể do constraint DB)";
            application.output("LỖI tại UUID " + errorRecord.order_uuid + ": " + exceptionMsg);
        }
        return false; 
    } else {
        application.output('Đã lưu thành công ' + totalRecords + ' bản ghi!');
        return true;
    }
}