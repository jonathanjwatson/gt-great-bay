const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Mickey19",
  database: "great_bay_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  //   readItems();
  init();
});

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: ["POST", "BID", "EXIT"],
        name: "userChoice",
      },
    ])
    .then((data) => {
      console.log(data);
      if (data.userChoice === "POST") {
        postItem();
      } else if (data.userChoice === "BID") {
        bidOnItem();
      } else {
        connection.end();
      }
    });
}

function postItem() {
  console.log("post an item");
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the item name?",
      },
      {
        type: "input",
        name: "bid",
        message: "What is the starting bid?",
      },
    ])
    .then((data) => {
      console.log(data);
      connection.query("INSERT INTO items SET ?", data, function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " item inserted!\n");
        // readItems();
        init();
      });
    });
}

function bidOnItem() {
  console.log("Bid on an item");
  connection.query("SELECT * FROM items", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    const arrayOfNames = res.map((item) => item.name);
    inquirer
      .prompt([
        {
          type: "list",
          choices: arrayOfNames,
          name: "usersChoice",
        },
        {
          type: "input",
          name: "userBid",
          message: "How much would you like to bid?",
        },
      ])
      .then((userInput) => {
        let selectedItem = {};
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === userInput.usersChoice) {
            selectedItem = res[i];
          }
        }
        console.log("Selected Item: ", selectedItem);
        console.log("User Input: ", userInput);
        if (parseFloat(selectedItem.bid) >= parseFloat(userInput.userBid)) {
          console.log("I'm sorry. That's not good enough.");
          init();
        } else {
          console.log("Your bid is valid.");
          // UPDATE THE ROW WITH THE UPDATE BID.
          connection.query(
            "UPDATE items SET ? WHERE ?",
            [
              {
                bid: userInput.userBid,
              },
              {
                id: selectedItem.id,
              },
            ],
            function (err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " items updated!\n");
                readItems();
            }
          );
        }
      });
  });
}

function readItems() {
  console.log("Selecting all items...\n");
  connection.query("SELECT * FROM items", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}
