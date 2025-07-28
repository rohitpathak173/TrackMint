const form = document.getElementById('form');
const list = document.getElementById('list');
const balance = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('trackmint_data')) || [];

function updateLocalStorage() {
  localStorage.setItem('trackmint_data', JSON.stringify(transactions));
}

function updateBalance() {
  let total = 0;
  transactions.forEach(t => {
    total += t.type === 'income' ? t.amount : -t.amount;
  });
  balance.innerText = total.toFixed(2);
}

function renderTransactions() {
  list.innerHTML = '';
  transactions.forEach((tx, index) => {
    const sign = tx.type === 'income' ? '+' : '-';
    const li = document.createElement('li');
    li.textContent = `${tx.desc} | ${sign}₹${tx.amount}`;
    list.appendChild(li);
  });
  updateBalance();
  updateChart();
}

function updateChart() {
  const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Money Flow',
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = document.getElementById('desc').value;
  const amount = +document.getElementById('amount').value;
  const type = document.getElementById('type').value;

  transactions.push({ desc, amount, type });
  updateLocalStorage();
  renderTransactions();
  form.reset();
});

renderTransactions();
