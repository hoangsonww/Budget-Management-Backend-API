namespace BudgetManagement.API.Models
{
    public class Budget
    {
        public Guid Id             { get; set; }
        public string Name         { get; set; } = default!;
        public decimal TotalAmount { get; set; }
        public Guid UserId         { get; set; }
        public User? User          { get; set; }
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
