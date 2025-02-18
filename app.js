// ????? ?????????? ?? localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// ????? ?????? ????????? ????? ??????? ???????? ?????? ?????
let extinguishers = JSON.parse(localStorage.getItem('extinguishers')) || [];
let ppe = JSON.parse(localStorage.getItem('ppe')) || [];
let accidents = JSON.parse(localStorage.getItem('accidents')) || [];
let currentUser = null;

// ????? ????????
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!fullName || !email || !phone || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    users.push({ fullName, email, phone, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Inscription réussie! Veuillez vous connecter.");
    document.getElementById('registerForm').reset();
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
});

// ????? ???? ????????
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("E-mail ou mot de passe incorrect.");
        return;
    }

    currentUser = user;
    document.getElementById('homePage').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
    updateDashboard();
});

// ????? ???? ??????
function updateDashboard() {
    document.getElementById('displayName').textContent = currentUser.fullName;
    document.getElementById('displayEmail').textContent = currentUser.email;
    document.getElementById('displayPhone').textContent = currentUser.phone;

    updateExtinguishersTable();
    updatePpeTable();
    updateAccidentsTable();
}

// ????? ???? ??????? ???????
function updateExtinguishersTable() {
    const tableBody = document.getElementById('extinguishersTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    extinguishers.forEach(extinguisher => {
        const row = document.createElement('tr');

        const daysUntilExpiry = Math.ceil((new Date(extinguisher.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

        row.innerHTML = `
            <td>${extinguisher.type}</td>
            <td>${extinguisher.location}</td>
            <td>${extinguisher.refillDate}</td>
            <td>${extinguisher.expiryDate}</td>
            <td>${extinguisher.responsibleCompany}</td>
            <td>${daysUntilExpiry <= 30 ? '<span class="notification">Proche de l\'expiration</span>' : 'En bon état'}</td>
        `;

        tableBody.appendChild(row);
    });
}

// ????? ?????? ????? ?????
function addExtinguisher() {
    const type = prompt("Type d'extincteur:");
    const location = prompt("Emplacement:");
    const refillDate = prompt("Date de remplissage (YYYY-MM-DD):");
    const expiryDate = prompt("Date d'expiration (YYYY-MM-DD):");
    const responsibleCompany = prompt("Entreprise responsable:");
    const status = prompt("État (En bon état / Nécessite maintenance / Expiré)");

    if (type && location && refillDate && expiryDate && responsibleCompany && status) {
        extinguishers.push({
            type,
            location,
            refillDate,
            expiryDate,
            responsibleCompany,
            status
        });
        localStorage.setItem('extinguishers', JSON.stringify(extinguishers));
        updateExtinguishersTable();
    }
}

// ????? ???? ????? ??????? ???????
function updatePpeTable() {
    const tableBody = document.getElementById('ppeTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    ppe.forEach(person => {
        const row = document.createElement('tr');

        const daysUntilReplacement = Math.ceil((new Date(person.nextReplacementDate) - new Date()) / (1000 * 60 * 60 * 24));

        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.function}</td>
            <td>${person.receptionDate}</td>
            <td>${daysUntilReplacement <= 30 ? '<span class="notification">Proche de la date de remplacement</span>' : person.nextReplacementDate}</td>
        `;

        tableBody.appendChild(row);
    });
}

// ????? ????? ????? ????? ?????
function addPpe() {
    const name = prompt("Nom et prénom:");
    const functionn = prompt("Fonction:");
    const receptionDate = prompt("Date de réception (YYYY-MM-DD):");
    const nextReplacementDate = prompt("Date de prochain remplacement (YYYY-MM-DD):");

    if (name && functionn && receptionDate && nextReplacementDate) {
        ppe.push({
            name,
            functionn,
            receptionDate,
            nextReplacementDate
        });
        localStorage.setItem('ppe', JSON.stringify(ppe));
        updatePpeTable();
    }
}

// ??