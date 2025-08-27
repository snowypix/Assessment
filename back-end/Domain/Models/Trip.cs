
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Microsoft.VisualBasic;
namespace backend.Domain.Models
{
    public class Trip
    {

        public Trip()
        {
        }
        [Key]
        public int Code { get; set; }
        [Required]
        public DateTime DepartureDate { get; set; }
        [Required]

        public DateInterval Duration { get; set; }
        [Required]

        public string Status { get; set; }
        [Required]
        public Station DepartureStation { get; set; }
        public int DepartureStationId { get; set; }
        [Required]
        public Station ArrivalStation { get; set; }
        public int ArrivalStationId { get; set; }
        [Required]
        public Train Train { get; set; }
        public int TrainId { get; set; }
    }
}