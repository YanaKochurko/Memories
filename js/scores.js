function main() {
    const difficulty = +findGetParameter("difficulty");
    fetchRecords(difficulty);
}

function fetchRecords(difficulty) {
    let request = new XMLHttpRequest();
    request.open("GET", "https://memories-b055.restdb.io/rest/memories-players");
    request.setRequestHeader("x-apikey", "638b381dc890f30a8fd1f6f5");
    request.onload = () => {
        console.log(request.response)
        let data = JSON.parse(request.response)
            .filter(stat => stat.difficulty === difficulty)
            .sort((stat1, stat2) => stat1.timePassed - stat2.timePassed);
        processLeaderTableRecords(data);
        highlightName(findGetParameter("name"));
    };
    request.onerror = () => {
        alert("Произошла ошибка, повторите попытку позже");
        console.log(request.response);
    }
    request.send();
}

function processLeaderTableRecords(data) {
    const table = document.getElementById("leadersTable");
    const tbody = table.getElementsByTagName('tbody')[0];
    data.forEach(stat => {
        let newRow = tbody.insertRow();
        let nameCell = newRow.insertCell();
        nameCell.innerHTML = stat.name;
        let timeCell = newRow.insertCell();
        timeCell.innerHTML = stat.timePassed;
        let movesCell = newRow.insertCell();
        movesCell.innerHTML = stat.turns;
    })
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


