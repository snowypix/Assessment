
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using AccountService.Exceptions;
namespace backend.Domain.Models
{

    public class Train
    {

        public Train()
        {
        }
        public Train(int capacite, string type, string status)
        {
            if (capacite < 0)
            {
                throw new BusinessRuleException("Capacity can't be negative.");
            }
            Capacity = capacite;
            Type = type;
            Status = status;
        }
        public void Update(string type, int capacite, string status)
        {
            if (capacite < 0)
            {
                throw new BusinessRuleException("Capacity can't be negative.");
            }
            Capacity = capacite;
            Type = type;
            Status = status;
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