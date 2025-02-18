// تخزين المستخدمين في localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// تخزين بيانات الطفايات، معدات الوقاية الشخصية، وحوادث العمل
let extinguishers = JSON.parse(localStorage.getItem('extinguishers')) || [];
let ppe = JSON.parse(localStorage.getItem('ppe')) || [];
let accidents = JSON.parse(localStorage.getItem('accidents')) || [];
let currentUser = null;

// تسجيل المستخدم
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
    window.location.href = 'login.html'; // تحويل المستخدم إلى صفحة تسجيل الدخول
});

// تسجيل دخول المستخدم
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
    window.location.href = 'dashboard.html'; // تحويل المستخدم إلى لوحة التحكم
});

// تحديث لوحة التحكم
function updateDashboard() {
    document.getElementById('displayName').textContent = currentUser.fullName;
    document.getElementById('displayEmail').textContent = currentUser.email;
    document.getElementById('displayPhone').textContent = currentUser.phone;

    updateExtinguishersTable();
    updatePpeTable();
    updateAccidentsTable();
}

// تحديث جدول قارورات الإطفاء
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

// إضافة قارورة إطفاء جديدة
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

// تحديث جدول معدات الوقاية الشخصية
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

// إضافة معدات وقاية شخصية جديدة
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

// تحديث جدول حوادث العمل
function updateAccidentsTable() {
    const tableBody = document.getElementById('accidentsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    accidents.forEach(accident => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${accident.name}</td>
            <td>${accident.dateAndTime}</td>
            <td>${accident.location}</td>
            <td>${accident.accidentType}</td>
            <td>${accident.absenceDuration}</td>
        `;
        tableBody.appendChild(row);
    });
}

// إضافة حادث عمل جديد
function addAccident() {
    const name = prompt("Nom et prénom:");
    const dateAndTime = prompt("Date et heure de l'accident (YYYY-MM-DD HH:MM):");
    const location = prompt("Lieu de l'accident:");
    const accidentType = prompt("Type d'accident:");
    const absenceDuration = prompt("Durée d'absence (en jours):");

    if (name && dateAndTime && location && accidentType && absenceDuration) {
        accidents.push({
            name,
            dateAndTime,
            location,
            accidentType,
            absenceDuration
        });
        localStorage.setItem('accidents', JSON.stringify(accidents));
        updateAccidentsTable();
    }
}

// تحديث لوحة التحكم عند تحميل الصفحة
window.onload = updateDashboard;
