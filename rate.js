;
Rate(initValue){
	//init
	this.maxRate = initValue === undefined ? 100 : initValue;
	this.setValues = []; 
	this.setPercent = [];
	this.setSortedValues = [];
	this.setDefaultValue = {};
	this._cloneMaxRate;
}


//add
Rate.prototype.add = function(per,func){
	try{
		//check arg1 type 
		if(per !== 'default' && typeof per !== "number") throw 'invalid type';
		//check arg2 type
		if(typeof func !== "function") throw 'invalid type';
		//check overflow
		if(this.setValues.length > 0){
			this._cloneMaxRate = this.maxRate;
			for(var svk in this.setValues){
				 this._cloneMaxRate= this._cloneMaxRate - this.setValues[svk].percent;
			}
			if( this._cloneMaxRate - per< 0){
					throw 'Rates of your adding is over MaxRate';
			}
		}
		//set values
		if(per === 'default'){
			this.setDefaultValue.execute = func;
		}else{
			this.setPercent.push(per);
			this.setValues.push({percent:per,execute:func});
		}
	}catch(e){
		console.log(e);
	}
}

//clear
Rate.prototype.clear = function(){
	this.maxRate = undefined;
	this.setValues = [];
	this.setPercent = [];
	this.setSortedValues = [];
	this.setDefaultValue = {};
}

//generate
Rate.prototype.generate = function(){
	try{
		//check method
		if(typeof(this.setDefaultValue.execute) ===  "undefined") throw 'Default function is undefined. Define Obj.add("default",func)';
		//check maxRate
		if(typeof(this.maxRate) === "undefined") throw 'Max rate is undefined';
			//order by Number asc
		var sortedPercent = this.setPercent.sort(function(x,y){
			if(x<y) return -1;
			if(x>y) return 1;
			return 0;
		});
		//delete duplication 
		var uniqPercent= _uniq(sortedPercent);
		
		//identify the default value as number
		uniqPercent.push(-1);
		//
		var randNum = Math.random() * this.maxRate;
		
		console.log(randNum);
		//caluculate rate and execute each method by conditions
		for(var i=0,index=0;i<uniqPercent.length;i++){
			
			index = index + uniqPercent[i];
			if(i == 0){
				if(0 < randNum && index >= randNum ){
					//execute each functions
					for (var svfunc in this.setValues){
						if(this.setValues[svfunc].percent == index){
							this.setValues[svfunc].execute();
						}
					}
				}
			}else if(uniqPercent[i] == - 1 && index < randNum  && this.maxRate >= randNum){
				//default
				this.setDefaultValue.execute();
			}else if(uniqPercent[i-1] < randNum && index >= randNum ){
				//
				for (var svfunc in this.setValues){
					if(this.setValues[svfunc].percent == uniqPercent[i]){
						this.setValues[svfunc].execute();
					}
				}
			}
		}
	}catch(e){
		console.log(e);
	}
}

//make unique Array
function _uniq(arr){
	var storage = {};
	var uniqueArr = [];
	var i,val;
	for (i=0;i<arr.length;i++){
		val = arr[i];
		if(!(val in storage)){
			storage[val] = true;
			uniqueArr.push(val);
		}
	}
	return uniqueArr;
}

/*test
var test = new Rate(100);
test.add(30,say);//checked arg,type conditions
test.add(50,say1);//checked arg,type conditions
test.add('default',sayDefault);//checked arg,type conditions 
test.generate();//checked arg,type conditions

test.clear();//checked arg,type conditions
console.log(test.maxRate);
console.log(test.setPercent);
console.log(test.setSortedValues);
console.log(test.setDefaultValue);

//by initialization,reuse defined instances.
//using clear() method, 
	this.maxRate = undefined;
	this.setValues = [];
	this.setPercent = [];
	this.setSortedValues = [];
	this.setDefaultValue = {};
	
test.maxRate = 50;
test.add(20,say);
console.log(test.setValues);//valid execution

//test functions
function say(){
	alert('This is a pen');
};
function sayDefault(){
	alert('default');
}
function say1(){
	alert('Haaaaa!');
}
*/
