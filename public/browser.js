document.addEventListener('click', function(e) {
    // Update Feature
    if (e.target.classList.contains('edit-me')) {
        let userInput = prompt("Enter your new text here", e.target.parentElement.parentElement.querySelector('.text-item').innerHTML)
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute('data-id')}).then(function() {
            e.target.parentElement.parentElement.querySelector('.text-item').innerHTML = userInput
        }).catch(function() {
            console.log("Please try again later")
        })
    }
})