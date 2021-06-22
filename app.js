class App {
    constructor() {
        this.issues =  {
            open: {},
            closed: {}
        }
    }

    init() {
        this.bind();
    }

    bind() {
        document.addEventListener('DOMContentLoaded', () => {
            this.issueForm = document.querySelector('#issueForm');
            this.searchForm = document.querySelector('#searchForm');
            this.searchInput = document.querySelector("#search");
            this.badges = {
                open: document.querySelector('#badgeOpen'),
                closed: document.querySelector('#badgeClosed'),
                all: document.querySelector('#badgeAll')
            };
            this.lists = {
                open: document.querySelector('#issueListOpen'),
                closed: document.querySelector('#issueListClosed'),
                all: document.querySelector('#issueListAll')
            };

            this.searchForm.addEventListener('submit', event => {
                this.handleSearch(event);
            });
        
            this.issueForm.addEventListener('submit', event => {
                this.handleAddIssue(event);
            });
        });

        document.addEventListener('click', event => {
            if(event.target){
                if(event.target.classList.contains('nav-link')) {
                    this.handleClickTab(event);
                }
                else if(event.target.classList.contains('close-issue')) {
                    this.handleClickCloseIssue(event);
                }
                else if(event.target.classList.contains('delete-issue')) {
                    this.handleClickDeleteIssue(event);
                }
                else if(event.target.classList.contains('reopen-issue')) {
                    this.handleClickReopenIssue(event);
                }
                else if(event.target.classList.contains('clear-search')) {
                    this.handleClickClearSearch(event);
                }
            }
        });
    }

    updateBadges() {
        const opens = Object.keys(this.issues.open).length;
        const closed = Object.keys(this.issues.closed).length;
        this.badges.open.textContent = opens;
        this.badges.closed.textContent = closed;
        this.badges.all.textContent = opens + closed;

        if(opens > 0) {
            this.lists.open.querySelector('.default-message').classList.add('d-none');
        }
        else {
            this.lists.open.querySelector('.default-message').classList.remove('d-none');
        }

        if(closed > 0) {
            this.lists.closed.querySelector('.default-message').classList.add('d-none');
        }
        else {
            this.lists.closed.querySelector('.default-message').classList.remove('d-none');
        }

        if(opens + closed > 0) {
            this.lists.all.querySelector('.default-message').classList.add('d-none');
        }
        else {
            this.lists.all.querySelector('.default-message').classList.remove('d-none');
        }
    }

    handleClickTab(event) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        document.querySelectorAll('.issue-list').forEach(list => {
            list.classList.add('d-none');
        });

        event.target.classList.add('active');
        this.lists[event.target.dataset.list].classList.remove('d-none');
    }

    handleSearch(event) {
        event.preventDefault();

        const searchTerm = this.searchInput.value.trim();

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

    handleClickClearSearch(event) {
        this.searchInput.value = "";
        document.querySelectorAll(".issue").forEach(issue => {
            issue.classList.remove("d-none");
        });
    }

    handleClickCloseIssue(event) {
        let issue = event.target.closest('.issue');
        this.lists.open.querySelector(`.issue[data-id="${issue.dataset.id}"]`).remove();
        
        issue = this.lists.all.querySelector(`.issue[data-id="${issue.dataset.id}"]`);
        
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

        this.lists.closed.append(issue.cloneNode(true));

        this.issues.closed[issue.dataset.id] = this.issues.open[issue.dataset.id];
        delete this.issues.open[issue.dataset.id];

        this.updateBadges();
    }

    handleClickDeleteIssue(event) {
        const issue = event.target.closest('.issue');

        if(this.issues.open[issue.dataset.id]) {
            delete this.issues.open[issue.dataset.id];
        }
        else {
            delete this.issues.closed[issue.dataset.id];
        }

        document.querySelectorAll(`.issue-list .issue[data-id="${issue.dataset.id}"]`).forEach(issue => issue.remove());

        this.updateBadges();
    }

    handleClickReopenIssue(event) {
        let issue = event.target.closest('.issue');
        this.lists.closed.querySelector(`.issue[data-id="${issue.dataset.id}"]`).remove();

        issue = this.lists.all.querySelector(`.issue[data-id="${issue.dataset.id}"]`);
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

        this.lists.open.append(issue.cloneNode(true));

        this.issues.open[issue.dataset.id] = this.issues.closed[issue.dataset.id];
        delete this.issues.closed[issue.dataset.id];

        this.updateBadges();
    }

    handleAddIssue(event) {
        event.preventDefault();

        const issue = {
            id: uuidv4(),
            description: this.issueForm.elements['description'].value,
            severity: this.issueForm.elements['severity'].value,
            assignedTo: this.issueForm.elements['assigned_to'].value
        };

        this.issues.open[issue.id] = issue;

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

        this.lists.open.innerHTML += content;
        this.lists.all.innerHTML += content;

        this.updateBadges();

        this.issueForm.reset();
    }
}

new App().init();