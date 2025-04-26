// Expense array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expensesList = document.getElementById('expenses');
const chartCanvas = document.getElementById('expense-chart').getContext('2d');

// Add Expense
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (description && amount && category && date) {
        const expense = { description, amount, category, date };
        expenses.push(expense);
        saveAndRender();
        expenseForm.reset();
    }
});

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    renderChart();
}

// Render Expenses List
function renderExpenses() {
    expensesList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.date} - <strong>${expense.category}</strong> : ${expense.description} - $${expense.amount.toFixed(2)}
            <button onclick="deleteExpense(${index})" style="float:right; background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">X</button>
        `;
        expensesList.appendChild(li);
    });
}

// Delete Expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveAndRender();
}

// Render Chart
function renderChart() {
    const categoryTotals = {};

    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: amounts,
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FFC107',
                    '#FF5722',
                    '#9C27B0'
                ],
                borderWidth: 1
            }]
        }
    });
}

// Initialize
saveAndRender();
