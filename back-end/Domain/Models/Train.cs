
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
namespace backend.Domain.Models
{

    public class Train
    {

        public Train()
        {
        }
        [Key]
        public int Code { get; set; }
        [Required]

        public int Capacity { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Status { get; set; }
        public ICollection<Trip> Trips { get; set; }
    }


}