document.getElementById("regFormid").addEventListener("submit", async function(event) {
    event.preventDefault(); 
    
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const password = document.getElementById("password").value;
    
    const data = { name, age, password }; 
    
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        });
        
        if (response.ok) {
            alert('Data added successfully');
            window.location.href = 'home.html';
        } else {
            alert('An error occurred');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred');
    }
});
