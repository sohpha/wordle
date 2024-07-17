document.addEventListener('DOMContentLoaded', () => {
document.getElementById('returnButton').addEventListener('click', function() {
    // Navigate to the previous page using JavaScript
    window.history.back(); // This will take the user back to the previous page in history
});
})

fetch('game.php')
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        topStreaks = data.topStreaks;
        console.log("leaderboard streaks: ", topStreaks);

        // sort by most consucitve wins
        topStreaks = topStreaks.sort((a, b) => b - a);
        updateLeaderboard(topStreaks);

    })
    .catch(error => console.error('Error fetching data:', error));


function updateLeaderboard(topStreaks) {

    const table = document.getElementById('streakTable');

    // Clear existing table 
    table.innerHTML = '';

    // table headers
    const headerRow = table.insertRow();
    const headers = ['Rank', '# of Consecutive wins'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        const textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });

    // Display top 10 streaks
    for (let i = 0; i < Math.min(10, topStreaks.length); i++) {
        const row = table.insertRow();
        const rankCell = row.insertCell();
        rankCell.textContent = i + 1; // from rank 1
        const streakCell = row.insertCell();
        streakCell.textContent = topStreaks[i];
    }


}