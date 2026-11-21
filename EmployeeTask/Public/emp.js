'use strict'
let employee_vars = {
    AddBtn: document.getElementById('AddBtn'),
    TotalEmployee: document.getElementById('TotalEmployee'),
    Totalpharmaciest: document.getElementById('Totalpharmaciest'),
    TotalChacier: document.getElementById('TotalChacier'),
    TotalDelivery: document.getElementById('TotalDelivery'),
    TotalCleaner: document.getElementById('TotalCleaner'),
    TotalManager: document.getElementById('TotalManager'),
    TotalSalaries: document.getElementById('TotalSalaries'),
    SearchBar: document.getElementById('SearchBar'),
    GridBody: document.getElementById('GridBody'),
    SelectRole: document.getElementById('SelectRole'),
    Shifts: document.getElementById('Shifts'),
    SaveEmp: document.getElementById('SaveEmp'),
    AddressInp: document.getElementById('AddressInp'),
    salaryInp: document.getElementById('salaryInp'),
    ShiftInp: document.getElementById('ShiftInp'),
    RoleInp: document.getElementById('RoleInp'),
    PhoneInp: document.getElementById('PhoneInp'),
    NameInp: document.getElementById('NameInp'),
}
// CLEAR DATA AFTER SAVE 
function clear() {
    [employee_vars.NameInp, employee_vars.salaryInp, employee_vars.AddressInp,
    employee_vars.PhoneInp, employee_vars.ShiftInp, employee_vars.RoleInp].forEach((val) => {
        val.value = ""
    })
}
// ====================================================
// ADD DATA FOR EMPLOYEE
async function Add_Employees(url) {
    let inp_name = employee_vars.NameInp.value;
    let inp_sallary = employee_vars.salaryInp.value;
    let inp_address = employee_vars.AddressInp.value;
    let inp_phone = employee_vars.PhoneInp.value;
    let inp_shift = employee_vars.ShiftInp.value;
    let inp_role = employee_vars.RoleInp.value;
    try {
        if (inp_name && inp_address && inp_phone && inp_role && inp_sallary && inp_shift) {
            let data = {
                Name: inp_name, Phone: inp_phone,
                Sallary: inp_sallary, Address: inp_address,
                Role: inp_role, Shift: inp_shift
            };
            let FetchedData_Request = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            let FetchedData_Response = await FetchedData_Request.json();
            alert(FetchedData_Response)
            clear()
        } else {
            alert('Enter All Field');
        }
    } catch (error) {
        console.log(error.message);
    }
}
employee_vars.SaveEmp.addEventListener('click', (e) => {
    e.preventDefault();
    Add_Employees('http://localhost:3001/AddEmployee');
})
// ====================================================
// SHOW EMPLOYEE
async function Show_Employee(url) {
    try {
        let Request = await fetch(url);
        let Reasponse = await Request.json();
        let TotalSalary = Reasponse.reduce((acc, curr) => {
            return acc + Number(curr.Sallary);
        }, 0);
        let Reduced = Reasponse.reduce((acc, curr) => {
            acc[curr.Role] = (acc[curr.Role] || 0) + 1;
            return acc;
        }, {})
        employee_vars.TotalSalaries.innerHTML = TotalSalary || 0;
        employee_vars.TotalEmployee.innerHTML = Reasponse.length || 0;
        employee_vars.TotalChacier.innerHTML = Reduced.Cashier || 0;
        employee_vars.TotalCleaner.innerHTML = Reduced.Cleaner || 0;
        employee_vars.TotalDelivery.innerHTML = Reduced.Delivery || 0;
        employee_vars.Totalpharmaciest.innerHTML = Reduced.Pharmacist || 0;
        employee_vars.TotalManager.innerHTML = Reduced.Manager || 0;

        let Mapping = Reasponse.map((item) => {
            return `
            <div class="emp-card">
                <div class="avatar">💊</div>
                <h3>${item.Name}</h3>
                <span class="role">${item.Role}</span>
                <div class="info">
                    <span>📞 ${item.Phone}</span>
                    <span> Shift: ${item.Shift}</span>
                    <span>📍 ${item.Address}</span>
                    <span>💰 Salary: <span class="salary">${item.Sallary} EGP</span></span>
                </div>
            </div>
            `
        }).join('');
        employee_vars.GridBody.innerHTML = Mapping;
    } catch (error) {
        console.log(error)
    }
}
Show_Employee('http://localhost:3001/GetEmployee')
// ===================================================
// SEARCH
async function Search(url) {
    try {
        let Request = await fetch(url);
        let Reasponse = await Request.json();
        let Filtering = Reasponse.filter((Value) => {
            return Value.Name.toLowerCase().includes(employee_vars.SearchBar.value.trim().toLowerCase());
        })
       if (Filtering.length > 0) {
                let Mapping = Filtering.map((item) => {
            return `
            <div class="emp-card">
                <div class="avatar">💊</div>
                <h3>${item.Name}</h3>
                <span class="role">${item.Role}</span>
                <div class="info">
                    <span>📞 ${item.Phone}</span>
                    <span> Shift: ${item.Shift}</span>
                    <span>📍 ${item.Address}</span>
                    <span>💰 Salary: <span class="salary">${item.Sallary} EGP</span></span>
                </div>
            </div>
            `
        }).join('');
        employee_vars.GridBody.innerHTML = Mapping
       } 
    } catch (error) {
        console.log(error)
    }
}
employee_vars.SearchBar.addEventListener('input', (e) => {
    Search('http://localhost:3001/GetEmployee');
})