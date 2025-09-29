const votes = {
    'JavaScript': 0,
    'Python': 0,
    'Java': 0,
    'C++': 0
};

function vote(language) {
    votes[language]++;
    updateVotes();
    
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function updateVotes() {
    const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
    
    Object.keys(votes).forEach(language => {
        const voteElement = document.getElementById(language);
        const progressElement = document.getElementById(`progress-${language}`);
        
        voteElement.textContent = votes[language];
        
        const percentage = totalVotes > 0 ? (votes[language] / totalVotes) * 100 : 0;
        progressElement.style.width = percentage + '%';
    });
    
    document.getElementById('total-votes').textContent = totalVotes;
}

function simulateRealTimeVoting() {
    const languages = Object.keys(votes);
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
    
    votes[randomLanguage]++;
    updateVotes();
    
    const resultItem = document.querySelector(`#${randomLanguage}`).closest('.result-item');
    resultItem.style.background = '#e3f2fd';
    setTimeout(() => {
        resultItem.style.background = '#f8f9fa';
    }, 500);
}

updateVotes();

setInterval(simulateRealTimeVoting, 2000);