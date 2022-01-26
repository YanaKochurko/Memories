function main() {
    const difficulty = findGetParameter("difficulty");
    Object
        .keys(window.localStorage)
        .forEach(key => processLeaderTableRecord(key, difficulty));
    highlightName(findGetParameter("name"));
}

function processLeaderTableRecord(key, difficulty) {
    let name = key;
    console.log(window.localStorage.getItem(name));
    let data = JSON.parse(window.localStorage.getItem(name));

    console.log(+data.difficulty + " + " + difficulty);

    if (+data.difficulty !== +difficulty) {
        return;
    }

    let tr = document.createElement("tr");
    let nameTd = document.createElement("td");
    nameTd.innerHTML = name;
    let timeTd = document.createElement("td");
    timeTd.innerHTML = data.timePassed;
    let movesTd = document.createElement("td");
    movesTd.innerHTML = data.turns;

    tr.appendChild(nameTd);
    tr.appendChild(timeTd);
    tr.appendChild(movesTd);

    const table = document.getElementById("leadersTable");
    table.appendChild(tr);
}

function highlightName(name) {
    document.getElementById("leadersTable")
        .childNodes
        .forEach(tr => {
            tr.childNodes.forEach(td => {
                if (td.textContent === name) {
                    tr.classList.add('highlightedRow');
                }
            })
        });
}