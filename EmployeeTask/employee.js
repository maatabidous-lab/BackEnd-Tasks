const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
let Array_Of_Employee = [];
const Server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    let { url, method } = req;
    if (url === '/AddEmployee' && method === 'POST') {
        let Body = "";
        for await (const element of req) {
            Body += element;
        }
        let ParsingData = JSON.parse(Body);
        Array_Of_Employee.push(ParsingData);
        fs.writeFile(path.resolve(__dirname, 'Users.json'), JSON.stringify(Array_Of_Employee), { encoding: 'utf-8' }, (err) => {
            if (err) {
                console.log(err)
            }
        })
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('We Add This employee now');
        res.end();
    } else if (url === '/GetEmployee' && method === 'GET') {
        let Data = fs.readFileSync(path.resolve(__dirname, 'Users.json'));
        if (Data) {
            let Parsing = JSON.parse(Data);
            res.end(JSON.stringify(Parsing));
        } else {    
            console.log("There is no Data Now")
        }
    }
});
Server.listen(3001, () => {
    console.log("hello localHost 3001")
})
console.log("hello Branch")






