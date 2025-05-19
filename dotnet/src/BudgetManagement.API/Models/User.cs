namespace BudgetManagement.API.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = default!;
        public string Email    { get; set; } = default!;
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    }
}
