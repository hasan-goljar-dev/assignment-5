const createElements = (arr) => {
    return arr.map(el =>
        `<span class="badge badge-warning badge-outline">${el}</span>`
    ).join("");
};
let issuesData = [];
const allContainer = document.getElementById("all-container");
const openContainer = document.getElementById("open-container");
const closedContainer = document.getElementById("closed-container");

const updateIssueCount = (issues) => {
    document.getElementById("issue-count").textContent = issues.length;
};
const allIssues = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            issuesData = data.data;
            displayIssues(issuesData);
            updateIssueCount(issuesData);
        });
};
const displayIssues = (issues) => {
    allContainer.innerHTML = "";
    openContainer.innerHTML = "";
    closedContainer.innerHTML = "";
    issues.forEach(issue => {
        const cardDiv = document.createElement("div");

        cardDiv.innerHTML = `
        <div class="bg-base-100 shadow rounded-xl p-4 space-y-3">
            <div class="flex justify-between items-center">
            <span class="flex items-center gap-1">
              <img class="w-6 h-6" src="${issue.status === 'open' ?
                './assets/Open-Status.png' :
                './assets/Closed-Status.png'}" alt=""></span>
                <span class="badge ${issue.priority === 'high'
                ? 'badge-error'
                : issue.priority === 'medium'
                    ? 'badge-warning'
                    : 'badge-neutral'} badge-outline">
                  ${issue.priority}
            </span>
            </div>

            <h2 class="font-semibold">
                ${issue.title}
            </h2>

            <p class="text-sm text-gray-500">
                ${issue.description}
            </p>

            <div class="flex gap-2">
                ${createElements(issue.labels)}
            </div>

            <div class="border-t pt-2 text-xs text-gray-500">
                <p># by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>

        </div>
        `;
        allContainer.appendChild(cardDiv.cloneNode(true));
        if (issue.status === "open") {
            openContainer.appendChild(cardDiv.cloneNode(true));
        }
        if (issue.status === "closed") {
            closedContainer.appendChild(cardDiv.cloneNode(true));
        }
    });
};

const tabActive = ["bg-blue-800", "text-white"];
const tabInactive = ["bg-transparent"];
const tabs = ["all", "open", "closed"];

function switchTab(select) {

    tabs.forEach(tab => {

        const tabBtn = document.getElementById("Select-" + tab);

        if (tab === select) {
            tabBtn.classList.remove(...tabInactive);
            tabBtn.classList.add(...tabActive);
        } else {
            tabBtn.classList.remove(...tabActive);
            tabBtn.classList.add(...tabInactive);
        }
    });

    // hide all pages
    const pages = [allContainer, openContainer, closedContainer];

    pages.forEach(page => page.classList.add("hidden"));
    // show selected page
    if (select === "all") allContainer.classList.remove("hidden");
    if (select === "open") openContainer.classList.remove("hidden");
    if (select === "closed") closedContainer.classList.remove("hidden");
    // update counter
    if (select === "all") updateIssueCount(issuesData);
    if (select === "open") {
        const open = issuesData.filter(issue => issue.status === "open");
        updateIssueCount(open);
    }
    if (select === "closed") {
        const closed = issuesData.filter(issue => issue.status === "closed");
        updateIssueCount(closed);
    }
}
// button events
tabs.forEach(tab => {
    document.getElementById("Select-" + tab).onclick = () => switchTab(tab);
});

switchTab("all");

allIssues();