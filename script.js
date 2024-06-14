/* 계산기 버튼 구성 요소들 */
const data = ["(", ")", "C", "%", "7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", '.', "0", "＝", "+"];

window.onload = function () {
    for (let i = 0; i < data.length; i++)
        create(i);
}

/* 버튼 생성 */
function create(i) {
    let btn = document.createElement("button");
    btn.append(data[i]);

    /* 연산자라면 */
    if (isNaN(data[i]))
        btn.className = "operator";
    
    /* 피연산자 즉, 숫자라면 */
    else
        btn.className = "operand";

    document.getElementById("container").appendChild(btn);

    btn.addEventListener("click", function () {
        if (data[i] == "C")
            document.getElementById("input").value = "";
        else if (data[i] == "＝") {
            let input = document.getElementById("input").value;
            if (!input)     //아무것도 입력을 하지 않을 경우
                alert("Please fill in the blank");
            else
                result();
        }
        else
            document.getElementById("input").value += data[i];
    })
}

/* 후위 표기법으로 변환 후 계산 */
function result() {
    let input = document.getElementById("input").value;
    input = input.replace(/(\s*)/g, "");    //공백문자 제거
    let history = input + "=";              //기록 용도

    let stack = [];         //연산자 임시 저장 및 후위 표기법 계산 결과 저장
    let convert = [];       //후위 표기법 저장
    let temp = "";          //입력된 수 임시 저장

    for (let i = 0; i < input.length; i++) {
        let token = input[i];
        if (!isNaN(token) || token == '.') {
            temp += token;
            if ((isNaN(input[i + 1]) || (i + 1 == input.length)) && input[i + 1] != '.') {
                convert.push(temp);
                temp = ""
            }
        }
        else {
            switch (token) {
                case '(':
                    stack.push(token);
                    break;
                case ')':
                    while (1) {
                        let popOP = stack.pop();
                        if (popOP == '(')
                            break;
                        convert.push(popOP);
                    }
                    break;
                case '+':
                case '-':
                case '×':
                case '*':
                case '÷':
                case '/':
                case '%':
                    while (stack.length && WhoPrecOp(stack[stack.length - 1], token) >= 0) {
                        convert.push(stack.pop());
                    }
                    stack.push(token);
                    break;
            }
        }
    }
    while (stack.length != 0) {
        convert.push(stack.pop());
    }

    for (let i = 0; i < convert.length; i++) {
        let token = convert[i];

        if (!isNaN(token)) {
            stack.push(token);
        }
        else {
            let op2 = Number(stack.pop());
            let op1 = Number(stack.pop());

            if (!op1) op1 = 0;
            
            switch (token) {
                case '+':
                    stack.push(op1 + op2);
                    break;
                case '-':
                    stack.push(op1 - op2);
                    break;
                case '×':
                case '*':
                    stack.push(op1 * op2);
                    break;
                case '÷':
                case '/':
                    stack.push(op1 / op2);
                    break;
                case '%':
                    stack.push(op1 * op2 / 100);
                    break;
            }
        }
    }
    document.getElementById("input").value = stack;

    history += stack;
    record(history)
}

/* 계산 과정 및 결과 기록 */
function record(result) {
    let p = document.createElement("p");
    p.append(result);
    document.getElementById("record").prepend(p);
}

/* 연산자 순위 */
function GetOpPrec(op) {
    switch (op) {
        case '×':
        case '*':
        case '÷':
        case '/':
        case '%':
            return 5;
        case '+':
        case '-':
            return 3;
        case '(':
            return 1;
    }
    return -1;
}

/* 연산자 순위 비교 */
function WhoPrecOp(op1, op2) {
    op1Prec = GetOpPrec(op1);
    op2Prec = GetOpPrec(op2);

    if (op1Prec > op2Prec)
        return 1;
    else if (op1Prec < op2Prec)
        return -1;
    else
        return 0;
}

/* CE 버튼 event */
function clearEntry() {
    let input = document.getElementById("input").value;
    input = input.substr(0, input.length - 1)
    document.getElementById("input").value = input;
}

/* Enter키 이벤트 */
function enter(event) {
    if (event.keyCode == 13) {
        result();
    }
}

/* 연산 과정 및 결과 기록 보이게 하기 */
let flag = 0;
function show() {
    if (!flag)
        document.getElementById('history').classList.toggle('show');
    else
        document.getElementById('history').classList.remove('show');
}