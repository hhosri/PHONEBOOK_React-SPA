import axios from "axios";
const url_path = "http://localhost:3002/persons";

const from_server = () => {
    return (
    axios
    .get(url_path)
    .then(response => response.data)
    .catch(error => console.error(error))
    )
}

const to_server = (entry) =>{
    return(
        axios
        .post(url_path, entry)
        .then(response => response.data)
        .catch(error => console.error(error))
    )
}

const del_entry = (person) =>{
    let url = url_path
    url += "/"
    url += person.id
    return(
        axios
        .delete(url)
    )
}

const update_num = (persons, newEntry, newNumber) => {
    let existingPerson = persons.find((person) => person.name.toLowerCase() === newEntry.name.toLowerCase());
    let updatedPerson = {...existingPerson, number:newNumber}
    let url = url_path
    url += "/"
    url += existingPerson.id
    return(
        axios
        .put(url, updatedPerson)
        .then(response => response.data)
        .catch(error => console.error(error))
    )
}

const server_functs = {from_server, to_server, del_entry, update_num}
export default server_functs;