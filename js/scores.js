function main() {
    const difficulty = findGetParameter("difficulty");
    Object
        .keys(window.localStorage)
        .forEach(key => processLeaderTableRecord(key, difficulty));
    highlightName(findGetParameter("name"));
}

function processLeaderTableRecord(key, difficulty) {
    let name = key;
    let data = JSON.parse(window.localStorage.getItem(name));

    if (+data.difficulty !== +difficulty) {
        return;
    }

    const table = document.getElementById("leadersTable");
    const tbody = table.getElementsByTagName('tbody')[0];
    let newRow = tbody.insertRow();
    let nameCell = newRow.insertCell();
    nameCell.innerHTML = name;
    let timeCell = newRow.insertCell();
    timeCell.innerHTML = data.timePassed;
    let movesCell = newRow.insertCell();
    movesCell.innerHTML = data.turns;
}

function highlightName(name) {
    document
        .getElementById("leadersTable")
        .getElementsByTagName("tbody")[0]
        .childNodes
        .forEach(tr => {
            tr.childNodes.forEach(td => {
                if (td.textContent === name) {
                    tr.classList.add('highlightedRow');
                }
            })
        });
}