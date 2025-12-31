# gRPC Request Samples

Use these payloads with `grpcurl` once the server is running on `0.0.0.0:50051`.

Create budget:
```
grpcurl -plaintext -d '{"name":"Travel","limit":2500}' localhost:50051 budget.BudgetManager/CreateBudget
```

List budgets:
```
grpcurl -plaintext -d '{"page":1,"pageSize":10}' localhost:50051 budget.BudgetManager/ListBudgets
```

Add expense:
```
grpcurl -plaintext -d '{"budgetId":"<id>","description":"Hotel booking","amount":420.5}' localhost:50051 budget.BudgetManager/AddExpense
```

Get summary:
```
grpcurl -plaintext -d '{"budgetId":"<id>"}' localhost:50051 budget.BudgetManager/GetBudgetSummary
```
