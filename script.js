// =========================
// Sentinel X
// Main JavaScript
// =========================


// =========================
// Saved Data
// =========================

let isolatedDevices = JSON.parse(
    localStorage.getItem("sentinelXIsolatedDevices") || "[]"
);

let containedIncidents = JSON.parse(
    localStorage.getItem("sentinelXContainedIncidents") || "[]"
);

let ignoredAlerts = JSON.parse(
    localStorage.getItem("sentinelXIgnoredAlerts") || "[]"
);

let blockedAlerts = JSON.parse(
    localStorage.getItem("sentinelXBlockedAlerts") || "[]"
);

let resolvedIncidents = JSON.parse(
    localStorage.getItem("sentinelXResolvedIncidents") || "[]"
);

let closedIncidents = JSON.parse(
    localStorage.getItem("sentinelXClosedIncidents") || "[]"
);


// =========================
// Helper: Save Alert Data
// =========================

function saveAlertData() {

    localStorage.setItem(
        "sentinelXIgnoredAlerts",
        JSON.stringify(ignoredAlerts)
    );

    localStorage.setItem(
        "sentinelXBlockedAlerts",
        JSON.stringify(blockedAlerts)
    );

}


// =========================
// Alert Buttons
// =========================

const investigateButtons =
    document.querySelectorAll(".investigate-btn");

const blockButtons =
    document.querySelectorAll(".block-btn");

const ignoreButtons =
    document.querySelectorAll(".ignore-btn");


// =========================
// Restore Alert States
// =========================

document.querySelectorAll(".alert-card").forEach(card => {

    let alertID = card.dataset.alert;

    if (!alertID) {

        const idElement =
            card.querySelector(".alert-id");

        if (idElement) {

            alertID =
                idElement.textContent
                    .trim()
                    .replace("Alert ID:", "")
                    .replace("Alert:", "")
                    .trim();

        }

    }

    if (!alertID) return;


    // Restore Blocked Alert

    if (blockedAlerts.includes(alertID)) {

        card.style.opacity = "0.6";

        card.classList.add(
            "alert-blocked"
        );

        card.style.border =
            "2px solid #ef4444";

        const blockButton =
            card.querySelector(".block-btn");

        if (blockButton) {

            blockButton.innerHTML =
                "✅ Blocked";

            blockButton.disabled = true;

        }

    }


    // Restore Ignored Alert

    if (ignoredAlerts.includes(alertID)) {

        card.style.opacity = "0.5";

        card.classList.add(
            "alert-ignored"
        );

        const ignoreButton =
            card.querySelector(".ignore-btn");

        if (ignoreButton) {

            ignoreButton.innerHTML =
                "✓ Ignored";

            ignoreButton.disabled = true;

        }

    }

});


// =========================
// Investigate Alert
// =========================

investigateButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (
            typeof window.sentinelHasPermission === "function" &&
            !window.sentinelHasPermission("investigateAlerts")
        ) {

            alert(
                "⛔ Access Denied\n\n" +
                "Your account does not have permission " +
                "to investigate alerts."
            );

            return;

        }


        const alertID =
            this.dataset.alert;

        if (!alertID) return;

        alert(
            "🔎 Opening Incident\n\n" +
            "Alert: " +
            alertID
        );

        window.location.href =
            "incidents.html?alert=" +
            encodeURIComponent(alertID);

    });

});


// =========================
// Block Device
// =========================

blockButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (
            typeof window.sentinelHasPermission === "function" &&
            !window.sentinelHasPermission("blockAlert")
        ) {

            alert(
                "⛔ Access Denied\n\n" +
                "Your account does not have permission " +
                "to block alerts."
            );

            return;

        }


        const card =
            this.closest(".alert-card");

        if (!card) return;


        let alertID =
            this.dataset.alert ||
            card.dataset.alert;


        if (!alertID) {

            const idElement =
                card.querySelector(".alert-id");

            if (idElement) {

                alertID =
                    idElement.textContent
                        .trim()
                        .replace("Alert ID:", "")
                        .replace("Alert:", "")
                        .trim();

            }

        }


        const deviceID =
            card.dataset.device;


        // Update UI

        card.style.opacity = "0.6";

        card.classList.add(
            "alert-blocked"
        );

        card.style.border =
            "2px solid #ef4444";

        this.innerHTML =
            "✅ Blocked";

        this.disabled =
            true;


        // Save blocked alert

        if (
            alertID &&
            !blockedAlerts.includes(alertID)
        ) {

            blockedAlerts.push(alertID);

        }


        // Isolate device

        if (
            deviceID &&
            !isolatedDevices.includes(deviceID)
        ) {

            isolatedDevices.push(deviceID);

            localStorage.setItem(
                "sentinelXIsolatedDevices",
                JSON.stringify(isolatedDevices)
            );

        }


        saveAlertData();


        alert(
            "🔒 Device Blocked Successfully\n\n" +
            "Alert: " +
            (alertID || "-") +
            "\n" +
            "Device: " +
            (deviceID || "-") +
            "\n\n" +
            "The device has been blocked and isolated."
        );

    });

});


// =========================
// Ignore Alert
// =========================

ignoreButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (
            typeof window.sentinelHasPermission === "function" &&
            !window.sentinelHasPermission("ignoreAlert")
        ) {

            alert(
                "⛔ Access Denied\n\n" +
                "Your account does not have permission " +
                "to ignore alerts."
            );

            return;

        }


        const card =
            this.closest(".alert-card");

        if (!card) return;


        let alertID =
            this.dataset.alert ||
            card.dataset.alert;


        if (!alertID) {

            const idElement =
                card.querySelector(".alert-id");

            if (idElement) {

                alertID =
                    idElement.textContent
                        .trim()
                        .replace("Alert ID:", "")
                        .replace("Alert:", "")
                        .trim();

            }

        }


        card.style.opacity =
            "0.5";

        card.classList.add(
            "alert-ignored"
        );

        this.innerHTML =
            "✓ Ignored";

        this.disabled =
            true;


        if (
            alertID &&
            !ignoredAlerts.includes(alertID)
        ) {

            ignoredAlerts.push(alertID);

        }


        saveAlertData();


        alert(
            "⚪ Alert Ignored\n\n" +
            "Alert: " +
            (alertID || "-") +
            "\n\n" +
            "This alert has been marked as ignored."
        );

    });

});


// =========================
// URL Parameters
// =========================

const params =
    new URLSearchParams(
        window.location.search
    );

const openedAlertID =
    params.get("alert");


// =========================
// Highlight Alert
// =========================

if (openedAlertID) {

    const alertCards =
        document.querySelectorAll(
            ".alert-card"
        );

    alertCards.forEach(card => {

        const cardAlertID =
            card.dataset.alert;

        if (
            cardAlertID === openedAlertID
        ) {

            card.classList.add(
                "alert-selected"
            );

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });

}


// =========================
// Incident Information
// =========================

const incidentInfo =
    document.getElementById(
        "incidentInfo"
    );

if (incidentInfo) {

    if (openedAlertID) {

        incidentInfo.innerHTML =
            "🚨 Opened from Alert: " +
            openedAlertID;


        const incidentRows =
            document.querySelectorAll(
                ".incidents tbody tr"
            );

        incidentRows.forEach(row => {

            const alertCell =
                row.cells[2];

            if (!alertCell) return;


            const rowAlertID =
                alertCell.textContent.trim();


            if (
                rowAlertID === openedAlertID
            ) {

                row.style.background =
                    "#263b5c";

                row.style.boxShadow =
                    "inset 4px 0 0 #00bfff";

                row.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        });

    } else {

        incidentInfo.innerHTML =
            "📂 Manual Incident View";

    }

}


// =========================
// Restore Incident States
// =========================

const allIncidentRows =
    document.querySelectorAll(
        ".incidents tbody tr"
    );

allIncidentRows.forEach(row => {

    const incidentID =
        row.cells[0]?.textContent.trim();


    if (!incidentID) {
        return;
    }


    if (
        closedIncidents.includes(
            incidentID
        )
    ) {

        if (row.cells[6]) {

            row.cells[6].textContent =
                "Closed";

            row.cells[6].className =
                "status-closed";

        }

        return;

    }


    if (
        resolvedIncidents.includes(
            incidentID
        )
    ) {

        if (row.cells[6]) {

            row.cells[6].textContent =
                "Resolved";

            row.cells[6].className =
                "status-closed";

        }

        return;

    }


    if (
        containedIncidents.includes(
            incidentID
        )
    ) {

        if (row.cells[6]) {

            row.cells[6].textContent =
                "Contained";

            row.cells[6].className =
                "status-investigating";

        }

    }

});


// =========================
// Restore Isolated Devices
// =========================

const allDeviceRows =
    document.querySelectorAll(
        "[data-device]"
    );

allDeviceRows.forEach(row => {

    const deviceID =
        row.dataset.device;


    if (
        isolatedDevices.includes(deviceID)
    ) {

        const statusCell =
            row.cells?.[4];


        if (statusCell) {

            statusCell.textContent =
                "🔒 Isolated";

            statusCell.className =
                "status-isolated";

        }


        row.classList.add(
            "device-isolated"
        );

    }

});


// =========================
// Incident View
// =========================

const incidentViewButtons =
    document.querySelectorAll(
        ".incidents .view-btn"
    );


incidentViewButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const row =
                this.closest("tr");

            if (!row) return;


            const incidentID =
                row.cells[0].textContent.trim();

            const attackType =
                row.cells[1].textContent.trim();

            const incidentAlertID =
                row.cells[2].textContent.trim();

            const employee =
                row.cells[3].textContent.trim();

            const device =
                row.cells[4].textContent.trim();

            const severity =
                row.cells[5].textContent.trim();

            const status =
                row.cells[6].textContent.trim();


            const popup =
                document.createElement("div");

            popup.className =
                "incident-popup";


            popup.innerHTML = `

                <div class="incident-popup-box">

                    <div class="incident-popup-header">

                        <h2>
                            🔎 Incident Details
                        </h2>

                        <button class="close-popup">
                            ✖
                        </button>

                    </div>

                    <div class="incident-details">

                        <div>
                            <strong>Incident ID</strong>
                            <span>${incidentID}</span>
                        </div>

                        <div>
                            <strong>Attack Type</strong>
                            <span>${attackType}</span>
                        </div>

                        <div>
                            <strong>Alert ID</strong>
                            <span>${incidentAlertID}</span>
                        </div>

                        <div>
                            <strong>Employee</strong>
                            <span>${employee}</span>
                        </div>

                        <div>
                            <strong>Device</strong>
                            <span>${device}</span>
                        </div>

                        <div>
                            <strong>Severity</strong>
                            <span>${severity}</span>
                        </div>

                        <div>
                            <strong>Status</strong>
                            <span>${status}</span>
                        </div>

                    </div>

                    <div class="incident-actions">

                        <button class="investigate-incident">
                            🔍 Investigate
                        </button>

                        <button class="contain-incident">
                            🔒 Contain
                        </button>

                        <button class="resolve-incident">
                            ✅ Resolve
                        </button>

                        <button class="close-incident">
                            ❌ Close Incident
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(popup);


            // Close popup

            popup
                .querySelector(".close-popup")
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            popup.addEventListener(
                "click",
                function (event) {

                    if (event.target === popup) {

                        popup.remove();

                    }

                }
            );


            // =========================
            // Investigate Incident
            // =========================

            popup
                .querySelector(
                    ".investigate-incident"
                )
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission("viewInvestigation")
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to open investigations."
                            );

                            return;

                        }


                        window.location.href =
                            "investigation.html?alert=" +
                            encodeURIComponent(
                                incidentAlertID
                            );

                    }
                );


            // =========================
            // Contain Incident
            // =========================

            popup
                .querySelector(
                    ".contain-incident"
                )
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission("containIncident")
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to contain incidents."
                            );

                            return;

                        }


                        row.cells[6].textContent =
                            "Contained";

                        row.cells[6].className =
                            "status-investigating";


                        if (
                            !containedIncidents.includes(
                                incidentID
                            )
                        ) {

                            containedIncidents.push(
                                incidentID
                            );

                        }


                        resolvedIncidents =
                            resolvedIncidents.filter(
                                id =>
                                    id !== incidentID
                            );


                        closedIncidents =
                            closedIncidents.filter(
                                id =>
                                    id !== incidentID
                            );


                        localStorage.setItem(
                            "sentinelXContainedIncidents",
                            JSON.stringify(
                                containedIncidents
                            )
                        );


                        localStorage.setItem(
                            "sentinelXResolvedIncidents",
                            JSON.stringify(
                                resolvedIncidents
                            )
                        );


                        localStorage.setItem(
                            "sentinelXClosedIncidents",
                            JSON.stringify(
                                closedIncidents
                            )
                        );


                        if (
                            !isolatedDevices.includes(
                                device
                            )
                        ) {

                            isolatedDevices.push(
                                device
                            );

                        }


                        localStorage.setItem(
                            "sentinelXIsolatedDevices",
                            JSON.stringify(
                                isolatedDevices
                            )
                        );


                        alert(
                            "🔒 Incident Contained\n\n" +
                            "Incident: " +
                            incidentID +
                            "\n" +
                            "Device: " +
                            device +
                            "\n" +
                            "Status: Isolated\n\n" +
                            "The device has been isolated successfully."
                        );

                    }
                );


            // =========================
            // Resolve Incident
            // =========================

            popup
                .querySelector(
                    ".resolve-incident"
                )
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission("resolveIncident")
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to resolve incidents."
                            );

                            return;

                        }


                        row.cells[6].textContent =
                            "Resolved";

                        row.cells[6].className =
                            "status-closed";


                        if (
                            !resolvedIncidents.includes(
                                incidentID
                            )
                        ) {

                            resolvedIncidents.push(
                                incidentID
                            );

                        }


                        closedIncidents =
                            closedIncidents.filter(
                                id =>
                                    id !== incidentID
                            );


                        containedIncidents =
                            containedIncidents.filter(
                                id =>
                                    id !== incidentID
                            );


                        localStorage.setItem(
                            "sentinelXResolvedIncidents",
                            JSON.stringify(
                                resolvedIncidents
                            )
                        );


                        localStorage.setItem(
                            "sentinelXClosedIncidents",
                            JSON.stringify(
                                closedIncidents
                            )
                        );


                        localStorage.setItem(
                            "sentinelXContainedIncidents",
                            JSON.stringify(
                                containedIncidents
                            )
                        );


                        alert(
                            "✅ Incident Resolved\n\n" +
                            incidentID +
                            " has been resolved successfully."
                        );

                        popup.remove();

                    }
                );


            // =========================
            // Close Incident
            // =========================

            popup
                .querySelector(
                    ".close-incident"
                )
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission("closeIncident")
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to close incidents."
                            );

                            return;

                        }


                        row.cells[6].textContent =
                            "Closed";

                        row.cells[6].className =
                            "status-closed";


                        if (
                            !closedIncidents.includes(
                                incidentID
                            )
                        ) {

                            closedIncidents.push(
                                incidentID
                            );

                        }


                        resolvedIncidents =
                            resolvedIncidents.filter(
                                id =>
                                    id !== incidentID
                            );


                        containedIncidents =
                            containedIncidents.filter(
                                id =>
                                    id !== incidentID
                            );


                        localStorage.setItem(
                            "sentinelXClosedIncidents",
                            JSON.stringify(
                                closedIncidents
                            )
                        );


                        localStorage.setItem(
                            "sentinelXResolvedIncidents",
                            JSON.stringify(
                                resolvedIncidents
                            )
                        );


                        localStorage.setItem(
                            "sentinelXContainedIncidents",
                            JSON.stringify(
                                containedIncidents
                            )
                        );


                        alert(
                            "❌ Incident Closed\n\n" +
                            incidentID +
                            " has been closed."
                        );

                        popup.remove();

                    }
                );

        }
    );

});
// =========================
// Device View
// =========================

const deviceViewButtons =
    document.querySelectorAll(
        "[data-device] .view-btn"
    );


deviceViewButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const row =
                this.closest("tr");

            if (!row) return;


            const deviceID =
                row.dataset.device;

            const type =
                row.cells[1].textContent.trim();

            const owner =
                row.cells[2].textContent.trim();

            const department =
                row.cells[3].textContent.trim();

            const status =
                row.cells[4].textContent.trim();

            const lastAlert =
                row.cells[5].textContent.trim();


            const popup =
                document.createElement("div");

            popup.className =
                "incident-popup";


            popup.innerHTML = `

                <div class="incident-popup-box">

                    <div class="incident-popup-header">

                        <h2>
                            💻 Device Details
                        </h2>

                        <button class="close-popup">
                            ✖
                        </button>

                    </div>

                    <div class="incident-details">

                        <div>
                            <strong>Device ID</strong>
                            <span>${deviceID}</span>
                        </div>

                        <div>
                            <strong>Device Type</strong>
                            <span>${type}</span>
                        </div>

                        <div>
                            <strong>Owner</strong>
                            <span>${owner}</span>
                        </div>

                        <div>
                            <strong>Department</strong>
                            <span>${department}</span>
                        </div>

                        <div>
                            <strong>Current Status</strong>
                            <span>${status}</span>
                        </div>

                        <div>
                            <strong>Last Alert</strong>
                            <span>${lastAlert}</span>
                        </div>

                    </div>

                    <div class="incident-actions">

                        <button class="close-device-popup">
                            Close
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(popup);


            popup
                .querySelector(".close-popup")
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            popup
                .querySelector(
                    ".close-device-popup"
                )
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            popup.addEventListener(
                "click",
                function (event) {

                    if (event.target === popup) {

                        popup.remove();

                    }

                }
            );

        }
    );

});


// ========================================================
// EMPLOYEES
// ========================================================


// =========================
// Employee Security Activity
// =========================

const employeeSecurityActivities = {

    "LAP-022": {

        alertID: "ALT-002",

        title:
            "Employee Downloaded 500 Files",

        severity:
            "MEDIUM"

    },


    "LAP-015": {

        alertID: "ALT-005",

        title:
            "Multiple Failed VPN Logins",

        severity:
            "MEDIUM"

    }

};


// =========================
// Employee View Buttons
// =========================

const employeeViewButtons =
    document.querySelectorAll(
        ".employees .view-btn"
    );


employeeViewButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const row =
                this.closest("tr");

            if (!row) return;


            // =========================
            // Read Employee Information
            // =========================

            const employeeID =
                row.cells[0]
                    .textContent
                    .trim();

            const employeeName =
                row.cells[1]
                    .textContent
                    .trim();

            const department =
                row.cells[2]
                    .textContent
                    .trim();

            const device =
                row.cells[3]
                    .textContent
                    .trim();

            const role =
                row.cells[4]
                    .textContent
                    .trim();

            const status =
                row.cells[5]
                    .textContent
                    .trim();


            // =========================
            // Find Security Activity
            // =========================

            const activity =
                employeeSecurityActivities[
                    device
                ];


            let activityHTML = "";


            if (activity) {

                const severityClass =
                    activity.severity
                        .toLowerCase();


                activityHTML = `

                    <div
                        class="employee-activity ${severityClass}"
                    >

                        <div
                            class="employee-activity-info"
                        >

                            <span
                                class="employee-activity-title"
                            >
                                ${activity.title}
                            </span>

                            <span
                                class="employee-activity-meta"
                            >
                                ${activity.alertID}
                                •
                                ${device}
                            </span>

                        </div>


                        <span
                            class="employee-activity-badge ${severityClass}"
                        >
                            ${activity.severity}
                        </span>

                    </div>

                `;

            } else {

                activityHTML = `

                    <div
                        class="no-employee-activity"
                    >
                        🛡️ No recent security activity detected.
                    </div>

                `;

            }


            // =========================
            // Current Security State
            // =========================

            let deviceSecurityStatus =
                "Normal";


            if (
                isolatedDevices.includes(
                    device
                )
            ) {

                deviceSecurityStatus =
                    "🔒 Isolated";

            }


            const employeeBlockedAlerts =
                blockedAlerts.filter(
                    alertID =>
                        activity &&
                        activity.alertID === alertID
                );


            const employeeIgnoredAlerts =
                ignoredAlerts.filter(
                    alertID =>
                        activity &&
                        activity.alertID === alertID
                );


            let incidentSecurityStatus =
                "No Incident Action";


            const relatedIncidentRows =
                Array.from(
                    document.querySelectorAll(
                        ".incidents tbody tr"
                    )
                );


            const relatedIncident =
                relatedIncidentRows.find(
                    incidentRow =>
                        incidentRow.cells?.[4]
                            ?.textContent
                            .trim() === device
                );


            if (relatedIncident) {

                const relatedIncidentID =
                    relatedIncident.cells?.[0]
                        ?.textContent
                        .trim();


                if (
                    closedIncidents.includes(
                        relatedIncidentID
                    )
                ) {

                    incidentSecurityStatus =
                        "⚫ Incident Closed";

                }

                else if (
                    resolvedIncidents.includes(
                        relatedIncidentID
                    )
                ) {

                    incidentSecurityStatus =
                        "✅ Incident Resolved";

                }

                else if (
                    containedIncidents.includes(
                        relatedIncidentID
                    )
                ) {

                    incidentSecurityStatus =
                        "🔒 Incident Contained";

                }

            }


            // =========================
            // Create Employee Popup
            // =========================

            const popup =
                document.createElement(
                    "div"
                );


            popup.className =
                "employee-popup";


            popup.innerHTML = `

                <div
                    class="employee-popup-box"
                >

                    <div
                        class="employee-popup-header"
                    >

                        <h2>
                            👤 Employee Details
                        </h2>

                        <button
                            class="employee-close-popup"
                        >
                            ✖
                        </button>

                    </div>


                    <div
                        class="employee-details"
                    >

                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Employee ID
                            </strong>

                            <span>
                                ${employeeID}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Employee Name
                            </strong>

                            <span>
                                ${employeeName}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Department
                            </strong>

                            <span>
                                ${department}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Role
                            </strong>

                            <span>
                                ${role}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Assigned Device
                            </strong>

                            <span>
                                ${device}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Employee Status
                            </strong>

                            <span>
                                ${status}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Device Security
                            </strong>

                            <span>
                                ${deviceSecurityStatus}
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Alert State
                            </strong>

                            <span>
                                ${
                                    employeeBlockedAlerts.length
                                        ? "🚫 Alert Blocked"
                                        : employeeIgnoredAlerts.length
                                            ? "⚪ Alert Ignored"
                                            : "Active"
                                }
                            </span>

                        </div>


                        <div
                            class="employee-detail-item"
                        >

                            <strong>
                                Incident State
                            </strong>

                            <span>
                                ${incidentSecurityStatus}
                            </span>

                        </div>

                    </div>


                    <!-- Security Activity -->

                    <div
                        class="employee-security"
                    >

                        <h3>
                            🛡️ Security Activity
                        </h3>

                        ${activityHTML}

                    </div>


                    <!-- Actions -->

                    <div
                        class="employee-popup-actions"
                    >

                        <button
                            class="employee-device-btn"
                        >
                            💻 View Device
                        </button>

                        <button
                            class="employee-close-btn"
                        >
                            Close
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                popup
            );


            // =========================
            // Close X
            // =========================

            popup
                .querySelector(
                    ".employee-close-popup"
                )
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            // =========================
            // Close Button
            // =========================

            popup
                .querySelector(
                    ".employee-close-btn"
                )
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            // =========================
            // View Device
            // =========================

            popup
                .querySelector(
                    ".employee-device-btn"
                )
                .addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "devices.html?device=" +
                            encodeURIComponent(
                                device
                            );

                    }
                );


            // =========================
            // Close Outside
            // =========================

            popup.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        popup
                    ) {

                        popup.remove();

                    }

                }
            );


            // =========================
            // ESC Close
            // =========================

            function closeEmployeePopup(
                event
            ) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    popup.remove();

                    document
                        .removeEventListener(
                            "keydown",
                            closeEmployeePopup
                        );

                }

            }


            document.addEventListener(
                "keydown",
                closeEmployeePopup
            );

        }
    );

});


// =========================
// Sentinel X Loaded
// =========================

console.log(
    "Sentinel X Security Dashboard Loaded"
);
// ============================================================
// Sentinel X
// SETTINGS SYSTEM
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // Check If We Are On Settings Page
    // ========================================================

    const savePermissionsBtn =
        document.getElementById("savePermissionsBtn");

    const addRoleBtn =
        document.getElementById("addRoleBtn");

    const settingsMessage =
        document.getElementById("settingsMessage");

    const mfaSetting =
        document.getElementById("mfaSetting");

    const autoIsolationSetting =
        document.getElementById("autoIsolationSetting");

    const notificationSetting =
        document.getElementById("notificationSetting");

    const sessionTimeout =
        document.getElementById("sessionTimeout");


    // If Settings page does not exist, stop here
    if (
        !savePermissionsBtn &&
        !addRoleBtn &&
        !mfaSetting
    ) {
        return;
    }


    // ========================================================
    // Local Storage Keys
    // ========================================================

    const PERMISSIONS_KEY =
        "sentinelXRolePermissions";

    const SECURITY_SETTINGS_KEY =
        "sentinelXSecuritySettings";

    const CUSTOM_ROLES_KEY =
        "sentinelXCustomRoles";

    const AUDIT_LOG_KEY =
        "sentinelXAuditLog";


    // ========================================================
    // Helper - Safe JSON Read
    // ========================================================

    function getStoredData(key, fallback) {

        try {

            const value =
                localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            console.error(
                "Sentinel X Storage Error:",
                error
            );

            return fallback;

        }

    }


    // ========================================================
    // Helper - Show Message
    // ========================================================

    function showSettingsMessage(
        message,
        type = "success"
    ) {

        if (!settingsMessage) {
            return;
        }

        settingsMessage.textContent =
            message;

        settingsMessage.className =
            "settings-message " + type;


        clearTimeout(
            window.sentinelXSettingsMessageTimer
        );


        window.sentinelXSettingsMessageTimer =
            setTimeout(function () {

                settingsMessage.className =
                    "settings-message";

                settingsMessage.textContent =
                    "";

            }, 3500);

    }


    // ========================================================
    // Audit Log
    // ========================================================

    function addAuditLog(action) {

        let logs =
            getStoredData(
                AUDIT_LOG_KEY,
                []
            );


        let currentUserName =
            "Admin";


        try {

            const session =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXSession"
                    ) || "null"
                );


            if (
                session &&
                session.name
            ) {

                currentUserName =
                    session.name;

            }

        } catch (error) {

            currentUserName =
                "Admin";

        }


        const newLog = {

            action: action,

            user: currentUserName,

            time: new Date()
                .toLocaleString()

        };


        logs.unshift(newLog);


        // Keep only latest 20 records
        logs =
            logs.slice(0, 20);


        localStorage.setItem(
            AUDIT_LOG_KEY,
            JSON.stringify(logs)
        );


        renderAuditLog();

    }


    // ========================================================
    // Render Audit Log
    // ========================================================

    function renderAuditLog() {

        const auditLog =
            document.getElementById(
                "auditLog"
            );


        if (!auditLog) {
            return;
        }


        const logs =
            getStoredData(
                AUDIT_LOG_KEY,
                []
            );


        // Default records
        if (logs.length === 0) {

            auditLog.innerHTML = `

                <div class="audit-item">

                    <div class="audit-info">

                        <span class="audit-action">
                            Permissions reviewed
                        </span>

                        <span class="audit-user">
                            👤 Admin
                        </span>

                    </div>

                    <span class="audit-time">
                        System initialized
                    </span>

                </div>


                <div class="audit-item">

                    <div class="audit-info">

                        <span class="audit-action">
                            MFA protection enabled
                        </span>

                        <span class="audit-user">
                            👤 Admin
                        </span>

                    </div>

                    <span class="audit-time">
                        Security Policy
                    </span>

                </div>

            `;

            return;

        }


        auditLog.innerHTML =
            logs.map(function (log) {

                return `

                    <div class="audit-item">

                        <div class="audit-info">

                            <span class="audit-action">
                                ${escapeHTML(log.action)}
                            </span>

                            <span class="audit-user">
                                👤 ${escapeHTML(log.user)}
                            </span>

                        </div>

                        <span class="audit-time">
                            ${escapeHTML(log.time)}
                        </span>

                    </div>

                `;

            }).join("");

    }


    // ========================================================
    // Escape HTML
    // ========================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }


    // ========================================================
    // Restore Permissions
    // ========================================================

    function restorePermissions() {

        const savedPermissions =
            getStoredData(
                PERMISSIONS_KEY,
                null
            );


        if (!savedPermissions) {
            return;
        }


        const checkboxes =
            document.querySelectorAll(
                ".permission-checkbox"
            );


        checkboxes.forEach(function (checkbox) {

            const role =
                checkbox.dataset.role;

            const permission =
                checkbox.dataset.permission;


            // Admin always keeps full access
            if (
                role === "admin"
            ) {

                checkbox.checked =
                    true;

                checkbox.disabled =
                    true;

                return;

            }


            if (
                savedPermissions[role] &&
                Object.prototype.hasOwnProperty.call(
                    savedPermissions[role],
                    permission
                )
            ) {

                checkbox.checked =
                    savedPermissions[role][permission];

            }

        });

    }


    // ========================================================
    // Save Permissions
    // ========================================================

    if (savePermissionsBtn) {

        savePermissionsBtn.addEventListener(
            "click",
            function () {

                const permissions = {};

                const checkboxes =
                    document.querySelectorAll(
                        ".permission-checkbox"
                    );


                checkboxes.forEach(
                    function (checkbox) {

                        const role =
                            checkbox.dataset.role;

                        const permission =
                            checkbox.dataset.permission;


                        if (!permissions[role]) {

                            permissions[role] = {};

                        }


                        permissions[role][permission] =
                            role === "admin"
                                ? true
                                : checkbox.checked;

                    }
                );


                localStorage.setItem(
                    PERMISSIONS_KEY,
                    JSON.stringify(
                        permissions
                    )
                );


                showSettingsMessage(
                    "✅ Permissions saved successfully.",
                    "success"
                );


                addAuditLog(
                    "Role permissions were updated"
                );

            }
        );

    }


    // ========================================================
    // Security Settings
    // ========================================================

    function saveSecuritySettings(
        auditMessage = null
    ) {

        const securitySettings = {

            mfa:
                mfaSetting
                    ? mfaSetting.checked
                    : false,

            autoIsolation:
                autoIsolationSetting
                    ? autoIsolationSetting.checked
                    : false,

            notifications:
                notificationSetting
                    ? notificationSetting.checked
                    : false,

            sessionTimeout:
                sessionTimeout
                    ? sessionTimeout.value
                    : "30"

        };


        localStorage.setItem(
            SECURITY_SETTINGS_KEY,
            JSON.stringify(
                securitySettings
            )
        );


        showSettingsMessage(
            "🛡️ Security settings updated.",
            "success"
        );


        if (auditMessage) {

            addAuditLog(
                auditMessage
            );

        }

    }


    // ========================================================
    // Restore Security Settings
    // ========================================================

    function restoreSecuritySettings() {

        const savedSettings =
            getStoredData(
                SECURITY_SETTINGS_KEY,
                null
            );


        if (!savedSettings) {
            return;
        }


        if (
            mfaSetting &&
            typeof savedSettings.mfa ===
            "boolean"
        ) {

            mfaSetting.checked =
                savedSettings.mfa;

        }


        if (
            autoIsolationSetting &&
            typeof savedSettings.autoIsolation ===
            "boolean"
        ) {

            autoIsolationSetting.checked =
                savedSettings.autoIsolation;

        }


        if (
            notificationSetting &&
            typeof savedSettings.notifications ===
            "boolean"
        ) {

            notificationSetting.checked =
                savedSettings.notifications;

        }


        if (
            sessionTimeout &&
            savedSettings.sessionTimeout
        ) {

            sessionTimeout.value =
                savedSettings.sessionTimeout;

        }

    }


    // ========================================================
    // MFA Event
    // ========================================================

    if (mfaSetting) {

        mfaSetting.addEventListener(
            "change",
            function () {

                const status =
                    this.checked
                        ? "enabled"
                        : "disabled";


                saveSecuritySettings(
                    "Multi-Factor Authentication " +
                    status
                );

            }
        );

    }


    // ========================================================
    // Auto Isolation Event
    // ========================================================

    if (autoIsolationSetting) {

        autoIsolationSetting.addEventListener(
            "change",
            function () {

                const status =
                    this.checked
                        ? "enabled"
                        : "disabled";


                saveSecuritySettings(
                    "Automatic Device Isolation " +
                    status
                );

            }
        );

    }


    // ========================================================
    // Notifications Event
    // ========================================================

    if (notificationSetting) {

        notificationSetting.addEventListener(
            "change",
            function () {

                const status =
                    this.checked
                        ? "enabled"
                        : "disabled";


                saveSecuritySettings(
                    "Critical Alert Notifications " +
                    status
                );

            }
        );

    }


    // ========================================================
    // Session Timeout Event
    // ========================================================

    if (sessionTimeout) {

        sessionTimeout.addEventListener(
            "change",
            function () {

                saveSecuritySettings(
                    "Session timeout changed to " +
                    this.value +
                    " minutes"
                );

            }
        );

    }


    // ========================================================
    // Custom Roles
    // ========================================================

    function getCustomRoles() {

        return getStoredData(
            CUSTOM_ROLES_KEY,
            []
        );

    }


    // ========================================================
    // Render Custom Roles
    // ========================================================

    function renderCustomRoles() {

        const roleList =
            document.getElementById(
                "roleList"
            );


        if (!roleList) {
            return;
        }


        // Remove previously rendered custom roles
        roleList
            .querySelectorAll(
                ".custom-role"
            )
            .forEach(function (element) {

                element.remove();

            });


        const roles =
            getCustomRoles();


        roles.forEach(function (role) {

            const roleItem =
                document.createElement(
                    "div"
                );


            roleItem.className =
                "role-item custom-role";


            roleItem.innerHTML = `

                <div class="role-info">

                    <span class="role-name">
                        ${escapeHTML(role.name)}
                    </span>

                    <span class="role-description">
                        ${escapeHTML(role.description)}
                    </span>

                </div>


                <div>

                    <span class="role-badge role-viewer">
                        CUSTOM
                    </span>

                    <button
                        class="settings-btn danger-btn delete-role-btn"
                        data-role-id="${escapeHTML(role.id)}"
                        style="margin-left:8px;"
                    >
                        Delete
                    </button>

                </div>

            `;


            roleList.appendChild(
                roleItem
            );

        });


        // Delete buttons
        document
            .querySelectorAll(
                ".delete-role-btn"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deleteCustomRole(
                            this.dataset.roleId
                        );

                    }
                );

            });

    }


    // ========================================================
    // Add Role Popup
    // ========================================================

    if (addRoleBtn) {

        addRoleBtn.addEventListener(
            "click",
            function () {

                openAddRolePopup();

            }
        );

    }


    function openAddRolePopup() {

        // Prevent duplicate popup
        const existingPopup =
            document.querySelector(
                ".settings-popup"
            );


        if (existingPopup) {

            existingPopup.remove();

        }


        const popup =
            document.createElement(
                "div"
            );


        popup.className =
            "settings-popup";


        popup.innerHTML = `

            <div class="settings-popup-box">

                <div class="settings-popup-header">

                    <h2>
                        ➕ Add Security Role
                    </h2>

                    <button
                        class="settings-popup-close"
                    >
                        ✖
                    </button>

                </div>


                <div class="settings-form">


                    <div class="settings-form-group">

                        <label>
                            Role Name
                        </label>

                        <input
                            type="text"
                            id="newRoleName"
                            placeholder="Example: Threat Hunter"
                            maxlength="40"
                        >

                    </div>


                    <div class="settings-form-group">

                        <label>
                            Description
                        </label>

                        <input
                            type="text"
                            id="newRoleDescription"
                            placeholder="Describe the role responsibilities"
                            maxlength="100"
                        >

                    </div>


                </div>


                <div class="settings-popup-actions">

                    <button
                        class="settings-btn edit-role-btn cancel-role-btn"
                    >
                        Cancel
                    </button>

                    <button
                        class="settings-btn primary-btn create-role-btn"
                    >
                        Create Role
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            popup
        );


        const roleNameInput =
            popup.querySelector(
                "#newRoleName"
            );


        const roleDescriptionInput =
            popup.querySelector(
                "#newRoleDescription"
            );


        roleNameInput.focus();


        // Close X
        popup
            .querySelector(
                ".settings-popup-close"
            )
            .addEventListener(
                "click",
                function () {

                    popup.remove();

                }
            );


        // Cancel
        popup
            .querySelector(
                ".cancel-role-btn"
            )
            .addEventListener(
                "click",
                function () {

                    popup.remove();

                }
            );


        // Outside click
        popup.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === popup
                ) {

                    popup.remove();

                }

            }
        );


        // Create Role
        popup
            .querySelector(
                ".create-role-btn"
            )
            .addEventListener(
                "click",
                function () {

                    const name =
                        roleNameInput.value
                            .trim();

                    const description =
                        roleDescriptionInput.value
                            .trim();


                    if (!name) {

                        alert(
                            "Please enter a role name."
                        );

                        roleNameInput.focus();

                        return;

                    }


                    const roles =
                        getCustomRoles();


                    const duplicate =
                        roles.some(
                            function (role) {

                                return (
                                    role.name
                                        .toLowerCase() ===
                                    name.toLowerCase()
                                );

                            }
                        );


                    if (duplicate) {

                        alert(
                            "A role with this name already exists."
                        );

                        return;

                    }


                    const newRole = {

                        id:
                            "ROLE-" +
                            Date.now(),

                        name:
                            name,

                        description:
                            description ||
                            "Custom security role"

                    };


                    roles.push(
                        newRole
                    );


                    localStorage.setItem(
                        CUSTOM_ROLES_KEY,
                        JSON.stringify(
                            roles
                        )
                    );


                    renderCustomRoles();


                    addAuditLog(
                        'Security role "' +
                        name +
                        '" was created'
                    );


                    showSettingsMessage(
                        "✅ New security role created.",
                        "success"
                    );


                    popup.remove();

                }
            );

    }


    // ========================================================
    // Delete Custom Role
    // ========================================================

    function deleteCustomRole(roleID) {

        const roles =
            getCustomRoles();


        const role =
            roles.find(
                function (item) {

                    return (
                        item.id === roleID
                    );

                }
            );


        if (!role) {
            return;
        }


        const confirmed =
            confirm(
                'Delete security role "' +
                role.name +
                '"?'
            );


        if (!confirmed) {
            return;
        }


        const updatedRoles =
            roles.filter(
                function (item) {

                    return (
                        item.id !== roleID
                    );

                }
            );


        localStorage.setItem(
            CUSTOM_ROLES_KEY,
            JSON.stringify(
                updatedRoles
            )
        );


        renderCustomRoles();


        addAuditLog(
            'Security role "' +
            role.name +
            '" was deleted'
        );


        showSettingsMessage(
            "🗑️ Security role deleted.",
            "warning"
        );

    }


    // ========================================================
    // Initialize Settings
    // ========================================================

    restorePermissions();

    restoreSecuritySettings();

    renderCustomRoles();

    renderAuditLog();


    console.log(
        "Sentinel X Settings System Loaded"
    );

});
// ========================================================
// SENTINEL X - DATASET REPORTS PAGE
// ========================================================

