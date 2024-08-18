async function loadTitle() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        document.getElementById('title').textContent = data.title;
    } catch (error) {
        console.error('Error loading title:', error);
    }
}

loadTitle();