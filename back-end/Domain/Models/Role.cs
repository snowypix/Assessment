using System.ComponentModel.DataAnnotations;

namespace backend.Domain.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }  // e.g., "Admin", "Agent"

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}