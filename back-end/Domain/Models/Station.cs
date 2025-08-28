
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
namespace backend.Domain.Models
{

    public class Station
    {

        public Station()
        {
        }
        public Station(string name)
        {
            Name = name;
        }
        public void Update(string name)
        {
            Name = name;
        }
        [Key]
        public int Code { get; set; }
        [Required]
        public string Name { get; set; }
        public ICollection<Trip> DepartureTrips { get; set; }
        public ICollection<Trip> ArrivalTrips { get; set; }
    }
}