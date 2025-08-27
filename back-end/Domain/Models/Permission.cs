using System.ComponentModel.DataAnnotations;

namespace backend.Domain.Models
{

    public class Permission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }


        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}