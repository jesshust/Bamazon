var mysql = require('mysql'); 
var inquirer = require('inquirer'); 

var connection = mysql.createConnection({
	host: 'localhost', 
	port: 3306, 
	user: 'root', 
	password: '', 
	database: 'BamazonDB'
}); 

connection.connect(function(err) {
	if(err) throw err; 
}); 

var showTable = function(){
	connection.query('SELECT * FROM products', function(err, res) {
    	if (err) throw err;
    		console.log('Item ID | Product Name | Department Name | Price | Stock Quantity');
    	for (i = 0; i < res.length; i++){
    		console.log(res[i].itemId + ' | '  + res[i].productName + ' | '  + res[i].departmentName + ' | '  + res[i].price + ' | ' + res[i].stockQuantity); 
    	}
    	userPrompt(); 
	}); 
}; 

showTable(); 
 

function userPrompt() {

    inquirer.prompt([
    {
        name: "itemId",
        type: "input",
        message: "What is the ID of the item you'd like to buy?"

    }, 
    {
        name: "numberOf",
        type: "input",
        message: "How many would you like to purchase?"

    }
    ]).then(function(choice) {
    	selectedId = choice.itemId; 
    	quantity = choice.numberOf; 

    	connection.query ('SELECT stockQuantity, productName, price FROM products WHERE itemId = ' + selectedId,  
    		function(err, res){
    		var updatedQuantity = res[0].stockQuantity - quantity; 
    			if(updatedQuantity < 0){
    				console.log('Our apologies. Insufficient quantity'); 
    			} else {
    				connection.query('UPDATE products SET ? WHERE ?',
    					[{stockQuantity: res[0].stockQuantity - quantity}, {itemId: selectedId}], 
    					function(err, res){
    						showTable(); 
    					}); 

    				if (quantity === '1') {
    					console.log('Total cost: $' + (res[0].price * quantity) + ' for buying ' + quantity + ' copies of ' + res[0].productName); 
    				} else {
    					console.log('Total cost: $' + (res[0].price * quantity) + ' for buying ' + quantity + ' copies of ' + res[0].productName); 
    				}
 					console.log('Product Bought!'); 
 					 
    				}
    		});
  
		}); 
}



