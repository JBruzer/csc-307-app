import Table from "./Table";
import Form from "./Form";
import React, {useState, useEffect} from 'react';

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

function postUser(person) {
  return fetch("http://localhost:8000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(person),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((err) => console.log("POST error:", err)); // see exact backend error
    }
    return res;
  });
}

  function delUser(person) {
    const promise = fetch(`http://localhost:8000/users/${person.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }


function updateListAdd(person) {
  postUser(person)
    .then((res) => {
      if (res.status === 201) {
        return res.json();
      } else {
        throw new Error("User not created, status: " + res.status);
      }
    })
    .then((newUser) => setCharacters([...characters, newUser]))
    .catch((error) => console.log(error));
}

  function updateListDel(person) { 
    delUser(person)
      .then(() => setCharacters(characters.filter(character => character.id !== person.id)))
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
  }, [] );


  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={updateListDel}
    />
    <Form handleSubmit={updateListAdd} />
  </div>
  );
}

export default MyApp;