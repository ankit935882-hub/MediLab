const sampleForm = document.getElementById("sampleForm");

function displaySamples() {
    const samples = getData("samples");
    const patients = getData("patients");

    const table = document.getElementById("sampleTable");

    if (table) {
        table.innerHTML = samples.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.patientName}</td>
                <td>${s.test}</td>
                <td>${s.technician}</td>
                <td><span class="status">${s.status}</span></td>
                <td>
                    <button class="delete-btn"
                    onclick="deleteSample('${s.id}')">Delete</button>
                </td>
            </tr>
        `).join("");
    }

    const patientDropdown = document.getElementById("samplePatient");

    if (patientDropdown) {
        patientDropdown.innerHTML = '<option value="">Select Patient</option>';

        patients.forEach(p => {
            patientDropdown.innerHTML += `
                <option value="${p.id}">${p.name} (${p.id})</option>
            `;
        });
    }

    const resultDropdown = document.getElementById("resultSample");

    if (resultDropdown) {
        resultDropdown.innerHTML = '<option value="">Select Sample ID</option>';

        samples.filter(s => s.status !== "Verified").forEach(s => {
            resultDropdown.innerHTML += `
                <option value="${s.id}">${s.id} - ${s.patientName}</option>
            `;
        });
    }

    displayResults();
}

if (sampleForm) {
    sampleForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const samples = getData("samples");
        const patients = getData("patients");

        const patientId = document.getElementById("samplePatient").value;
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            alert("Please register a patient first.");
            return;
        }

        const sample = {
            id: "SMP" + Date.now().toString().slice(-6),
            patientId: patient.id,
            patientName: patient.name,
            test: document.getElementById("sampleTest").value,
            technician: document.getElementById("technician").value,
            type: document.getElementById("sampleType").value,
            status: "Collected",
            result: "",
            reference: "",
            remarks: ""
        };

        samples.push(sample);
        saveData("samples", samples);

        alert("Sample Added Successfully! ID: " + sample.id);

        sampleForm.reset();
        displaySamples();
    });
}

function deleteSample(id) {
    if (!confirm("Delete this sample?")) return;

    const samples = getData("samples").filter(s => s.id !== id);

    saveData("samples", samples);
    displaySamples();
}

function displayResults() {
    const table = document.getElementById("resultTable");

    if (!table) return;

    const samples = getData("samples");

    table.innerHTML = samples.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.patientName}</td>
            <td>${s.test}</td>
            <td>${s.result || "Not Entered"}</td>
            <td><span class="status">${s.status}</span></td>
            <td>
                ${s.result && s.status !== "Verified" ?
                `<button class="verify-btn"
                onclick="verifyResult('${s.id}')">Verify</button>` : ""}
            </td>
        </tr>
    `).join("");
}

const resultForm = document.getElementById("resultForm");

if (resultForm) {
    resultForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const samples = getData("samples");

        const id = document.getElementById("resultSample").value;
        const sample = samples.find(s => s.id === id);

        if (!sample) {
            alert("Sample not found.");
            return;
        }

        sample.result = document.getElementById("testResult").value;
        sample.reference = document.getElementById("referenceRange").value;
        sample.remarks = document.getElementById("remarks").value;
        sample.status = "Pending Verification";

        saveData("samples", samples);

        alert("Result Saved Successfully!");

        resultForm.reset();
        displaySamples();
    });
}

function verifyResult(id) {
    const samples = getData("samples");

    const sample = samples.find(s => s.id === id);

    if (!sample || !sample.result) return;

    if (confirm("Verify this result?")) {
        sample.status = "Verified";
        sample.verifiedAt = new Date().toLocaleString();

        saveData("samples", samples);

        alert("Result Verified Successfully!");
        displaySamples();
    }
}

displaySamples();