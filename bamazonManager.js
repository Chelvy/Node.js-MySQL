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

connection.connect(function(err) {
    if (err) throw err;
    start();
})

function start() {
    inquirer.prompt({
        name: "menu",
        type: "rawlist",
        message: "Choose from the menu option what you want to do",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function(response) {
        switch (response.menu) {
            case choices[0]:
                return viewProductsForSale();
                break;

            case choices[1]:
                return viewLowInventory();
                break;

            case choices[2]:
                return addToInventory();
                break;

            case choices[3]:
                return addNewProduct();
                break;

            default:
                process.exit()
        }
    });
}

function viewProductsForSale() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("--------------- List every available item: the item IDs, names, prices, and quantities. ---------------");
        console.log("Item\tProduct\tDepartment\tPrice\tStock");
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].product_name + "\t" + res[i].department_name + "\t" + res[i].price + "\t" + res[i].stock_quantity);
        };
        console.log("------------------------------------------------------------------------------");
        start()
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.log("--------------- List every available item: the item IDs, names, prices, and quantities. ---------------");
        console.log("Item\tProduct\tDepartment\tPrice\tStock");
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].product_name + "\t" + res[i].department_name + "\t" + res[i].price + "\t" + res[i].stock_quantity);
        };
        console.log("------------------------------------------------------------------------------");
        start()
    });
}

function addToInventory() {
    viewProductsForSale();
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt({
            name: "ID",
            type: "rawlist",
            message: "Select the ID to increase inventory",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].item_id);
                }
                return choiceArray;
            }
        }, {
            name: "newQty",
            type: "input",
            message: "Enter New Quantity"
        }).then(function(response) {
            console.log("New Quantity currently in the store for item ID" + response.ID + ": " + response.newQty);
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [{ stock_quantity: response.newQty }, { item_id: response.ID }], function(err, res) {
                console.log("Item\tProduct\tDepartment\tPrice\tStock")
                console.log(res[0].item_id + "\t" + res[0].product_name + "\t" + res[0].department_name + "\t" + res[0].price + "\t" + res[0].stock_quantity);
                console.log("------------------------------------------------------------------------------");
            })

        })
    });
}

function addNewProduct() {
    inquirer.prompt({
        name: "product_name",
        type: "input",
        message: "Enter Product Name"
    }, {
        name: "department_name",
        type: "input",
        message: "Enter Department Name"
    }, {
        name: "price",
        type: "input",
        message: "Enter Product Price"
    }, {
        name: "stock_quantity",
        type: "input",
        message: "Enter Product Stock Quantity"
    }).then(function(response) {
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [{ product_name: response.product_name }, { department_name: response.department_name }, { price: response.price }, { stock_quantity: response.stock_quantity }], function(err, res) {
            if (err) throw err;
            console.log('Row inserted:' + res.affectedRows);
            console.log("------------------------------");
            start()
        })
    })

}

async function exit() {
    connection.end();
}