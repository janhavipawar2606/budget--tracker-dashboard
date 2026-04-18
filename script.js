// Get transactions from browser storage (or start with default ones)
let transactions = JSON.parse(localStorage.getItem('transactions')) || [
    { id: 1, name: 'Salary Credit', amount: 75000, type: 'income', icon: 'salary', date: 'Oct 1, 2025' },
    { id: 2, name: 'Swiggy Order', amount: 450, type: 'expense', icon: 'food', date: 'Today, 9:30 AM' },
    { id: 3, name: 'Amazon Shopping', amount: 2500, type: 'expense', icon: 'shopping', date: 'Yesterday' },
    { id: 4, name: 'Ola Cab', amount: 320, type: 'expense', icon: 'transport', date: 'Yesterday' },
    { id: 5, name: 'Freelance Work', amount: 15000, type: 'income', icon: 'salary', date: 'Oct 5, 2025' }
];

// ===== Format amount in Indian Rupees =====
function formatIndianRupees(amount) {
    return '₹' + amount.toLocaleString('en-IN', { 
        maximumFractionDigits: 2,
        minimumFractionDigits: 0 
    });
}

// ===== Open Modal =====
function openModal() {
    document.getElementById('modal').classList.add('active');
}

// ===== Close Modal =====
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    // Clear input fields
    document.getElementById('transName').value = '';
    document.getElementById('transAmount').value = '';
}

// ===== Add New Transaction =====
function addTransaction() {
    const name = document.getElementById('transName').value;
    const amount = parseFloat(document.getElementById('transAmount').value);
    const type = document.getElementById('transType').value;

    // Check if fields are empty
    if (name === '' || isNaN(amount) || amount <= 0) {
        alert('Please fill all fields correctly!');
        return;
    }

    // Create new transaction object
    const newTransaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        type: type,
        icon: type === 'income' ? 'salary' : 'shopping',
        date: 'Just now'
    };

    // Add to transactions array
    transactions.unshift(newTransaction);
    
    // Save to browser storage
    saveTransactions();
    
    // Update the page
    displayTransactions();
    updateSummary();
    
    // Close modal
    closeModal();
}

// ===== Delete Transaction =====
function deleteTransaction(id) {
    transactions = transactions.filter(trans => trans.id !== id);
    saveTransactions();
    displayTransactions();
    updateSummary();
}

// ===== Save to Browser Storage =====
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== Display All Transactions =====
function displayTransactions() {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    // Icon map for different transaction types
    const iconMap = {
        food: 'fa-utensils',
        salary: 'fa-indian-rupee-sign',
        shopping: 'fa-cart-shopping',
        transport: 'fa-taxi',
        savings: 'fa-piggy-bank'
    };

    transactions.forEach(trans => {
        const sign = trans.type === 'income' ? '+' : '-';
        const amountClass = trans.type === 'income' ? 'plus' : 'minus';
        
        list.innerHTML += `
            <div class="transaction">
                <div class="trans-icon ${trans.icon}">
                    <i class="fa-solid ${iconMap[trans.icon] || 'fa-indian-rupee-sign'}"></i>
                </div>
                <div class="trans-details">
                    <h4>${trans.name}</h4>
                    <p>${trans.date}</p>
                </div>
                <span class="amount ${amountClass}">${sign}${formatIndianRupees(trans.amount)}</span>
                <button class="delete-btn" onclick="deleteTransaction(${trans.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });
}

// ===== Update Summary Cards =====
function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(trans => {
        if (trans.type === 'income') {
            income += trans.amount;
        } else {
            expense += trans.amount;
        }
    });

    const balance = income - expense;
    const savings = balance * 0.3; // 30% of balance as savings

    // Update card values
    document.querySelector('.card.income h2').innerText = formatIndianRupees(income);
    document.querySelector('.card.expense h2').innerText = formatIndianRupees(expense);
    document.querySelector('.card.savings h2').innerText = formatIndianRupees(savings);
    document.querySelector('.card.balance h2').innerText = formatIndianRupees(balance);
}

// ===== Initialize when page loads =====
displayTransactions();
updateSummary();