const createElements = (arr) => {
    const htmlElements = arr.map((el) =>
        `<span class="badge badge-warning badge-outline">${el}</span>`
    );
    return htmlElements.join("");
};

const allIssues = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(json => displayIssues(json.data));
};

const displayIssues = (issues) => {
    const allContainer = document.getElementById("all-container");

    allContainer.innerHTML = "";

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

        allContainer.appendChild(cardDiv);

    });
};

allIssues();