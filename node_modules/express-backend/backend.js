import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = {
  users_list: []};

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
    );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:name/:job", (req, res) => {
  const name = req.params.name;
  const job = req.params.job;
  let result1 = findUserByName(name);
  let result2 = findUserByJob(job);
  if (result1 === undefined || result2 === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result1);
  }
});

const findUserById = (id) =>  users["users_list"].find((user) => user["id"] === id);


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  if (!userToAdd.id) {
    userToAdd.id = Math.random().toString(36).slice(2);
  }
  addUser(userToAdd);
  res.status(201).json(userToAdd);
});

const rmUser = (id) => {
    users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
};

const rmUserName = (name) => {
    users["users_list"] = users["users_list"].filter((user) => user["name"] !== name);
};

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const exist = findUserById(id);
    if(exist === undefined){
        res.status(404).send("Resource Not Found.");
    }else{
        rmUser(id);
        res.send();
    }
});