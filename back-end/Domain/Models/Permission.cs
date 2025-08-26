using System.ComponentModel.DataAnnotations;

namespace backend.Domain.Models
{
    // Permissions table
    public class Permission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }  // e.g., "Invoice.Delete"

        // Navigation property
        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}