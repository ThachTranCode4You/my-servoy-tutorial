/**
 * TODO generated, please specify type and doc for the params
 * @param sourceServer
 * @param sourceTable
 * @param targetServer
 * @param targetTable
 * @param mapping
 *
 * @properties={typeid:24,uuid:"1F365F22-510A-40BD-870E-626B8EB73D5A"}
 */
 function importDataGeneric(sourceServer, sourceTable, targetServer, targetTable, mapping,defaults) {
	    var query = "SELECT * FROM " + sourceTable;
	    var sourceDS = databaseManager.getDataSetByQuery(sourceServer, query, null, -1);
	    
	    	application.output("asdasdas" + sourceDS.getMaxRowIndex());
	    if (!sourceDS || sourceDS.getMaxRowIndex() === 0) {
	        application.output("Không có dữ liệu trong bảng nguồn: " + sourceTable);
	        return false;
	    }
	    
	    var targetFS = databaseManager.getFoundSet(targetServer, targetTable);
	    
	    var colIndexMap = {};
	    var colNames = sourceDS.getColumnNames();
	    for (var j = 0; j < colNames.length; j++) {
	        colIndexMap[colNames[j]] = j + 1;
	    }

	    try {
	    	for (var i = 1; i <= sourceDS.getMaxRowIndex(); i++) {
		        var newRecordIndex = targetFS.newRecord();
		        
		        var newRec = targetFS.getRecord(newRecordIndex);
		        
		        for (var sourceCol in mapping) {
		            var targetCol = mapping[sourceCol];
		            var colIndex = colIndexMap[sourceCol];
		            
		            if (colIndex) {
		                var val = sourceDS.getValue(i, colIndex);
		                if (val != null) {
		                    newRec[targetCol] = val; 
		                }
		            }
		        }
		        
		        for (var col in defaults) {
		            var val = defaults[col];
		            if (typeof val === 'function') {
		                newRec[col] = val();
		            } else {
		                newRec[col] = val;
		            }
		        }

		        if (!newRec.vessel_uuid) {
		            newRec.vessel_uuid = application.getUUID().toString();
		        }
//		        newRec.tenant_name = 'default' + i; 

		        databaseManager.saveData(newRec);
		    }
	    	
	    } catch (e) {
	    	application.output("Đã xảy ra lỗi hệ thống: " + e.message);
	    }
	    
	}
//for (var sourceCol in mapping) {
//var targetCol = mapping[sourceCol];
//newRec[targetCol] = sourceDS.getValue(i, sourceDS.getColumnIndex(sourceCol));
//}
/**
 * @properties={typeid:24,uuid:"F816A42E-8862-43F2-ACFC-01ADB582AF62"}
 */
//function importData() {
//	var userMapping = {
//		"User": "user_name",    
//        "Password": "user_password",
//        "FullName": "display_name"
//    };
//
//	var userDefaults = {
//        "creation_date": new Date(),
//        "creation_user": "import_system"
//    };
//	
//    // 2. Gọi hàm Generic
//    var success = importDataGeneric(
//        'my_mariadb', 
//        'users',               
//        'svy_security',    
//        'users', 
//        userMapping,
//		userDefaults
//    );
//    
//    if (success) {
//        application.output("Import Orders thành công!");
//    }
//}

/**
 * @properties={typeid:24,uuid:"87C818DA-E40D-47E6-9FF3-E821FEA0234B"}
 */
function importData() {
   try {
	   var vesselMapping = {
	        "VesselName": "vessel_name",
	        "IMONo":      "imo_no",
	        "DWAT":       "dwt",
	        "NT":         "nrt",
	        "GT":         "gross_tonnage",
	        "LOA":        "loa",
	        "Beam":       "beam",
	        "Built":      "built_year",
	        "CallSign":   "call_sign",
	        "Flag":       "flag_code",
	        "hidden":     "is_hidden",
	        "BunkerManifolds": "bunker_manifolds_desc",
	        "AttachedDocument": "attached_doc_path"
	    };

	    var vesselDefaults = {
	        "created_on":  new Date(),
	        "modified_on": new Date(),
	        "created_by_name": "system_import"
	    };
	    
	    if (!databaseManager.getTable('my_mariadb', 'vessel')) {
            application.output("LỖI: Không tìm thấy bảng vessel trong MariaDB!");
            return;
        }
	    
        var success = application.output("Bắt đầu import...");
	    // Gọi hàm Generic của bạn
	    importDataGeneric(
	        'my_mariadb', 
	        'vessel',          
	        'code4you',    
	        'global_vessels', 
	        vesselMapping,
	        vesselDefaults
	    );
	    
	    if (success) {
            application.output("Import thành công!");
        } else {
        	throw new Error();        }
	    

   } catch (e) {
	   application.output("Đã xảy ra lỗi hệ thống: " + e.message);
   }
}