const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE_PATH = "./users.json";

function readUsers() {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
}

function writeUsers(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

// 1- Add User
app.post("/user", (req, res) => {
    const { id, name, age, email } = req.body;
    let users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email already exists" });
    }

    users.push({ id, name, age, email });
    writeUsers(users);
    res.json({ message: "User added successfully" });
});

// 2- Update User
app.patch("/user/:id", (req, res) => {
    const id = Number(req.params.id);
    let users = readUsers();

    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, age, email } = req.body;
    if (name) user.name = name;
    if (age) user.age = age;
    if (email) user.email = email;

    writeUsers(users);
    res.json({ message: "User updated successfully" });
});

// 3- Delete User
app.delete("/user/:id", (req, res) => {
    const id = Number(req.params.id);
    let users = readUsers();

    const newUsers = users.filter(u => u.id !== id);
    if (newUsers.length === users.length) {
        return res.status(404).json({ message: "User not found" });
    }

    writeUsers(newUsers);
    res.json({ message: "User deleted successfully" });
});

// 4- Get By Name
app.get("/user/getByName", (req, res) => {
    const { name } = req.query;
    let users = readUsers();

    const user = users.find(u => u.name === name);
    res.json(user || { message: "User not found" });
});

// 5- Get All Users
app.get("/user", (req, res) => {
    res.json(readUsers());
});

// 6- Filter By Age
app.get("/user/filter", (req, res) => {
    const age = Number(req.query.age);
    let users = readUsers();

    res.json(users.filter(u => u.age >= age));
});

// 7- Get By ID
app.get("/user/:id", (req, res) => {
    const id = Number(req.params.id);
    let users = readUsers();

    const user = users.find(u => u.id === id);
    res.json(user || { message: "User not found" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//https://nassefm807-7801898.postman.co/workspace/Mahmoud-Sami-Nassef's-Workspace~2c8f71e3-56cd-43ad-874e-f48b10c4129c/collection/51125510-8b3360b9-54cb-4868-b2db-da353aac042d?action=share&creator=51125510&active-environment=51125510-a6a01ba8-8aeb-4d6b-ac3f-555686cd98a7
