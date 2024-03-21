const diretory = document.querySelector('#Employees');
const Modal = document.querySelector('#Employee_Modal');
const API = '';

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

async function createEmployee(){
    try {
        const Results = await fetchData('https://randomuser.me/api/');
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
        diretory.innerHTML += HTML;

        document.querySelectorAll('.Employee').forEach( (employee, index) => {
            employee.addEventListener('click', ()=>{
                openEmployeeModal(loadedEmployees[index]);
            })
        })


    } catch (error) {
        console.log(error)
    }
}

function filterPhone(phone){
    let arr = [];
    const remove = /(-)|( )|\D/gm; 
    const length = /\w*(\d{10})/gm

    

    phone.split('').forEach( char => {
        if(!remove.test(char)) {
            arr.push(char)
        }
    })
    let num = arr.join("").replace(length, '$1')

    return num;

}

function openEmployeeModal(Employee){
    const format = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})$/;  
    const phone = filterPhone(Employee.phone).replace(format, '($1) $2-$3');
    console.log(phone)
    const Modal_HTML = `
    <div>
        <button>X</button>
        <img src="${Employee.picture.large}" alt="">
        <h2>${Employee.name.first} ${Employee.name.last}</h2>
        <p>${Employee.email}</p>
        <p>${Employee.location.city}</p>
        <div>
            <p></p>
            <p>adsa</p>
            <p>asdas</p>
        </div>
    </div>
    <span class="blur"></span>
    `

    Modal.innerHTML = Modal_HTML;

    Modal.style.display = 'flex';
    Modal.addEventListener('click', e => {
        if(e.target.tagName = 'BUTTON'){
            Modal.style.display = 'none'
        }
    })
}

for (let x = 0; x < 12; x++) {
    createEmployee();
}



