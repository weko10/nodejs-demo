let tbl = document.getElementById("table");
let tblBody = document.getElementById("tbody");

const getNthParentOf = (elem, i) => {
    while (i > 0) {
        elem = elem.parentElement;
        i--;
    }
    return elem;
};

const setupTable = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/admin/users", true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            //creating all cells
            res.forEach(elem => {
                let row = document.createElement("tr");

                //creates a cell per column property
                let cellId = document.createElement("td");
                let cellUsername = document.createElement("td");
                let cellEmail = document.createElement("td");
                let cellPhone = document.createElement("td");
                let cellAddress = document.createElement("td");

                //add text to each cell
                cellId.innerText = elem.id;
                cellUsername.innerText = elem.username;
                cellEmail.innerText = elem.email;
                cellPhone.innerText = elem.phone;
                cellAddress.innerText = elem.address;

                row.appendChild(cellId);
                row.appendChild(cellUsername);
                row.appendChild(cellEmail);
                row.appendChild(cellPhone);
                row.appendChild(cellAddress);

                //add actions cell
                let cellActions = document.createElement("td");
                let actionButtonDelete = document.createElement("button");
                actionButtonDelete.className = "actionButtons deleteButtons";
                actionButtonDelete.innerText = "Delete";
                actionButtonDelete.dataset.userId = elem.id;

                actionButtonDelete.addEventListener("click", () => {
                    const xhr = new XMLHttpRequest();
                    let reqUrl = `http://localhost:3000/admin/delete/${actionButtonDelete.dataset.userId}`;
                    xhr.open("DELETE", reqUrl, true);

                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            let deletedRow = getNthParentOf(actionButtonDelete, 2);
                            deletedRow.remove();
                        }
                    };
                    xhr.send();
                });

                cellActions.appendChild(actionButtonDelete);

                row.appendChild(cellActions);

                //add the row to the end of the table body
                tblBody.appendChild(row);
            });
        }
    };
    xhr.send();
};
document.addEventListener("DOMContentLoaded", setupTable);