document.addEventListener("DOMContentLoaded", async function () {

    // =========================
    // Elements
    // =========================

    const reportType =
        document.getElementById("reportType");

    const reportTarget =
        document.getElementById("reportTarget");

    const generateReportBtn =
        document.getElementById("generateReportBtn");

    const reportEmptyState =
        document.getElementById("reportEmptyState");

    const generatedReport =
        document.getElementById("generatedReport");

    const reportSummary =
        document.getElementById("reportSummary");


    // Run only on Reports page
    if (
        !reportType ||
        !reportTarget ||
        !generateReportBtn ||
        !generatedReport
    ) {
        return;
    }


    // =========================
    // Load CIC-IDS Dataset
    // =========================

    let dataset = [];

    try {

        const response =
            await fetch("data/sentinel_data.json");

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        dataset =
            await response.json();

        console.log(
            "Sentinel X Reports Dataset Loaded:",
            dataset.length
        );

    }

    catch (error) {

        console.error(
            "Failed to load Reports dataset:",
            error
        );

        reportTarget.innerHTML =
            '<option value="">Dataset unavailable</option>';

        reportTarget.disabled = true;
        generateReportBtn.disabled = true;

        return;
    }


    if (!dataset.length) {

        reportTarget.innerHTML =
            '<option value="">No dataset records found</option>';

        reportTarget.disabled = true;
        generateReportBtn.disabled = true;

        return;
    }


    // =========================
    // Helpers
    // =========================

    function escapeHTML(value) {

        return String(value ?? "Unknown")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function getSeverity(riskScore) {

        const risk =
            Number(riskScore) || 0;

        if (risk >= 90) {
            return "CRITICAL";
        }

        if (risk >= 80) {
            return "HIGH";
        }

        if (risk >= 70) {
            return "MEDIUM";
        }

        return "LOW";
    }


    function getSeverityClass(severity) {

        if (
            severity === "CRITICAL" ||
            severity === "HIGH"
        ) {
            return "high";
        }

        if (severity === "MEDIUM") {
            return "medium";
        }

        return "low";
    }


    function getStoredArray(key) {

        try {

            return JSON.parse(
                localStorage.getItem(key) ||
                "[]"
            );

        }

        catch (error) {

            return [];

        }

    }


    function uniqueValues(values) {

        return [
            ...new Set(
                values.filter(
                    value =>
                        value &&
                        value !== "Unknown"
                )
            )
        ];
    }


    // =========================
    // Report Type Changed
    // =========================

    reportType.addEventListener(
        "change",
        function () {

            const type =
                reportType.value;

            reportTarget.innerHTML =
                '<option value="">Select Target</option>';

            reportTarget.disabled = true;

            generateReportBtn.disabled = true;


            if (!type) {
                return;
            }


            // =========================
            // Device Targets
            // =========================

            if (type === "device") {

                const devices =
                    uniqueValues(
                        dataset.map(
                            record =>
                                record.targetDevice
                        )
                    ).sort();


                devices.forEach(
                    function (device) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            device;

                        option.textContent =
                            device;

                        reportTarget.appendChild(
                            option
                        );

                    }
                );

            }


            // =========================
            // Employee Targets
            // =========================

            else if (
                type === "employee"
            ) {

                const employees =
                    uniqueValues(
                        dataset
                            .filter(
                                record =>
                                    record.employee !==
                                    "External User"
                            )
                            .map(
                                record =>
                                    record.employee
                            )
                    ).sort();


                employees.forEach(
                    function (employee) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            employee;

                        option.textContent =
                            employee;

                        reportTarget.appendChild(
                            option
                        );

                    }
                );

            }


            // =========================
            // Incident Targets
            // =========================

            else if (
                type === "incident"
            ) {

                const incidents =
                    [...dataset]
                        .sort(
                            (a, b) =>
                                Number(b.riskScore) -
                                Number(a.riskScore)
                        );


                incidents.forEach(
                    function (record) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            record.id;

                        option.textContent =
                            `${record.id} — ${record.attackType} — ${record.targetDevice}`;

                        reportTarget.appendChild(
                            option
                        );

                    }
                );

            }


            reportTarget.disabled =
                false;

        }
    );


    // =========================
    // Target Changed
    // =========================

    reportTarget.addEventListener(
        "change",
        function () {

            generateReportBtn.disabled =
                !reportTarget.value;

        }
    );


    // =========================
    // Generate Report
    // =========================

    generateReportBtn.addEventListener(
        "click",
        function () {

            if (
                typeof window.sentinelHasPermission === "function" &&
                !window.sentinelHasPermission("generateReports")
            ) {

                alert(
                    "⛔ Access Denied\n\n" +
                    "Your account does not have permission " +
                    "to generate reports."
                );

                return;

            }


            const type =
                reportType.value;

            const target =
                reportTarget.value;


            if (!type || !target) {
                return;
            }


            const currentIsolatedDevices =
                getStoredArray(
                    "sentinelXIsolatedDevices"
                );

            const currentBlockedAlerts =
                getStoredArray(
                    "sentinelXBlockedAlerts"
                );

            const currentIgnoredAlerts =
                getStoredArray(
                    "sentinelXIgnoredAlerts"
                );

            const currentContainedIncidents =
                getStoredArray(
                    "sentinelXContainedIncidents"
                );

            const currentResolvedIncidents =
                getStoredArray(
                    "sentinelXResolvedIncidents"
                );

            const currentClosedIncidents =
                getStoredArray(
                    "sentinelXClosedIncidents"
                );


            let matchingRecords = [];

            let title = "";

            let targetLabel = target;


            // =========================
            // Find Matching Records
            // =========================

            if (type === "device") {

                matchingRecords =
                    dataset.filter(
                        record =>
                            record.targetDevice ===
                            target
                    );

                title =
                    "Device Security Report";

            }


            else if (
                type === "employee"
            ) {

                matchingRecords =
                    dataset.filter(
                        record =>
                            record.employee ===
                            target
                    );

                title =
                    "Employee Security Report";

            }


            else if (
                type === "incident"
            ) {

                matchingRecords =
                    dataset.filter(
                        record =>
                            record.id ===
                            target
                    );

                title =
                    "Incident Security Report";

            }


            if (!matchingRecords.length) {

                alert(
                    "No security records were found for this target."
                );

                return;
            }


            // Highest risk first
            matchingRecords.sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


            const highestRiskRecord =
                matchingRecords[0];

            const highestRisk =
                Number(
                    highestRiskRecord.riskScore
                ) || 0;

            const severity =
                getSeverity(highestRisk);

            const severityClass =
                getSeverityClass(severity);


            const sortedDataset =
                [...dataset].sort(
                    (a, b) =>
                        Number(b.riskScore) -
                        Number(a.riskScore)
                );


            function getAlertID(record) {

                const alertIndex =
                    sortedDataset.findIndex(
                        item =>
                            item.id === record.id
                    );


                if (
                    alertIndex < 0 ||
                    alertIndex >= 12
                ) {

                    return null;

                }


                return (
                    "DATA-ALT-" +
                    String(
                        alertIndex + 1
                    ).padStart(3, "0")
                );

            }


            function getIncidentID(record) {

                const incidentIndex =
                    sortedDataset
                        .slice(0, 10)
                        .findIndex(
                            item =>
                                item.id === record.id
                        );


                if (incidentIndex < 0) {

                    return null;

                }


                return (
                    "DATA-INC-" +
                    String(
                        incidentIndex + 1
                    ).padStart(3, "0")
                );

            }


            // =========================
            // Report ID
            // =========================

            const reportID =
                "RPT-" +
                String(Date.now()).slice(-8);


            // =========================
            // Target Details
            // =========================

            let detailsHTML = "";


            // DEVICE
            if (type === "device") {

                const employees =
                    uniqueValues(
                        matchingRecords.map(
                            record =>
                                record.employee
                        )
                    );

                const deviceNames =
                    uniqueValues(
                        matchingRecords.map(
                            record =>
                                record.deviceName
                        )
                    );

                const sourceTypes =
                    uniqueValues(
                        matchingRecords.map(
                            record =>
                                record.sourceType
                        )
                    );

                const deviceStatus =
                    currentIsolatedDevices.includes(
                        target
                    )
                        ? "🔒 Isolated"
                        : "🟢 Active";


                detailsHTML = `

                    <div class="report-detail-item">
                        <span>Device ID</span>
                        <strong>
                            ${escapeHTML(target)}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Device Name</span>
                        <strong>
                            ${escapeHTML(
                                deviceNames.join(", ") ||
                                "Unknown"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Employee</span>
                        <strong>
                            ${escapeHTML(
                                employees.join(", ") ||
                                "Unknown"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Source Type</span>
                        <strong>
                            ${escapeHTML(
                                sourceTypes.join(", ") ||
                                "Unknown"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Security Status</span>
                        <strong>
                            ${deviceStatus}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Highest Risk</span>
                        <strong>
                            ${highestRisk}/100
                            •
                            ${severity}
                        </strong>
                    </div>

                `;

            }


            // EMPLOYEE
            else if (
                type === "employee"
            ) {

                const devices =
                    uniqueValues(
                        matchingRecords.map(
                            record =>
                                record.targetDevice
                        )
                    );

                const deviceNames =
                    uniqueValues(
                        matchingRecords.map(
                            record =>
                                record.deviceName
                        )
                    );

                const sourceTypes =
                    uniqueValues(
                        matchingRecords.map(
                            record =>
                                record.sourceType
                        )
                    );

                const isolatedEmployeeDevices =
                    devices.filter(
                        device =>
                            currentIsolatedDevices.includes(
                                device
                            )
                    );


                detailsHTML = `

                    <div class="report-detail-item">
                        <span>Employee</span>
                        <strong>
                            ${escapeHTML(target)}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Assigned Device</span>
                        <strong>
                            ${escapeHTML(
                                devices.join(", ") ||
                                "Unknown"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Device Name</span>
                        <strong>
                            ${escapeHTML(
                                deviceNames.join(", ") ||
                                "Unknown"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Source Type</span>
                        <strong>
                            ${escapeHTML(
                                sourceTypes.join(", ") ||
                                "Unknown"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Device Status</span>
                        <strong>
                            ${
                                isolatedEmployeeDevices.length
                                    ? "🔒 Isolated Device Detected"
                                    : "🟢 Active"
                            }
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Highest Risk</span>
                        <strong>
                            ${highestRisk}/100
                            •
                            ${severity}
                        </strong>
                    </div>

                `;

            }


            // INCIDENT
           
            // INCIDENT
            else if (
                type === "incident"
            ) {

                const record =
                    highestRiskRecord;

                const relatedAlertID =
                    getAlertID(record);

                const relatedIncidentID =
                    getIncidentID(record);

                const createdIncident = getStoredArray(
                    "sentinelXCreatedIncidents"
                ).find(incident =>
                    incident.datasetRecord === record.id
                );

                const relatedIncidentIDs = [
                    relatedIncidentID,
                    createdIncident ? createdIncident.id : null
                ].filter(Boolean);

                let responseStatus =
                    currentIsolatedDevices.includes(
                        record.targetDevice
                    )
                        ? "🔒 Device Isolated"
                        : "⚠️ Requires Review";

                if (
                    relatedIncidentIDs.some(id =>
                        currentClosedIncidents.includes(id)
                    )
                ) {

                    responseStatus =
                        "⚫ Incident Closed";

                }

                else if (
                    relatedIncidentIDs.some(id =>
                        currentResolvedIncidents.includes(id)
                    )
                ) {

                    responseStatus =
                        "✅ Incident Resolved";

                }

                else if (
                    relatedIncidentIDs.some(id =>
                        currentContainedIncidents.includes(id)
                    )
                ) {

                    responseStatus =
                        "🔒 Incident Contained";

                }

                else if (
                    relatedAlertID &&
                    currentBlockedAlerts.includes(
                        relatedAlertID
                    )
                ) {

                    responseStatus =
                        "🚫 Alert Blocked";

                }

                else if (
                    relatedAlertID &&
                    currentIgnoredAlerts.includes(
                        relatedAlertID
                    )
                ) {

                    responseStatus =
                        "⚪ Alert Ignored";

                }



                detailsHTML = `

                    <div class="report-detail-item">
                        <span>Dataset Record ID</span>
                        <strong>
                            ${escapeHTML(record.id)}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Attack Type</span>
                        <strong>
                            ${escapeHTML(
                                record.attackType
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Source IP</span>
                        <strong>
                            ${escapeHTML(
                                record.sourceIp
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Destination IP</span>
                        <strong>
                            ${escapeHTML(
                                record.destinationIp
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Target Device</span>
                        <strong>
                            ${escapeHTML(
                                record.targetDevice
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Device Name</span>
                        <strong>
                            ${escapeHTML(
                                record.deviceName
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Employee</span>
                        <strong>
                            ${escapeHTML(
                                record.employee
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Source Type</span>
                        <strong>
                            ${escapeHTML(
                                record.sourceType
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Related Alert</span>
                        <strong>
                            ${escapeHTML(
                                relatedAlertID ||
                                "No Top-12 Alert"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Related Incident</span>
                        <strong>
                            ${escapeHTML(
                                relatedIncidentID ||
                                "No Top-10 Incident"
                            )}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Risk Score</span>
                        <strong>
                            ${highestRisk}/100
                            •
                            ${severity}
                        </strong>
                    </div>

                    <div class="report-detail-item">
                        <span>Response Status</span>
                        <strong>
                            ${responseStatus}
                        </strong>
                    </div>

                `;

            }


            // =========================
            // Security Activity
            // =========================

            const visibleActivity =
                matchingRecords.slice(0, 10);


            let activityHTML = "";


            visibleActivity.forEach(
                function (record) {

                    const recordSeverity =
                        getSeverity(
                            record.riskScore
                        );

                    const recordClass =
                        getSeverityClass(
                            recordSeverity
                        );


                    activityHTML += `

                        <div class="report-activity-item ${recordClass}">

                            <div class="report-activity-info">

                                <strong>
                                    ${escapeHTML(
                                        record.attackType
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(record.id)}
                                    •
                                    ${escapeHTML(
                                        record.sourceIp
                                    )}
                                    →
                                    ${escapeHTML(
                                        record.destinationIp
                                    )}
                                    •
                                    ${escapeHTML(
                                        record.targetDevice
                                    )}
                                </span>

                            </div>

                            <span
                                class="report-activity-severity ${recordClass}"
                            >
                                ${recordSeverity}
                                •
                                ${Number(
                                    record.riskScore
                                )}/100
                            </span>

                        </div>

                    `;

                }
            );


            // =========================
            // Sentinel X Response
            // =========================

            const affectedDevices =
                uniqueValues(
                    matchingRecords.map(
                        record =>
                            record.targetDevice
                    )
                );


            const isolatedAffectedDevices =
                affectedDevices.filter(
                    device =>
                        currentIsolatedDevices.includes(
                            device
                        )
                );


            const matchingAlertIDs =
                matchingRecords
                    .map(getAlertID)
                    .filter(Boolean);


            const matchingIncidentIDs =
                matchingRecords
                    .map(getIncidentID)
                    .filter(Boolean);


            const blockedMatchingAlerts =
                matchingAlertIDs.filter(
                    alertID =>
                        currentBlockedAlerts.includes(
                            alertID
                        )
                );


            const ignoredMatchingAlerts =
                matchingAlertIDs.filter(
                    alertID =>
                        currentIgnoredAlerts.includes(
                            alertID
                        )
                );


            const containedMatchingIncidents =
                matchingIncidentIDs.filter(
                    incidentID =>
                        currentContainedIncidents.includes(
                            incidentID
                        )
                );


            const resolvedMatchingIncidents =
                matchingIncidentIDs.filter(
                    incidentID =>
                        currentResolvedIncidents.includes(
                            incidentID
                        )
                );


            const closedMatchingIncidents =
                matchingIncidentIDs.filter(
                    incidentID =>
                        currentClosedIncidents.includes(
                            incidentID
                        )
                );


            let responseHTML = "";


            if (
                blockedMatchingAlerts.length
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        🚫 Blocked alert:
                        ${escapeHTML(
                            blockedMatchingAlerts.join(
                                ", "
                            )
                        )}
                    </div>

                `;

            }


            if (
                ignoredMatchingAlerts.length
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        ⚪ Ignored alert:
                        ${escapeHTML(
                            ignoredMatchingAlerts.join(
                                ", "
                            )
                        )}
                    </div>

                `;

            }


            if (
                containedMatchingIncidents.length
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        🔒 Contained incident:
                        ${escapeHTML(
                            containedMatchingIncidents.join(
                                ", "
                            )
                        )}
                    </div>

                `;

            }


            if (
                resolvedMatchingIncidents.length
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        ✅ Resolved incident:
                        ${escapeHTML(
                            resolvedMatchingIncidents.join(
                                ", "
                            )
                        )}
                    </div>

                `;

            }


            if (
                closedMatchingIncidents.length
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        ⚫ Closed incident:
                        ${escapeHTML(
                            closedMatchingIncidents.join(
                                ", "
                            )
                        )}
                    </div>

                `;

            }


            if (
                isolatedAffectedDevices.length
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        🔒 Isolated device:
                        ${escapeHTML(
                            isolatedAffectedDevices.join(
                                ", "
                            )
                        )}
                    </div>

                `;

            }


            if (
                severity === "CRITICAL" ||
                severity === "HIGH"
            ) {

                if (
                    !isolatedAffectedDevices.length
                ) {

                    responseHTML += `

                        <div class="report-response-item">
                            ⚠️ Recommended:
                            isolate the affected device
                            if the activity is confirmed
                            as malicious.
                        </div>

                    `;

                }


                responseHTML += `

                    <div class="report-response-item">
                        🔍 Recommended:
                        investigate the source IP,
                        affected device, and attack pattern.
                    </div>

                    <div class="report-response-item">
                        🚨 Recommended:
                        escalate this activity for
                        SOC analyst investigation.
                    </div>

                `;

            }


            else if (
                severity === "MEDIUM"
            ) {

                responseHTML += `

                    <div class="report-response-item">
                        🔍 Recommended:
                        investigate the suspicious activity.
                    </div>

                    <div class="report-response-item">
                        👁️ Recommended:
                        continue monitoring the affected target.
                    </div>

                `;

            }


            else {

                responseHTML += `

                    <div class="report-response-item">
                        👁️ Recommended:
                        continue monitoring and validate
                        future related alerts.
                    </div>

                `;

            }


            // =========================
            // Build Report
            // =========================

            generatedReport.innerHTML = `

                <div class="generated-report-header">

                    <div>

                        <span class="report-id">
                            ${reportID}
                        </span>

                        <h2>
                            ${escapeHTML(title)}
                        </h2>

                        <p>
                            Target:
                            ${escapeHTML(targetLabel)}
                        </p>

                    </div>

                    <span
                        class="report-risk-badge ${severityClass}"
                    >
                        ${severity}
                        •
                        ${highestRisk}/100
                    </span>

                </div>


                <div class="report-section">

                    <h3>
                        📌 Target Details
                    </h3>

                    <div class="report-details-grid">
                        ${detailsHTML}
                    </div>

                </div>


                <div class="report-section">

                    <h3>
                        🚨 Security Activity
                    </h3>

                    <div class="report-activity-list">
                        ${activityHTML}
                    </div>

                </div>


                <div class="report-section">

                    <h3>
                        🛡️ Sentinel X Response
                    </h3>

                    <div class="report-response-list">
                        ${responseHTML}
                    </div>

                </div>


                <div class="report-section">

                    <h3>
                        🤖 AI Analysis
                    </h3>

                    <div id="aiReportContent">

                        <div class="ai-placeholder">

                            <div>

                                <strong>
                                    AI Analysis Ready
                                </strong>

                                <p>
                                    AI integration is not connected
                                    in this version of Sentinel X.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <div class="report-actions">

                    <button id="analyzeReportBtn">
                        🤖 Analyze with AI
                    </button>

                    <button id="printReportBtn">
                        🖨️ Print Report
                    </button>

                    <button id="newReportBtn">
                        ＋ New Report
                    </button>

                </div>

            `;


            // =========================
            // Show Report
            // =========================

            if (reportEmptyState) {

                reportEmptyState.classList.add(
                    "hidden"
                );

            }


            if (reportSummary) {

                reportSummary.classList.add(
                    "hidden"
                );

            }


            generatedReport.classList.remove(
                "hidden"
            );


            // =========================
            // AI Button
            // =========================

            const analyzeButton =
                document.getElementById(
                    "analyzeReportBtn"
                );


            if (analyzeButton) {

                analyzeButton.addEventListener(
                    "click",
                    function () {

                        const aiContent =
                            document.getElementById(
                                "aiReportContent"
                            );


                        if (!aiContent) {
                            return;
                        }


                        aiContent.innerHTML = `

                            <div class="ai-analysis-result">

                                <div class="ai-analysis-block">

                                    <span>
                                        AI STATUS
                                    </span>

                                    <p>
                                        AI integration is not connected
                                        in this version of Sentinel X.
                                    </p>

                                </div>


                                <div class="ai-analysis-block">

                                    <span>
                                        CURRENT ANALYSIS
                                    </span>

                                    <p>
                                        This report currently uses
                                        CIC-IDS dataset records and
                                        current Sentinel X response states.
                                    </p>

                                </div>


                                <div class="ai-analysis-block">

                                    <span>
                                        RISK RESULT
                                    </span>

                                    <strong>
                                        ${severity} RISK
                                        •
                                        ${highestRisk}/100
                                    </strong>

                                </div>

                            </div>

                        `;


                        analyzeButton.innerHTML =
                            "🤖 AI Not Connected";

                        analyzeButton.disabled =
                            true;

                    }
                );

            }


            // =========================
            // Print
            // =========================

            const printButton =
                document.getElementById(
                    "printReportBtn"
                );


            if (printButton) {

                printButton.addEventListener(
                    "click",
                    function () {

                        window.print();

                    }
                );

            }


            // =========================
            // New Report
            // =========================

            const newReportButton =
                document.getElementById(
                    "newReportBtn"
                );


            if (newReportButton) {

                newReportButton.addEventListener(
                    "click",
                    function () {

                        generatedReport.classList.add(
                            "hidden"
                        );


                        if (reportSummary) {

                            reportSummary.classList.add(
                                "hidden"
                            );

                        }


                        if (reportEmptyState) {

                            reportEmptyState.classList.remove(
                                "hidden"
                            );

                        }


                        reportType.value =
                            "";

                        reportTarget.innerHTML =
                            '<option value="">Select Target</option>';

                        reportTarget.disabled =
                            true;

                        generateReportBtn.disabled =
                            true;


                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }
                );

            }

        }
    );


    console.log(
        "Sentinel X Dataset Reports System Ready"
    );

});
// ============================================
// SENTINEL X - CIC-IDS DATASET LOADER
// ============================================

async function loadSentinelDataset() {

    try {

        const response =
            await fetch("data/sentinel_data.json");

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }

        const data =
            await response.json();

        console.log(
            "Sentinel X Dataset Loaded Successfully!"
        );

        console.log(
            "Total Dataset Records:",
            data.length
        );

        console.log(
            "First Dataset Record:",
            data[0]
        );

        return data;

    }

    catch (error) {

        console.error(
            "Failed to load Sentinel X Dataset:",
            error
        );

        return [];

    }

}


loadSentinelDataset();


// ========================================================
// SENTINEL X - DATASET ALERTS
// ========================================================

