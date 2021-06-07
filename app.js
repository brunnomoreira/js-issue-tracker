document.addEventListener('DOMContentLoaded', () => {
    const issueForm = document.querySelector('#issueForm');
    const searchForm = document.querySelector('#searchForm');

    const badges = {
        open: document.querySelector('#badgeOpen'),
        closed: document.querySelector('#badgeClosed'),
        all: document.querySelector('#badgeAll')
    }

    const lists = {
        open: document.querySelector('#issueListOpen'),
        closed: document.querySelector('#issueListClosed'),
        all: document.querySelector('#issueListAll')
    };

    const issues = {
        open: {},
        closed: {}
    }

    const search = document.querySelector("#search");

    const updateBadges = () => {
        const opens = Object.keys(issues.open).length;
        const closed = Object.keys(issues.closed).length;
        badges.open.textContent = opens;
        badges.closed.textContent = closed;
        badges.all.textContent = opens + closed;

        if(opens > 0) {
            lists.open.querySelector('.default-message').classList.add('d-none');
        }
        else {
            lists.open.querySelector('.default-message').classList.remove('d-none');
        }

        if(closed > 0) {
            lists.closed.querySelector('.default-message').classList.add('d-none');
        }
        else {
            lists.closed.querySelector('.default-message').classList.remove('d-none');
        }

        if(opens + closed > 0) {
            lists.all.querySelector('.default-message').classList.add('d-none');
        }
        else {
            lists.all.querySelector('.default-message').classList.remove('d-none');
        }
        
    }

    const handleClickTab = (event) => {
        document.querySelectorAll('.nav-link').forEach(nv => {
            nv.classList.remove('active');
        });

        document.querySelectorAll('.issue-list').forEach(dm => {
            dm.classList.add('d-none');
        });

        event.target.classList.add('active');
        lists[event.target.dataset.list].classList.remove('d-none');
    }

    const handleSearch = (event) => {
        event.preventDefault();

        const searchTerm = search.value.trim();

        document.querySelectorAll(".issue").forEach(issue => {
            const description = issue.querySelector(".issue-description");
            if(description.textContent.includes(searchTerm)) {
                issue.classList.remove("d-none");
            }
            else {
                issue.classList.add("d-none");
            }
        });
    }

    const handleClickClearSearch = (event) => {
        search.value = "";
        document.querySelectorAll(".issue").forEach(issue => {
            issue.classList.remove("d-none");
        });
    }

    const handleClickCloseIssue = (event) => {
        let issue = event.target.closest('.issue');
        lists.open.querySelector(`.issue[data-id="${issue.dataset.id}"]`).remove();
        
        issue = lists.all.querySelector(`.issue[data-id="${issue.dataset.id}"]`);
        
        const badge = issue.querySelector('.badge');
        badge.classList.remove('bg-info');
        badge.classList.add('bg-danger');
        badge.textContent = "Closed";

        const closeBtn = issue.querySelector('.close-issue');
        closeBtn.classList.remove('btn-success');
        closeBtn.classList.remove('close-issue');
        closeBtn.classList.add('btn-warning');
        closeBtn.classList.add('reopen-issue');
        closeBtn.textContent = "Reopen";

        lists.closed.append(issue.cloneNode(true));

        issues.closed[issue.dataset.id] = issues.open[issue.dataset.id];
        delete issues.open[issue.dataset.id];

        updateBadges();
    }

    const handleClickDeleteIssue = (event) => {
        const issue = event.target.closest('.issue');

        if(issues.open[issue.dataset.id]) {
            delete issues.open[issue.dataset.id];
        }
        else {
            delete issues.closed[issue.dataset.id];
        }

        document.querySelectorAll(`.issue-list .issue[data-id="${issue.dataset.id}"]`).forEach(issue => issue.remove());

        updateBadges();
    }

    const handleClickReopenIssue = (event) => {
        let issue = event.target.closest('.issue');
        lists.closed.querySelector(`.issue[data-id="${issue.dataset.id}"]`).remove();

        issue = lists.all.querySelector(`.issue[data-id="${issue.dataset.id}"]`);
        const badge = issue.querySelector('.badge');
        badge.classList.remove('bg-danger');
        badge.classList.add('bg-info');
        badge.textContent = "Open";

        const btnReopen = issue.querySelector('.reopen-issue');
        btnReopen.classList.remove('btn-warning');
        btnReopen.classList.remove('reopen-issue');
        btnReopen.classList.add('btn-success');
        btnReopen.classList.add('close-issue');
        btnReopen.textContent = "Close";

        lists.open.append(issue.cloneNode(true));

        issues.open[issue.dataset.id] = issues.closed[issue.dataset.id];
        delete issues.closed[issue.dataset.id];

        updateBadges();
    }

    const handleAddIssue = (event) => {
        event.preventDefault();

        const issue = {
            id: uuidv4(),
            description: issueForm.elements['description'].value,
            severity: issueForm.elements['severity'].value,
            assignedTo: issueForm.elements['assigned_to'].value
        };

        issues.open[issue.id] = issue;

        const content = `
            <div class="card mb-4 issue" data-id="${issue.id}">
                <div class="card-body">
                    <p class="h6 issue-id">Issue ID: ${issue.id}</p>
                    <p><span class="badge bg-info">Open</span></p>
                    <h5 class="card-title issue-description">${issue.description}</h5>
                    <p class="card-text">
                        <span class="issue-severity"><i class="bi bi-clock"></i> ${issue.severity}</span>
                        <span class="issue-assigned"><i class="bi bi-person-fill"></i> ${issue.assignedTo}</span>
                    </p>
                    <div>
                        <button type="button" class="btn btn-success close-issue">Close</button>
                        <button type="button" class="btn btn-danger delete-issue">Delete</button>
                    </div>
                </div>
            </div>
        `;

        lists.open.innerHTML += content;
        lists.all.innerHTML += content;

        updateBadges();

        issueForm.reset();
    }

    searchForm.addEventListener('submit', event => {
        handleSearch(event);
    });

    issueForm.addEventListener('submit', event => {
        handleAddIssue(event);
    });
    
    document.addEventListener('click', event => {
        if(event.target){
            if(event.target.classList.contains('nav-link')) {
                handleClickTab(event);
            }
            else if(event.target.classList.contains('close-issue')) {
                handleClickCloseIssue(event);
            }
            else if(event.target.classList.contains('delete-issue')) {
                handleClickDeleteIssue(event);
            }
            else if(event.target.classList.contains('reopen-issue')) {
                handleClickReopenIssue(event);
            }
            else if(event.target.classList.contains('clear-search')) {
                handleClickClearSearch(event);
            }
        }
    });
});