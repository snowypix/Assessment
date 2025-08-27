
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
namespace backend.Domain.Models
{

    public class Ticket
    {

        public Ticket()
        {
        }
        [Key]
        public int Code { get; set; }
        [Required]
        public string QrCode { get; set; }
        [Required]
        public int Class { get; set; }
        [Required]
        public User Client { get; set; }
        public int ClientId { get; set; }
    }
}