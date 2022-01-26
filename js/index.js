function main() {
    let submitButton = document.getElementById("submitButton");

    submitButton.addEventListener("click", function() {
        let nameInput = document.getElementById("nameInput");
        if (nameInput.value.trim() === "") {
            alert("Введите имя");
            return;
        }
        let easyCheckBox = document.getElementById("easyDiff");
        let mediumCheckBox = document.getElementById("mediumDiff");
        let hardCheckBox = document.getElementById("hardDiff");

        if (!easyCheckBox.checked && !mediumCheckBox.checked && !hardCheckBox.checked) {
            alert("Выберите уровень сложности");
            return;
        }

        document.getElementById("startingForm").submit();
    });
}