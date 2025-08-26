using System.ComponentModel.DataAnnotations;

namespace backend.Application.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string Nom { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

    }
}
