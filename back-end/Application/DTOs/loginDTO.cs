using System.ComponentModel.DataAnnotations;

namespace backend.Application.DTOs
{
    public class loginDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
