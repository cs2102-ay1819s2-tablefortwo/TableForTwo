function check(event) {
    // Get Values
    var name = document.getElementById('name').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Simple Check
    if (name.length == 0 || username.length == 0 || password.length == 0) {
        alert("All fields cannot be empty");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}