﻿Ext.ux.DWRTreeLoader=function(A){Ext.ux.DWRTreeLoader.superclass.constructor.call(this,A)};Ext.extend(Ext.ux.DWRTreeLoader,Ext.tree.TreeLoader,{queryParam:"",load:function(D,E){if(this.clearOnLoad){while(D.firstChild){D.removeChild(D.firstChild)}}if(D.attributes.children){var C=D.attributes.children;for(var B=0,A=C.length;B<A;B++){D.appendChild(this.createNode(C[B]))}if(typeof E=="function"){E()}}else{if(this.dwrMethod){this.requestData(D,E)}}},requestData:function(C,E){if(this.fireEvent("beforeload",this,C,E)!==false){var A=new Array();var D=this.handleResponse.createDelegate(this,[C,E],1);var B=this.handleFailure.createDelegate(this,[C,E],1);A.push(C.id);if(C.attributes.queryParam!=null){this.queryParam=C.attributes.queryParam}A.push(this.queryParam);A.push({callback:D,errorHandler:B});this.transId=true;this.dwrMethod.apply(this,A)}else{if(typeof E=="function"){E()}}},processResponse:function(A,C,F){try{for(var B=0;B<A.length;B++){var E=this.createNode(A[B]);if(E){C.appendChild(E)}}if(typeof F=="function"){F(this,C)}}catch(D){this.handleFailure(A)}},handleResponse:function(A,B,C){this.transId=false;this.processResponse(A,B,C);this.fireEvent("load",this,B,A)},handleFailure:function(A,B,C){this.transId=false;this.fireEvent("loadexception",this,B,A);if(typeof C=="function"){C(this,B)}}});