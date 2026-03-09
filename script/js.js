/**
 * Global State
 */
let issuesData = [];
let currentFilter = "all";

// DOM Elements
const mainContainer = document.getElementById("all-container"); // একটি কন্টেইনারেই সব দেখাবো
const modalHandler = document.getElementById("my_modal_3");
const issueCountElement = document.getElementById("issue-count");
const spinner = document.getElementById("spinner");

/**
 * Helper: Create Tags HTML
 */
const createElements = (arr) => {
    return arr.map(el =>
        `<span class="badge badge-warning badge-outline text-xs">${el}</span>`
    ).join("");
};

/**
 * Manage Spinner
 */
const manageSpinner = (status) => {
    status ? spinner.classList.remove("hidden") : spinner.classList.add("hidden");
};

/**
 * API: Fetch All Issues
 */
const allIssues = async () => {
    manageSpinner(true);
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        issuesData = data.data;
        
        // ডিফল্টভাবে 'all' ট্যাব রেন্ডার হবে
        switchTab("all");
    } catch (error) {
        console.error("Error fetching issues:", error);
        mainContainer.innerHTML = `<p class="text-error text-center">ডেটা লোড করতে সমস্যা হয়েছে!</p>`;
    } finally {
        setTimeout(() => manageSpinner(false), 500);
    }
};

/**
 * Logic: Display/Render Issues
 */
const displayIssues = (issues) => {
    mainContainer.innerHTML = "";
    
    if (issues.length === 0) {
        mainContainer.innerHTML = `<p class="text-gray-500 text-center col-span-full">কোনো ইস্যু পাওয়া যায়নি।</p>`;
        return;
    }

    issues.forEach(issue => {
        const cardDiv = document.createElement("div");
        cardDiv.className = `issue-card bg-base-100 shadow rounded-xl p-4 space-y-3 border-t-4 cursor-pointer 
                            ${issue.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500'}`;
        
        cardDiv.onclick = () => openModal(issue.id);
        
        cardDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="flex items-center gap-1">
                    <img class="w-6 h-6" src="${issue.status === 'open' ? '../assets/Open-Status.png' : '../assets/Closed-Status.png'}" alt="">
                </span>
                <span class="badge ${issue.priority === 'high' ? 'badge-error' : issue.priority === 'medium' ? 'badge-warning' : 'badge-neutral'} badge-outline">
                    ${issue.priority}
                </span>
            </div>
            <h2 class="font-semibold">${issue.title}</h2>
            <p class="text-sm text-gray-500 line-clamp-2">${issue.description}</p>
            <div class="flex flex-wrap gap-2">${createElements(issue.labels)}</div>
            <div class="border-t pt-2 text-xs text-gray-500 flex justify-between">
                <span>#${issue.id} by ${issue.author}</span>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        `;
        mainContainer.appendChild(cardDiv);
    });
};

/**
 * Tab Switching Logic
 */
const tabs = ["all", "open", "closed"];
function switchTab(select) {
    currentFilter = select;
    
    // UI Update: Tab active/inactive classes
    tabs.forEach(tab => {
        const tabBtn = document.getElementById("Select-" + tab);
        if (tab === select) {
            tabBtn.classList.add("bg-blue-800", "text-white");
            tabBtn.classList.remove("bg-transparent");
        } else {
            tabBtn.classList.remove("bg-blue-800", "text-white");
            tabBtn.classList.add("bg-transparent");
        }
    });

    // Data Filtering
    const filteredIssues = select === "all" 
        ? issuesData 
        : issuesData.filter(issue => issue.status === select);

    displayIssues(filteredIssues);
    issueCountElement.textContent = filteredIssues.length;
}

/**
 * Modal Logic
 */
async function openModal(id) {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;

        modalHandler.innerHTML = `
            <div class="modal-box w-11/22 max-w-2xl">
                <h2 class="text-xl font-bold">${issue.title}</h2>
                <div class="text-sm text-gray-500 mt-1">
                    <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-info'}">${issue.status}</span>
                    • Opened by <b>${issue.author}</b> • ${new Date(issue.createdAt).toLocaleDateString()}
                </div>
                <div class="flex gap-2 mt-3">${createElements(issue.labels)}</div>       
                <p class="mt-4 text-gray-700">${issue.description}</p>
                <div class="grid grid-cols-2 mt-6 text-sm border-t pt-4">
                    <div>
                        <p class="text-gray-500">Assignee:</p>
                        <p class="font-semibold">${issue.assignee || 'Not Assigned'}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Priority:</p>
                        <span class="badge ${issue.priority === 'high' ? 'badge-error' : 'badge-warning'} badge-outline">${issue.priority}</span>
                    </div>
                </div>
                <div class="modal-action">
                    <form method="dialog"><button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
                    <form method="dialog"><button class="btn btn-primary">Close</button></form>
                </div>
            </div>`;
        modalHandler.showModal();
    } catch (err) {
        console.error("Modal Error:", err);
    }
}

/**
 * Search Logic
 */
document.getElementById("search-btn").addEventListener("click", async () => {
    const inputValue = document.getElementById("input-search").value.trim().toLowerCase();
    if (!inputValue) return allIssues(); // খালি থাকলে সব দেখাবে

    manageSpinner(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputValue}`);
        const data = await res.json();
        
        // সার্চ রেজাল্টকে বর্তমান সিলেক্ট করা ট্যাব অনুযায়ী ফিল্টার করা (Optional)
        const results = data.data;
        displayIssues(results);
        issueCountElement.textContent = results.length;
    } catch (error) {
        console.error("Search failed:", error);
    } finally {
        manageSpinner(false);
    }
});

// Initialize
allIssues();