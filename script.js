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
          result = firstOperand/secondOperand.toPrecision(3);
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

function calculate(equation)
{
    equation = concatNumbers(equation);


    let firstOperand;
    let secondOperand;
    let operation;

    let firstOperandIndex;
    let secondOperandIndex; // for brackets

    let partialEquation;

    if(equation.length == 1 && typeof Number(equation[0]) == 'number') // for future change
    {
        return equation[0];
    }

    while(equation.length != 1)
    {
        if(equation.includes('('))
        {
            firstOperandIndex = equation.lastIndexOf('('); 
            secondOperandIndex = equation.indexOf(')', firstOperandIndex); 
            partialEquation = equation.slice(firstOperandIndex + 1,secondOperandIndex);

            firstOperand = partialEquation[0];
            operation = partialEquation[1]; 
            secondOperand = partialEquation[2]; 

            partialEquation = operate(operation,firstOperand,secondOperand).toString(); 

            equation.splice(firstOperandIndex, secondOperandIndex-firstOperandIndex + 1, partialEquation); 
            
            
        }

        else if(equation.includes('*')) 
        {
            firstOperandIndex = equation.indexOf('*');

            firstOperand = equation[firstOperandIndex-1]; 
            operation = equation[firstOperandIndex]; 
            secondOperand = equation[firstOperandIndex+1]; 

            partialEquation = operate(operation, firstOperand, secondOperand).toString();

            equation.splice(firstOperandIndex - 1, 3, partialEquation);
            
        }

        else if(equation.includes('/'))
        {
            firstOperandIndex = equation.indexOf('/');

            firstOperand = equation[firstOperandIndex-1]; 
            operation = equation[firstOperandIndex]; 
            secondOperand = equation[firstOperandIndex+1]; 

            partialEquation = operate(operation, firstOperand, secondOperand);

            equation.splice(firstOperandIndex - 1, 3, partialEquation);
            
        }

        else if(equation.includes('+'))
        {
            firstOperandIndex = equation.indexOf('+'); 

            firstOperand = equation[firstOperandIndex - 1]; 
            operation = equation[firstOperandIndex]; 
            secondOperand = equation[firstOperandIndex + 1]; 

            partialEquation = operate(operation, firstOperand, secondOperand).toString(); 

            equation.splice(firstOperandIndex-1, 3, partialEquation);
            
        }

        else if(equation.includes('-'))
        {
            firstOperandIndex = equation.indexOf('-'); 

            firstOperand = equation[firstOperandIndex - 1]; 
            operation = equation[firstOperandIndex];
            secondOperand = equation[firstOperandIndex + 1];

            partialEquation = operate(operation, firstOperand, secondOperand).toString();

            equation.splice(firstOperandIndex-1, 3, partialEquation);
            
        }
    }
    console.log(`equation is ${equation}`)
    return equation[0];
}

const buttons = document.querySelectorAll('button');

let equation = [];
let openingBracket = true;
let operators = ['+', '-', '*', '/'];

buttons.forEach((button => {
    button.addEventListener('click', () => {

        switch(button.value)
        {
            case '=':
                if(equation.length == 0)
                {
                    return;
                }
                display.textContent = calculate(equation);           
                return;

            case 'C':
                display.textContent = '';
                equation = [];
                return;

            case 'Del':
                if(equation.length == 1)
                {
                    display.textContent = '';
                    equation.pop();
                }
                else
                {
                    display.textContent = display.textContent.slice(0, -1);
                    equation.pop();
                }
                return;

            case '()':
                if(openingBracket)
                {
                    display.textContent += '(';
                    openingBracket = false;
                }
                else
                {
                    display.textContent += ')';
                    openingBracket = true;
                }
                return;
            
            case '.':
                display.textContent += '.';
                equation.push(button.value);

            

                
        }

        if(button.className == 'num')
        {
            display.textContent += button.value;
            equation.push(button.value);
        }
        
        else if(button.className == 'operator')
        {
            if(equation.length == 0 )
            {
                return;
            }

            if(operators.includes(equation[equation.length-1]) == true)
            {
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