async function renderDatasetAlerts() {

    const container =
        document.getElementById(
            "datasetAlertsContainer"
        );


    // Only run this code on alerts.html
    if (!container) {
        return;
    }


    try {

        // =========================
        // Load Sentinel Dataset
        // =========================

        const response =
            await fetch(
                "data/sentinel_data.json"
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Dataset Alerts Loaded:",
            data.length
        );


        // =========================
        // Sort by Risk Score
        // =========================

        const sortedData =
            [...data].sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


        // =========================
        // Show Top 12 Alerts
        // =========================

        const visibleAlerts =
            sortedData.slice(0, 12);


        // =========================
        // Clear Container
        // =========================

        container.innerHTML =
            "";


        // =========================
        // Simulated Alert
        // =========================

        let simulatedAlert =
            null;


        try {

            simulatedAlert =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXSimulatedAlert"
                    ) || "null"
                );

        }

        catch (error) {

            simulatedAlert =
                null;

        }


        if (
            simulatedAlert &&
            simulatedAlert.id === "SIM-001"
        ) {

            const simulatedCard =
                document.createElement(
                    "div"
                );


            simulatedCard.className =
                "alert-card high";

            simulatedCard.dataset.alertCard =
                "SIM-001";

            simulatedCard.dataset.alert =
                "SIM-001";

            simulatedCard.dataset.device =
                simulatedAlert.targetDevice ||
                "SIM-PC-001";


            simulatedCard.innerHTML = `

                <div class="alert-main">

                    <div class="alert-title-row">

                        <span class="alert-icon">
                            🚨
                        </span>

                        <div>

                            <h4>
                                ${
                                    simulatedAlert.attackType ||
                                    "Simulated Network Attack"
                                }
                            </h4>

                            <span class="alert-id">
                                SIM-001
                            </span>

                        </div>

                    </div>


                    <p>
                        Sentinel X detected a simulated
                        security attack generated from
                        the Dashboard.
                    </p>


                    <div class="alert-meta">

                        <span>
                            🌐 Source IP:
                            <strong>
                                ${
                                    simulatedAlert.sourceIp ||
                                    "Simulation"
                                }
                            </strong>
                        </span>


                        <span>
                            🎯 Target Device:
                            <strong>
                                ${
                                    simulatedAlert.targetDevice ||
                                    "SIM-PC-001"
                                }
                            </strong>
                        </span>


                        <span>
                            👤 Employee:
                            <strong>
                                ${
                                    simulatedAlert.employee ||
                                    "Simulation"
                                }
                            </strong>
                        </span>


                        <span>
                            💻 Device Name:
                            <strong>
                                ${
                                    simulatedAlert.deviceName ||
                                    "Simulation Device"
                                }
                            </strong>
                        </span>


                        <span>
                            🔴 Source:
                            <strong>
                                ${
                                    simulatedAlert.sourceType ||
                                    "External"
                                }
                            </strong>
                        </span>


                        <span>
                            🦠 Attack Type:
                            <strong>
                                ${
                                    simulatedAlert.attackType ||
                                    "Simulated Network Attack"
                                }
                            </strong>
                        </span>


                        <span>
                            📈 Risk Score:
                            <strong>
                                ${
                                    simulatedAlert.riskScore ||
                                    95
                                }/100
                            </strong>
                        </span>

                    </div>

                </div>


                <div class="alert-actions">

                    <div class="alert-status">

                        <span
                            class="severity-badge critical-badge"
                        >
                            CRITICAL
                        </span>

                        <span
                            class="state-badge active-state"
                        >
                            Active
                        </span>

                    </div>


                    <div class="action-buttons">

                        <button
                            class="dataset-investigate-btn"
                        >
                            🔍 Investigate
                        </button>


                        <button
                            class="dataset-block-btn"
                        >
                            🚫 Block
                        </button>


                        <button
                            class="dataset-ignore-btn"
                        >
                            👁 Ignore
                        </button>

                    </div>

                </div>

            `;


            const simulatedInvestigateButton =
                simulatedCard.querySelector(
                    ".dataset-investigate-btn"
                );


            simulatedInvestigateButton
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission(
                                "investigateAlerts"
                            )
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to investigate alerts."
                            );

                            return;

                        }


                        window.location.href =
                            "investigation.html?alert=" +
                            encodeURIComponent(
                                "SIM-001"
                            );

                    }
                );


            const simulatedBlockButton =
                simulatedCard.querySelector(
                    ".dataset-block-btn"
                );


            simulatedBlockButton
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission(
                                "blockAlert"
                            )
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to block alerts."
                            );

                            return;

                        }


                        simulatedCard.style.opacity =
                            "0.6";

                        simulatedCard.style.border =
                            "2px solid #ef4444";

                        this.innerHTML =
                            "✅ Blocked";

                        this.disabled =
                            true;


                        if (
                            !blockedAlerts.includes(
                                "SIM-001"
                            )
                        ) {

                            blockedAlerts.push(
                                "SIM-001"
                            );

                        }


                        const simulatedDevice =
                            simulatedCard.dataset.device;


                        if (
                            simulatedDevice &&
                            !isolatedDevices.includes(
                                simulatedDevice
                            )
                        ) {

                            isolatedDevices.push(
                                simulatedDevice
                            );

                        }


                        localStorage.setItem(
                            "sentinelXBlockedAlerts",
                            JSON.stringify(
                                blockedAlerts
                            )
                        );


                        localStorage.setItem(
                            "sentinelXIsolatedDevices",
                            JSON.stringify(
                                isolatedDevices
                            )
                        );

                    }
                );


            const simulatedIgnoreButton =
                simulatedCard.querySelector(
                    ".dataset-ignore-btn"
                );


            simulatedIgnoreButton
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission(
                                "ignoreAlert"
                            )
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to ignore alerts."
                            );

                            return;

                        }


                        simulatedCard.style.opacity =
                            "0.5";

                        simulatedCard.classList.add(
                            "alert-ignored"
                        );

                        this.innerHTML =
                            "✓ Ignored";

                        this.disabled =
                            true;


                        if (
                            !ignoredAlerts.includes(
                                "SIM-001"
                            )
                        ) {

                            ignoredAlerts.push(
                                "SIM-001"
                            );

                        }


                        localStorage.setItem(
                            "sentinelXIgnoredAlerts",
                            JSON.stringify(
                                ignoredAlerts
                            )
                        );

                    }
                );


            if (
                blockedAlerts.includes(
                    "SIM-001"
                )
            ) {

                simulatedCard.style.opacity =
                    "0.6";

                simulatedCard.style.border =
                    "2px solid #ef4444";

                simulatedBlockButton.innerHTML =
                    "✅ Blocked";

                simulatedBlockButton.disabled =
                    true;

            }


            if (
                ignoredAlerts.includes(
                    "SIM-001"
                )
            ) {

                simulatedCard.style.opacity =
                    "0.5";

                simulatedCard.classList.add(
                    "alert-ignored"
                );

                simulatedIgnoreButton.innerHTML =
                    "✓ Ignored";

                simulatedIgnoreButton.disabled =
                    true;

            }


            container.appendChild(
                simulatedCard
            );

        }


        // =========================
        // Create Alert Cards
        // =========================

        visibleAlerts.forEach(
            (record, index) => {

                const alertID =
                    `DATA-ALT-${String(index + 1).padStart(3, "0")}`;


                // =========================
                // Severity
                // =========================

                let severity =
                    "LOW";

                let severityClass =
                    "low";

                let badgeClass =
                    "low-badge";

                let icon =
                    "🟡";


                if (
                    Number(record.riskScore) >= 90
                ) {

                    severity =
                        "CRITICAL";

                    severityClass =
                        "high";

                    badgeClass =
                        "critical-badge";

                    icon =
                        "🚨";

                }

                else if (
                    Number(record.riskScore) >= 80
                ) {

                    severity =
                        "HIGH";

                    severityClass =
                        "high";

                    badgeClass =
                        "high-badge";

                    icon =
                        "🔴";

                }

                else if (
                    Number(record.riskScore) >= 70
                ) {

                    severity =
                        "MEDIUM";

                    severityClass =
                        "medium";

                    badgeClass =
                        "medium-badge";

                    icon =
                        "⚠️";

                }


                // =========================
                // Internal / External Icon
                // =========================

                let sourceIcon =
                    "⚪";


                if (
                    record.sourceType ===
                    "Internal"
                ) {

                    sourceIcon =
                        "🟢";

                }

                else if (
                    record.sourceType ===
                    "External"
                ) {

                    sourceIcon =
                        "🔴";

                }


                // =========================
                // Alert Card
                // =========================

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    `alert-card ${severityClass}`;


                card.dataset.alertCard =
                    alertID;

                card.dataset.alert =
                    alertID;

                card.dataset.device =
                    record.targetDevice;


                card.innerHTML = `

                    <div class="alert-main">

                        <div class="alert-title-row">

                            <span class="alert-icon">
                                ${icon}
                            </span>

                            <div>

                                <h4>
                                    ${record.attackType}
                                </h4>

                                <span class="alert-id">
                                    ${alertID}
                                </span>

                            </div>

                        </div>


                        <p>
                            Sentinel X detected
                            ${record.attackType}
                            activity from
                            ${record.sourceIp}
                            targeting
                            ${record.destinationIp}.
                        </p>


                        <div class="alert-meta">

                            <span>
                                🌐 Source IP:
                                <strong>
                                    ${record.sourceIp}
                                </strong>
                            </span>


                            <span>
                                🎯 Target Device:
                                <strong>
                                    ${record.targetDevice}
                                </strong>
                            </span>


                            <span>
                                👤 Employee:
                                <strong>
                                    ${record.employee}
                                </strong>
                            </span>


                            <span>
                                💻 Device Name:
                                <strong>
                                    ${record.deviceName}
                                </strong>
                            </span>


                            <span>
                                ${sourceIcon}
                                Source:
                                <strong>
                                    ${record.sourceType}
                                </strong>
                            </span>


                            <span>
                                🦠 Attack Type:
                                <strong>
                                    ${record.attackType}
                                </strong>
                            </span>


                            <span>
                                📈 Risk Score:
                                <strong>
                                    ${record.riskScore}/100
                                </strong>
                            </span>

                        </div>

                    </div>


                    <div class="alert-actions">

                        <div class="alert-status">

                            <span
                                class="severity-badge ${badgeClass}"
                            >
                                ${severity}
                            </span>

                            <span
                                class="state-badge active-state"
                            >
                                Active
                            </span>

                        </div>


                        <div class="action-buttons">

                            <button
                                class="dataset-investigate-btn"
                            >
                                🔍 Investigate
                            </button>


                            <button
                                class="dataset-block-btn"
                            >
                                🚫 Block
                            </button>


                            <button
                                class="dataset-ignore-btn"
                            >
                                👁 Ignore
                            </button>

                        </div>

                    </div>

                `;


                // =========================
                // Investigate Button
                // =========================

                const datasetInvestigateButton =
                    card.querySelector(
                        ".dataset-investigate-btn"
                    );


                datasetInvestigateButton
                    .addEventListener(
                        "click",
                        function () {

                            if (
                                typeof window.sentinelHasPermission === "function" &&
                                !window.sentinelHasPermission(
                                    "investigateAlerts"
                                )
                            ) {

                                alert(
                                    "⛔ Access Denied\n\n" +
                                    "Your account does not have permission " +
                                    "to investigate alerts."
                                );

                                return;

                            }


                            window.location.href =
                                "investigation.html?alert=" +
                                encodeURIComponent(
                                    alertID
                                );

                        }
                    );


                // =========================
                // Restore Blocked State
                // =========================

                if (
                    blockedAlerts.includes(
                        alertID
                    )
                ) {

                    card.style.opacity =
                        "0.6";

                    card.style.border =
                        "2px solid #ef4444";

                    const blockButton =
                        card.querySelector(
                            ".dataset-block-btn"
                        );


                    if (blockButton) {

                        blockButton.innerHTML =
                            "✅ Blocked";

                        blockButton.disabled =
                            true;

                    }

                }


                // =========================
                // Restore Ignored State
                // =========================

                if (
                    ignoredAlerts.includes(
                        alertID
                    )
                ) {

                    card.style.opacity =
                        "0.5";

                    card.classList.add(
                        "alert-ignored"
                    );

                    const ignoreButton =
                        card.querySelector(
                            ".dataset-ignore-btn"
                        );


                    if (ignoreButton) {

                        ignoreButton.innerHTML =
                            "✓ Ignored";

                        ignoreButton.disabled =
                            true;

                    }

                }


                // =========================
                // Block Button
                // =========================

                card
                    .querySelector(
                        ".dataset-block-btn"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            if (
                                typeof window.sentinelHasPermission === "function" &&
                                !window.sentinelHasPermission(
                                    "blockAlert"
                                )
                            ) {

                                alert(
                                    "⛔ Access Denied\n\n" +
                                    "Your account does not have permission " +
                                    "to block alerts."
                                );

                                return;

                            }


                            card.style.opacity =
                                "0.6";

                            card.style.border =
                                "2px solid #ef4444";

                            this.innerHTML =
                                "✅ Blocked";

                            this.disabled =
                                true;


                            if (
                                !blockedAlerts.includes(
                                    alertID
                                )
                            ) {

                                blockedAlerts.push(
                                    alertID
                                );

                            }


                            localStorage.setItem(
                                "sentinelXBlockedAlerts",
                                JSON.stringify(
                                    blockedAlerts
                                )
                            );


                            if (
                                !isolatedDevices.includes(
                                    record.targetDevice
                                )
                            ) {

                                isolatedDevices.push(
                                    record.targetDevice
                                );


                                localStorage.setItem(
                                    "sentinelXIsolatedDevices",
                                    JSON.stringify(
                                        isolatedDevices
                                    )
                                );

                            }


                            alert(
                                "🔒 Device Blocked\n\n" +
                                "Device: " +
                                record.targetDevice +
                                "\nAttack: " +
                                record.attackType +
                                "\nSource IP: " +
                                record.sourceIp
                            );

                        }
                    );


                // =========================
                // Ignore Button
                // =========================

                card
                    .querySelector(
                        ".dataset-ignore-btn"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            if (
                                typeof window.sentinelHasPermission === "function" &&
                                !window.sentinelHasPermission(
                                    "ignoreAlert"
                                )
                            ) {

                                alert(
                                    "⛔ Access Denied\n\n" +
                                    "Your account does not have permission " +
                                    "to ignore alerts."
                                );

                                return;

                            }


                            card.style.opacity =
                                "0.5";

                            card.classList.add(
                                "alert-ignored"
                            );

                            this.innerHTML =
                                "✓ Ignored";

                            this.disabled =
                                true;


                            if (
                                !ignoredAlerts.includes(
                                    alertID
                                )
                            ) {

                                ignoredAlerts.push(
                                    alertID
                                );

                            }


                            localStorage.setItem(
                                "sentinelXIgnoredAlerts",
                                JSON.stringify(
                                    ignoredAlerts
                                )
                            );

                        }
                    );


                container.appendChild(
                    card
                );

            }
        );


        // =========================
        // Summary Counters
        // =========================

        const highCount =
            visibleAlerts.filter(
                item =>
                    Number(item.riskScore) >= 80
            ).length +
            (
                simulatedAlert &&
                simulatedAlert.id === "SIM-001"
                    ? 1
                    : 0
            );


        const mediumCount =
            visibleAlerts.filter(
                item =>
                    Number(item.riskScore) >= 70 &&
                    Number(item.riskScore) < 80
            ).length;


        const lowCount =
            visibleAlerts.filter(
                item =>
                    Number(item.riskScore) < 70
            ).length;


        const displayedAlertCount =
            visibleAlerts.length +
            (
                simulatedAlert &&
                simulatedAlert.id === "SIM-001"
                    ? 1
                    : 0
            );


        const highElement =
            document.getElementById(
                "highAlertCount"
            );

        const mediumElement =
            document.getElementById(
                "mediumAlertCount"
            );

        const lowElement =
            document.getElementById(
                "lowAlertCount"
            );

        const topAlertCount =
            document.getElementById(
                "topAlertCount"
            );


        if (highElement) {

            highElement.textContent =
                highCount;

        }


        if (mediumElement) {

            mediumElement.textContent =
                mediumCount;

        }


        if (lowElement) {

            lowElement.textContent =
                lowCount;

        }


        if (topAlertCount) {

            topAlertCount.textContent =
                `🔔 Alerts: ${displayedAlertCount}`;

        }


        // =========================
        // Dataset Status
        // =========================

        const datasetStatus =
            document.getElementById(
                "datasetStatus"
            );


        if (datasetStatus) {

            datasetStatus.innerHTML =
                `🛡️ CIC-IDS Dataset Connected • ` +
                `${data.length} security records loaded • ` +
                `${displayedAlertCount} alerts displayed`;

        }


        console.log(
            "Sentinel X Alert Interface Updated Successfully!"
        );

    }

    catch (error) {

        console.error(
            "Failed to render dataset alerts:",
            error
        );


        const datasetStatus =
            document.getElementById(
                "datasetStatus"
            );


        if (datasetStatus) {

            datasetStatus.textContent =
                "⚠️ Unable to load Sentinel X security dataset.";

        }

    }

}


// =========================
// Start Dataset Alerts
// =========================

renderDatasetAlerts();
// ========================================================
// SENTINEL X - CIC-IDS DATASET INCIDENTS
// ========================================================

async function renderDatasetIncidents() {

    const incidentsTable =
        document.querySelector(
            ".incidents tbody"
        );


    // Only run this code on the Incidents page
    if (!incidentsTable) {
        return;
    }


    try {

        // ================================================
        // 1. Load Sentinel X Dataset
        // ================================================

        const response =
            await fetch(
                "data/sentinel_data.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load Sentinel X dataset"
            );

        }


        const data =
            await response.json();


        console.log(
            "Sentinel X Incidents Dataset Loaded:",
            data.length
        );


        // ================================================
        // 2. Select Highest-Risk Security Incidents
        // ================================================

        const incidents =
            [...data]
                .sort(
                    (a, b) =>
                        Number(b.riskScore) -
                        Number(a.riskScore)
                )
                .slice(0, 10);


        // ================================================
        // Saved Incident States
        // ================================================

        let savedContainedIncidents = [];
        let savedResolvedIncidents = [];
        let savedClosedIncidents = [];


        try {

            savedContainedIncidents =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXContainedIncidents"
                    ) || "[]"
                );


            savedResolvedIncidents =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXResolvedIncidents"
                    ) || "[]"
                );


            savedClosedIncidents =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXClosedIncidents"
                    ) || "[]"
                );

        }

        catch (error) {

            savedContainedIncidents = [];
            savedResolvedIncidents = [];
            savedClosedIncidents = [];

        }


        function saveIncidentStates() {

            localStorage.setItem(
                "sentinelXContainedIncidents",
                JSON.stringify(
                    savedContainedIncidents
                )
            );


            localStorage.setItem(
                "sentinelXResolvedIncidents",
                JSON.stringify(
                    savedResolvedIncidents
                )
            );


            localStorage.setItem(
                "sentinelXClosedIncidents",
                JSON.stringify(
                    savedClosedIncidents
                )
            );

        }


        function getIncidentState(
            incidentID,
            fallbackStatus = "Open"
        ) {

            if (
                savedClosedIncidents.includes(
                    incidentID
                )
            ) {

                return {
                    text: "Closed",
                    className: "status-closed"
                };

            }


            if (
                savedResolvedIncidents.includes(
                    incidentID
                )
            ) {

                return {
                    text: "Resolved",
                    className: "status-closed"
                };

            }


            if (
                savedContainedIncidents.includes(
                    incidentID
                )
            ) {

                return {
                    text: "Contained",
                    className:
                        "status-investigating"
                };

            }


            return {
                text: fallbackStatus || "Open",
                className: "status-open"
            };

        }


        function setIncidentState(
            incidentID,
            state
        ) {

            savedContainedIncidents =
                savedContainedIncidents.filter(
                    id =>
                        id !== incidentID
                );


            savedResolvedIncidents =
                savedResolvedIncidents.filter(
                    id =>
                        id !== incidentID
                );


            savedClosedIncidents =
                savedClosedIncidents.filter(
                    id =>
                        id !== incidentID
                );


            if (state === "Contained") {

                savedContainedIncidents.push(
                    incidentID
                );

            }

            else if (
                state === "Resolved"
            ) {

                savedResolvedIncidents.push(
                    incidentID
                );

            }

            else if (
                state === "Closed"
            ) {

                savedClosedIncidents.push(
                    incidentID
                );

            }


            saveIncidentStates();

        }


        // ================================================
        // 3. Remove Old Static Incident Rows
        // ================================================

        incidentsTable.innerHTML =
            "";


        // ================================================
        // Investigation Created Incidents
        // ================================================

        let createdInvestigationIncidents =
            [];


        try {

            createdInvestigationIncidents =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXCreatedIncidents"
                    ) || "[]"
                );

        }

        catch (error) {

            createdInvestigationIncidents =
                [];

        }


        // ================================================
        // 4. Update Incident Counter
        // ================================================

        const createdValidCount =
            createdInvestigationIncidents.filter(
                incident =>
                    data.some(
                        record =>
                            record.id ===
                            incident.datasetRecord
                    )
            ).length;


        const createdDatasetRecords =
            new Set(
                createdInvestigationIncidents.map(
                    incident =>
                        incident.datasetRecord
                )
            );


        const filteredIncidents =
            incidents.filter(
                record =>
                    !createdDatasetRecords.has(
                        record.id
                    )
            );


        const displayedIncidentCount =
            createdValidCount +
            filteredIncidents.length;


        const topbarSpans =
            document.querySelectorAll(
                ".topbar-right span"
            );


        topbarSpans.forEach(
            function (span) {

                if (
                    span.textContent.includes(
                        "Incidents:"
                    )
                ) {

                    span.textContent =
                        `📂 Incidents: ${displayedIncidentCount}`;

                }

            }
        );


        // ================================================
        // 5. Update Dataset Information
        // ================================================

        const incidentInfo =
            document.getElementById(
                "incidentInfo"
            );


        if (incidentInfo) {

            incidentInfo.textContent =
                `🛡️ CIC-IDS Dataset Connected • ` +
                `${data.length} security records loaded • ` +
                `${displayedIncidentCount} incidents displayed`;

        }


        // ================================================
        // 6. Investigation Created Incident Rows
        // ================================================

        createdInvestigationIncidents.forEach(
            function (incident) {

                const record =
                    data.find(
                        item =>
                            item.id ===
                            incident.datasetRecord
                    );


                if (!record) {
                    return;
                }


                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.incident =
                    incident.id;

                row.dataset.alert =
                    incident.alert;

                row.dataset.device =
                    incident.targetDevice;


                let severityClass =
                    "severity-low";


                if (
                    incident.severity ===
                        "CRITICAL" ||
                    incident.severity ===
                        "HIGH"
                ) {

                    severityClass =
                        "severity-high";

                }

                else if (
                    incident.severity ===
                    "MEDIUM"
                ) {

                    severityClass =
                        "severity-medium";

                }


                const restoredState =
                    getIncidentState(
                        incident.id,
                        incident.status
                    );


                row.innerHTML = `

                    <td>
                        ${incident.id}
                    </td>

                    <td>
                        ${incident.attackType}
                    </td>

                    <td>
                        ${incident.alert}
                    </td>

                    <td>
                        ${incident.employee}
                    </td>

                    <td>
                        ${incident.targetDevice}
                    </td>

                    <td class="${severityClass}">
                        ${incident.severity}
                    </td>

                    <td class="${restoredState.className}">
                        ${restoredState.text}
                    </td>

                    <td>
                        <button
                            class="dataset-incident-view"
                        >
                            View
                        </button>
                    </td>

                `;


                incidentsTable.appendChild(
                    row
                );


                // ========================================
                // View Investigation Incident
                // ========================================

                const viewButton =
                    row.querySelector(
                        ".dataset-incident-view"
                    );


                viewButton.addEventListener(
                    "click",
                    function () {

                        const popup =
                            document.createElement(
                                "div"
                            );


                        popup.className =
                            "incident-popup";


                        popup.innerHTML = `

                            <div class="incident-popup-box">

                                <div class="incident-popup-header">

                                    <h2>
                                        🔎 Security Incident
                                    </h2>

                                    <button
                                        class="dataset-close-popup"
                                    >
                                        ✖
                                    </button>

                                </div>


                                <div class="incident-details">

                                    <div>
                                        <strong>
                                            Incident ID
                                        </strong>

                                        <span>
                                            ${incident.id}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Alert ID
                                        </strong>

                                        <span>
                                            ${incident.alert}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Dataset Record
                                        </strong>

                                        <span>
                                            ${incident.datasetRecord}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Attack Type
                                        </strong>

                                        <span>
                                            ${record.attackType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source IP
                                        </strong>

                                        <span>
                                            ${record.sourceIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Destination IP
                                        </strong>

                                        <span>
                                            ${record.destinationIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Target Device
                                        </strong>

                                        <span>
                                            ${record.targetDevice}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Employee
                                        </strong>

                                        <span>
                                            ${record.employee}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Device Name
                                        </strong>

                                        <span>
                                            ${record.deviceName}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source Type
                                        </strong>

                                        <span>
                                            ${record.sourceType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Risk Score
                                        </strong>

                                        <span>
                                            ${record.riskScore}/100
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Severity
                                        </strong>

                                        <span>
                                            ${incident.severity}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Status
                                        </strong>

                                        <span
                                            class="dataset-current-status"
                                        >
                                            ${row.cells[6].textContent.trim()}
                                        </span>
                                    </div>

                                </div>


                                <div class="incident-actions">

                                    <button
                                        class="dataset-investigate-incident"
                                    >
                                        🔍 Investigate
                                    </button>


                                    <button
                                        class="dataset-contain-incident"
                                    >
                                        🔒 Contain
                                    </button>


                                    <button
                                        class="dataset-resolve-incident"
                                    >
                                        ✅ Resolve
                                    </button>


                                    <button
                                        class="dataset-close-incident"
                                    >
                                        ❌ Close Incident
                                    </button>

                                </div>

                            </div>

                        `;


                        document.body.appendChild(
                            popup
                        );


                        // =================================
                        // Close Popup
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-close-popup"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    popup.remove();

                                }
                            );


                        popup.addEventListener(
                            "click",
                            function (event) {

                                if (
                                    event.target ===
                                    popup
                                ) {

                                    popup.remove();

                                }

                            }
                        );


                        // =================================
                        // Investigate
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-investigate-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "viewInvestigation"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to open investigations."
                                        );

                                        return;

                                    }


                                    window.location.href =
                                        "investigation.html?alert=" +
                                        encodeURIComponent(
                                            incident.alert
                                        );

                                }
                            );


                        // =================================
                        // Contain
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-contain-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "containIncident"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to contain incidents."
                                        );

                                        return;

                                    }


                                    row.cells[6].textContent =
                                        "Contained";

                                    row.cells[6].className =
                                        "status-investigating";


                                    setIncidentState(
                                        incident.id,
                                        "Contained"
                                    );


                                    let isolated = [];


                                    try {

                                        isolated =
                                            JSON.parse(
                                                localStorage.getItem(
                                                    "sentinelXIsolatedDevices"
                                                ) || "[]"
                                            );

                                    }

                                    catch (error) {

                                        isolated =
                                            [];

                                    }


                                    if (
                                        !isolated.includes(
                                            record.targetDevice
                                        )
                                    ) {

                                        isolated.push(
                                            record.targetDevice
                                        );

                                    }


                                    localStorage.setItem(
                                        "sentinelXIsolatedDevices",
                                        JSON.stringify(
                                            isolated
                                        )
                                    );


                                    const statusElement =
                                        popup.querySelector(
                                            ".dataset-current-status"
                                        );


                                    if (statusElement) {

                                        statusElement.textContent =
                                            "Contained";

                                    }

                                }
                            );


                        // =================================
                        // Resolve
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-resolve-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "resolveIncident"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to resolve incidents."
                                        );

                                        return;

                                    }


                                    row.cells[6].textContent =
                                        "Resolved";

                                    row.cells[6].className =
                                        "status-closed";


                                    setIncidentState(
                                        incident.id,
                                        "Resolved"
                                    );


                                    alert(
                                        "✅ Incident Resolved\n\n" +
                                        incident.id +
                                        " has been resolved successfully."
                                    );


                                    popup.remove();

                                }
                            );


                        // =================================
                        // Close Incident
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-close-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "closeIncident"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to close incidents."
                                        );

                                        return;

                                    }


                                    row.cells[6].textContent =
                                        "Closed";

                                    row.cells[6].className =
                                        "status-closed";


                                    setIncidentState(
                                        incident.id,
                                        "Closed"
                                    );


                                    alert(
                                        "❌ Incident Closed\n\n" +
                                        incident.id +
                                        " has been closed."
                                    );


                                    popup.remove();

                                }
                            );

                    }
                );

            }
        );


        // ================================================
        // 7. Standard Dataset Incident Rows
        // ================================================

        filteredIncidents.forEach(
            function (record) {

                const originalIncidentIndex =
                    incidents.findIndex(
                        item =>
                            item.id ===
                            record.id
                    );


                const incidentID =
                    `DATA-INC-${String(
                        originalIncidentIndex + 1
                    ).padStart(3, "0")}`;


                const alertID =
                    `DATA-ALT-${String(
                        originalIncidentIndex + 1
                    ).padStart(3, "0")}`;


                // ========================================
                // Determine Severity
                // ========================================

                let severity =
                    "LOW";

                let severityClass =
                    "severity-low";

                const risk =
                    Number(
                        record.riskScore
                    );


                if (risk >= 90) {

                    severity =
                        "CRITICAL";

                    severityClass =
                        "severity-high";

                }

                else if (risk >= 80) {

                    severity =
                        "HIGH";

                    severityClass =
                        "severity-high";

                }

                else if (risk >= 70) {

                    severity =
                        "MEDIUM";

                    severityClass =
                        "severity-medium";

                }


                // ========================================
                // Restore Incident Status
                // ========================================

                const restoredState =
                    getIncidentState(
                        incidentID,
                        "Open"
                    );


                // ========================================
                // Create Table Row
                // ========================================

                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.incident =
                    incidentID;

                row.dataset.alert =
                    alertID;

                row.dataset.device =
                    record.targetDevice;


                row.innerHTML = `

                    <td>
                        ${incidentID}
                    </td>

                    <td>
                        ${record.attackType}
                    </td>

                    <td>
                        ${alertID}
                    </td>

                    <td>
                        ${record.employee}
                    </td>

                    <td>
                        ${record.targetDevice}
                    </td>

                    <td class="${severityClass}">
                        ${severity}
                    </td>

                    <td class="${restoredState.className}">
                        ${restoredState.text}
                    </td>

                    <td>
                        <button
                            class="dataset-incident-view"
                        >
                            View
                        </button>
                    </td>

                `;


                incidentsTable.appendChild(
                    row
                );


                // ========================================
                // View Incident
                // ========================================

                const viewButton =
                    row.querySelector(
                        ".dataset-incident-view"
                    );


                viewButton.addEventListener(
                    "click",
                    function () {

                        const popup =
                            document.createElement(
                                "div"
                            );


                        popup.className =
                            "incident-popup";


                        popup.innerHTML = `

                            <div class="incident-popup-box">

                                <div class="incident-popup-header">

                                    <h2>
                                        🔎 Security Incident
                                    </h2>

                                    <button
                                        class="dataset-close-popup"
                                    >
                                        ✖
                                    </button>

                                </div>


                                <div class="incident-details">

                                    <div>
                                        <strong>
                                            Incident ID
                                        </strong>

                                        <span>
                                            ${incidentID}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Alert ID
                                        </strong>

                                        <span>
                                            ${alertID}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Attack Type
                                        </strong>

                                        <span>
                                            ${record.attackType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source IP
                                        </strong>

                                        <span>
                                            ${record.sourceIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Destination IP
                                        </strong>

                                        <span>
                                            ${record.destinationIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Target Device
                                        </strong>

                                        <span>
                                            ${record.targetDevice}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Employee
                                        </strong>

                                        <span>
                                            ${record.employee}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Device Name
                                        </strong>

                                        <span>
                                            ${record.deviceName}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source Type
                                        </strong>

                                        <span>
                                            ${record.sourceType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Risk Score
                                        </strong>

                                        <span>
                                            ${record.riskScore}/100
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Severity
                                        </strong>

                                        <span>
                                            ${severity}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Status
                                        </strong>

                                        <span
                                            class="dataset-current-status"
                                        >
                                            ${row.cells[6].textContent.trim()}
                                        </span>
                                    </div>

                                </div>


                                <div class="incident-actions">

                                    <button
                                        class="dataset-investigate-incident"
                                    >
                                        🔍 Investigate
                                    </button>


                                    <button
                                        class="dataset-contain-incident"
                                    >
                                        🔒 Contain
                                    </button>


                                    <button
                                        class="dataset-resolve-incident"
                                    >
                                        ✅ Resolve
                                    </button>


                                    <button
                                        class="dataset-close-incident"
                                    >
                                        ❌ Close Incident
                                    </button>

                                </div>

                            </div>

                        `;


                        document.body.appendChild(
                            popup
                        );


                        // =================================
                        // Close Popup
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-close-popup"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    popup.remove();

                                }
                            );


                        popup.addEventListener(
                            "click",
                            function (event) {

                                if (
                                    event.target ===
                                    popup
                                ) {

                                    popup.remove();

                                }

                            }
                        );


                        // =================================
                        // Investigate
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-investigate-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "viewInvestigation"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to open investigations."
                                        );

                                        return;

                                    }


                                    window.location.href =
                                        "investigation.html?alert=" +
                                        encodeURIComponent(
                                            alertID
                                        );

                                }
                            );


                        // =================================
                        // Contain Incident
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-contain-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "containIncident"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to contain incidents."
                                        );

                                        return;

                                    }


                                    row.cells[6].textContent =
                                        "Contained";

                                    row.cells[6].className =
                                        "status-investigating";


                                    setIncidentState(
                                        incidentID,
                                        "Contained"
                                    );


                                    let currentIsolatedDevices =
                                        [];


                                    try {

                                        currentIsolatedDevices =
                                            JSON.parse(
                                                localStorage.getItem(
                                                    "sentinelXIsolatedDevices"
                                                ) || "[]"
                                            );

                                    }

                                    catch (error) {

                                        currentIsolatedDevices =
                                            [];

                                    }


                                    if (
                                        !currentIsolatedDevices.includes(
                                            record.targetDevice
                                        )
                                    ) {

                                        currentIsolatedDevices.push(
                                            record.targetDevice
                                        );

                                    }


                                    localStorage.setItem(
                                        "sentinelXIsolatedDevices",
                                        JSON.stringify(
                                            currentIsolatedDevices
                                        )
                                    );


                                    alert(
                                        "🔒 Incident Contained\n\n" +
                                        "Incident: " +
                                        incidentID +
                                        "\nDevice: " +
                                        record.targetDevice +
                                        "\nAttack: " +
                                        record.attackType +
                                        "\n\nThe device has been isolated successfully."
                                    );


                                    popup.remove();

                                }
                            );


                        // =================================
                        // Resolve Incident
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-resolve-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "resolveIncident"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to resolve incidents."
                                        );

                                        return;

                                    }


                                    row.cells[6].textContent =
                                        "Resolved";

                                    row.cells[6].className =
                                        "status-closed";


                                    setIncidentState(
                                        incidentID,
                                        "Resolved"
                                    );


                                    alert(
                                        "✅ Incident Resolved\n\n" +
                                        incidentID +
                                        " has been resolved successfully."
                                    );


                                    popup.remove();

                                }
                            );


                        // =================================
                        // Close Incident
                        // =================================

                        popup
                            .querySelector(
                                ".dataset-close-incident"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    if (
                                        typeof window.sentinelHasPermission === "function" &&
                                        !window.sentinelHasPermission(
                                            "closeIncident"
                                        )
                                    ) {

                                        alert(
                                            "⛔ Access Denied\n\n" +
                                            "Your account does not have permission " +
                                            "to close incidents."
                                        );

                                        return;

                                    }


                                    row.cells[6].textContent =
                                        "Closed";

                                    row.cells[6].className =
                                        "status-closed";


                                    setIncidentState(
                                        incidentID,
                                        "Closed"
                                    );


                                    alert(
                                        "❌ Incident Closed\n\n" +
                                        incidentID +
                                        " has been closed."
                                    );


                                    popup.remove();

                                }
                            );

                    }
                );

            }
        );


        console.log(
            "Sentinel X Dataset Incidents Created Successfully!"
        );


        console.log(
            "Incidents Displayed:",
            displayedIncidentCount
        );

    }

    catch (error) {

        console.error(
            "Failed to load Sentinel X Incidents:",
            error
        );

    }

}


