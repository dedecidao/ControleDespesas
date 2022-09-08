//Pegando as referencias dos elementos HTML

const transactionUL = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus') // Pegando o elemento com id money-plus q exibe total
const expenseDisplay = document.querySelector('#money-minus') // Pegando o elemento com id money-minus q exibe total
const balanceDisplay = document.querySelector('#balance')

//Form References

const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')


const inputTransactionAmount = document.querySelector('#amount')



// let transactions = [
//     {id: 1, name: 'Bolo', amount: -20},
//     {id: 2, name: 'Salario', amount: 300},
//     {id: 3, name: 'Torta de Frango', amount: 10},
//     {id: 4, name: 'Violão', amount: -20},
//     {id: 5, name: 'Guitarra', amount: -20},
// ]


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []    

const removeTransaction = ID => {
    // Filtrando o array transactions e retornando um array com todos os elementos que o id seja diferente do ID passado como parametro
    transactions = transactions.filter(transaction => transaction.id !== ID) 
    updateLocalStorage()
    init()
}



const addTransactionIntoDOM = transaction => {
    
    const operator = transaction.amount < 0 ? '-' : '+' // Se o valor for menor que 0, o operador será - senão será +
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus' // Se o valor for menor que 0, a classe será minus senão será plus
    const amountWithoutOperator = Math.abs(transaction.amount) // Math.abs retorna o valor absoluto, ou seja, o valor sem o sinal de menos
    const li = document.createElement('li') // Criando um elemento li

    li.classList.add(CSSClass) // Adicionando a classe no elemento li
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span> 
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    ` 
    transactionUL.prepend(li) // Adicionando o elemento li (OBJECT JAVASCRITP) no elemento ul (OBJECT JAVASCRITP)
}



const updateBalanceValues = () => {
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount) // Percorrento o transactions e retornando um array com os valores de amount  
    const total = transactionsAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2) // Somando todos os valores do array transactionsAmounts
    
    const income = transactionsAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2) // Filtrando os valores maiores que 0 e somando todos os valores do array transactionsAmounts

    const expense = Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0)
    ).toFixed(2)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}


//Init vai adicionar as transacoes no DOM assim que a pagina for carregada
const init = () => {
    transactionUL.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
    
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
    
    event.preventDefault() // Previne o comportamento padrão do submit, que é recarregar a pagina

    // Pegando os valores dos inputs q estão no form
    let nameTransaction = inputTransactionName.value.trim() 
    let valueTransaction = inputTransactionAmount.value.trim() 
    console.log(nameTransaction, valueTransaction)

    if(nameTransaction == '' || valueTransaction == '' ||  valueTransaction == NaN) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return //para a execução do código de event listener
    }
    //form foi preenchiido corretamente
    
    const transaction = {
        id: generateID(),
        name: nameTransaction,
        amount: Number(valueTransaction)
    }
    transactions.push(transaction)
    init()
    updateLocalStorage()
    //Limpar os campos
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
})
