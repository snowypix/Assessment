using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;

namespace backend.Domain.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nom { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string CIN { get; set; }

        [Required]
        public string Password { get; set; }
        public ICollection<Ticket> Tickets { get; set; }

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public bool VerifyPassword(string password)
        {
            var hash = HashPassword(password);
            return Password == hash;
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
        public void AssignDefaultRole(Role clientRole)
        {
            UserRoles.Add(new UserRole { User = this, Role = clientRole });
        }
    }
}