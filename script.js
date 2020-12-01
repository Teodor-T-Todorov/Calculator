const buttons = document.querySelectorAll('button');

let equation = [];
let openingBracketCounter = 0;
let operators = ['+', '-', '*', '/', '('];

buttons.forEach((button => {
    button.addEventListener('click', () => {

        switch(button.value)
        {
            case '=':
                if(equation.length == 0)
                {
                    return;
                }

                if(['+', '-', '*', '/'].includes(equation[equation.length - 1])) // If there is no number after operator we add 0
                {
                    equation.push('0');
                }
                display.textContent = calculate(equation);           
                return;

            case 'C':
                display.textContent = '';
                equation = [];
                openingBracketCounter = 0;
                return;

            case 'Del':
                if(equation[equation.length - 1] == '(')
                {
                    openingBracketCounter--;
                }
                display.textContent = display.textContent.slice(0, -1);
                equation.pop();
                return;

            case '()':
                if(equation[equation.length - 1] != '(' 
                && openingBracketCounter != 0 
                && ['+', '-', '*', '/'].includes(equation[equation.length - 1]) == false)
                {
                    if(['+', '-', '*', '/'].includes(equation[equation.length - 1])) // If there is no number after operator we add 0
                    {
                        equation.push('0');
                    }
                    
                    display.textContent += ')';
                    equation.push(')');
                    openingBracketCounter--;
                    return;
                }

                display.textContent += '(';
                equation.push('(');
                openingBracketCounter++;
                return;
            
            case '.':
                display.textContent += '.';
                equation.push(button.value);

            case '+/-':
              
                equation.splice(equation.length , 0 , '(', '-', '1', ')');
                display.textContent += '(-1)';
                   

                
        }

        if(button.className == 'num') // Adding numbers to the caluclator
        {
            display.textContent += button.value;
            equation.push(button.value);
        }
        
        else if(button.className == 'operator')
        {
            if(equation.length == 0 ) // Can't start calculating with a operator
            {
                return;
            }

            if(operators.includes(equation[equation.length-1]) == true) // Changing the current operator
            {
                if(equation[equation.length - 1] == '(')
                {
                    return;
                }
                equation[equation.length-1] = button.value;

                display.textContent = display.textContent.slice(0, -1);
                display.textContent += button.value;
                return;
            }

            display.textContent += button.value;
            equation.push(button.value);
        }
        
        console.log(equation)
    })
    
}))

function operate(operation,firstOperand, secondOperand)
{
    let result;
    firstOperand = parseFloat(firstOperand);
    secondOperand = parseFloat(secondOperand);

    switch(operation)
    {
      case '+':
          result = firstOperand+secondOperand;
          break;

      case '-':
          result = firstOperand-secondOperand;
          break; 
          
      case '*':
          result = firstOperand*secondOperand;
          break;

      case '/':
          result = (firstOperand/secondOperand).toFixed(2);
          break;
        
      case '%':
          result = firstOperand%secondOperand;
          break;    
    }

    return result;
}

function concatNumbers(equation)
{
    let operators = ['+', '-', '*', '/', '(', ')'];
    let i = 0;

    while(i+1 != equation.length)
    {
        if((operators.includes(equation[i]) == false) && (operators.includes(equation[i+1]) == false) && (equation[i+1] != undefined))
        {
            equation.splice(i, 2, equation[i]+equation[i+1]);
        }

        if((operators.includes(equation[i])) == true || (operators.includes(equation[i+1]) == true ))
        {
            i++;
        }
    }
    return equation;
}

function isNumeric(num) // Check if current element is a number
{
    return !isNaN(num);
}

function calculate(equation)
{
    equation = concatNumbers(equation);
    if(equation.length == 1)
    {
        return equation[0];
    }

    let firstOperand;
    let secondOperand;
    let operation;

    let operationIndex;
    let closingBracketIndex; // for brackets

    let partialEquation;

    if(equation.length == 1)
    {
        return equation[0];
    }

    if(equation.length == 2 && equation[0] == '-')
    {
        return '-1';
    }

    let openingBracketCounter = 0;
    let closingBracketCounter = 0

    if(equation.includes('('))
    {
        for(let i = 0; i < equation.length; i++)
        {
            if(equation[i] == '(')
            {
                openingBracketCounter++;
            }
    
            if(equation[i] == ')')
            { 
                closingBracketCounter++;
            }
        }
    }

    while(equation.length != 1)
    {

        if(equation.includes('('))
        {    
            operationIndex = equation.lastIndexOf('('); 
            closingBracketIndex = equation.indexOf(')', operationIndex);

            if(isNumeric(equation[operationIndex - 1]) == true) // If we have a number before '(' and no operations, add *
            {
                equation.splice(operationIndex , 0, '*');
                operationIndex = equation.lastIndexOf('('); 
                closingBracketIndex = equation.indexOf(')', operationIndex);
            }

            if(openingBracketCounter != closingBracketCounter) // We add ')' till we have the same number of opening and closing brackets
            {
                closingBracketCounter++;
                equation.push(')');
            }
            
            else // Caluclate what is inside the brackets 
            {
                partialEquation = equation.slice(operationIndex + 1,closingBracketIndex);
                partialEquation = calculate(partialEquation);
    
                equation.splice(operationIndex, closingBracketIndex-operationIndex + 1, partialEquation); 

                if(isNumeric(equation[operationIndex]) == true && isNumeric(equation[operationIndex + 1]) == true) // (5)2 -> 5*2
                {
                    equation.splice(operationIndex + 1, 0 , '*');
                }
                
            }
        }

        else if(equation.includes('*') || equation.includes('/')) 
        {
            if(((equation.indexOf('*') <= Math.abs(equation.indexOf('/'))) && (equation.indexOf('*') != -1 )) || equation.indexOf('/') == -1)
            {
                operationIndex = equation.indexOf('*');

                firstOperand = equation[operationIndex-1]; 
                operation = equation[operationIndex]; 
                secondOperand = equation[operationIndex+1]; 
    
                partialEquation = operate(operation, firstOperand, secondOperand);
    
                equation.splice(operationIndex - 1, 3, partialEquation);
            }
            
            else if(((equation.indexOf('/') <= Math.abs(equation.indexOf('*'))) && (equation.indexOf('/') != -1 )) || equation.indexOf('*') == -1)
            {
                operationIndex = equation.indexOf('/');

                firstOperand = equation[operationIndex-1]; 
                operation = equation[operationIndex]; 
                secondOperand = equation[operationIndex+1]; 

                partialEquation = operate(operation, firstOperand, secondOperand);

                equation.splice(operationIndex - 1, 3, partialEquation);
            }
            
        }

        else if(equation.includes('+'))
        {
            operationIndex = equation.indexOf('+'); 

            firstOperand = equation[operationIndex - 1]; 
            operation = equation[operationIndex]; 
            secondOperand = equation[operationIndex + 1]; 

            partialEquation = operate(operation, firstOperand, secondOperand); 

            equation.splice(operationIndex-1, 3, partialEquation);
            
        }

        else if(equation.includes('-'))
        {
            operationIndex = equation.indexOf('-'); 

            firstOperand = equation[operationIndex - 1]; 
            operation = equation[operationIndex];
            secondOperand = equation[operationIndex + 1];

            partialEquation = operate(operation, firstOperand, secondOperand);

            equation.splice(operationIndex-1, 3, partialEquation);
            
        }
    }
    console.log(`equation is ${equation}`)
    return equation[0];
}
