function check(event) {
    // Get Values
    var name = document.getElementById('loginName').value;
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    // Simple Check
    if (name.length == 0 || username.length == 0 || password.length == 0) {
        alert("All fields cannot be empty");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
