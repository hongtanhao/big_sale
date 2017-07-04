// 自定义命名空间
window.Upc = {} || upc ;
/**
 * [dataInteraction description]
 * @param  {[type]} path      [description]
 * @param  {[type]} type      [description]
 * @param  {[type]} data      [description]
 * @param  {[type]} fnSuccess [description]
 * @param  {[type]} fnFail    [description]
 * @return {[type]}           [description]
 */
Upc.dataInteraction = function(path,type,data,fnSuccess,fnFail){
    console.log('<<<<<<<<<<<<<<上送报文>>>>>>>>>>>>>>',data)
    var opts = {
    	//url:'http://localhost:8080'+path,
    	type:type,
    	data:data,  
    	success:function(response,fnSuccess){
    		if(response){
               console.log('<<<<<<<<<<<<<<接受报文>>>>>>>>>>>>>>',response)
            }
    		if(fnSuccess instanceof Function){
    			fnSuccess(response);
    		}
    	},
    	error:function(response,fnFail){
    		if(response){
               console.log('<<<<<<<<<<<<<<接受报文>>>>>>>>>>>>>>',response)
            }
    		if(fnSuccess instanceof Function){
    			fnFail(response);
    		}
    	},
    }; 
    ajax(opts);
} 