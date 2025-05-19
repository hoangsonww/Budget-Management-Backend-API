namespace BudgetManagement.API.Models
{
    public class Category
    {
        public Guid Id       { get; set; }
        public string Name   { get; set; } = default!;
        public Guid BudgetId { get; set; }
        public Budget? Budget { get; set; }
    }
}
