using System.ComponentModel.DataAnnotations;

namespace backend.Application.DTOs
{
    public class UserDTO
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Nom { get; set; }
        [Required]
        public string IBAN { get; set; }
        [Required]
        public string CIN { get; set; }
        public string UserType { get; set; }
    }
}
