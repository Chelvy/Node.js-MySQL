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

// connection.connect((err) => {
//     if (err) throw err
//     console.log('Database connected. Beginning Inquirer');
//     start()
// })

// function start() {
//     connection.query("SELECT * FROM products", function(err, res) {
//         if (err) throw err;
//         // First display all of the items available for sale ( Include the ids, names, and prices of products for sale.)
//         console.log(res);
//         inquirer
//             .prompt([{
//                     name: "ID",
//                     type: "rawlist",
//                     choices: function() {
//                         var choiceArray = [];
//                         for (var i = 0; i < res.length; i++) {
//                             choiceArray.push(res[i].item_id);
//                         }
//                         return choiceArray;
//                     },
//                     message: 
//                 },
//                 {
//                     name: "Units",
//                     type: "input",
//                     message: 
//                 }
//             ]).then(function(answer) {
//                 // get the information of the chosen item
//                 var chosenItem;
//                 for (var i = 0; i < res.length; i++) {
//                     if (res[i].item_id === answer.choice) {
//                         chosenItem = res[i];
//                         console.log("The chosen item!");
//                         console.log(chosenItem);
//                     }
//                 }

//                 // determine if bid was high enough
//                 if (chosenItem.highest_bid < parseInt(answer.bid)) {
//                     // bid was high enough, so update db, let the user know, and start over
//                     connection.query(
//                         "UPDATE auctions SET ? WHERE ?", [{
//                                 highest_bid: answer.bid
//                             },
//                             {
//                                 id: chosenItem.id
//                             }
//                         ],
//                         function(error) {
//                             if (error) throw err;
//                             console.log("Bid placed successfully!");
//                             start();
//                         }
//                     );
//                 } else {
//                     // bid wasn't high enough, so apologize and start over
//                     console.log("Your bid was too low. Try again...");
//                     start();
//                 }
//             });
//         switch (response.todo) {
//             case choices[0]:
//                 return searchArtist()
//             case choices[1]:
//                 return searchMultipleAppearences()
//             case choices[2]:
//                 return searchRange()
//             case choices[3]:
//                 return searchSong()
//             case choices[4]:
//                 return searchAlbum()
//             default:
//                 process.exit()
//         }

//     });
// }


// async function searchArtist() {
//     console.log('search artist')
//     const response = await inquirer.prompt([{
//         type: 'input',
//         message: 'What artist would you like to search?',
//         name: 'artist'
//     }])

//     const { artist } = response
//     connection.query('select * from Top5000 where ?', { artist }, (err, res) => {
//         if (err) throw err
//         if (res.length < 1) {
//             text = `Artist: ${artist} not found!`
//             console.log(`\x1b[31m ${text}`)
//         } else {
//             const songs = res.map(element => `${element.artist} \n`)
//             const sumRaw = res.map(element => element.raw).reduce((acc, curr) => {
//                 acc = acc + curr
//                 return acc
//             }, 0)
//             const rawAvg = sumRaw / res.length
//             console.log(`Artist: ${artist}\nSongs: ${songs.toString().replace(/,/g, '')}\n average world score: ${rawAvg}`)
//         }
//         start()
//     })
// }

// async function searchMultipleAppearences() {
//     const response = await inquirer.prompt([{
//         type: 'input',
//         message: 'Choose number',
//         name: 'number',
//         validate: (input) => {
//             const regex = new RegExp(/^[0-9]*$/g)
//             return regex.test(input) || 'must be a number'
//         }
//     }])
//     const { number } = response
//     connection.query(`SELECT artist FROM Top5000 GROUP BY artist HAVING count(*) > ${number}`, (err, res) => {
//         if (err) throw err
//         if (res.length < 1) {
//             console.log(`\x1b[31m No results found!`)
//         } else {
//             const artistJawns = res.map(element => `${element.artist} \n`)
//             console.log(`The following artists have ${number} song${number > 1 ? 's' : ''} on the top 5000 charts\n${artistJawns.toString().replace(/,/g, '')}`)
//         }
//         start()
//     })
// }

// function searchRange() {
//     console.log('search range')
// }

// async function searchSong() {
//     const response = await inquirer.prompt([{
//         type: 'input',
//         message: 'What song would you like to search?',
//         name: 'song'
//     }])
//     const { song } = response
//     connection.query('select * from Top5000 where ?', { song }, (err, res) => {
//         if (err) throw err
//         res = res[0]
//         let text
//         if (!res) {
//             text = `Song: ${song} not found!`
//             console.log(`\x1b[31m ${text}`)
//         } else {
//             text = `${res.song} was written by ${res.artist} in ${res.year}.`
//             console.log(`${text}`)
//         }
//         start()
//     })
// }

// async function searchSong() {
//     console.log('search song')
//     const response = await inquirer.prompt([{
//         type: 'input',
//         message: 'What song would you like to search?',
//         name: 'song'
//     }])

//     const { song } = response
//     connection.query('select (songs.artist, albums.year, songs.raw) from Top5000 songs join TopAlbums albums on songs.artist = albums.artist and songs.year = albums.year where ?', { song }, (err, res) => {
//         if (err) throw err
//         if (res.length < 1) {
//             text = `Song: ${song} not found!`
//             console.log(`\x1b[31m ${text}`)
//         } else {
//             const songs = res.map(element => `${element.artist} \n`)
//             const sumRaw = res.map(element => element.raw).reduce((acc, curr) => {
//                 acc = acc + curr
//                 return acc
//             }, 0)
//             const rawAvg = sumRaw / res.length
//             console.log(`Song: ${song}\nSongs: ${songs.toString().replace(/,/g, '')}\n average world score: ${rawAvg}`)
//         }
//         start()
//     })
// }