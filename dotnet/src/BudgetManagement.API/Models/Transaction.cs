namespace BudgetManagement.API.Models
{
    public class Transaction
    {
        public Guid Id          { get; set; }
        public decimal Amount   { get; set; }
        public DateTime Date    { get; set; }
        public string Description { get; set; } = default!;
        public Guid CategoryId  { get; set; }
        public Category? Category { get; set; }
    }
}
