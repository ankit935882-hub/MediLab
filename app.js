function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function updateDashboard() {
    const patients = getData("patients");
    const samples = getData("samples");

    document.getElementById("totalPatients").textContent = patients.length;
    document.getElementById("totalSamples").textContent = samples.length;

    document.getElementById("pendingSamples").textContent =
        samples.filter(s => s.status !== "Completed").length;

    document.getElementById("completedReports").textContent =
        samples.filter(s => s.status === "Verified").length;

    const recent = document.getElementById("recentSamples");

    if (recent) {
        recent.innerHTML = samples.slice(-5).reverse().map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.patientName}</td>
                <td>${s.test}</td>
                <td><span class="status">${s.status}</span></td>
            </tr>
        `).join("");
    }
}

if (document.getElementById("totalPatients")) {
    updateDashboard();
}