// ========================================================
// START DATASET INCIDENT SYSTEM
// ========================================================

renderDatasetIncidents();
// ========================================================
// SENTINEL X - DATASET DEVICES
// ========================================================

async function renderDatasetDevices() {

    const devicesTableBody =
        document.querySelector(
            ".devices tbody"
        );


    // Run only on Devices page
    if (!devicesTableBody) {
        return;
    }


    try {

        const response =
            await fetch(
                "data/sentinel_data.json"
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        // ================================================
        // Sort Dataset To Match Alert IDs
        // ================================================

        const sortedData =
            [...data].sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


        function getRelatedAlertID(
            record
        ) {

            const index =
                sortedData.findIndex(
                    item =>
                        item.id ===
                        record.id
                );


            if (
                index < 0 ||
                index >= 12
            ) {

                return "No Top-12 Alert";

            }


            return (
                "DATA-ALT-" +
                String(
                    index + 1
                ).padStart(3, "0")
            );

        }


        // ================================================
        // Create One Record For Each Unique Device
        // ================================================

        const uniqueDevices =
            new Map();


        sortedData.forEach(
            function (record) {

                if (
                    !uniqueDevices.has(
                        record.targetDevice
                    )
                ) {

                    uniqueDevices.set(
                        record.targetDevice,
                        {
                            ...record,
                            alertID:
                                getRelatedAlertID(
                                    record
                                )
                        }
                    );

                }

            }
        );


        // ================================================
        // Sort Devices By Highest Risk
        // ================================================

        const devices =
            Array.from(
                uniqueDevices.values()
            ).sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


        // ================================================
        // Read Isolated Devices
        // ================================================

        let currentIsolatedDevices =
            [];


        try {

            currentIsolatedDevices =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXIsolatedDevices"
                    ) || "[]"
                );

        }

        catch (error) {

            currentIsolatedDevices =
                [];

        }


        // ================================================
        // Remove Old Static Device Rows
        // ================================================

        devicesTableBody.innerHTML =
            "";


        // ================================================
        // Create Device Rows
        // ================================================

        devices.forEach(
            function (record) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.device =
                    record.targetDevice;


                const isIsolated =
                    currentIsolatedDevices.includes(
                        record.targetDevice
                    );


                // ========================================
                // Device Type
                // ========================================

                let deviceType =
                    "Workstation";


                if (
                    record.targetDevice.startsWith(
                        "LAP"
                    )
                ) {

                    deviceType =
                        "Laptop";

                }

                else if (
                    record.targetDevice.startsWith(
                        "PC"
                    )
                ) {

                    deviceType =
                        "Desktop";

                }

                else if (
                    record.targetDevice.startsWith(
                        "SRV"
                    )
                ) {

                    deviceType =
                        "Server";

                }


                // ========================================
                // Department
                // ========================================

                let department =
                    "Unknown";


                const deviceName =
                    (
                        record.deviceName ||
                        ""
                    ).toLowerCase();


                if (
                    deviceName.includes(
                        "finance"
                    )
                ) {

                    department =
                        "Finance";

                }

                else if (
                    deviceName.includes(
                        "security"
                    )
                ) {

                    department =
                        "Security";

                }

                else if (
                    deviceName.includes(
                        "admin"
                    )
                ) {

                    department =
                        "Administration";

                }

                else if (
                    deviceName.includes(
                        "reception"
                    )
                ) {

                    department =
                        "Reception";

                }

                else if (
                    deviceName.includes(
                        "it"
                    )
                ) {

                    department =
                        "IT";

                }


                // ========================================
                // Device Status
                // ========================================

                let statusText =
                    "🟢 Online";

                let statusClass =
                    "status-active";


                if (isIsolated) {

                    statusText =
                        "🔒 Isolated";

                    statusClass =
                        "status-danger";

                }

                else if (
                    Number(record.riskScore) >=
                    90
                ) {

                    statusText =
                        "🔴 Critical";

                    statusClass =
                        "status-danger";

                }

                else if (
                    Number(record.riskScore) >=
                    70
                ) {

                    statusText =
                        "🟠 Warning";

                    statusClass =
                        "status-warning";

                }


                // ========================================
                // Create HTML
                // ========================================

                const alertLink =
                    record.alertID ===
                    "No Top-12 Alert"
                        ? record.alertID
                        : `
                            <a href="alerts.html?alert=${record.alertID}">
                                ${record.alertID}
                            </a>
                        `;


                row.innerHTML = `

                    <td>
                        ${record.targetDevice}
                    </td>

                    <td>
                        ${deviceType}
                    </td>

                    <td>
                        ${record.employee}
                    </td>

                    <td>
                        ${department}
                    </td>

                    <td class="${statusClass}">
                        ${statusText}
                    </td>

                    <td>
                        ${alertLink}
                    </td>

                    <td>
                        <button
                            class="dataset-device-view"
                        >
                            View
                        </button>
                    </td>

                `;


                // ========================================
                // View Device
                // ========================================

                const viewButton =
                    row.querySelector(
                        ".dataset-device-view"
                    );


                viewButton.addEventListener(
                    "click",
                    function () {

                        const popup =
                            document.createElement(
                                "div"
                            );


                        popup.className =
                            "device-popup";


                        popup.innerHTML = `

                            <div class="device-popup-box">

                                <div class="device-popup-header">

                                    <h2>
                                        💻 Device Details
                                    </h2>

                                    <button
                                        class="dataset-close-device-popup"
                                    >
                                        ✕
                                    </button>

                                </div>


                                <div class="device-details">

                                    <div>
                                        <strong>
                                            Device ID
                                        </strong>

                                        <span>
                                            ${record.targetDevice}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Device Name
                                        </strong>

                                        <span>
                                            ${record.deviceName}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Device Type
                                        </strong>

                                        <span>
                                            ${deviceType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Employee
                                        </strong>

                                        <span>
                                            ${record.employee}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Department
                                        </strong>

                                        <span>
                                            ${department}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source Type
                                        </strong>

                                        <span>
                                            ${record.sourceType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Last Attack
                                        </strong>

                                        <span>
                                            ${record.attackType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Risk Score
                                        </strong>

                                        <span>
                                            ${record.riskScore}/100
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source IP
                                        </strong>

                                        <span>
                                            ${record.sourceIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Destination IP
                                        </strong>

                                        <span>
                                            ${record.destinationIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Status
                                        </strong>

                                        <span>
                                            ${statusText}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Last Alert
                                        </strong>

                                        <span>
                                            ${record.alertID}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        `;


                        document.body.appendChild(
                            popup
                        );


                        popup
                            .querySelector(
                                ".dataset-close-device-popup"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    popup.remove();

                                }
                            );

                    }
                );


                devicesTableBody.appendChild(
                    row
                );

            }
        );


        // ================================================
        // Update Topbar Device Count
        // ================================================

        const topbarSpans =
            document.querySelectorAll(
                ".topbar-right span"
            );


        topbarSpans.forEach(
            function (span) {

                if (
                    span.textContent.includes(
                        "Devices:"
                    )
                ) {

                    span.textContent =
                        `💻 Devices: ${devices.length}`;

                }

            }
        );


        console.log(
            `Sentinel X Devices Loaded: ${devices.length}`
        );

    }

    catch (error) {

        console.error(
            "Failed to load Sentinel X Devices:",
            error
        );

    }

}


renderDatasetDevices();


// ========================================================
// SENTINEL X - DATASET EMPLOYEES
// ========================================================

async function renderDatasetEmployees() {

    const employeesTableBody =
        document.querySelector(
            ".employees tbody"
        );


    // Run only on Employees page
    if (!employeesTableBody) {
        return;
    }


    try {

        const response =
            await fetch(
                "data/sentinel_data.json"
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        // ================================================
        // Sort Dataset To Match Alert And Incident IDs
        // ================================================

        const sortedData =
            [...data].sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


        function getRelatedAlertID(
            record
        ) {

            const index =
                sortedData.findIndex(
                    item =>
                        item.id ===
                        record.id
                );


            if (
                index < 0 ||
                index >= 12
            ) {

                return "No Top-12 Alert";

            }


            return (
                "DATA-ALT-" +
                String(
                    index + 1
                ).padStart(3, "0")
            );

        }


        function getRelatedIncidentID(
            record
        ) {

            const index =
                sortedData
                    .slice(0, 10)
                    .findIndex(
                        item =>
                            item.id ===
                            record.id
                    );


            if (index < 0) {

                return null;

            }


            return (
                "DATA-INC-" +
                String(
                    index + 1
                ).padStart(3, "0")
            );

        }


        // ================================================
        // Remove External User
        // ================================================

        const employeeRecords =
            sortedData.filter(
                record =>
                    record.employee &&
                    record.employee !==
                    "External User"
            );


        // ================================================
        // Create One Record For Each Employee
        // Keep Highest-Risk Activity
        // ================================================

        const uniqueEmployees =
            new Map();


        employeeRecords.forEach(
            function (record) {

                if (
                    !uniqueEmployees.has(
                        record.employee
                    )
                ) {

                    uniqueEmployees.set(
                        record.employee,
                        {
                            ...record,
                            alertID:
                                getRelatedAlertID(
                                    record
                                ),
                            incidentID:
                                getRelatedIncidentID(
                                    record
                                )
                        }
                    );

                }

            }
        );


        const employees =
            Array.from(
                uniqueEmployees.values()
            ).sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


        // ================================================
        // Current Sentinel X States
        // ================================================

        function readStoredArray(
            key
        ) {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        key
                    ) || "[]"
                );

            }

            catch (error) {

                return [];

            }

        }


        const currentIsolatedDevices =
            readStoredArray(
                "sentinelXIsolatedDevices"
            );

        const currentBlockedAlerts =
            readStoredArray(
                "sentinelXBlockedAlerts"
            );

        const currentIgnoredAlerts =
            readStoredArray(
                "sentinelXIgnoredAlerts"
            );

        const currentContainedIncidents =
            readStoredArray(
                "sentinelXContainedIncidents"
            );

        const currentResolvedIncidents =
            readStoredArray(
                "sentinelXResolvedIncidents"
            );

        const currentClosedIncidents =
            readStoredArray(
                "sentinelXClosedIncidents"
            );


        // ================================================
        // Remove Old Static Employees
        // ================================================

        employeesTableBody.innerHTML =
            "";


        // ================================================
        // Create Employee Rows
        // ================================================

        employees.forEach(
            function (record, index) {

                const employeeID =
                    `DATA-EMP-${String(
                        index + 1
                    ).padStart(3, "0")}`;


                const row =
                    document.createElement(
                        "tr"
                    );


                // ========================================
                // Department
                // ========================================

                let department =
                    "Unknown";


                const deviceName =
                    (
                        record.deviceName ||
                        ""
                    ).toLowerCase();


                if (
                    deviceName.includes(
                        "finance"
                    )
                ) {

                    department =
                        "Finance";

                }

                else if (
                    deviceName.includes(
                        "security"
                    )
                ) {

                    department =
                        "Security Operations";

                }

                else if (
                    deviceName.includes(
                        "reception"
                    )
                ) {

                    department =
                        "Reception";

                }

                else if (
                    deviceName.includes(
                        "admin"
                    )
                ) {

                    department =
                        "Administration";

                }

                else if (
                    deviceName.includes(
                        "it"
                    )
                ) {

                    department =
                        "IT";

                }


                // ========================================
                // Role
                // ========================================

                let role =
                    "Employee";


                if (
                    department ===
                    "Finance"
                ) {

                    role =
                        "Finance Employee";

                }

                else if (
                    department ===
                    "Security Operations"
                ) {

                    role =
                        "Security Employee";

                }

                else if (
                    department ===
                    "Reception"
                ) {

                    role =
                        "Reception Employee";

                }

                else if (
                    department ===
                    "Administration"
                ) {

                    role =
                        "Administrative Employee";

                }

                else if (
                    department ===
                    "IT"
                ) {

                    role =
                        "IT Employee";

                }


                // ========================================
                // Current Security State
                // ========================================

                const deviceIsolated =
                    currentIsolatedDevices.includes(
                        record.targetDevice
                    );


                const alertBlocked =
                    record.alertID !==
                        "No Top-12 Alert" &&
                    currentBlockedAlerts.includes(
                        record.alertID
                    );


                const alertIgnored =
                    record.alertID !==
                        "No Top-12 Alert" &&
                    currentIgnoredAlerts.includes(
                        record.alertID
                    );


                const incidentContained =
                    record.incidentID &&
                    currentContainedIncidents.includes(
                        record.incidentID
                    );


                const incidentResolved =
                    record.incidentID &&
                    currentResolvedIncidents.includes(
                        record.incidentID
                    );


                const incidentClosed =
                    record.incidentID &&
                    currentClosedIncidents.includes(
                        record.incidentID
                    );


                let statusText =
                    "🟢 Active";

                let statusClass =
                    "status-active";


                if (incidentClosed) {

                    statusText =
                        "⚫ Incident Closed";

                    statusClass =
                        "status-offline";

                }

                else if (
                    incidentResolved
                ) {

                    statusText =
                        "✅ Incident Resolved";

                    statusClass =
                        "status-active";

                }

                else if (
                    incidentContained
                ) {

                    statusText =
                        "🔒 Incident Contained";

                    statusClass =
                        "status-offline";

                }

                else if (
                    deviceIsolated
                ) {

                    statusText =
                        "🔒 Device Isolated";

                    statusClass =
                        "status-offline";

                }

                else if (
                    alertBlocked
                ) {

                    statusText =
                        "🚫 Alert Blocked";

                    statusClass =
                        "status-offline";

                }

                else if (
                    alertIgnored
                ) {

                    statusText =
                        "⚪ Alert Ignored";

                    statusClass =
                        "status-away";

                }

                else if (
                    Number(record.riskScore) >=
                    90
                ) {

                    statusText =
                        "🔴 High Risk";

                    statusClass =
                        "status-offline";

                }

                else if (
                    Number(record.riskScore) >=
                    70
                ) {

                    statusText =
                        "🟠 Under Review";

                    statusClass =
                        "status-away";

                }


                // ========================================
                // Row
                // ========================================

                row.dataset.employee =
                    employeeID;

                row.dataset.device =
                    record.targetDevice;


                row.innerHTML = `

                    <td>
                        ${employeeID}
                    </td>

                    <td>
                        ${record.employee}
                    </td>

                    <td>
                        ${department}
                    </td>

                    <td>
                        <a href="devices.html">
                            ${record.targetDevice}
                        </a>
                    </td>

                    <td>
                        ${role}
                    </td>

                    <td class="${statusClass}">
                        ${statusText}
                    </td>

                    <td>
                        <button
                            class="dataset-employee-view"
                        >
                            View
                        </button>
                    </td>

                `;


                // ========================================
                // View Employee
                // ========================================

                const viewButton =
                    row.querySelector(
                        ".dataset-employee-view"
                    );


                viewButton.addEventListener(
                    "click",
                    function () {

                        const popup =
                            document.createElement(
                                "div"
                            );


                        popup.className =
                            "employee-popup";


                        popup.innerHTML = `

                            <div class="employee-popup-box">

                                <div class="employee-popup-header">

                                    <h2>
                                        👤 Employee Security Details
                                    </h2>

                                    <button
                                        class="dataset-close-employee-popup"
                                    >
                                        ✕
                                    </button>

                                </div>


                                <div class="employee-details">

                                    <div>
                                        <strong>
                                            Employee ID
                                        </strong>

                                        <span>
                                            ${employeeID}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Name
                                        </strong>

                                        <span>
                                            ${record.employee}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Department
                                        </strong>

                                        <span>
                                            ${department}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Role
                                        </strong>

                                        <span>
                                            ${role}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Assigned Device
                                        </strong>

                                        <span>
                                            ${record.targetDevice}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Device Name
                                        </strong>

                                        <span>
                                            ${record.deviceName}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Security Status
                                        </strong>

                                        <span>
                                            ${statusText}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Last Attack
                                        </strong>

                                        <span>
                                            ${record.attackType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Risk Score
                                        </strong>

                                        <span>
                                            ${record.riskScore}/100
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source IP
                                        </strong>

                                        <span>
                                            ${record.sourceIp}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Source Type
                                        </strong>

                                        <span>
                                            ${record.sourceType}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Related Alert
                                        </strong>

                                        <span>
                                            ${record.alertID}
                                        </span>
                                    </div>


                                    <div>
                                        <strong>
                                            Related Incident
                                        </strong>

                                        <span>
                                            ${
                                                record.incidentID ||
                                                "No Top-10 Incident"
                                            }
                                        </span>
                                    </div>

                                </div>

                            </div>

                        `;


                        document.body.appendChild(
                            popup
                        );


                        popup
                            .querySelector(
                                ".dataset-close-employee-popup"
                            )
                            .addEventListener(
                                "click",
                                function () {

                                    popup.remove();

                                }
                            );

                    }
                );


                employeesTableBody.appendChild(
                    row
                );

            }
        );


        // ================================================
        // Update Employee Count
        // ================================================

        const topbarSpans =
            document.querySelectorAll(
                ".topbar-right span"
            );


        topbarSpans.forEach(
            function (span) {

                if (
                    span.textContent.includes(
                        "Employees:"
                    )
                ) {

                    span.textContent =
                        `👥 Employees: ${employees.length}`;

                }

            }
        );


        console.log(
            `Sentinel X Employees Loaded: ${employees.length}`
        );

    }

    catch (error) {

        console.error(
            "Failed to load Sentinel X Employees:",
            error
        );

    }

}


renderDatasetEmployees();
// ========================================================
// SENTINEL X - SECURITY INVESTIGATION
// ========================================================

