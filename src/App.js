import { useState, useEffect} from "react";
import server_functs from "./server/server";

const Notification = ({message, type}) =>{
  let notification_style ={
    color:'black',
    background: 'lightgrey',
    textAlign: 'center',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    zIndex: 1,
  }
  if (type === "good")
  {
    notification_style ={
      color:'green'
    }
  }
  else if (type === "bad")
  {
    notification_style ={
      color:'red'
    }
  }

  if (message === null){
    return null;}
  else{
    return(
      <div className="error" style={notification_style}>
        {message}
      </div>
    )
  }
}

const DisplayContact = ({person, search, delete_entry}) => {
  if (person.name.toLowerCase().includes(search.toLowerCase()))
  {
    return (
      <li className="note">
        {person.name} - {person.number}
        <button onClick={() => delete_entry(person)}>Delete</button>
      </li>
    );
  }
};

const SearchBox = ({newSearch, updateSearch}) => {
  return(
    <table>
    <tbody>
    <tr>
      <td>
        <label>Search:</label>
      </td>
      <td>
        <input value={newSearch} onChange={updateSearch} />
      </td>
    </tr>
    </tbody>
    </table>
  )
};

const NewContact = ({addEntry, newName, updateName, updateNumber, newNumber}) =>{
  return (
    <div>
      <h3>Add Contact:</h3>
      <form onSubmit={addEntry}>
      <table>
      <tbody>
      <tr>
        <td>
          <label>Name</label>
        </td>
        <td>
          <input value={newName} onChange={updateName} required/>
        </td>
      </tr>
      <tr>
        <td>
          <label>Number</label>
        </td>
        <td>
          <input value={newNumber} onChange={updateNumber} required/>
        </td>
      </tr>
      <tr>
        <td>
          <button type="submit">add</button>
        </td>
      </tr>
      </tbody>
    </table>
    </form>
    </div>

  )
};

const ContactList = ({persons, newSearch, delete_entry}) =>{
  if (persons.length === 0)
  {
    return(
      <h3>List is empty, please add a contact</h3>
    )
  }
  else{
    return (
      <div>
          <h3>Numbers</h3>
          <ul>
          {persons.map((person) => (
          <DisplayContact delete_entry={delete_entry} person={person} search={newSearch} key={person.id} />
          ))}
          </ul>
      </div>
    )
  }

};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [errorMsg, setNewMsg] = useState(null);
  const [notification_type, setNewType] = useState("");

  useEffect( () =>{
  server_functs
  .from_server()
  .then(data => setPersons(data))
  },
  [])

  const updateName = (event) => {
    setNewName(event.target.value);
  };

  const updateNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const updateSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const delete_entry = (person) =>
{
  if (window.confirm("Do you really want to delete this contact?"))
  {
    server_functs
    .del_entry(person)
    .then(() => {
    })
    .catch((error) => {
      setNewType("bad");
      setNewMsg(`${person.name} has already been removed from the list`);
      console.error(error);
      setTimeout(() => {setNewMsg(null)}, 5000)
    })
    setPersons(persons.filter(p => p.id !== person.id))
  }

}

  const addEntry = (event) => {
    event.preventDefault();
    const newEntry = {
      name: newName,
      number: newNumber
    };
    setNewType("good");
    if (persons.some((person) => person.name.toLowerCase() === newEntry.name.toLowerCase()))
    {
      if (window.confirm(`Do you really want to updathe ${newEntry.name}?`))
      {
        server_functs
        .update_num(persons,newEntry,newNumber)
        .then(data => {
          const updatedPersons = persons.map(person => person.id === data.id ? data : person);
          setPersons(updatedPersons)
          setNewMsg(`Updated ${newEntry.name}!`)
        })
      }
    }
    else {
      server_functs
      .to_server(newEntry)
      .then(data => setPersons(persons.concat(data)))
      setNewMsg(`Added ${newEntry.name}!`)
    }
    setTimeout(() => {setNewMsg(null)}, 5000)
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <Notification message={errorMsg} type={notification_type} />
      <h2>PHONEBOOK</h2>
      <SearchBox newSearch={newSearch} updateSearch={updateSearch}/>
      <NewContact addEntry={addEntry} newName={newName} updateName={updateName} updateNumber={updateNumber} newNumber={newNumber}/>
      <ContactList delete_entry={delete_entry} persons={persons} newSearch={newSearch} />
    </div>
  );
};

export default App;
