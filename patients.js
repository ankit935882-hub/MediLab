const patientForm = document.getElementById("patientForm");

function displayPatients() {
    const patients = getData("patients");
    const table = document.getElementById("patientTable");

    table.innerHTML = patients.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.gender}</td>
            <td>${p.phone}</td>
        </tr>
    `).join("");

    const dropdown = document.getElementById("samplePatient");

    if (dropdown) {
        dropdown.innerHTML = '<option value="">Select Patient</option>';

        patients.forEach(p => {
            dropdown.innerHTML += `
                <option value="${p.id}">${p.name} (${p.id})</option>
            `;
        });
    }
}

if (patientForm) {
    patientForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const patients = getData("patients");

        const patient = {
            id: "PAT" + Date.now().toString().slice(-6),
            name: document.getElementById("patientName").value.trim(),
            age: document.getElementById("patientAge").value,
            gender: document.getElementById("patientGender").value,
            phone: document.getElementById("patientPhone").value,
            address: document.getElementById("patientAddress").value.trim()
        };

        patients.push(patient);
        saveData("patients", patients);

        alert("Patient Registered Successfully! ID: " + patient.id);

        patientForm.reset();
        displayPatients();
    });
}

const patientSearch = document.getElementById("patientSearch");

if (patientSearch) {
    patientSearch.addEventListener("input", function() {
        const value = this.value.toLowerCase();

        document.querySelectorAll("#patientTable tr").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(value)
                ? ""
                : "none";
        });
    });
}

displayPatients();