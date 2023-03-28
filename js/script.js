const openModal = () => document.getElementById('modal').classList.add('active');
const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}
const clearInput = () =>  {
    document.getElementById('search-input').value = '';
    updateTable();
}
const searchInput = document.querySelector("#search-input");


// const tempClient = {
//     obra: "Tomo-chan wa Onnanoko",
//     capitulo: 5,
// }

const getLocalStorage = () =>{
    return JSON.parse(localStorage.getItem('db_client')) ?? [];
} 

const setLocalStorage = (dbClient) => {
    return localStorage.setItem("db_client", JSON.stringify(dbClient));

}

const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

//Update
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);

}

 //read
const readClient = () => {
    return getLocalStorage();
}

//create
const createClient = (client) => { //1
    const dbClient = getLocalStorage();
    // console.log(db_client);
    dbClient.push(client);
    setLocalStorage(dbClient);
}
//Verificando se os campos esta vazio
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}
// Verificando se existe obra repetidas ou cadastrada
const isDuplicatedClient = (client) => {
    const dbClient = readClient();
    const repeatedClient = dbClient.find(c => c.obra === client.obra);
    return repeatedClient;
}

//Interção com usuario

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

const saveClient = () => {
    if(isValidFields()) {
        const client = {
            obra: document.getElementById('nome').value,
            capitulo: document.getElementById('number').value
        }
        if(isDuplicatedClient(client)) {
            return confirm('Obra Já Cadastrada na Lista');
        };
        const index = document.getElementById('nome').dataset.index;
        if(index === 'new') {
            createClient(client);
            updateTable();
            closeModal();//5541

        }else{
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.obra}</td>
        <td>${client.capitulo}</td>
        <td>
            <button type="button"  class="button" id="edit-${index}">Editar</button>
            <button type="button"  class="button red" id="delete-${index}">Excluir</button>
        </td>

    `
    document.querySelector('#tableClient > tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
} 

const updateTable = () => {
    dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow)

}

const fillFields = (client) => {
    document.getElementById('nome').value = client.obra;
    document.getElementById('number').value = client.capitulo;
    document.getElementById('nome').dataset.index = client.index;
}
const editClient = (index) => {
    const dbClient = readClient()[index];
    dbClient.index = index;
    fillFields(dbClient);    
    openModal();

}

const editDelete = (event) => {
    if(event.target.type === 'button') {
        const [action, index] = event.target.id.split('-'); //Usnado destruturação
        if(action === 'edit') {
            editClient(index);
        }else {
            const client = readClient()[index];
            const response = confirm(`Deseja realmente excluir o ${client.obra} ?`);
            if(response) {
                deleteClient(index);
                updateTable();
            }
        }
    }
}


updateTable();

//Pesquisar o nome na tablea;
const searchClient = () => {
    const searchValue = searchInput.value.toLowerCase();
    const dbClient = readClient();
    const filteredClient = dbClient.filter(client => client.obra.toLowerCase().includes(searchValue));
    clearTable()
    filteredClient.forEach(createRow);
}

//Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('clear-search').addEventListener('click', clearInput);
searchInput.addEventListener("input", searchClient);

document.getElementById('save').addEventListener('click', saveClient);
document.getElementById('cancel').addEventListener('click', closeModal);

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)