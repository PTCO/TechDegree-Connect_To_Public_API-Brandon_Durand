const diretory = document.querySelector('#Employees');
const Modal = document.querySelector('#Employee_Modal');
const Input = document.querySelector('.Search');
const API = '';

// Fetches data from passed in API
async function fetchData(url){
    try {
        const Response = await fetch(url);
        const Results = await Response.json();

        return Results;
    } catch (error) {
        throw error;
    }
}

let loadedEmployees = [];
let filteredEmployees = [];

async function createEmployee(){
    try {
        const Results = await fetchData('https://randomuser.me/api/?nat=gb,us');
        const Employee = Results.results[0];
        
        loadedEmployees.push(Employee)
        const HTML = `
        <div class="Employee">
             <img src="${Employee.picture.large}" alt="">
             <span>
                 <h2>${Employee.name.first} ${Employee.name.last}</h2>
                 <p>${Employee.email}</p>
                 <p>${Employee.location.city}, ${Employee.location.state}</p>
             </span>
        </div>
        `
        diretory.insertAdjacentHTML('beforeend', HTML);

        const Employees = document.querySelectorAll('.Employee');
        Employees.forEach( (employee, index) => {
            employee.addEventListener('click', ()=>{
                openEmployeeModal(loadedEmployees[index], loadedEmployees, index);
            })
        })
    } catch (error) {
        console.log(error)
    }
}

// Filters phone number to be formatted
function filterPhone(phone){
    let arr = [];
    const length = /\w*(\d{10})/gm
    phone.split("").forEach( char => {
        if(char !== '-' && char !== ' ' && char !== '(' && char !== ')'){
            arr.push(char)
        }
    })
    let numLength = arr.join("").replace(length, '$1').length;
    if(numLength < 10){
        while( arr.length <10){
            arr.unshift('0')
        }
    }
    return arr.join("")
}

function formatBirthdate(Birthdate){
    const format = /(\d{4})-(\d{2})-(\d{2})/gm;
    return Birthdate.split('T')[0].replace(format, '$2/$3/$1');
}

// Populates and displays employee modal
function openEmployeeModal(Employee, Directory, index){
    const format = /\D*(\w{3})\D*(\w{3})\D*(\w{4})$/gm;  
    const phone = filterPhone(Employee.phone).replace(format, '($1) $2-$3');
    const address = `${Employee.location.street.number} ${Employee.location.street.name}, ${Employee.location.city}, ${Employee.location.state}, ${Employee.location.postcode}`
    const Modal_HTML = 
    `
    <div>
        <span>
            <button class="switchBtn">BACK</button>
            <button class="switchBtn">NEXT</button>
            <button class="Close">X</button>
        </span>
        <img src="${Employee.picture.large}" alt="">
        <h2>${Employee.name.first} ${Employee.name.last}</h2>
        <p>${Employee.email}</p>
        <p>${Employee.location.city}</p>
        <div>
            <p>${phone}</p>
            <p>${address}</p>
            <p>Birthdaty: ${formatBirthdate(Employee.dob.date)}</p>
        </div>
    </div>
    <span class="blur"></span>
    `
    Modal.style.display = 'flex'
    Modal.innerHTML =  Modal_HTML;
    document.querySelector('.Close').addEventListener('click', ()=>{
        Modal.style.display = 'none'
    })
    document.querySelectorAll('.switchBtn')[0].addEventListener('click', ()=>{
        if(index > 0){
            openEmployeeModal(Directory[index - 1], Directory, index - 1)
        }
    })
    document.querySelectorAll('.switchBtn')[1].addEventListener('click', ()=>{
        if(Directory[index + 1] !== undefined){
            openEmployeeModal(Directory[index + 1], Directory, index + 1)
        }
    })
}

// Filters employees based of user's input
function filterEmployees(){
    let HTML= [];
    filteredEmployees.forEach( employee => {
        HTML.push(`
        <div class="Employee" style="max-width: 50%">
             <img src="${employee.picture.large}" alt="">
             <span>
                 <h2>${employee.name.first} ${employee.name.last}</h2>
                 <p>${employee.email}</p>
                 <p>${employee.location.city}, ${employee.location.state}</p>
             </span>
        </div>
        `)
    });
    diretory.innerHTML = HTML.join("");
    const Employees = document.querySelectorAll('.Employee');
    Employees.forEach( (employee, index) => {
        employee.addEventListener('click', ()=>{
            openEmployeeModal(filteredEmployees[index], filteredEmployees, index);
        })
    })
    
}

// Loads 12 employees
for (let x = 0; x < 12; x++) {
    createEmployee();
}


// Filters employee directory on user input
Input.addEventListener('keyup', e => {
    e.preventDefault();

    const value = Input.value;
    
    filteredEmployees = [];

    loadedEmployees.forEach( (employee, index) => {
        if(employee.name.first.toLowerCase().includes(value.toLowerCase()) || employee.name.last.toLowerCase().includes(value.toLowerCase())){
            filteredEmployees.push(employee)
        }
    })
    if(value !== ''){
        filterEmployees();
    } 
    else{
        filteredEmployees = loadedEmployees;
        filterEmployees();
    }         
})