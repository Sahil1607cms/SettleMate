# SettleMate 💰

A modern React-based web application for managing group expenses and simplifying debt settlements among friends, roommates, or any group of people.

## 🚀 Features

- **Group Management**: Create and manage multiple groups with custom purposes
- **Expense Tracking**: Add transactions with detailed expense information
- **Flexible Splitting**: Support for equal and custom split options
- **Debt Visualization**: Interactive debt graph showing who owes what to whom
- **Smart Settlements**: Automatic calculation of optimal debt settlements to minimize transactions
- **Local Storage**: Data persistence using browser localStorage
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19.0.0
- **Routing**: React Router DOM 7.4.1
- **Styling**: Tailwind CSS 4.0.14
- **Build Tool**: Vite 6.2.0
- **Linting**: ESLint 9.21.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahil1607cms/SettleMate.git
   cd SettleMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🎯 Usage

### Creating a Group
1. Enter a group name and purpose
2. Specify the number of members
3. Add member names
4. Click "Create Group" to proceed

### Adding Transactions
1. Select who paid for the expense
2. Enter the expense amount and purpose
3. Choose split type:
   - **Equal Split**: Automatically divides the amount equally among selected members
   - **Custom Split**: Manually specify how much each person owes
4. Select which members should contribute to the expense
5. Add the transaction

### Viewing Settlements
- The app automatically calculates the optimal way to settle all debts
- View simplified settlements showing who should pay whom and how much
- The debt graph provides a visual representation of all outstanding balances

## 🏗️ Project Structure

```
settlemate/
├── src/
│   ├── components/
│   │   ├── GroupForm.jsx          # Group creation form
│   │   ├── Transactions.jsx       # Transaction management
│   │   ├── DebtGraph.jsx          # Visual debt representation
│   │   └── DebtSettlements.jsx    # Settlement calculations
│   ├── algorithms/
│   │   └── debtSimplifier.js      # Debt optimization algorithms
│   ├── utils/
│   │   └── transactionCalculations.js
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Key Features Explained

### Debt Simplification Algorithm
The app uses a greedy algorithm to minimize the number of transactions needed to settle all debts:
1. Calculates net balance for each person
2. Separates creditors (positive balance) and debtors (negative balance)
3. Matches highest creditor with highest debtor
4. Creates settlement transactions until all balances are cleared

### Data Persistence
- All data is stored in browser localStorage
- Groups and transactions persist between sessions
- No external database required

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sahil** - [GitHub Profile](https://github.com/Sahil1607cms)

## 🐛 Issues

If you find any bugs or have feature requests, please [open an issue](https://github.com/Sahil1607cms/SettleMate/issues) on GitHub.

## 📱 Screenshots

*Add screenshots of your application here to showcase the UI*

---

**SettleMate** - Making group expenses simple and fair! 💸
