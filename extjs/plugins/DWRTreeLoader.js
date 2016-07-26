Ext.ux.DWRTreeLoader = function(config) {
	Ext.ux.DWRTreeLoader.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.DWRTreeLoader, Ext.tree.TreeLoader, {
	queryParam : '',
	
	load : function(node, callback){
		if(this.clearOnLoad){
			while(node.firstChild){
				node.removeChild(node.firstChild);
			}
		}
		if(node.attributes.children){ // preloaded json children
			var cs = node.attributes.children;
			for(var i = 0, len = cs.length; i < len; i++){
				node.appendChild(this.createNode(cs[i]));
			}
			if(typeof callback == "function"){
	    		callback();
			}
		}else if(this.dwrMethod){
     		this.requestData(node, callback);
		}
	},
	
	requestData : function(node, callback) {
		if (this.fireEvent("beforeload", this, node, callback) !== false) {
			var callParams = new Array();
			var success = this.handleResponse.createDelegate(this, [node, callback], 1);
			var error = this.handleFailure.createDelegate(this, [node, callback], 1);
			callParams.push(node.id);
			if(node.attributes.queryParam != null)
	      		this.queryParam = node.attributes.queryParam;
			callParams.push(this.queryParam);
			callParams.push({callback:success, errorHandler:error});
	
			this.transId=true;
			this.dwrMethod.apply(this, callParams);
		} else {
      		if (typeof callback == "function") {
        		callback();
      		}
 		}
	},
	
	processResponse : function(response, node, callback){
		try {
    		for(var i = 0; i < response.length; i++){
           		var n = this.createNode(response[i]);
				if(n){
               		node.appendChild(n);
				}
			}
			if(typeof callback == "function"){
           		callback(this, node);
			}
		}catch(e){
			this.handleFailure(response);
		}
	},

	handleResponse : function(response, node, callback){
		this.transId = false;
		this.processResponse(response, node, callback);
		this.fireEvent("load", this, node, response);
	},

	handleFailure : function(response, node, callback){
		this.transId = false;
		this.fireEvent("loadexception", this, node, response);
		if(typeof callback == "function"){
			callback(this, node);
		}
	}
}); 
