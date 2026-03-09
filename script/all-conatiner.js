const createElements = (arr) => {
    return arr.map(el =>
        `<span class="badge badge-warning badge-outline">${el}</span>`
    ).join("");
};
let issuesData = [];
const allContainer = document.getElementById("all-container");
const openContainer = document.getElementById("open-container");
const closedContainer = document.getElementById("closed-container");
const modalHandler = document.getElementById("my_modal_3");
const updateIssueCount = (issues) => {
    document.getElementById("issue-count").textContent = issues.length;
};
const allIssues = () => {
    manageSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                issuesData = data.data;
                displayIssues(issuesData);
                updateIssueCount(issuesData);
                manageSpinner(false);
            }, 800);
        });
};
const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");

    if (status) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
};
const displayIssues = (issues) => {
    manageSpinner(true)
    allContainer.innerHTML = "";
    openContainer.innerHTML = "";
    closedContainer.innerHTML = "";
    issues.forEach(issue => {
        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = `
<div
  onclick="modal(${issue.id})"
  class="issue-card bg-base-100 shadow rounded-xl p-4 space-y-3 border-t-4
  ${issue.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500'}"
>

  <div class="flex justify-between items-center">

    <span class="flex items-center gap-1">
      <img
        class="w-6 h-6"
        src="${issue.status === 'open'
                ? '../assets/Open-Status.png'
                : '../assets/Closed-Status.png'
            }"
        alt=""
      >
    </span>

    <span
      class="badge ${issue.priority === 'high'
                ? 'badge-error'
                : issue.priority === 'medium'
                    ? 'badge-warning'
                    : 'badge-neutral'
            } badge-outline"
    >
      ${issue.priority}
    </span>

  </div>

  <h2 class="font-semibold">
    ${issue.title}
  </h2>

  <p class="text-sm text-gray-500 line-clamp-2">
    ${issue.description}..
  </p>

  <div class="flex gap-2">
    ${createElements(issue.labels)}
  </div>

  <div class="border-t pt-2 text-xs text-gray-500">
    <p>#${issue.id} by ${issue.author}</p>
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
    manageSpinner(false)
};
function modal(id) {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            modalDisplay(data.data);
            modalHandler.showModal();
        });
}
function modalDisplay(a) {
    modalHandler.innerHTML = `
   <div class="modal-box">
    <form method="dialog">
     <h2 class="text-xl font-bold">${a.title}</h2>

    <div class="text-sm text-gray-500 mt-1">
   <span class="badge ${a.status === 'open' ? 'badge-success' : 'badge-info'}">
  ${a.status}
</span>
      • Opened by ${a.assignee}
      • ${new Date(a.createdAt).toLocaleDateString()}
    </div>

    <div class="flex gap-2 mt-3">
                ${createElements(a.labels)}
    </div>       
    <p class="mt-4 text-gray-700">
      ${a.description}
    </p>

    <div class="grid grid-cols-2 mt-6 text-sm">
      <div>
        <p class="text-gray-500">Assignee:</p>
        <p class="font-semibold">${a.author}</p>
      </div>

      <div>
        <p class="text-gray-500">Priority:</p>
        <span class="badge ${a.priority === 'high'
            ? 'badge-error'
            : a.priority === 'medium'
                ? 'badge-warning'
                : 'badge-neutral'} badge-outline">
                  ${a.priority}</span>
      </div>
    </div>

    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-primary">Close</button>
      </form>
    </div>`
}
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

    tabs.forEach(page => {
        const selectContainer = document.getElementById(page + "-container");

        selectContainer.classList.add("hidden");

        if (page === select) {
            selectContainer.classList.remove("hidden");
        }
    });

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
switchTab("all");
document.getElementById("search-btn").addEventListener("click", () => {
    const inputValue = document.getElementById("input-search").value.trim().toLowerCase();

    if (!inputValue) return allIssues();

    manageSpinner(true);

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputValue}`)
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                const results = data.data;
                displayIssues(results);
                manageSpinner(false);
            }, 800);
        })

});

allIssues();