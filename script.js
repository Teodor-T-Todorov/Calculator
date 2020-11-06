const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');

buttons.forEach((button => {
    button.addEventListener('click', () => {
        
        display.textContent += button.value;

    })
    
}))

