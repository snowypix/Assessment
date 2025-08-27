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

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; }
        public bool VerifyPassword(string password)
        {
            var hash = HashPassword(password);
            return Password == hash;
        }

        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}