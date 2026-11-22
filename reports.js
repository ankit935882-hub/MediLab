function displayReports() {
    const samples = getData("samples");

    const table = document.getElementById("reportTable");

    table.innerHTML = samples
        .filter(s => s.status === "Verified")
        .map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.patientName}</td>
                <td>${s.test}</td>
                <td>${s.result}</td>
                <td><span class="status completed">Verified</span></td>
                <td>
                    <button class="btn" onclick="printReport('${s.id}')">
                        Print Report
                    </button>
                </td>
            </tr>
        `).join("");
}

function printReport(id) {
    const samples = getData("samples");
    const sample = samples.find(s => s.id === id);

    if (!sample || sample.status !== "Verified") {
        alert("Report is not verified yet.");
        return;
    }

    const patients = getData("patients");
    const patient = patients.find(p => p.id === sample.patientId);

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
        alert("Please allow pop-ups to print the report.");
        return;
    }

    reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laboratory Report</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 40px;
                    color: #1e293b;
                }

                h1 {
                    text-align: center;
                    color: #087e8b;
                }

                hr {
                    margin: 20px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 30px;
                }

                td, th {
                    border: 1px solid #ccc;
                    padding: 15px;
                    text-align: left;
                }

                .footer {
                    margin-top: 80px;
                    text-align: right;
                }

                @media print {
                    button {
                        display: none;
                    }
                }
            </style>
        </head>

        <body>
            <h1>MEDILAB DIAGNOSTIC CENTER</h1>
            <p style="text-align:center">
                Diagnostic Laboratory Test Report
            </p>

            <hr>

            <h3>Patient Information</h3>

            <p><b>Patient ID:</b> ${sample.patientId}</p>
            <p><b>Name:</b> ${sample.patientName}</p>
            <p><b>Age:</b> ${patient ? patient.age : "N/A"}</p>
            <p><b>Gender:</b> ${patient ? patient.gender : "N/A"}</p>
            <p><b>Sample ID:</b> ${sample.id}</p>
            <p><b>Sample Type:</b> ${sample.type}</p>
            <p><b>Technician:</b> ${sample.technician}</p>

            <hr>

            <h3>Test Results</h3>

            <table>
                <tr>
                    <th>Test Name</th>
                    <th>Result</th>
                    <th>Reference Range</th>
                </tr>

                <tr>
                    <td>${sample.test}</td>
                    <td>${sample.result}</td>
                    <td>${sample.reference || "Not Specified"}</td>
                </tr>
            </table>

            <p><b>Remarks:</b> ${sample.remarks || "N/A"}</p>

            <p><b>Verification Status:</b> VERIFIED</p>
            <p><b>Verified At:</b> ${sample.verifiedAt || "N/A"}</p>

            <div class="footer">
                <p>________________________</p>
                <p>Authorized Laboratory Personnel</p>
            </div>

            <button onclick="window.print()">Print Report</button>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

const reportSearch = document.getElementById("reportSearch");

if (reportSearch) {
    reportSearch.addEventListener("input", function() {
        const value = this.value.toLowerCase();

        document.querySelectorAll("#reportTable tr").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(value)
                ? ""
                : "none";
        });
    });
}

displayReports();