document.addEventListener("DOMContentLoaded", async function () {

    // ====================================================
    // Run Only On Investigation Page
    // ====================================================

    const overview =
        document.getElementById(
            "investigationOverview"
        );


    if (!overview) {
        return;
    }


    // ====================================================
    // Page Elements
    // ====================================================

    const datasetStatus =
        document.getElementById(
            "investigationDatasetStatus"
        );

    const severityElement =
        document.getElementById(
            "investigationSeverity"
        );

    const alertIdElement =
        document.getElementById(
            "investigationAlertId"
        );

    const riskExplanation =
        document.getElementById(
            "riskExplanation"
        );

    const relatedActivityBody =
        document.getElementById(
            "relatedActivityBody"
        );

    const targetedDevices =
        document.getElementById(
            "targetedDevices"
        );

    const timeline =
        document.getElementById(
            "investigationTimeline"
        );

    const createIncidentBtn =
        document.getElementById(
            "createIncidentBtn"
        );

    const isolateDeviceBtn =
        document.getElementById(
            "isolateInvestigationDeviceBtn"
        );

    const closeInvestigationBtn =
        document.getElementById(
            "closeInvestigationBtn"
        );

    const actionStatus =
        document.getElementById(
            "investigationActionStatus"
        );


    // ====================================================
    // Helpers
    // ====================================================

    function escapeHTML(value) {

        return String(
            value ?? "Unknown"
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    function getSeverity(
        riskScore
    ) {

        const risk =
            Number(riskScore) || 0;


        if (risk >= 90) {
            return "CRITICAL";
        }


        if (risk >= 80) {
            return "HIGH";
        }


        if (risk >= 70) {
            return "MEDIUM";
        }


        return "LOW";

    }


    function getSeverityClass(
        severity
    ) {

        if (
            severity ===
            "CRITICAL"
        ) {

            return "severity-critical";

        }


        if (
            severity ===
            "HIGH"
        ) {

            return "severity-high";

        }


        if (
            severity ===
            "MEDIUM"
        ) {

            return "severity-medium";

        }


        return "severity-low";

    }


    function getStoredArray(
        key
    ) {

        try {

            return JSON.parse(
                localStorage.getItem(
                    key
                ) || "[]"
            );

        }

        catch (error) {

            return [];

        }

    }


    function hasPermission(
        permissionName
    ) {

        if (
            typeof window.sentinelHasPermission !==
            "function"
        ) {

            return true;

        }


        return window.sentinelHasPermission(
            permissionName
        );

    }


    // ====================================================
    // Read Selected Alert From URL
    // ====================================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const selectedAlertID =
        urlParams.get(
            "alert"
        );


    if (!selectedAlertID) {

        overview.innerHTML = `

            <div class="empty-state">

                ⚠️ No alert was selected for investigation.
                Return to Security Alerts and choose Investigate.

            </div>

        `;


        if (datasetStatus) {

            datasetStatus.textContent =
                "⚠️ Investigation requires a selected security alert.";

        }


        if (severityElement) {

            severityElement.textContent =
                "NO ALERT";

        }


        return;

    }


    if (alertIdElement) {

        alertIdElement.textContent =
            `🔍 ${selectedAlertID}`;

    }


    // ====================================================
    // Load CIC-IDS Dataset
    // ====================================================

    let dataset =
        [];


    try {

        const response =
            await fetch(
                "data/sentinel_data.json"
            );


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        dataset =
            await response.json();

    }

    catch (error) {

        console.error(
            "Investigation Dataset Error:",
            error
        );


        if (datasetStatus) {

            datasetStatus.textContent =
                "⚠️ Unable to load CIC-IDS security dataset.";

        }


        overview.innerHTML = `

            <div class="empty-state">
                Dataset unavailable.
            </div>

        `;


        return;

    }


    // ====================================================
    // Rebuild Alert Ordering
    // Must Match Alerts Page
    // ====================================================

    const sortedDataset =
        [...dataset].sort(
            (a, b) =>
                Number(b.riskScore) -
                Number(a.riskScore)
        );


    const visibleAlerts =
        sortedDataset.slice(
            0,
            12
        );


    let selectedRecord =
        null;


    // ====================================================
    // Simulated Alert
    // ====================================================

    if (
        selectedAlertID ===
        "SIM-001"
    ) {

        let simulatedAlert =
            null;


        try {

            simulatedAlert =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXSimulatedAlert"
                    ) || "null"
                );

        }

        catch (error) {

            simulatedAlert =
                null;

        }


        if (simulatedAlert) {

            selectedRecord = {

                id:
                    simulatedAlert.datasetRecord ||
                    "SIM-001",

                attackType:
                    simulatedAlert.attackType ||
                    "Simulated Network Attack",

                sourceIp:
                    simulatedAlert.sourceIp ||
                    "Simulation",

                destinationIp:
                    simulatedAlert.destinationIp ||
                    "Simulation",

                targetDevice:
                    simulatedAlert.targetDevice ||
                    "SIM-PC-001",

                employee:
                    simulatedAlert.employee ||
                    "Simulation",

                deviceName:
                    simulatedAlert.deviceName ||
                    "Simulation Device",

                sourceType:
                    simulatedAlert.sourceType ||
                    "External",

                riskScore:
                    Number(
                        simulatedAlert.riskScore
                    ) || 95

            };

        }

    }


    // ====================================================
    // Dataset Alert
    // ====================================================

    else {

        const alertNumber =
            Number(
                selectedAlertID.replace(
                    "DATA-ALT-",
                    ""
                )
            );


        if (
            !Number.isNaN(
                alertNumber
            ) &&
            alertNumber >= 1 &&
            alertNumber <=
                visibleAlerts.length
        ) {

            selectedRecord =
                visibleAlerts[
                    alertNumber - 1
                ];

        }

    }


    if (!selectedRecord) {

        if (datasetStatus) {

            datasetStatus.textContent =
                "⚠️ Selected alert could not be found.";

        }


        overview.innerHTML = `

            <div class="empty-state">

                No matching security record was found
                for ${escapeHTML(selectedAlertID)}.

            </div>

        `;


        if (severityElement) {

            severityElement.textContent =
                "NOT FOUND";

        }


        return;

    }


    // ====================================================
    // Selected Record Information
    // ====================================================

    const risk =
        Number(
            selectedRecord.riskScore
        ) || 0;


    const severity =
        getSeverity(
            risk
        );


    const severityClass =
        getSeverityClass(
            severity
        );


    if (severityElement) {

        severityElement.className =
            `investigation-severity severity-badge ${severityClass}`;


        severityElement.textContent =
            `${severity} • ${risk}/100`;

    }


    if (datasetStatus) {

        datasetStatus.textContent =
            selectedAlertID ===
            "SIM-001"
                ? `🛡️ Sentinel X Simulation • Investigating ${selectedAlertID}`
                : `🛡️ CIC-IDS Dataset Connected • ` +
                  `${dataset.length} security records loaded • ` +
                  `Investigating ${selectedAlertID}`;

    }


    // ====================================================
    // Alert Overview
    // ====================================================

    overview.innerHTML = `

        <div class="overview-card">

            <span>
                Alert ID
            </span>

            <strong>
                ${escapeHTML(selectedAlertID)}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Dataset Record
            </span>

            <strong>
                ${escapeHTML(selectedRecord.id)}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Attack Type
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.attackType
                )}
            </strong>

        </div>


        <div class="overview-card risk-card">

            <span>
                Risk Score
            </span>

            <strong>
                ${risk}/100
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Source IP
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.sourceIp
                )}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Destination IP
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.destinationIp
                )}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Target Device
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.targetDevice
                )}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Employee
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.employee
                )}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Device Name
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.deviceName
                )}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Source Type
            </span>

            <strong>
                ${escapeHTML(
                    selectedRecord.sourceType
                )}
            </strong>

        </div>


        <div class="overview-card">

            <span>
                Severity
            </span>

            <strong>
                ${severity}
            </strong>

        </div>

    `;


    // ====================================================
    // Risk Explanation
    // ====================================================

    const relatedSourceRecords =
        selectedAlertID ===
        "SIM-001"
            ? [selectedRecord]
            : dataset.filter(
                record =>
                    record.sourceIp ===
                    selectedRecord.sourceIp
            );


    const relatedTargetRecords =
        selectedAlertID ===
        "SIM-001"
            ? [selectedRecord]
            : dataset.filter(
                record =>
                    record.targetDevice ===
                    selectedRecord.targetDevice
            );


    const uniqueTargets =
        [
            ...new Set(
                relatedSourceRecords
                    .map(
                        record =>
                            record.targetDevice
                    )
                    .filter(
                        Boolean
                    )
            )
        ];


    let riskMessage =
        "";


    if (risk >= 90) {

        riskMessage =
            "The event is classified as CRITICAL because its stored Sentinel X risk score is 90 or higher.";

    }

    else if (
        risk >= 80
    ) {

        riskMessage =
            "The event is classified as HIGH because its stored Sentinel X risk score is between 80 and 89.";

    }

    else if (
        risk >= 70
    ) {

        riskMessage =
            "The event is classified as MEDIUM because its stored Sentinel X risk score is between 70 and 79.";

    }

    else {

        riskMessage =
            "The event is classified as LOW because its stored Sentinel X risk score is below 70.";

    }


    if (riskExplanation) {

        riskExplanation.innerHTML = `

            <div class="risk-factor">

                <div class="risk-factor-icon">
                    🎯
                </div>

                <div>

                    <h3>
                        Risk Classification
                    </h3>

                    <p>
                        ${escapeHTML(riskMessage)}
                    </p>

                </div>

            </div>


            <div class="risk-factor">

                <div class="risk-factor-icon">
                    🌐
                </div>

                <div>

                    <h3>
                        Source IP Activity
                    </h3>

                    <p>
                        Source IP
                        ${escapeHTML(selectedRecord.sourceIp)}
                        appears in
                        ${relatedSourceRecords.length}
                        security record(s).
                    </p>

                </div>

            </div>


            <div class="risk-factor">

                <div class="risk-factor-icon">
                    💻
                </div>

                <div>

                    <h3>
                        Target Activity
                    </h3>

                    <p>
                        The investigated source is associated with
                        ${uniqueTargets.length}
                        unique target device(s).
                        The selected device
                        ${escapeHTML(selectedRecord.targetDevice)}
                        appears in
                        ${relatedTargetRecords.length}
                        security record(s).
                    </p>

                </div>

            </div>


            <div class="risk-factor">

                <div class="risk-factor-icon">
                    ⚔️
                </div>

                <div>

                    <h3>
                        Detected Attack Type
                    </h3>

                    <p>
                        Security activity for this record is labeled
                        ${escapeHTML(selectedRecord.attackType)}.
                        Sentinel X uses the stored risk score and
                        related activity to support analyst investigation.
                    </p>

                </div>

            </div>

        `;

    }


    // ====================================================
    // Related Source IP Activity
    // ====================================================

    const relatedActivity =
        [...relatedSourceRecords]
            .sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            )
            .slice(
                0,
                10
            );


    if (relatedActivityBody) {

        if (
            !relatedActivity.length
        ) {

            relatedActivityBody.innerHTML = `

                <tr>

                    <td colspan="6">
                        No related activity found.
                    </td>

                </tr>

            `;

        }

        else {

            relatedActivityBody.innerHTML =
                relatedActivity
                    .map(
                        function (
                            record
                        ) {

                            const recordSeverity =
                                getSeverity(
                                    record.riskScore
                                );


                            const recordClass =
                                getSeverityClass(
                                    recordSeverity
                                );


                            return `

                                <tr>

                                    <td>
                                        ${escapeHTML(record.id)}
                                    </td>

                                    <td>
                                        ${escapeHTML(record.attackType)}
                                    </td>

                                    <td>
                                        ${escapeHTML(record.targetDevice)}
                                    </td>

                                    <td>
                                        ${escapeHTML(record.destinationIp)}
                                    </td>

                                    <td>
                                        ${escapeHTML(record.riskScore)}/100
                                    </td>

                                    <td>

                                        <span
                                            class="severity-badge ${recordClass}"
                                        >
                                            ${recordSeverity}
                                        </span>

                                    </td>

                                </tr>

                            `;

                        }
                    )
                    .join("");

        }

    }


    // ====================================================
    // Targeted Devices
    // ====================================================

    const deviceRecords =
        uniqueTargets.map(
            function (
                device
            ) {

                const records =
                    relatedSourceRecords.filter(
                        record =>
                            record.targetDevice ===
                            device
                    );


                const highestRisk =
                    Math.max(
                        ...records.map(
                            record =>
                                Number(
                                    record.riskScore
                                ) || 0
                        )
                    );


                return {

                    device:
                        device,

                    count:
                        records.length,

                    risk:
                        highestRisk

                };

            }
        );


    if (targetedDevices) {

        if (
            !deviceRecords.length
        ) {

            targetedDevices.innerHTML = `

                <div class="empty-state">
                    No targeted devices found.
                </div>

            `;

        }

        else {

            targetedDevices.innerHTML =
                deviceRecords
                    .sort(
                        (a, b) =>
                            b.risk -
                            a.risk
                    )
                    .map(
                        function (
                            item
                        ) {

                            const deviceSeverity =
                                getSeverity(
                                    item.risk
                                );


                            return `

                                <div class="target-device-card">

                                    <h3>
                                        💻 ${escapeHTML(item.device)}
                                    </h3>

                                    <p>
                                        Related Records:
                                        <strong>
                                            ${item.count}
                                        </strong>
                                    </p>

                                    <p>
                                        Highest Risk:
                                        <strong>
                                            ${item.risk}/100
                                        </strong>
                                    </p>

                                    <p>
                                        Severity:
                                        <strong>
                                            ${deviceSeverity}
                                        </strong>
                                    </p>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }

    }


    // ====================================================
    // Investigation Timeline
    // ====================================================

    const sequenceRecords =
        relatedActivity.slice(
            0,
            6
        );


    if (timeline) {

        if (
            !sequenceRecords.length
        ) {

            timeline.innerHTML = `

                <div class="empty-state">
                    No related event sequence available.
                </div>

            `;

        }

        else {

            timeline.innerHTML =
                sequenceRecords
                    .map(
                        function (
                            record,
                            index
                        ) {

                            return `

                                <div class="timeline-item">

                                    <span
                                        class="timeline-dot"
                                    ></span>

                                    <h3>
                                        Event ${index + 1} —
                                        ${escapeHTML(record.attackType)}
                                    </h3>

                                    <p>
                                        ${escapeHTML(record.id)}
                                        • Source:
                                        ${escapeHTML(record.sourceIp)}
                                        • Target:
                                        ${escapeHTML(record.targetDevice)}
                                        • Risk:
                                        ${escapeHTML(record.riskScore)}/100
                                    </p>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }

    }


    // ====================================================
    // Restore Investigation Actions
    // ====================================================

    let isolatedDevices =
        getStoredArray(
            "sentinelXIsolatedDevices"
        );


    let createdIncidents =
        getStoredArray(
            "sentinelXCreatedIncidents"
        );


    let closedInvestigations =
        getStoredArray(
            "sentinelXClosedInvestigations"
        );


    const existingIncident =
        createdIncidents.find(
            incident =>
                incident.alert ===
                    selectedAlertID ||
                incident.datasetRecord ===
                    selectedRecord.id
        );


    if (
        isolateDeviceBtn &&
        isolatedDevices.includes(
            selectedRecord.targetDevice
        )
    ) {

        isolateDeviceBtn.textContent =
            "🔒 Device Isolated";

        isolateDeviceBtn.disabled =
            true;


        if (actionStatus) {

            actionStatus.textContent =
                `🔒 ${selectedRecord.targetDevice} is already isolated.`;

        }

    }


    if (
        createIncidentBtn &&
        existingIncident
    ) {

        createIncidentBtn.textContent =
            "✅ Incident Created";

        createIncidentBtn.disabled =
            true;


        if (actionStatus) {

            actionStatus.textContent =
                `📂 Incident ${existingIncident.id} already exists for ${selectedAlertID}.`;

        }

    }


    if (
        closeInvestigationBtn &&
        closedInvestigations.includes(
            selectedAlertID
        )
    ) {

        closeInvestigationBtn.textContent =
            "✓ Investigation Closed";

        closeInvestigationBtn.disabled =
            true;


        if (actionStatus) {

            actionStatus.textContent =
                `✅ Investigation ${selectedAlertID} is closed.`;

        }

    }


    // ====================================================
    // Isolate Device
    // ====================================================

    if (isolateDeviceBtn) {

        isolateDeviceBtn.addEventListener(
            "click",
            function () {

                if (
                    !hasPermission(
                        "isolateDevice"
                    )
                ) {

                    alert(
                        "⛔ Access Denied\n\n" +
                        "Your account does not have permission " +
                        "to isolate devices."
                    );

                    return;

                }


                isolatedDevices =
                    getStoredArray(
                        "sentinelXIsolatedDevices"
                    );


                if (
                    !isolatedDevices.includes(
                        selectedRecord.targetDevice
                    )
                ) {

                    isolatedDevices.push(
                        selectedRecord.targetDevice
                    );


                    localStorage.setItem(
                        "sentinelXIsolatedDevices",
                        JSON.stringify(
                            isolatedDevices
                        )
                    );

                }


                this.textContent =
                    "🔒 Device Isolated";

                this.disabled =
                    true;


                if (actionStatus) {

                    actionStatus.textContent =
                        `🔒 Device ${selectedRecord.targetDevice} ` +
                        `was isolated by the SOC analyst.`;

                }

            }
        );

    }


    // ====================================================
    // Create Incident
    // ====================================================

    if (createIncidentBtn) {

        createIncidentBtn.addEventListener(
            "click",
            function () {

                if (
                    !hasPermission(
                        "createIncident"
                    )
                ) {

                    alert(
                        "⛔ Access Denied\n\n" +
                        "Your account does not have permission " +
                        "to create incidents."
                    );

                    return;

                }


                createdIncidents =
                    getStoredArray(
                        "sentinelXCreatedIncidents"
                    );


                const alreadyExists =
                    createdIncidents.find(
                        incident =>
                            incident.alert ===
                                selectedAlertID ||
                            incident.datasetRecord ===
                                selectedRecord.id
                    );


                if (alreadyExists) {

                    this.textContent =
                        "✅ Incident Created";

                    this.disabled =
                        true;


                    if (actionStatus) {

                        actionStatus.textContent =
                            `📂 Incident ${alreadyExists.id} already exists for ${selectedAlertID}.`;

                    }


                    return;

                }


                const investigationIncident = {

                    id:
                        "INV-" +
                        String(
                            Date.now()
                        ).slice(-8),

                    alert:
                        selectedAlertID,

                    datasetRecord:
                        selectedRecord.id,

                    attackType:
                        selectedRecord.attackType,

                    sourceIp:
                        selectedRecord.sourceIp,

                    targetDevice:
                        selectedRecord.targetDevice,

                    employee:
                        selectedRecord.employee,

                    riskScore:
                        risk,

                    severity:
                        severity,

                    status:
                        "Open"

                };


                createdIncidents.unshift(
                    investigationIncident
                );


                localStorage.setItem(
                    "sentinelXCreatedIncidents",
                    JSON.stringify(
                        createdIncidents
                    )
                );


                this.textContent =
                    "✅ Incident Created";

                this.disabled =
                    true;


                if (actionStatus) {

                    actionStatus.textContent =
                        `📂 Incident ${investigationIncident.id} created from ${selectedAlertID}.`;

                }

            }
        );

    }


    // ====================================================
    // Close Investigation
    // ====================================================

    if (closeInvestigationBtn) {

        closeInvestigationBtn.addEventListener(
            "click",
            function () {

                closedInvestigations =
                    getStoredArray(
                        "sentinelXClosedInvestigations"
                    );


                if (
                    !closedInvestigations.includes(
                        selectedAlertID
                    )
                ) {

                    closedInvestigations.push(
                        selectedAlertID
                    );


                    localStorage.setItem(
                        "sentinelXClosedInvestigations",
                        JSON.stringify(
                            closedInvestigations
                        )
                    );

                }


                if (actionStatus) {

                    actionStatus.textContent =
                        `✅ Investigation ${selectedAlertID} closed by SOC analyst.`;

                }


                this.textContent =
                    "✓ Investigation Closed";

                this.disabled =
                    true;

            }
        );

    }


    console.log(
        "Sentinel X Investigation Loaded:",
        selectedRecord
    );

});
// ============================================================
// SENTINEL X - THREAT HUNTING
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ====================================================
        // Check If This Is The Threat Hunting Page
        // ====================================================

        const huntSearch =
            document.getElementById(
                "huntSearch"
            );

        const huntSearchBtn =
            document.getElementById(
                "huntSearchBtn"
            );

        const huntResetBtn =
            document.getElementById(
                "huntResetBtn"
            );

        const huntAttackType =
            document.getElementById(
                "huntAttackType"
            );

        const huntRiskLevel =
            document.getElementById(
                "huntRiskLevel"
            );

        const huntSourceType =
            document.getElementById(
                "huntSourceType"
            );

        const huntResultsBody =
            document.getElementById(
                "huntResultsBody"
            );

        const huntResultMessage =
            document.getElementById(
                "huntResultMessage"
            );

        const huntMatchingRecords =
            document.getElementById(
                "huntMatchingRecords"
            );

        const huntSourceCount =
            document.getElementById(
                "huntSourceCount"
            );

        const huntDeviceCount =
            document.getElementById(
                "huntDeviceCount"
            );

        const huntHighestRisk =
            document.getElementById(
                "huntHighestRisk"
            );

        const huntCommonAttack =
            document.getElementById(
                "huntCommonAttack"
            );


        if (
            !huntSearch ||
            !huntSearchBtn ||
            !huntResultsBody
        ) {
            return;
        }


        // ====================================================
        // Load CIC-IDS Dataset
        // ====================================================

        let threatData =
            [];


        try {

            const response =
                await fetch(
                    "data/sentinel_data.json"
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }


            threatData =
                await response.json();


            console.log(
                "Threat Hunting Dataset Loaded:",
                threatData.length,
                "records"
            );

        }

        catch (error) {

            console.error(
                "Threat Hunting Dataset Error:",
                error
            );


            if (huntResultMessage) {

                huntResultMessage.textContent =
                    "❌ Failed to load security dataset.";

            }


            huntResultsBody.innerHTML = `

                <tr class="hunt-empty-row">

                    <td colspan="8">
                        Dataset could not be loaded.
                    </td>

                </tr>

            `;


            return;

        }


        // ====================================================
        // Current Sentinel X States
        // ====================================================

        function readStoredArray(
            key
        ) {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        key
                    ) || "[]"
                );

            }

            catch (error) {

                return [];

            }

        }


        const sortedAlertData =
            [...threatData].sort(
                (a, b) =>
                    Number(b.riskScore) -
                    Number(a.riskScore)
            );


        function getRelatedAlertID(
            record
        ) {

            const index =
                sortedAlertData.findIndex(
                    item =>
                        item.id ===
                        record.id
                );


            if (
                index < 0 ||
                index >= 12
            ) {

                return null;

            }


            return (
                "DATA-ALT-" +
                String(
                    index + 1
                ).padStart(3, "0")
            );

        }


        function getRelatedIncidentID(
            record
        ) {

            const index =
                sortedAlertData
                    .slice(0, 10)
                    .findIndex(
                        item =>
                            item.id ===
                            record.id
                    );


            if (index < 0) {

                return null;

            }


            return (
                "DATA-INC-" +
                String(
                    index + 1
                ).padStart(3, "0")
            );

        }


        function getCurrentRecordState(
            record
        ) {

            const currentIsolatedDevices =
                readStoredArray(
                    "sentinelXIsolatedDevices"
                );

            const currentBlockedAlerts =
                readStoredArray(
                    "sentinelXBlockedAlerts"
                );

            const currentIgnoredAlerts =
                readStoredArray(
                    "sentinelXIgnoredAlerts"
                );

            const currentContainedIncidents =
                readStoredArray(
                    "sentinelXContainedIncidents"
                );

            const currentResolvedIncidents =
                readStoredArray(
                    "sentinelXResolvedIncidents"
                );

            const currentClosedIncidents =
                readStoredArray(
                    "sentinelXClosedIncidents"
                );

            const currentCreatedIncidents =
                readStoredArray(
                    "sentinelXCreatedIncidents"
                );


            const alertID =
                getRelatedAlertID(
                    record
                );


            const datasetIncidentID =
                getRelatedIncidentID(
                    record
                );


            const createdIncident =
                currentCreatedIncidents.find(
                    incident =>
                        incident.datasetRecord ===
                        record.id
                );


            const incidentIDs =
                [
                    datasetIncidentID,
                    createdIncident
                        ? createdIncident.id
                        : null
                ].filter(Boolean);


            if (
                incidentIDs.some(
                    incidentID =>
                        currentClosedIncidents.includes(
                            incidentID
                        )
                )
            ) {

                return {
                    text: "Incident Closed",
                    icon: "⚫"
                };

            }


            if (
                incidentIDs.some(
                    incidentID =>
                        currentResolvedIncidents.includes(
                            incidentID
                        )
                )
            ) {

                return {
                    text: "Incident Resolved",
                    icon: "✅"
                };

            }


            if (
                incidentIDs.some(
                    incidentID =>
                        currentContainedIncidents.includes(
                            incidentID
                        )
                )
            ) {

                return {
                    text: "Incident Contained",
                    icon: "🔒"
                };

            }


            if (
                currentIsolatedDevices.includes(
                    record.targetDevice
                )
            ) {

                return {
                    text: "Device Isolated",
                    icon: "🔒"
                };

            }


            if (
                alertID &&
                currentBlockedAlerts.includes(
                    alertID
                )
            ) {

                return {
                    text: "Alert Blocked",
                    icon: "🚫"
                };

            }


            if (
                alertID &&
                currentIgnoredAlerts.includes(
                    alertID
                )
            ) {

                return {
                    text: "Alert Ignored",
                    icon: "⚪"
                };

            }


            if (createdIncident) {

                return {
                    text: "Incident Created",
                    icon: "📂"
                };

            }


            return {
                text: "Active",
                icon: "🟢"
            };

        }


        // ====================================================
        // Populate Attack Type Filter
        // ====================================================

        const attackTypes =
            [
                ...new Set(
                    threatData
                        .map(
                            record =>
                                record.attackType
                        )
                        .filter(Boolean)
                )
            ].sort();


        attackTypes.forEach(
            function (
                attackType
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    attackType;

                option.textContent =
                    attackType;


                huntAttackType.appendChild(
                    option
                );

            }
        );


        // ====================================================
        // Get Risk Level
        // ====================================================

        function getRiskLevel(
            riskScore
        ) {

            const risk =
                Number(riskScore) || 0;


            if (risk >= 90) {
                return "critical";
            }


            if (risk >= 80) {
                return "high";
            }


            if (risk >= 70) {
                return "medium";
            }


            return "low";

        }


        // ====================================================
        // Get Risk Label
        // ====================================================

        function getRiskLabel(
            riskScore
        ) {

            const level =
                getRiskLevel(
                    riskScore
                );


            if (
                level ===
                "critical"
            ) {

                return "CRITICAL";

            }


            if (
                level ===
                "high"
            ) {

                return "HIGH";

            }


            if (
                level ===
                "medium"
            ) {

                return "MEDIUM";

            }


            return "LOW";

        }


        // ====================================================
        // Hunt Security Records
        // ====================================================

        function runThreatHunt() {

            const searchValue =
                huntSearch.value
                    .trim()
                    .toLowerCase();


            const selectedAttack =
                huntAttackType.value;

            const selectedRisk =
                huntRiskLevel.value;

            const selectedSource =
                huntSourceType.value;


            const results =
                threatData.filter(
                    function (
                        record
                    ) {

                        const currentState =
                            getCurrentRecordState(
                                record
                            );


                        const searchableValues =
                            [
                                record.id,
                                record.sourceIp,
                                record.destinationIp,
                                record.targetDevice,
                                record.employee,
                                record.deviceName,
                                record.attackType,
                                record.sourceType,
                                currentState.text
                            ]
                                .map(
                                    value =>
                                        String(
                                            value ||
                                            ""
                                        )
                                            .toLowerCase()
                                );


                        const matchesSearch =
                            !searchValue ||
                            searchableValues.some(
                                value =>
                                    value.includes(
                                        searchValue
                                    )
                            );


                        const matchesAttack =
                            selectedAttack ===
                                "all" ||
                            record.attackType ===
                                selectedAttack;


                        const matchesRisk =
                            selectedRisk ===
                                "all" ||
                            getRiskLevel(
                                record.riskScore
                            ) ===
                                selectedRisk;


                        const matchesSource =
                            selectedSource ===
                                "all" ||
                            record.sourceType ===
                                selectedSource;


                        return (
                            matchesSearch &&
                            matchesAttack &&
                            matchesRisk &&
                            matchesSource
                        );

                    }
                );


            results.sort(
                function (
                    a,
                    b
                ) {

                    return (
                        Number(
                            b.riskScore
                        ) -
                        Number(
                            a.riskScore
                        )
                    );

                }
            );


            updateHuntSummary(
                results
            );


            displayHuntResults(
                results
            );

        }


        // ====================================================
        // Update Hunt Summary
        // ====================================================

        function updateHuntSummary(
            results
        ) {

            if (huntMatchingRecords) {

                huntMatchingRecords.textContent =
                    results.length;

            }


            const uniqueSources =
                new Set(
                    results
                        .map(
                            record =>
                                record.sourceIp
                        )
                        .filter(Boolean)
                );


            if (huntSourceCount) {

                huntSourceCount.textContent =
                    uniqueSources.size;

            }


            const uniqueDevices =
                new Set(
                    results
                        .map(
                            record =>
                                record.targetDevice
                        )
                        .filter(Boolean)
                );


            if (huntDeviceCount) {

                huntDeviceCount.textContent =
                    uniqueDevices.size;

            }


            const highestRisk =
                results.length
                    ? Math.max(
                        ...results.map(
                            record =>
                                Number(
                                    record.riskScore
                                ) || 0
                        )
                    )
                    : 0;


            if (huntHighestRisk) {

                huntHighestRisk.textContent =
                    `${highestRisk}/100`;

            }


            const attackCounts =
                {};


            results.forEach(
                function (
                    record
                ) {

                    const attack =
                        record.attackType ||
                        "Unknown";


                    attackCounts[attack] =
                        (
                            attackCounts[
                                attack
                            ] || 0
                        ) + 1;

                }
            );


            let commonAttack =
                "-";

            let commonAttackCount =
                0;


            Object.entries(
                attackCounts
            ).forEach(
                function (
                    [attack, count]
                ) {

                    if (
                        count >
                        commonAttackCount
                    ) {

                        commonAttack =
                            attack;

                        commonAttackCount =
                            count;

                    }

                }
            );


            if (huntCommonAttack) {

                huntCommonAttack.textContent =
                    commonAttack;

            }

        }


        // ====================================================
        // Display Hunting Results
        // ====================================================

        function displayHuntResults(
            results
        ) {

            huntResultsBody.innerHTML =
                "";


            if (
                results.length ===
                0
            ) {

                if (huntResultMessage) {

                    huntResultMessage.textContent =
                        "No security records matched this hunt.";

                }


                huntResultsBody.innerHTML = `

                    <tr class="hunt-empty-row">

                        <td colspan="8">
                            🔍 No matching threats found.
                        </td>

                    </tr>

                `;


                return;

            }


            if (huntResultMessage) {

                huntResultMessage.textContent =
                    `${results.length} security records matched this hunt.`;

            }


            results.forEach(
                function (
                    record
                ) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const riskLevel =
                        getRiskLevel(
                            record.riskScore
                        );


                    const riskLabel =
                        getRiskLabel(
                            record.riskScore
                        );


                    const sourceClass =
                        record.sourceType ===
                        "External"
                            ? "hunt-source-external"
                            : "hunt-source-internal";


                    const currentState =
                        getCurrentRecordState(
                            record
                        );


                    row.title =
                        `Sentinel X State: ${currentState.text}`;


                    row.innerHTML = `

                        <td>
                            ${record.id || "-"}
                        </td>

                        <td>
                            ${record.sourceIp || "-"}
                        </td>

                        <td>
                            ${record.attackType || "-"}
                        </td>

                        <td>
                            ${record.employee || "-"}
                        </td>

                        <td>
                            ${record.targetDevice || "-"}
                        </td>

                        <td class="${sourceClass}">
                            ${record.sourceType || "-"}
                        </td>

                        <td>

                            <span
                                class="
                                    hunt-risk
                                    hunt-risk-${riskLevel}
                                "
                                title="Sentinel X State: ${currentState.text}"
                            >
                                ${record.riskScore}/100
                                ${riskLabel}
                                •
                                ${currentState.icon}
                                ${currentState.text}
                            </span>

                        </td>

                        <td>

                            <button
                                class="hunt-action-btn"
                            >
                                View
                            </button>

                        </td>

                    `;


                    huntResultsBody.appendChild(
                        row
                    );


                    const viewButton =
                        row.querySelector(
                            ".hunt-action-btn"
                        );


                    viewButton.addEventListener(
                        "click",
                        function () {

                            openHuntRecord(
                                record
                            );

                        }
                    );

                }
            );

        }


        // ====================================================
        // Open Hunting Record
        // ====================================================

        function openHuntRecord(
            record
        ) {

            const riskLevel =
                getRiskLevel(
                    record.riskScore
                );


            const riskLabel =
                getRiskLabel(
                    record.riskScore
                );


            const currentState =
                getCurrentRecordState(
                    record
                );


            const relatedAlertID =
                getRelatedAlertID(
                    record
                );


            const relatedIncidentID =
                getRelatedIncidentID(
                    record
                );


            const popup =
                document.createElement(
                    "div"
                );


            popup.className =
                "incident-popup";


            popup.innerHTML = `

                <div class="incident-popup-box">

                    <div class="incident-popup-header">

                        <h2>
                            🎯 Threat Hunt Record
                        </h2>

                        <button
                            class="hunt-close-popup"
                        >
                            ✖
                        </button>

                    </div>


                    <div class="incident-details">

                        <div>
                            <strong>
                                Dataset Record
                            </strong>

                            <span>
                                ${record.id || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Source IP
                            </strong>

                            <span>
                                ${record.sourceIp || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Destination IP
                            </strong>

                            <span>
                                ${record.destinationIp || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Attack Type
                            </strong>

                            <span>
                                ${record.attackType || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Employee
                            </strong>

                            <span>
                                ${record.employee || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Target Device
                            </strong>

                            <span>
                                ${record.targetDevice || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Device Name
                            </strong>

                            <span>
                                ${record.deviceName || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Source Type
                            </strong>

                            <span>
                                ${record.sourceType || "-"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Related Alert
                            </strong>

                            <span>
                                ${relatedAlertID || "No Top-12 Alert"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Related Incident
                            </strong>

                            <span>
                                ${relatedIncidentID || "No Top-10 Incident"}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Sentinel X State
                            </strong>

                            <span>
                                ${currentState.icon}
                                ${currentState.text}
                            </span>
                        </div>


                        <div>
                            <strong>
                                Risk Score
                            </strong>

                            <span
                                class="
                                    hunt-risk
                                    hunt-risk-${riskLevel}
                                "
                            >
                                ${record.riskScore}/100
                                ${riskLabel}
                            </span>
                        </div>

                    </div>


                    <div class="incident-popup-actions">

                        <button
                            class="hunt-investigate-record"
                        >
                            🔍 Investigate
                        </button>

                        <button
                            class="hunt-close-record"
                        >
                            Close
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                popup
            );


            popup
                .querySelector(
                    ".hunt-close-popup"
                )
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            popup
                .querySelector(
                    ".hunt-close-record"
                )
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            popup
                .querySelector(
                    ".hunt-investigate-record"
                )
                .addEventListener(
                    "click",
                    function () {

                        if (
                            typeof window.sentinelHasPermission === "function" &&
                            !window.sentinelHasPermission(
                                "investigateAlerts"
                            )
                        ) {

                            alert(
                                "⛔ Access Denied\n\n" +
                                "Your account does not have permission " +
                                "to investigate alerts."
                            );

                            return;

                        }


                        if (
                            !relatedAlertID
                        ) {

                            alert(
                                "This record was found through Threat Hunting.\n\n" +
                                "It is not currently part of the Top 12 Alerts, " +
                                "so no existing Investigation Alert ID is available."
                            );


                            return;

                        }


                        window.location.href =
                            "investigation.html?alert=" +
                            encodeURIComponent(
                                relatedAlertID
                            );

                    }
                );

        }


        // ====================================================
        // Hunt Button
        // ====================================================

        huntSearchBtn.addEventListener(
            "click",
            runThreatHunt
        );


        // ====================================================
        // Enter Key Search
        // ====================================================

        huntSearch.addEventListener(
            "keydown",
            function (
                event
            ) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    runThreatHunt();

                }

            }
        );


        // ====================================================
        // Filters
        // ====================================================

        huntAttackType.addEventListener(
            "change",
            runThreatHunt
        );


        huntRiskLevel.addEventListener(
            "change",
            runThreatHunt
        );


        huntSourceType.addEventListener(
            "change",
            runThreatHunt
        );


        // ====================================================
        // Reset Hunt
        // ====================================================

        huntResetBtn.addEventListener(
            "click",
            function () {

                huntSearch.value =
                    "";

                huntAttackType.value =
                    "all";

                huntRiskLevel.value =
                    "all";

                huntSourceType.value =
                    "all";


                if (huntMatchingRecords) {

                    huntMatchingRecords.textContent =
                        "0";

                }


                if (huntSourceCount) {

                    huntSourceCount.textContent =
                        "0";

                }


                if (huntDeviceCount) {

                    huntDeviceCount.textContent =
                        "0";

                }


                if (huntHighestRisk) {

                    huntHighestRisk.textContent =
                        "0/100";

                }


                if (huntCommonAttack) {

                    huntCommonAttack.textContent =
                        "-";

                }


                if (huntResultMessage) {

                    huntResultMessage.textContent =
                        "Run a hunt to analyze security records.";

                }


                huntResultsBody.innerHTML = `

                    <tr class="hunt-empty-row">

                        <td colspan="8">
                            🔍 No hunt has been executed yet.
                        </td>

                    </tr>

                `;

            }
        );

    }
);


// ============================================================
// THREAT HUNTING - VIEW BUTTON FIX
// ============================================================

document.addEventListener(
    "click",
    function (
        event
    ) {

        const viewButton =
            event.target.closest(
                ".hunt-action-btn"
            );


        if (!viewButton) {
            return;
        }


        console.log(
            "Threat Hunting View clicked"
        );

    }
);
// ============================================================
// SENTINEL X - DASHBOARD DATASET INTEGRATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ====================================================
        // Check If This Is The Dashboard Page
        // ====================================================

        const threatsElement =
            document.getElementById(
                "threats"
            );

        const criticalElement =
            document.getElementById(
                "alerts"
            );

        const riskElement =
            document.getElementById(
                "risk"
            );

        const alertsContainer =
            document.getElementById(
                "alertsContainer"
            );

        const dashboardAlertCount =
            document.getElementById(
                "dashboardAlertCount"
            );


        if (
            !threatsElement ||
            !criticalElement ||
            !riskElement ||
            !alertsContainer
        ) {
            return;
        }


        // ====================================================
        // Load CIC-IDS Dataset
        // ====================================================

        let dashboardData =
            [];


        try {

            const response =
                await fetch(
                    "data/sentinel_data.json"
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }


            dashboardData =
                await response.json();


            console.log(
                "Dashboard Dataset Loaded:",
                dashboardData.length,
                "records"
            );

        }

        catch (error) {

            console.error(
                "Dashboard Dataset Error:",
                error
            );


            return;

        }


        // ====================================================
        // Sort Dataset By Risk
        // ====================================================

        const sortedDashboardData =
            [...dashboardData].sort(
                function (
                    a,
                    b
                ) {

                    return (
                        Number(
                            b.riskScore
                        ) -
                        Number(
                            a.riskScore
                        )
                    );

                }
            );


        const dashboardAlerts =
            sortedDashboardData.slice(
                0,
                12
            );


        // ====================================================
        // Simulated Dashboard Alert
        // ====================================================

        let simulatedAlert =
            null;


        try {

            simulatedAlert =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXSimulatedAlert"
                    ) || "null"
                );

        }

        catch (error) {

            simulatedAlert =
                null;

        }


        // ====================================================
        // Severity Helper
        // ====================================================

        function getDashboardSeverity(
            riskScore
        ) {

            const risk =
                Number(
                    riskScore
                ) || 0;


            if (risk >= 90) {

                return {
                    label:
                        "CRITICAL",
                    className:
                        "severity-critical",
                    badgeClass:
                        "critical"
                };

            }


            if (risk >= 80) {

                return {
                    label:
                        "HIGH",
                    className:
                        "severity-high",
                    badgeClass:
                        "high"
                };

            }


            if (risk >= 70) {

                return {
                    label:
                        "MEDIUM",
                    className:
                        "severity-medium",
                    badgeClass:
                        "medium"
                };

            }


            return {
                label:
                    "LOW",
                className:
                    "severity-low",
                badgeClass:
                    "low"
            };

        }


        // ====================================================
        // Calculate Dashboard Statistics
        // ====================================================

        const criticalAlerts =
            dashboardAlerts.filter(
                function (
                    record
                ) {

                    return (
                        Number(
                            record.riskScore
                        ) >= 90
                    );

                }
            );


        const activeThreats =
            dashboardAlerts.filter(
                function (
                    record
                ) {

                    return (
                        Number(
                            record.riskScore
                        ) >= 80
                    );

                }
            );


        const hasSimulatedAlert =
            simulatedAlert &&
            simulatedAlert.id ===
                "SIM-001";


        threatsElement.textContent =
            activeThreats.length +
            (
                hasSimulatedAlert
                    ? 1
                    : 0
            );


        criticalElement.textContent =
            criticalAlerts.length +
            (
                hasSimulatedAlert &&
                Number(
                    simulatedAlert.riskScore ||
                    95
                ) >= 90
                    ? 1
                    : 0
            );


        if (dashboardAlertCount) {

            dashboardAlertCount.textContent =
                "🔔 Alerts: " +
                (
                    dashboardAlerts.length +
                    (
                        hasSimulatedAlert
                            ? 1
                            : 0
                    )
                );

        }


        // ====================================================
        // Overall Risk Level
        // ====================================================

        const dashboardRiskValues =
            dashboardAlerts.map(
                function (
                    record
                ) {

                    return (
                        Number(
                            record.riskScore
                        ) || 0
                    );

                }
            );


        if (hasSimulatedAlert) {

            dashboardRiskValues.push(
                Number(
                    simulatedAlert.riskScore ||
                    95
                )
            );

        }


        const highestRisk =
            dashboardRiskValues.length
                ? Math.max(
                    ...dashboardRiskValues
                )
                : 0;


        if (highestRisk >= 90) {

            riskElement.textContent =
                "CRITICAL";

            riskElement.className =
                "risk-critical";

        }

        else if (
            highestRisk >= 80
        ) {

            riskElement.textContent =
                "HIGH";

            riskElement.className =
                "risk-high";

        }

        else if (
            highestRisk >= 70
        ) {

            riskElement.textContent =
                "MEDIUM";

            riskElement.className =
                "risk-medium";

        }

        else {

            riskElement.textContent =
                "LOW";

            riskElement.className =
                "";

        }


        // ====================================================
        // Replace Static Recent Alerts
        // ====================================================

        alertsContainer.innerHTML =
            "";


        // ====================================================
        // Restore Simulated Alert
        // ====================================================

        if (hasSimulatedAlert) {

            const simulatedSeverity =
                getDashboardSeverity(
                    simulatedAlert.riskScore ||
                    95
                );


            const simulatedLink =
                document.createElement(
                    "a"
                );


            simulatedLink.href =
                "investigation.html?alert=" +
                encodeURIComponent(
                    "SIM-001"
                );


            simulatedLink.className =
                "dashboard-alert-link";


            const simulatedCard =
                document.createElement(
                    "div"
                );


            simulatedCard.className =
                "dashboard-alert " +
                simulatedSeverity.className;


            simulatedCard.id =
                "SIM-001";


            simulatedCard.dataset.dashboardAlert =
                "SIM-001";


            simulatedCard.dataset.device =
                simulatedAlert.targetDevice ||
                "SIM-PC-001";


            simulatedCard.innerHTML = `

                <div
                    class="dashboard-alert-info"
                >

                    <div
                        class="dashboard-alert-icon"
                    >
                        🚨
                    </div>


                    <div
                        class="dashboard-alert-text"
                    >

                        <span
                            class="dashboard-alert-title"
                        >
                            ${
                                simulatedAlert.attackType ||
                                "Simulated Network Attack"
                            }
                        </span>


                        <span
                            class="dashboard-alert-meta"
                        >
                            SIM-001
                            •
                            ${
                                simulatedAlert.targetDevice ||
                                "SIM-PC-001"
                            }
                            •
                            ${
                                simulatedAlert.employee ||
                                "Simulation"
                            }
                        </span>

                    </div>

                </div>


                <span
                    class="
                        dashboard-severity
                        ${simulatedSeverity.badgeClass}
                    "
                >
                    ${simulatedSeverity.label}
                </span>

            `;


            simulatedLink.appendChild(
                simulatedCard
            );


            alertsContainer.appendChild(
                simulatedLink
            );

        }


        // ====================================================
        // Show Highest-Risk Dataset Alerts
        // ====================================================

        const recentAlerts =
            dashboardAlerts.slice(
                0,
                hasSimulatedAlert
                    ? 5
                    : 6
            );


        recentAlerts.forEach(
            function (
                record,
                index
            ) {

                const alertID =
                    `DATA-ALT-${String(
                        index + 1
                    ).padStart(
                        3,
                        "0"
                    )}`;


                const severity =
                    getDashboardSeverity(
                        record.riskScore
                    );


                const alertLink =
                    document.createElement(
                        "a"
                    );


                alertLink.href =
                    "investigation.html?alert=" +
                    encodeURIComponent(
                        alertID
                    );


                alertLink.className =
                    "dashboard-alert-link";


                const alertCard =
                    document.createElement(
                        "div"
                    );


                alertCard.className =
                    "dashboard-alert " +
                    severity.className;


                alertCard.dataset.dashboardAlert =
                    alertID;


                alertCard.dataset.device =
                    record.targetDevice ||
                    "";


                alertCard.innerHTML = `

                    <div
                        class="dashboard-alert-info"
                    >

                        <div
                            class="dashboard-alert-icon"
                        >
                            🚨
                        </div>


                        <div
                            class="dashboard-alert-text"
                        >

                            <span
                                class="dashboard-alert-title"
                            >
                                ${
                                    record.attackType ||
                                    "Security Alert"
                                }
                            </span>


                            <span
                                class="dashboard-alert-meta"
                            >
                                ${alertID}
                                •
                                ${
                                    record.targetDevice ||
                                    "Unknown Device"
                                }
                                •
                                ${
                                    record.employee ||
                                    "Unknown User"
                                }
                            </span>

                        </div>

                    </div>


                    <span
                        class="
                            dashboard-severity
                            ${severity.badgeClass}
                        "
                    >
                        ${severity.label}
                    </span>

                `;


                alertLink.appendChild(
                    alertCard
                );


                alertsContainer.appendChild(
                    alertLink
                );

            }
        );


        // ====================================================
        // Restore Blocked / Ignored / Isolated State
        // ====================================================

        let currentBlockedAlerts =
            [];

        let currentIgnoredAlerts =
            [];

        let currentIsolatedDevices =
            [];


        try {

            currentBlockedAlerts =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXBlockedAlerts"
                    ) || "[]"
                );

        }

        catch (error) {

            currentBlockedAlerts =
                [];

        }


        try {

            currentIgnoredAlerts =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXIgnoredAlerts"
                    ) || "[]"
                );

        }

        catch (error) {

            currentIgnoredAlerts =
                [];

        }


        try {

            currentIsolatedDevices =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXIsolatedDevices"
                    ) || "[]"
                );

        }

        catch (error) {

            currentIsolatedDevices =
                [];

        }


        alertsContainer
            .querySelectorAll(
                "[data-dashboard-alert]"
            )
            .forEach(
                function (
                    alertCard
                ) {

                    const alertID =
                        alertCard.dataset
                            .dashboardAlert;


                    const device =
                        alertCard.dataset
                            .device;


                    if (
                        currentBlockedAlerts.includes(
                            alertID
                        ) ||
                        currentIsolatedDevices.includes(
                            device
                        )
                    ) {

                        alertCard.classList.add(
                            "alert-blocked"
                        );

                    }


                    if (
                        currentIgnoredAlerts.includes(
                            alertID
                        )
                    ) {

                        alertCard.style.opacity =
                            "0.5";

                    }

                }
            );


        console.log(
            "Sentinel X Dashboard Updated from CIC-IDS Dataset"
        );

    }
);


// ============================================================
// DASHBOARD SIMULATED ATTACK PERSISTENCE
// ============================================================

document.addEventListener(
    "click",
    function (
        event
    ) {

        const simulateButton =
            event.target.closest(
                "#attackBtn"
            );


        if (!simulateButton) {
            return;
        }


        if (
            typeof window.sentinelHasPermission ===
                "function" &&
            !window.sentinelHasPermission(
                "blockAlert"
            ) &&
            !window.sentinelHasPermission(
                "investigateAlerts"
            )
        ) {

            return;

        }


        window.setTimeout(
            function () {

                const simulatedElement =
                    document.getElementById(
                        "SIM-001"
                    );


                if (!simulatedElement) {
                    return;
                }


                const simulatedAlert = {

                    id:
                        "SIM-001",

                    datasetRecord:
                        "SIM-001",

                    attackType:
                        "Simulated Network Attack",

                    sourceIp:
                        "Simulation",

                    destinationIp:
                        "Simulation",

                    targetDevice:
                        simulatedElement.dataset.device ||
                        "SIM-PC-001",

                    employee:
                        "Simulation",

                    deviceName:
                        "Simulation Device",

                    sourceType:
                        "External",

                    riskScore:
                        95

                };


                localStorage.setItem(
                    "sentinelXSimulatedAlert",
                    JSON.stringify(
                        simulatedAlert
                    )
                );

            },
            0
        );

    }
);
/* =========================================================
   SENTINEL X - LOGIN & RBAC SYSTEM
   Front-End Security Prototype
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Demo SOC Accounts
       ========================= */

    const sentinelUsers = {

        admin: {
            username: "admin",
            password: "Admin@123",
            name: "Reem",
            role: "SOC Administrator",
            accessLevel: "Full Security Access",
            permission: "admin"
        },

        analyst: {
            username: "analyst",
            password: "Analyst@123",
            name: "SOC Analyst",
            role: "SOC Analyst",
            accessLevel: "Investigation & Response",
            permission: "analyst"
        },

        viewer: {
            username: "monitor",
            password: "Monitor@123",
            name: "SOC Monitor",
            role: "SOC Monitor",
            accessLevel: "Monitoring / Read Only",
            permission: "viewer"
        }

    };


    /* =========================
       Login Page Elements
       ========================= */

    const loginForm =
        document.getElementById(
            "sentinelLoginForm"
        );

    const usernameInput =
        document.getElementById(
            "loginUsername"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const togglePassword =
        document.getElementById(
            "toggleLoginPassword"
        );


    /* =========================
       Password Visibility
       ========================= */

    if (
        togglePassword &&
        passwordInput
    ) {

        togglePassword.addEventListener(
            "click",
            function () {

                const passwordVisible =
                    passwordInput.type === "text";

                passwordInput.type =
                    passwordVisible
                        ? "password"
                        : "text";

                togglePassword.textContent =
                    passwordVisible
                        ? "👁️"
                        : "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    passwordVisible
                        ? "Show password"
                        : "Hide password"
                );

                togglePassword.title =
                    passwordVisible
                        ? "Show password"
                        : "Hide password";

            }
        );

    }


    /* =========================
       Login
       ========================= */

    if (
        loginForm &&
        usernameInput &&
        passwordInput
    ) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const enteredUsername =
                    usernameInput.value
                        .trim()
                        .toLowerCase();

                const enteredPassword =
                    passwordInput.value;


                if (loginMessage) {

                    loginMessage.textContent =
                        "";

                    loginMessage.className =
                        "login-message";

                }


                const matchedUser =
                    Object.values(
                        sentinelUsers
                    ).find(
                        function (user) {

                            return (
                                user.username.toLowerCase() ===
                                    enteredUsername &&
                                user.password ===
                                    enteredPassword
                            );

                        }
                    );


                if (!matchedUser) {

                    if (loginMessage) {

                        loginMessage.textContent =
                            "Invalid username or password.";

                        loginMessage.className =
                            "login-message error";

                    }

                    passwordInput.value =
                        "";

                    passwordInput.focus();

                    return;

                }


                const session = {

                    username:
                        matchedUser.username,

                    name:
                        matchedUser.name,

                    role:
                        matchedUser.role,

                    accessLevel:
                        matchedUser.accessLevel,

                    permission:
                        matchedUser.permission,

                    authenticated:
                        true,

                    loginTime:
                        new Date().toISOString()

                };


                localStorage.setItem(
                    "sentinelXSession",
                    JSON.stringify(
                        session
                    )
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        "Access granted. Opening Sentinel X...";

                    loginMessage.className =
                        "login-message success";

                }


                if (loginButton) {

                    loginButton.disabled =
                        true;

                    loginButton.innerHTML =
                        "<span>✅</span><span>Access Granted</span>";

                }


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    500
                );

            }
        );

    }


    /* =========================
       Existing Session
       ========================= */

    function getSentinelSession() {

        try {

            const storedSession =
                localStorage.getItem(
                    "sentinelXSession"
                );

            if (!storedSession) {
                return null;
            }


            const session =
                JSON.parse(
                    storedSession
                );


            if (
                !session ||
                session.authenticated !== true
            ) {
                return null;
            }


            return session;

        }

        catch (error) {

            return null;

        }

    }


    /* =========================
       Permission Helper
       ========================= */

    window.getSentinelSession =
        getSentinelSession;


    window.hasSentinelPermission =
        function (requiredPermission) {

            const session =
                getSentinelSession();


            if (!session) {
                return false;
            }


            if (
                session.permission ===
                "admin"
            ) {
                return true;
            }


            if (
                typeof window.sentinelHasPermission ===
                "function"
            ) {

                return window.sentinelHasPermission(
                    requiredPermission
                );

            }


            if (
                requiredPermission ===
                "viewer"
            ) {
                return true;
            }


            if (
                requiredPermission ===
                    "analyst" &&
                session.permission ===
                    "analyst"
            ) {
                return true;
            }


            return false;

        };


    /* =========================
       Logout Helper
       ========================= */

    window.logoutSentinelX =
        function () {

            localStorage.removeItem(
                "sentinelXSession"
            );

            window.location.href =
                "login.html";

        };

});


/* =========================================================
   SENTINEL X - CENTRALIZED RBAC SYSTEM
   Admin = Full Access
   Analyst & Monitor = Admin Managed Permissions
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DEFAULT PERMISSIONS
       ===================================================== */

    const defaultRolePermissions = {

        analyst: {
            viewDashboard: true,
            viewAlerts: true,
            investigateAlerts: true,
            blockAlert: true,
            ignoreAlert: true,
            viewInvestigation: true,
            createIncident: true,
            isolateDevice: true,
            viewIncidents: true,
            containIncident: true,
            resolveIncident: true,
            closeIncident: true,
            viewEmployees: true,
            viewDevices: true,
            threatHunting: true,
            viewReports: true,
            generateReports: true
        },

        viewer: {
            viewDashboard: true,
            viewAlerts: true,
            investigateAlerts: false,
            blockAlert: false,
            ignoreAlert: false,
            viewInvestigation: false,
            createIncident: false,
            isolateDevice: false,
            viewIncidents: true,
            containIncident: false,
            resolveIncident: false,
            closeIncident: false,
            viewEmployees: true,
            viewDevices: true,
            threatHunting: false,
            viewReports: true,
            generateReports: false
        }

    };


    /* =====================================================
       STORAGE HELPERS
       ===================================================== */

    function getSession() {

        try {

            const session =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXSession"
                    )
                );


            if (
                !session ||
                session.authenticated !== true
            ) {
                return null;
            }


            return session;

        }

        catch (error) {

            return null;

        }

    }


    function getRolePermissions() {

        let permissions =
            null;


        try {

            permissions =
                JSON.parse(
                    localStorage.getItem(
                        "sentinelXRolePermissions"
                    )
                );

        }

        catch (error) {

            permissions =
                null;

        }


        if (
            !permissions ||
            typeof permissions !==
                "object"
        ) {

            permissions =
                JSON.parse(
                    JSON.stringify(
                        defaultRolePermissions
                    )
                );

        }


        ["analyst", "viewer"].forEach(
            function (role) {

                if (
                    !permissions[role] ||
                    typeof permissions[role] !==
                        "object"
                ) {

                    permissions[role] =
                        {};

                }


                Object.keys(
                    defaultRolePermissions[role]
                ).forEach(
                    function (permission) {

                        if (
                            typeof permissions[
                                role
                            ][
                                permission
                            ] !==
                            "boolean"
                        ) {

                            permissions[
                                role
                            ][
                                permission
                            ] =
                                defaultRolePermissions[
                                    role
                                ][
                                    permission
                                ];

                        }

                    }
                );

            }
        );


        localStorage.setItem(
            "sentinelXRolePermissions",
            JSON.stringify(
                permissions
            )
        );


        return permissions;

    }


    /* =====================================================
       GLOBAL PERMISSION CHECKER
       ===================================================== */

    window.sentinelHasPermission =
        function (permissionName) {

            const session =
                getSession();


            if (!session) {
                return false;
            }


            /* Admin always has full access */

            if (
                session.permission ===
                "admin"
            ) {
                return true;
            }


            /* Settings remains Admin only */

            if (
                permissionName ===
                "changeSettings"
            ) {
                return false;
            }


            const permissions =
                getRolePermissions();


            if (
                !permissions[
                    session.permission
                ]
            ) {
                return false;
            }


            return (
                permissions[
                    session.permission
                ][permissionName] ===
                true
            );

        };


    /* =====================================================
       LOGIN PROTECTION
       ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() ||
        "index.html";


    if (
        currentPage ===
        "login.html"
    ) {
        return;
    }


    const session =
        getSession();


    if (!session) {

        window.location.replace(
            "login.html"
        );

        return;

    }


    /* =====================================================
       PAGE ACCESS CONTROL
       ===================================================== */

    const pagePermissions = {

        "index.html":
            "viewDashboard",

        "alerts.html":
            "viewAlerts",

        "investigation.html":
            "viewInvestigation",

        "incidents.html":
            "viewIncidents",

        "employees.html":
            "viewEmployees",

        "devices.html":
            "viewDevices",

        "threat-hunting.html":
            "threatHunting",

        "reports.html":
            "viewReports",

        "settings.html":
            "changeSettings"

    };


    const requiredPermission =
        pagePermissions[
            currentPage
        ];


    if (
        requiredPermission &&
        !window.sentinelHasPermission(
            requiredPermission
        )
    ) {

        alert(
            "⛔ Access Denied\n\n" +
            "Your account does not have permission " +
            "to access this page."
        );


        window.location.replace(
            "index.html"
        );

        return;

    }


    /* =====================================================
       SETTINGS = ADMIN ONLY
       ===================================================== */

    if (
        currentPage ===
            "settings.html" &&
        session.permission !==
            "admin"
    ) {

        alert(
            "⛔ Access Denied\n\n" +
            "Settings can only be accessed by Admin."
        );


        window.location.replace(
            "index.html"
        );

        return;

    }


    /* =====================================================
       USER ROLE INFORMATION
       ===================================================== */

    let welcomeLabel =
        session.role ||
        "SOC User";


    let accountLabel =
        session.role ||
        "SOC User";


    if (
        session.permission ===
        "admin"
    ) {

        welcomeLabel =
            "SOC Administrator";

        accountLabel =
            "Admin";

    }

    else if (
        session.permission ===
        "analyst"
    ) {

        welcomeLabel =
            "SOC Analyst";

        accountLabel =
            "SOC Analyst";

    }

    else if (
        session.permission ===
        "viewer"
    ) {

        welcomeLabel =
            "SOC Monitor";

        accountLabel =
            "SOC Monitor";

    }


    /* =====================================================
       USER IDENTITY ON ALL PAGES
       ===================================================== */

    function updateUserIdentity() {

        const welcomeElements = [
            document.getElementById(
                "welcomeUser"
            ),
            document.getElementById(
                "welcomeText"
            ),
            document.getElementById(
                "welcomeMessage"
            ),
            document.getElementById(
                "alertsWelcome"
            ),
            document.getElementById(
                "investigationWelcome"
            ),
            document.querySelector(
                ".welcome-user"
            ),
            document.querySelector(
                ".welcome-text"
            ),
            document.querySelector(
                ".topbar-welcome"
            )
        ];


        welcomeElements.forEach(
            function (element) {

                if (element) {

                    element.textContent =
                        "Welcome, " +
                        welcomeLabel;

                }

            }
        );


        const namedUserElements = [
            document.getElementById(
                "alertsUserName"
            ),
            document.getElementById(
                "incidentsUserName"
            ),
            document.getElementById(
                "employeesUserName"
            ),
            document.getElementById(
                "devicesUserName"
            ),
            document.getElementById(
                "reportsUserName"
            ),
            document.getElementById(
                "settingsCurrentUser"
            )
        ];


        namedUserElements.forEach(
            function (element) {

                if (element) {

                    element.textContent =
                        "👤 " +
                        accountLabel;

                }

            }
        );


        const currentUserRole =
            document.getElementById(
                "currentUserRole"
            );


        if (currentUserRole) {

            currentUserRole.textContent =
                "👤 " +
                accountLabel;

        }


        const possibleRoleElements = [
            document.getElementById(
                "userRole"
            ),
            document.getElementById(
                "accountRole"
            ),
            document.querySelector(
                ".user-role"
            ),
            document.querySelector(
                ".account-role"
            )
        ];


        possibleRoleElements.forEach(
            function (element) {

                if (element) {

                    element.textContent =
                        accountLabel;

                }

            }
        );


        const topbar =
            document.querySelector(
                ".topbar"
            );


        if (topbar) {

            const elements =
                topbar.querySelectorAll(
                    "span, p, strong, button, div"
                );


            elements.forEach(
                function (element) {

                    if (
                        element.children.length >
                        0
                    ) {
                        return;
                    }


                    const text =
                        element.textContent
                            .trim();


                    if (
                        text ===
                            "Welcome, SOC Analyst" ||
                        text ===
                            "Welcome SOC Analyst" ||
                        text ===
                            "Welcome, Admin" ||
                        text ===
                            "Welcome Admin" ||
                        text ===
                            "Welcome, SOC Monitor" ||
                        text ===
                            "Welcome SOC Monitor"
                    ) {

                        element.textContent =
                            "Welcome, " +
                            welcomeLabel;

                    }


                    if (
                        text ===
                            "Admin" ||
                        text ===
                            "SOC Analyst" ||
                        text ===
                            "SOC Monitor"
                    ) {

                        element.textContent =
                            accountLabel;

                    }

                }
            );

        }

    }


    updateUserIdentity();


    /* =====================================================
       SIDEBAR PERMISSION MAP
       ===================================================== */

    const navigationPermissions = {

        "index.html":
            "viewDashboard",

        "alerts.html":
            "viewAlerts",

        "investigation.html":
            "viewInvestigation",

        "incidents.html":
            "viewIncidents",

        "employees.html":
            "viewEmployees",

        "devices.html":
            "viewDevices",

        "threat-hunting.html":
            "threatHunting",

        "reports.html":
            "viewReports",

        "settings.html":
            "changeSettings"

    };


    /* =====================================================
       PROTECT SIDEBAR LINKS
       ===================================================== */

    document
        .querySelectorAll(
            ".sidebar a, nav a"
        )
        .forEach(
            function (link) {

                const href =
                    (
                        link.getAttribute(
                            "href"
                        ) || ""
                    )
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .toLowerCase();


                const permission =
                    navigationPermissions[
                        href
                    ];


                if (!permission) {
                    return;
                }


                if (
                    window.sentinelHasPermission(
                        permission
                    )
                ) {
                    return;
                }


                link.style.opacity =
                    "0.45";

                link.style.cursor =
                    "not-allowed";

                link.title =
                    "Access restricted for this account";


                link.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        alert(
                            "⛔ Access Denied\n\n" +
                            "Your account does not have permission " +
                            "to access this section."
                        );

                    }
                );

            }
        );


    /* =====================================================
       GLOBAL ACTION PERMISSION HELPER
       ===================================================== */

    function protectAction(
        selector,
        permission,
        message
    ) {

        document
            .querySelectorAll(
                selector
            )
            .forEach(
                function (button) {

                    if (
                        window.sentinelHasPermission(
                            permission
                        )
                    ) {
                        return;
                    }


                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            event.stopImmediatePropagation();


                            alert(
                                "⛔ Access Denied\n\n" +
                                message
                            );

                        },
                        true
                    );

                }
            );

    }


    /* =====================================================
       ALERT ACTIONS
       ===================================================== */

    protectAction(
        ".investigate-btn, " +
        ".dataset-investigate-btn, " +
        ".investigate-incident, " +
        ".hunt-investigate-btn, " +
        ".hunt-investigate-record",
        "investigateAlerts",
        "Your account does not have permission to investigate alerts."
    );


    protectAction(
        ".block-btn, " +
        ".dataset-block-btn",
        "blockAlert",
        "Your account does not have permission to block alerts."
    );


    protectAction(
        ".ignore-btn, " +
        ".dataset-ignore-btn",
        "ignoreAlert",
        "Your account does not have permission to ignore alerts."
    );


    /* =====================================================
       INVESTIGATION ACTIONS
       ===================================================== */

    protectAction(
        "#createIncidentBtn",
        "createIncident",
        "Your account does not have permission to create incidents."
    );


    protectAction(
        "#isolateInvestigationDeviceBtn, " +
        "#isolateDeviceBtn, " +
        ".isolate-device-btn",
        "isolateDevice",
        "Your account does not have permission to isolate devices."
    );


    /* =====================================================
       INCIDENT ACTIONS
       ===================================================== */

    protectAction(
        ".contain-incident, " +
        ".dataset-contain-incident, " +
        ".dataset-contain-btn, " +
        ".contain-btn",
        "containIncident",
        "Your account does not have permission to contain incidents."
    );


    protectAction(
        ".resolve-incident, " +
        ".dataset-resolve-incident, " +
        ".dataset-resolve-btn, " +
        ".resolve-btn",
        "resolveIncident",
        "Your account does not have permission to resolve incidents."
    );


    protectAction(
        ".close-incident, " +
        ".dataset-close-incident, " +
        ".close-incident-btn",
        "closeIncident",
        "Your account does not have permission to close incidents."
    );


    /* =====================================================
       REPORT ACTIONS
       ===================================================== */

    protectAction(
        "#generateReportBtn, " +
        ".generate-report-btn",
        "generateReports",
        "Your account does not have permission to generate reports."
    );


    /* =====================================================
       SETTINGS PERMISSION MATRIX
       ===================================================== */

    const permissionCheckboxes =
        document.querySelectorAll(
            ".permission-checkbox"
        );


    if (
        permissionCheckboxes.length ===
        0
    ) {
        return;
    }


    if (
        session.permission !==
        "admin"
    ) {
        return;
    }


    let rolePermissions =
        getRolePermissions();


    /* =====================================================
       RESTORE SETTINGS CHECKBOXES
       ===================================================== */

    permissionCheckboxes.forEach(
        function (checkbox) {

            const role =
                checkbox.dataset.role;

            const permission =
                checkbox.dataset.permission;


            if (
                role ===
                "admin"
            ) {

                checkbox.checked =
                    true;

                checkbox.disabled =
                    true;

                return;

            }


            if (
                permission ===
                "changeSettings"
            ) {

                checkbox.checked =
                    false;

                checkbox.disabled =
                    true;

                return;

            }


            if (
                rolePermissions[role] &&
                typeof rolePermissions[
                    role
                ][
                    permission
                ] ===
                    "boolean"
            ) {

                checkbox.checked =
                    rolePermissions[
                        role
                    ][
                        permission
                    ];

            }

        }
    );


    /* =====================================================
       SETTINGS AUTO SAVE
       ===================================================== */

    permissionCheckboxes.forEach(
        function (checkbox) {

            checkbox.addEventListener(
                "change",
                function () {

                    const role =
                        checkbox.dataset.role;

                    const permission =
                        checkbox.dataset.permission;


                    if (
                        role ===
                        "admin"
                    ) {

                        checkbox.checked =
                            true;

                        return;

                    }


                    if (
                        permission ===
                        "changeSettings"
                    ) {

                        checkbox.checked =
                            false;

                        return;

                    }


                    if (
                        !rolePermissions[
                            role
                        ]
                    ) {

                        rolePermissions[
                            role
                        ] = {};

                    }


                    rolePermissions[
                        role
                    ][
                        permission
                    ] =
                        checkbox.checked;


                    localStorage.setItem(
                        "sentinelXRolePermissions",
                        JSON.stringify(
                            rolePermissions
                        )
                    );


                    const settingsMessage =
                        document.getElementById(
                            "settingsMessage"
                        );


                    if (
                        settingsMessage
                    ) {

                        const roleName =
                            role ===
                                "analyst"
                                ? "SOC Analyst"
                                : "SOC Monitor";


                        const status =
                            checkbox.checked
                                ? "enabled"
                                : "disabled";


                        settingsMessage.textContent =
                            "✅ " +
                            permission +
                            " " +
                            status +
                            " for " +
                            roleName +
                            ". Saved automatically.";


                        settingsMessage.className =
                            "settings-message success";


                        clearTimeout(
                            window
                                .sentinelPermissionMessageTimer
                        );


                        window
                            .sentinelPermissionMessageTimer =
                            setTimeout(
                                function () {

                                    settingsMessage
                                        .textContent =
                                            "";

                                    settingsMessage
                                        .className =
                                            "settings-message";

                                },
                                3000
                            );

                    }

                }
            );

        }
    );


    console.log(
        "Sentinel X Centralized RBAC Loaded:",
        session.permission
    );

});
/* =========================================================
   SENTINEL X - FIX CURRENT USER ROLE DISPLAY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const currentUserRole =
        document.getElementById(
            "currentUserRole"
        );


    if (!currentUserRole) {
        return;
    }


    let session =
        null;


    try {

        session =
            JSON.parse(
                localStorage.getItem(
                    "sentinelXSession"
                )
            );

    }

    catch (error) {

        return;

    }


    if (
        !session ||
        session.authenticated !== true
    ) {
        return;
    }


    let roleName =
        "User";


    if (
        session.permission ===
        "admin"
    ) {

        roleName =
            "Admin";

    }

    else if (
        session.permission ===
        "analyst"
    ) {

        roleName =
            "SOC Analyst";

    }

    else if (
        session.permission ===
        "viewer"
    ) {

        roleName =
            "SOC Monitor";

    }


    currentUserRole.textContent =
        "👤 " +
        roleName;

});
