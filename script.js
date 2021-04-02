const buttons = document.querySelectorAll('button');

let equation = [];
let openingBracketCounter = 0;
let operators = ['+', '-', '*', '/', '('];

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

    //If we have eqaution with the form [-, number] we return -number;
    else if(equation.length == 2 && equation[0] == '-')
    {
        return `-${equation[1]}`;
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

            // If we have a number before '(' and no operations, add *
            if(isNumeric(equation[operationIndex - 1]) == true) 
            {
                equation.splice(operationIndex , 0, '*');
                operationIndex = equation.lastIndexOf('('); 
                closingBracketIndex = equation.indexOf(')', operationIndex);
            }

            // We add ')' till we have the same number of opening and closing brackets
            if(openingBracketCounter != closingBracketCounter) 
            {
                closingBracketCounter++;
                equation.push(')');
            }
            
            // Caluclate what is inside the brackets 
            else 
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

buttons.forEach((button => {
    button.addEventListener('click', () => {

        switch(button.value)
        {
            case '=':
                if(equation.length == 0)
                {
                    return;
                }

                //***EDGE CASES***//


                if(equation[equation.length - 2] == '(' && equation[equation.length - 1] == '-')
                {
                    equation[equation.length - 1] = '-1';
                }

                // If there is no number after operator we add 0
                else if(['+', '-', '*', '/'].includes(equation[equation.length - 1])) 
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

                else if(equation[equation.length - 1] == ')')
                {
                    openingBracketCounter++;
                }
                display.textContent = display.textContent.slice(0, -1);
                equation.pop();
                return;

            case '()':
                if(equation[equation.length - 1] != '(' 
                && openingBracketCounter != 0 
                && ['+', '-', '*', '/'].includes(equation[equation.length - 1]) == false)
                {
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
                if(equation[equation.length - 1] == '.')
                {
                    return;
                }
                display.textContent += '.';
                equation.push(button.value);
                return;

            case '+/-':
                if(equation[equation.length - 1] == '-' && equation[equation.length - 2] == '(')
                {
                    equation.splice(-1 , 2);
                    display.textContent = display.textContent.slice(0, -2);
                    openingBracketCounter--;
                    return;
                }

                equation.splice(equation.length, 0 , '(', '-');
                display.textContent += '(-';
                openingBracketCounter++;
                return;
                   
        }

        // Adding numbers to the caluclator
        if(button.className == 'num') 
        {
            // Adding negative numbers to the equation
            if(equation[equation.length - 1] == '-' 
            && isNumeric(equation[equation.length - 2]) == false 
            && equation[equation.length - 2] != ')') 
            {
                equation.splice(equation.length - 1, 1, '-' + button.value);
                display.textContent += button.value;
            }
            else
            {
                display.textContent += button.value;
                equation.push(button.value);
            }
        }
        
        else if(button.className == 'operator')
        {
            // Can't start calculating with a operator
            if(equation.length == 0 ) 
            {
                return;
            }

            // Changing the current operator to another one
            if(operators.includes(equation[equation.length-1]) == true) 
            {
                if(equation[equation.length - 1] == '(' || (equation[equation.length - 2] == '(' && equation[equation.length - 1] == '-'))
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

