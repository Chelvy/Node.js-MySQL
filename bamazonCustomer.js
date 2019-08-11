const inquirer = require("inquirer");
const mysql = require("mysql");

// Establish database connection first
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ch5lv25@07',
    database: 'bamazon'
})


connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // First display all of the items available for sale ( Include the ids, names, and prices of products for sale.)
    console.log("--------------- Items available for sale ---------------");
    console.log("Item\tProduct\tDepartment\tPrice\tStock")
    for (let i = 0; i < res.length; i++) {
        console.log(res[i].item_id + "\t" + res[i].product_name + "\t" + res[i].department_name + "\t" + res[i].price + "\t" + res[i].stock_quantity);
    }
    console.log("------------------------------------------------------------------------------");
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the ID of the product you would like to buy?"
        },
        {
            name: "Units",
            type: "input",
            message: "How many units of the product would you like to buy?"
        }
    ]).then(function(answer) {
        connection.query("SELECT * FROM products WHERE ?", { item_id: answer.ID }, function(err, res) {
            if (err) throw err;
            if (res[0].stock_quantity > answer.Units) {
                var remainQty = res[0].stock_quantity - answer.Units;
                var totalCost = res[0].price * answer.Units;
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: remainQty }, { item_id: answer.ID }], function(err, res) {
                    console.log("--------------- Updated the SQL database with the remaining quantity ---------------");
                })
                connection.query("SELECT * FROM products WHERE ?", { item_id: answer.ID }, function(err, res) {
                    console.log("Item\tProduct\tDepartment\tPrice\tStock")
                    console.log(res[0].item_id + "\t" + res[0].product_name + "\t" + res[0].department_name + "\t" + res[0].price + "\t" + res[0].stock_quantity);
                    console.log("The total cost of your purchase is " + totalCost);
                    console.log("------------------------------------------------------------------------------");
                })

            } else {
                console.log("--------------- Insufficient quantity! ---------------");
                console.log("Total Quantity Available: " + res[0].stock_quantity);
                console.log("Requested Quantity: " + answer.Units);
                console.log("------------------------------------------------------------------------------");
            }
        })
    })

})