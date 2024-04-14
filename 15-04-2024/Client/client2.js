async function ins() {
    event.preventDefault(); // Prevent the default form submission
    
    const username = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    
    const data = { username, password }; // Data to send to the server
    
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convert data to JSON string
        });
        
        if (response.ok) {
            window.location.href = 'home.html'; 
            alert('Success');
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred');
    }
}